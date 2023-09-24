import ContractRegistryRepository from "../repositories/ContractRegistryRepository";
import IContractRegistry from "../interfaces/IContractRegistry";
import CustomError from "../utils/CustomError";
import HolderService from "./HolderService";
import BusinessContractService from "./BusinessContractService";
import ContractRegistry from "../classes/ContractRegistrySchema";
import UserDataSanitizer from "../helpers/UserDataSanitizer";
import BillingService from "./BillingService";
import IBilling from "../interfaces/IBilling";
import DependentService from "./DependentService";


export default class ContractRegistryService {
    contractRegistryRepository: ContractRegistryRepository;
    holderService: HolderService;
    businessContractService: BusinessContractService;
    billingService: BillingService;
    dependentService: DependentService;

    constructor() {
        this.contractRegistryRepository = new ContractRegistryRepository();
        this.holderService = new HolderService()
        this.dependentService = new DependentService()
        this.businessContractService = new BusinessContractService()
        this.billingService = new BillingService()
    }

    async Create(body: IContractRegistry & IBilling) {
        const dependent: any = await this.findDependent(body)
        const holder = await this.findHolder(body)

        const businessContract = await this.findBusinessContract(body)

        const contractRegistry = await this.contractRegistryRepository.Create(body);

        await this.billingService.Create(body)

        if (!contractRegistry) throw new CustomError('Não foi possível registrar o usuário no convênio', 500)

        const name = dependent.user.nome || holder.user.nome

        return { message: `${name} agora é conveniado(a) da ${businessContract.nome_convenio}` }
    }

    async ReadAll(query: any) {
        const subscriptions: any[] = await this.contractRegistryRepository.ReadAll(query);

        if (!subscriptions || subscriptions.length === 0) throw new CustomError('Nenhum registro encontrado!', 400)

        const holders: Record<number, any> = {}

        for (let subscription of subscriptions) {
            const idTitular = subscription.id_titular

            if (!holders[idTitular]) {
                const holder = await this.holderService.ReadOne(idTitular)
                holder['subscriptions'] = {}
                holders[idTitular] = holder
            }

            const contractName = subscription['contract']['nome_convenio']
            holders[idTitular]['subscriptions'][contractName] = { ...subscription }
        }

        return Object.values(holders)
    }

    async ReadOne(subscription_id: string | number) {
        const data = await this.contractRegistryRepository.ReadOne(subscription_id);

        if (!data) throw new CustomError('Nenhum registro encontrado!', 400)

        return UserDataSanitizer.sanitizeQuery(data);
    }

    async Update(body: IContractRegistry) {
        const subscription = new ContractRegistry(body)

        if (!subscription.id_conveniado) throw new CustomError('Verifique a identificação do conveniado', 400)

        if (!subscription.ativo && !subscription.data_exclusao) subscription.data_exclusao = new Date(Date.now())

        if (subscription.ativo && subscription.data_exclusao) subscription.data_exclusao = null

        const [AffectedCount] = await this.contractRegistryRepository.Update(subscription);

        if (AffectedCount === 0) throw new CustomError('Nenhum dado foi alterado', 400)

        return UserDataSanitizer.sanitizeQuery(await this.ReadOne(subscription.id_conveniado));
    }

    async Delete(body: IContractRegistry) {
        const holder = await this.findHolder(body)

        const businessContract = await this.findBusinessContract(body)

        const deletedRegistry = await this.contractRegistryRepository.Delete(body);

        if (!deletedRegistry) throw new CustomError('Registro do conveniado não foi deletado', 400)

        return { message: `${holder.user.nome} foi removido do convênio ${businessContract.nome_convenio}` }
    }

    async findDependent(body: IContractRegistry) {
        if (!body.id_dependente) return

        const dependent = await this.dependentService.ReadOne(body.id_titular, body.id_dependente)

        if (!dependent) throw new CustomError('Não foi possível localizar os dados do dependente', 400)

        return dependent
    }

    async findHolder(body: IContractRegistry) {
        const holder = await this.holderService.ReadOne(body.id_titular)

        if (!holder) throw new CustomError('Não foi possível localizar os dados do titular', 400)

        return holder
    }

    async findBusinessContract(body: IContractRegistry) {
        const businessContract = await this.businessContractService.ReadOne(body.id_convenio);

        if (!businessContract) throw new CustomError('Não foi possível localizar os dados do convênio', 400)

        return businessContract;
    }

}