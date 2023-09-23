import ContractRegistryRepository from "../repositories/ContractRegistryRepository";
import IContractRegistry from "../interfaces/IContractRegistry";
import CustomError from "../utils/CustomError";
import HolderService from "./HolderService";
import BusinessContractService from "./BusinessContractService";


export default class ContractRegistryService {
    contractRegistryRepository: ContractRegistryRepository;
    holderService: HolderService;
    businessContractService: BusinessContractService;

    constructor() {
        this.contractRegistryRepository = new ContractRegistryRepository();
        this.holderService = new HolderService()
        this.businessContractService = new BusinessContractService()
    }

    async Create(body: IContractRegistry) {
        const holder = await this.holderService.ReadOne(body.id_titular)

        if (!holder) throw new CustomError('Não foi possível localizar os dados do titular', 400)

        const businessContract = await this.businessContractService.ReadOne(body.id_convenio);

        if (!businessContract) throw new CustomError('Não foi possível localizar os dados do convênio', 400)

        const contractRegistry = await this.contractRegistryRepository.Create(body);

        if (!contractRegistry) throw new CustomError('Não foi possível registrar o usuário no convênio', 500)

        return { message: `${holder.user.nome} agora é conveniado(a) da ${businessContract.nome_convenio}` }
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
            console.log(holders)
            const contractName = subscription['contract']['nome_convenio']
            holders[idTitular]['subscriptions'][contractName] = { ...subscription }
        }

        return Object.values(holders)
    }

    async ReadOne(subscription_id: string | number) {
        return this.contractRegistryRepository.ReadOne(subscription_id);
    }

    async Update() {
        return this.contractRegistryRepository.Update();
    }

    async Delete(body: IContractRegistry) {
        const holder = await this.holderService.ReadOne(body.id_titular)

        if (!holder) throw new CustomError('Não foi possível localizar os dados do titular', 400)

        const businessContract = await this.businessContractService.ReadOne(body.id_convenio);

        if (!businessContract) throw new CustomError('Não foi possível localizar os dados do convênio', 400)

        const deletedRegistry = await this.contractRegistryRepository.Delete(body);

        if (!deletedRegistry) throw new CustomError('Registro do conveniado não foi deletado', 400)

        return { message: `${holder.user.nome} foi removido do convênio ${businessContract.nome_convenio}` }
    }

}