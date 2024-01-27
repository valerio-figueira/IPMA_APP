import MemberRepository from "../repositories/MemberRepository";
import IMember from "../interfaces/IMember";
import CustomError from "../utils/CustomError";
import MemberEntity from "../entities/MemberEntity";
import MonthlyFeeService from "./MonthlyFeeService";
import IMonthlyFee from "../interfaces/IMonthlyFee";
import DependentModel from "../models/DependentModel";
import MemberModel from "../models/MemberModel";
import Database from "../db/Database";
import { validateAgreements } from "../utils/decorators/validateBody";
import { Request } from "express";
import { UploadedFile } from "express-fileupload";
import ExtractAndCreateData from "../helpers/ExtractAndCreateData";
import MonthlyFeeEntity from "../entities/MonthlyFeeEntity";



export default class MemberService {
    private db: Database;
    private memberRepository: MemberRepository;
    private monthlyFeeService: MonthlyFeeService;

    constructor(db: Database) {
        this.db = db
        this.memberRepository = new MemberRepository(db)
        this.monthlyFeeService = new MonthlyFeeService(db)
    }



    @validateAgreements
    async Create(body: IMember & IMonthlyFee) {
        const dependent = await this.findDependent(body.dependent_id)
        await this.checkIfMemberExists(body, dependent)
        const holder = await this.findHolder(body.holder_id)
        const agreement = await this.findAgreement(body.agreement_id)
        await this.checkIfHolderIsActive(body)

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

        const name = dependent ? dependent.user?.name : holder.user!.name

        return { message: `${name} agora é conveniado(a) da ${agreement.agreement_name}` }
    }





    async ReadAll(query: any) {
        const subscriptions: MemberModel[] = await this.memberRepository.ReadAll(query)
        const totalCount = await this.memberRepository.totalCount(query)

        //const holders: Record<number, any> = await this.addUsersToResponse(subscriptions)

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

        if (!subscription.member_id) throw new CustomError('Verifique a identificação do conveniado.', 400)
        if (!subscription.holder_id) throw new CustomError('Verifique a identificação do servidor.', 400)
        if (!subscription.agreement_id) throw new CustomError('Verifique a identificação do convênio.', 400)

        await this.checkMemberExistence(subscription.member_id)

        if (subscription.active && subscription.exclusion_date) subscription.exclusion_date = null

        if (!subscription.active) {
            if (!subscription.dependent_id) { // IT'S A HOLDER MEMBER BECAUSE DOESN'T HAVE DEPENDENT_ID
                return this.deactiveMember(subscription, this.memberRepository
                    .DeactiveMembers.bind(this.memberRepository))
            } else { // IT'S DEPENDENT BECAUSE IT HAS DEPENDENT_ID
                return this.deactiveMember(subscription, this.memberRepository.Update.bind(this.memberRepository))
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
            const agreement = await this.findAgreement(agreement_id)
            const deletedRegistry = await this.memberRepository.Delete({
                holder_id, member_id, agreement_id
            })

            if (!deletedRegistry) throw new CustomError('Não houve alterações', 400)

            return { message: `O titular foi removido(a) do convênio ${agreement.agreement_name}` }
        } else {
            throw new Error('Falha ao localizar convênio.')
        }
    }





    async BulkCreate(req: Request) {
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new CustomError('Nenhuma planilha foi enviada', 400)
        }

        const table = req.files.table as UploadedFile

        const { message, fileName, filePath } = await ExtractAndCreateData(
            table, 'members-and-billings-table',
            this.createJsonFromTable.bind(this),
            this.memberRepository.BulkCreate.bind(this.memberRepository)
        )

        return { message, fileName, filePath }
    }





    async ReviveMember(body: IMember & IMonthlyFee) {
        const memberEntity = new MemberEntity(body)
        const monthlyFeeEntity = new MonthlyFeeEntity(body)
        const dependent = await this.findDependent(memberEntity.dependent_id)
        await this.checkIfMemberExists(memberEntity, dependent) // VALIDATE IF ALREADY EXISTS
        await this.findHolder(memberEntity.holder_id) // VALIDATE HOLDER EXISTENCE
        await this.findAgreement(memberEntity.agreement_id) // VALIDATE AGREEMENT EXISTENCE
        await this.checkIfHolderIsActive(memberEntity) // VALIDATE IF HOLDER IS ENABLED IN AGREEMENT BEFORE REVIVE

        const transaction = await this.db.sequelize.transaction()

        try {
            const createdMember = await this.memberRepository.ReviveMember(memberEntity, transaction)
            monthlyFeeEntity.member_id = createdMember.member_id
            await this.monthlyFeeService.Create(monthlyFeeEntity, transaction)

            await transaction.commit()

            const userType = !createdMember.dependent_id ? 'Holder' : 'Dependent'
            return this.memberRepository.ReadOneByUserType(createdMember.member_id, userType)
        } catch (error: any) {
            await transaction.rollback()
            throw new CustomError('Falha na transação: ' + error.message, 500)
        }
    }





