import IBusinessContract from "../interfaces/IBusinessContract";
import BusinessContractModel from "../models/BusinessContractModel";

export default class BusinessContractRepository {

    constructor() { }

    async Create(query: IBusinessContract) {
        return await BusinessContractModel.create(query, { raw: true })
    }

    async ReadAll() {
        return await BusinessContractModel.findAll({ raw: true })
    }

    async ReadOne(contract_id: string) {
        return await BusinessContractModel.findOne({
            where: { id_convenio: contract_id },
            raw: true
        })
    }

    async Update(query: IBusinessContract) {
        return BusinessContractModel.update(query, {
            where: { id_convenio: query.id_convenio }
        })
    }

    async Delete(query: IBusinessContract) {
        return await BusinessContractModel.destroy({
            where: { id_convenio: query.id_convenio }
        })
    }

}