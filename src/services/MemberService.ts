import MemberRepository from "../repositories/MemberRepository";
import IMember from "../interfaces/IMember";
import CustomError from "../utils/CustomError";
import HolderService from "./HolderService";
import AgreementService from "./AgreementService";
import MemberEntity from "../entities/MemberEntity";
import UserDataSanitizer from "../helpers/UserDataSanitizer";
import MonthlyFeeService from "./MonthlyFeeService";
import IMonthlyFee from "../interfaces/IMonthlyFee";
import DependentService from "./DependentService";
import HolderModel from "../models/HolderModel";
import DependentModel from "../models/DependentModel";
import MemberModel from "../models/MemberModel";
import Database from "../db/Database";
import { validateAgreements } from "../utils/decorators/validateBody";


export default class MemberService {
    db: Database;
    memberRepository: MemberRepository;
    holderService: HolderService;
    agreementService: AgreementService;
    monthlyFeeService: MonthlyFeeService;
    dependentService: DependentService;

    constructor(db: Database) {
        this.db = db
        this.memberRepository = new MemberRepository(db)
        this.holderService = new HolderService(db)
        this.dependentService = new DependentService(db)
        this.agreementService = new AgreementService(db)
        this.monthlyFeeService = new MonthlyFeeService(db)
    }



    @validateAgreements
    async Create(body: IMember & IMonthlyFee) {
        const dependent = await this.findDependent(body)
        await this.checkIfExists(body, dependent)
        const holder = await this.findHolder(body)
        const agreement = await this.findAgreement(body)

        const transaction = await this.db.sequelize.transaction()

        try {
            const subscription = await this.memberRepository.Create(body, transaction)
            body.member_id = subscription.member_id
            await this.monthlyFeeService.Create(body, transaction)
            await transaction.commit()
        } catch (error: any) {
            await transaction.rollback()
            throw new CustomError('Não foi possível concluir: ' + error.message, 500)
        }

        const name = dependent?.user?.name || holder.user!.name

        return { message: `${name} agora é conveniado(a) da ${agreement.agreement_name}` }
    }





    async ReadAll(query: any) {
        const subscriptions: MemberModel[] = await this.memberRepository.ReadAll(query)

        if (!subscriptions || subscriptions.length === 0) throw new CustomError('Nenhum registro encontrado!', 400)
        //const holders: Record<number, any> = await this.addUsersToResponse(subscriptions)

        const totalCount = subscriptions.length + 1
        const totalPages = Math.ceil(totalCount / (query.pageSize || 10))
        const response = []
        response.push(subscriptions, {
            currentPage: query.page || 1,
            pageSize: query.pageSize || 10,
            totalCount: totalCount,
            totalPages: totalPages
        })

        return response
    }





    async ReadOne(subscription_id: string | number) {
        const data = await this.memberRepository.ReadOne(subscription_id);

        if (!data) throw new CustomError('Nenhum registro encontrado!', 400)

        return data
    }





    async Update(body: IMember) {
        const subscription = new MemberEntity(body)

        if (!subscription.member_id) throw new CustomError('Verifique a identificação do conveniado', 400)

        await this.checkIfMemberExists(body)

        if (!subscription.active && !subscription.exclusion_date) subscription.exclusion_date = new Date()
        if (subscription.active && subscription.exclusion_date) subscription.exclusion_date = null

        if (!subscription.active) {
            if (subscription.holder_id && !subscription.dependent_id) {
                const dependentExists = await this.findAllDependents(subscription)

                if (dependentExists) {
                    return this.memberRepository.updateExclusionOfDependents(body)
                } else {
                    const [affectedCount] = await this.memberRepository.Update(subscription)

                    if (affectedCount) return this.ReadOne(subscription.member_id)
                    else return affectedCount
                }
            }
        } else {
            const [affectedCount] = await this.memberRepository.Update(subscription);

            if (affectedCount === 0) throw new CustomError('Nenhum dado foi alterado', 400)

            return { message: `Houve ${affectedCount} alteração` }
        }
    }





    async Delete(member_id: string | number) {
        const holder = await this.ReadOne(member_id)

        if (holder && holder.subscription) {
            const agreement_id = holder.subscription.agreement_id
            const member_id = holder.subscription.member_id
            const holder_id = holder.holder_id
            const agreement = await this.findAgreement({ agreement_id })
            const deletedRegistry = await this.memberRepository.Delete({
                holder_id, member_id, agreement_id
            })

            if (!deletedRegistry) throw new CustomError('Não houve alterações', 400)

            return { message: `O titular foi removido(a) do convênio ${agreement.agreement_name}` }
        } else {
            throw new Error('Falha ao localizar convênio.')
        }
    }





    private async findDependent(body: IMember) {
        if (!body.dependent_id) return

        const dependent: DependentModel | null = await this.dependentService.ReadOne(body.holder_id, body.dependent_id)

        if (!dependent) throw new CustomError('Não foi possível localizar os dados do dependente', 400)

        return dependent
    }





    private async findAllDependents(body: IMember) {
        if (!body.dependent_id) return

        const dependent: any[] = await this.dependentService.ReadAll(String(body.holder_id))

        if (dependent.length === 0) throw new CustomError('Não foi possível localizar os dados do dependente', 400)

        return dependent
    }





    private async findHolder(body: Record<string, any>) {
        const holder: HolderModel = await this.holderService.ReadOne(body.holder_id)

        if (!holder) throw new CustomError('Não foi possível localizar os dados do titular', 400)

        return holder
    }





    private async findAgreement(body: Record<string, any>) {
        const agreement = await this.agreementService.ReadOne(body.agreement_id);

        if (!agreement) throw new CustomError('Não foi possível localizar os dados do convênio', 400)

        return agreement;
    }




    private async checkIfExists(body: IMember, dependent: DependentModel | undefined) {
        if (dependent) {
            const dependentExists = await this.memberRepository.ifMemberExists(body, dependent.dependent_id)
            if (dependentExists) throw new CustomError(`O dependente já existe na base de dados`, 400)
            return
        }

        const member = await this.memberRepository.ifMemberExists(body)
        if (member) throw new CustomError(`O titular já existe na base de dados`, 400)
    }




    private async checkIfMemberExists(body: IMember) {
        const member = await this.memberRepository.ReadOne(body.member_id!)

        if (!member) throw new CustomError(`O conveniado não existe`, 400)
    }




    private async addUsersToResponse(subscriptions: MemberModel[]) {
        const holders: Record<number, any> = {}
        let index = 1

        for (let subscription of subscriptions) {
            const holderID = subscription.holder_id
            const dependentID = subscription.dependent_id

            if (!holders[holderID]) {
                const holder: any = await this.holderService.ReadOneSummary(holderID)
                holder['subscriptions'] = {}
                holders[holderID] = holder
                console.log(holders)
                index = 1
            }
            const dependent = dependentID ? await this.dependentService.ReadOneSummary(holderID, dependentID) : null
            const agreementName = subscription['agreement']!['agreement_name']
            holders[holderID]['subscriptions'][`${agreementName} ${index}`] = { ...subscription, dependent }
            index++
        }

        return holders
    }

}