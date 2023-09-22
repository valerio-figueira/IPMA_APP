import BusinessContractRepository from "../repositories/BusinessContractRepository";
import BusinessContractSchema from "../classes/BusinessContractSchema";
import IBusinessContract from "../interfaces/IBusinessContract";
import CustomError from "../utils/CustomError";
import BusinessContractModel from "../models/BusinessContractModel";

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
        const contract = await this.businessContractRepository.ReadAll();

        if (contract.length === 0) throw new CustomError('Nenhum convênio registrado', 404)

        return contract;
    }

    async ReadOne(contract_id: string | number) {
        const contract = await this.businessContractRepository.ReadOne(contract_id);

        if(!contract) throw new CustomError('O Convênio não foi alterado ou localizado', 404)

        return contract
    }

    async Update(body: IBusinessContract) {
        const contract = new BusinessContractSchema(body);

        if (!contract.id_convenio) throw new CustomError('Convênio não localizado', 404)

        const [affectedCount] = await this.businessContractRepository.Update(contract);

        if(!affectedCount) throw new CustomError('O Convênio não foi alterado ou localizado', 404)

        return await BusinessContractModel.findByPk(contract.id_convenio)
    }

    async Delete(body: IBusinessContract) {
        if (!body.id_convenio) throw new CustomError('Convênio não localizado', 404)
        const contract = await this.businessContractRepository.Delete(body);

        if (!contract) throw new CustomError('O Convênio não foi removido ou localizado', 400)

        return { message: 'Convênio removido com sucesso!' }
    }

}