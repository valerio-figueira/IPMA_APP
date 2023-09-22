import BusinessContractRepository from "../repositories/BusinessContractRepository";


export default class BusinessContractService {
    businessContractRepository: BusinessContractRepository;

    constructor() {
        this.businessContractRepository = new BusinessContractRepository();
    }

    async Create() {
        return this.businessContractRepository.Create(undefined);
    }

    async ReadAll() {
        return this.businessContractRepository.ReadAll();
    }

    async ReadOne() {
        return this.businessContractRepository.ReadOne();
    }

    async Update() {
        return this.businessContractRepository.Update();
    }

    async Delete() {
        return this.businessContractRepository.Delete();
    }

}