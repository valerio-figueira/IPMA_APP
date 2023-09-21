import ContractRegistryRepository from "../repositories/ContractRegistryRepository";


export default class ContractRegistryService {
    contractRegistryRepository: ContractRegistryRepository;

    constructor() {
        this.contractRegistryRepository = new ContractRegistryRepository();
    }

    async Create() {
        return this.contractRegistryRepository.Create(undefined);
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