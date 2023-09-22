import ContractRegistryModel from "../models/ContractRegistryModel";
import IContractRegistry from "../interfaces/IContractRegistry";

export default class ContractRegistryRepository {

    constructor() { }

    async Create(query: IContractRegistry) {
        return ContractRegistryModel.create(query, { raw: true })
    }

    async ReadAll() { }

    async ReadOne() { }

    async Update() { }

    async Delete(body: IContractRegistry) {
        return ContractRegistryModel.destroy({
            where: {
                id_conveniado: body.id_conveniado,
                id_convenio: body.id_convenio,
                id_titular: body.id_titular
            }
        })
    }

}