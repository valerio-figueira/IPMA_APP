import IBilling from "../interfaces/IBilling";
import BillingModel from "../models/BillingModel";
import HolderModel from "../models/HolderModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import UserModel from "../models/user/UserModel";
import ContractRegistryModel from "../models/ContractRegistryModel";
import BusinessContractModel from "../models/BusinessContractModel";
import { Op } from "sequelize";
import Queries from "../db/Queries";

export default class BillingRepository {

    constructor() { }

    async Create(query: IBilling) {
        return BillingModel.create(query, { raw: true })
    }

    async ReadAll(query: any) {
        const month = new Date().getMonth();
        const whereClause: any = {
            ativo: query.ativo || 1,
            '$billing.id_conveniado$': { [Op.not]: null },
            '$billing.mes_referencia$': query.mes_referencia || month
        }

        if (query.nome_convenio) {
            whereClause['$contract.nome_convenio$'] = query.nome_convenio
        }

        return ContractRegistryModel.findAll({
            where: whereClause,
            include: Queries.ContractRegistryIncludeAll,
            raw: true, nest: true
        })
    }

    async ReadOne() { }

    async Update() { }

    async Delete(billing_id: string | number) {
        return BillingModel.destroy({
            where: { id_mensalidade: billing_id }
        })
    }

}