    private async findDependent(dependent_id: string | number | null | undefined) {
        if (!dependent_id) return
        const dependent = this.db.models.Dependent.findByPk(dependent_id, {
            include: [{ model: this.db.models.User, as: 'user' }], nest: true, raw: true
        })
        if (!dependent) throw new CustomError('Não foi possível localizar os dados do dependente', 400)
        return dependent
    }





    private async deactiveMember(subscription: MemberEntity,
        update: (e: MemberEntity) => Promise<[affectedCount: number]>) {
        subscription.active = false
        subscription.exclusion_date = new Date()
        const [affectedCount] = await update(subscription)

        if (affectedCount) return this.ReadOne(subscription.member_id!)
        else return affectedCount
    }






    private async findHolder(holder_id: string | number) {
        const holder = await this.db.models.Holder.findByPk(holder_id, {
            include: [{ model: this.db.models.User, as: 'user' }], nest: true, raw: true
        })
        if (!holder) throw new CustomError('Não foi possível localizar os dados do servidor', 400)
        return holder
    }





    private async checkIfHolderIsActive(member: MemberEntity) {
        const { holder_id, agreement_id, dependent_id } = member
        if (!dependent_id) return

        const entries = await this.db.models.Member.findAll({
            where: { holder_id, agreement_id, dependent_id: null }
        })

        if (entries.length === 0) throw new CustomError('O servidor não está registrado no convênio.', 400)

        for (let entry of entries) {
            if (entry.active) return
        }

        throw new CustomError('O servidor não está ativo no convênio.', 400)
    }





    private async findAgreement(agreement_id: string | number) {
        const agreement = await this.db.models.Agreement.findByPk(agreement_id);
        if (!agreement) throw new CustomError('Não foi possível localizar os dados do convênio', 400)
        return agreement;
    }






    private async checkIfMemberExists(body: IMember, dependent: DependentModel | null | undefined) {
        if (dependent) {
            const dependentExists = await this.memberRepository.ifMemberExists(body, dependent.dependent_id)
            if (dependentExists) {
                throw new CustomError(`O dependente já existe na base de dados`, 400)
            }
            return
        }

        const member = await this.memberRepository.ifMemberExists(body)
        if (member) { // IF MEMBER IS ENABLED
            throw new CustomError(`O servidor já existe na base de dados`, 400)
        }
    }






    private async checkMemberExistence(member_id: string | number) {
        const member = await this.db.models.Member.findByPk(member_id)

        if (!member) throw new CustomError(`O conveniado não existe`, 400)
    }




    private createJsonFromTable(columns: any[], rows: any[]) {
        return rows.slice(1).map((row: any) => {
            const member: Record<string, any> = {}
            const columnNames = ['MES_REFERENCIA', 'ANO_REFERENCIA', 'MENSALIDADE']

            row.forEach((value: any, index: any) => {
                const column = this.convertExcelColumnName(columns[index])
                if (columnNames.includes(column)) value = Number(value)
                member[column] = value
            })

            this.validateMemberObj(member)
            return member
        }).filter(Boolean)
    }




    private validateMemberObj(member: Record<string, any>) {
        if (!member.user_id) throw new CustomError('Insira o campo ID_USUARIO na tabela!', 400)
        if (!member.holder_id) throw new CustomError('Insira o campo ID_TITULAR na tabela!', 400)
        if (!member.agreement_id) throw new CustomError('Insira o campo ID_CONVENIO na tabela!', 400)
    }




    private convertExcelColumnName(column: string) {
        if (column === 'ID_USUARIO') return 'user_id'
        if (column === 'ID_TITULAR') return 'holder_id'
        if (column === 'ID_DEPENDENTE') return 'dependent_id'
        if (column === 'ID_CONVENIO') return 'agreement_id'

        return column
    }
}