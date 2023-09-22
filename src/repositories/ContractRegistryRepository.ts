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

    async Delete() { }

}