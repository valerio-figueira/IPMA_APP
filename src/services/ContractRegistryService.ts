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

    async ReadAll() {
        return this.contractRegistryRepository.ReadAll();
    }

    async ReadOne() {
        return this.contractRegistryRepository.ReadOne();
    }

    async Update() {
        return this.contractRegistryRepository.Update();
    }

    async Delete() {
        return this.contractRegistryRepository.Delete();
    }

}