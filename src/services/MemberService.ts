import MemberRepository from "../repositories/MemberRepository";
import IMember from "../interfaces/IMember";
import CustomError from "../utils/CustomError";
import HolderService from "./HolderService";
import AgreementService from "./AgreementService";
import MemberSchema from "../classes/MemberSchema";
import UserDataSanitizer from "../helpers/UserDataSanitizer";
import MonthlyFeeService from "./MonthlyFeeService";
import IMonthlyFee from "../interfaces/IMonthlyFee";
import DependentService from "./DependentService";
import HolderModel from "../models/HolderModel";
import DependentModel from "../models/DependentModel";


export default class MemberService {
    memberRepository: MemberRepository;
    holderService: HolderService;
    agreementService: AgreementService;
    monthlyFeeService: MonthlyFeeService;
    dependentService: DependentService;

    constructor() {
        this.memberRepository = new MemberRepository();
        this.holderService = new HolderService()
        this.dependentService = new DependentService()
        this.agreementService = new AgreementService()
        this.monthlyFeeService = new MonthlyFeeService()
    }

    async Create(body: IMember & IMonthlyFee) {
        await this.checkIfExists(body)
        const dependent = await this.findDependent(body)
        const holder = await this.findHolder(body)
        const agreement = await this.findAgreement(body)
        const subscription = await this.memberRepository.Create(body);

        if (!subscription) throw new CustomError('Não foi possível registrar o usuário no convênio', 500)
        body.member_id = subscription.member_id
        await this.monthlyFeeService.Create(body)

        const name = dependent?.user?.name || holder.user!.name

        return { message: `${name} agora é conveniado(a) da ${agreement.agreement_name}` }
    }

    async ReadAll(query: any) {
        const subscriptions: any[] = await this.memberRepository.ReadAll(query);

        if (!subscriptions || subscriptions.length === 0) throw new CustomError('Nenhum registro encontrado!', 400)

        const holders: Record<number, any> = {}

        for (let subscription of subscriptions) {
            const holderID = subscription.holder_id

            if (!holders[holderID]) {
                const holder = await this.holderService.ReadOne(holderID)
                holder['subscriptions'] = {}
                holders[holderID] = holder
            }

            const agreementName = subscription['agreement']['agreement_name']
            holders[holderID]['subscriptions'][agreementName] = { ...subscription }
        }

        return Object.values(holders)
    }

    async ReadOne(subscription_id: string | number) {
        const data = await this.memberRepository.ReadOne(subscription_id);

        if (!data) throw new CustomError('Nenhum registro encontrado!', 400)

        return UserDataSanitizer.sanitizeQuery(data);
    }

    async Update(body: IMember) {
        const subscription = new MemberSchema(body)

        if (!subscription.member_id) throw new CustomError('Verifique a identificação do conveniado', 400)
        if (!subscription.active && !subscription.exclusion_date) subscription.exclusion_date = new Date(Date.now())
        if (subscription.active && subscription.exclusion_date) subscription.exclusion_date = null

        const [AffectedCount] = await this.memberRepository.Update(subscription);

        if (AffectedCount === 0) throw new CustomError('Nenhum dado foi alterado', 400)

        return UserDataSanitizer.sanitizeQuery(await this.ReadOne(subscription.member_id));
    }

    async Delete(body: IMember) {
        const holder = await this.findHolder(body)
        const agreement = await this.findAgreement(body)
        const deletedRegistry = await this.memberRepository.Delete(body);

        if (!deletedRegistry) throw new CustomError('Não houve alterações', 400)

        return { message: `${holder.user!.name} foi removido(a) do convênio ${agreement.agreement_name}` }
    }

    async findDependent(body: IMember) {
        if (!body.dependent_id) return

        const dependent: DependentModel | null = await this.dependentService.ReadOne(body.holder_id, body.dependent_id)

        if (!dependent) throw new CustomError('Não foi possível localizar os dados do dependente', 400)

        return dependent
    }

    async findHolder(body: IMember) {
        const holder: HolderModel = await this.holderService.ReadOne(body.holder_id)

        if (!holder) throw new CustomError('Não foi possível localizar os dados do titular', 400)

        return holder
    }

    async findAgreement(body: IMember) {
        const agreement = await this.agreementService.ReadOne(body.agreement_id);

        if (!agreement) throw new CustomError('Não foi possível localizar os dados do convênio', 400)

        return agreement;
    }

    async checkIfExists(body: IMember) {
        const member = await this.memberRepository.ifMemberExists(body)
        if(member) throw new CustomError(`já existe na base de dados`, 400)
    }

}