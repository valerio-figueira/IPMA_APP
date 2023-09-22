import BusinessContractRepository from "../repositories/BusinessContractRepository";
import BusinessContractSchema from "../classes/BusinessContractSchema";
import IBusinessContract from "../interfaces/IBusinessContract";
import CustomError from "../classes/CustomError";

export default class BusinessContractService {
    businessContractRepository: BusinessContractRepository;

    constructor() {
        this.businessContractRepository = new BusinessContractRepository();
    }

    async Create(body: IBusinessContract) {
        const contract = new BusinessContractSchema(body);

        return this.businessContractRepository.Create(contract);
    }

    async ReadAll() {
        return this.businessContractRepository.ReadAll();
    }

    async ReadOne(contract_id: string) {
        return this.businessContractRepository.ReadOne(contract_id);
    }

    async Update(body: IBusinessContract) {
        const contract = new BusinessContractSchema(body);

        if(!contract.id_convenio) throw new CustomError('Convênio não localizado', 404)

        return this.businessContractRepository.Update(contract);
    }

    async Delete(body: IBusinessContract) {
        if(!body.id_convenio) throw new CustomError('Convênio não localizado', 404)
        return this.businessContractRepository.Delete(body);
    }

}