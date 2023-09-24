import ContractRegistryModel from "../models/ContractRegistryModel";
import IContractRegistry from "../interfaces/IContractRegistry";
import HolderModel from "../models/HolderModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import UserModel from "../models/user/UserModel";
import BusinessContractModel from "../models/BusinessContractModel";
import { Sequelize, Op, HasMany } from "sequelize";
import CustomError from "../utils/CustomError";

export default class ContractRegistryRepository {

    constructor() { }

    async Create(query: IContractRegistry) {
        return ContractRegistryModel.create(query, { raw: true })
    }

    async ReadAll(query: any) {
        const whereClause: any = { ativo: query.ativo || true }
        const includeClause: any = [{
            model: BusinessContractModel,
            as: 'contract',
            attributes: { exclude: ['id_convenio'] }
        }]

        if (query.id_titular) whereClause.id_titular = query.id_titular

        if (query.nome_convenio) includeClause[0].where = {
            nome_convenio: query.nome_convenio
        }

        return ContractRegistryModel.findAll({
            where: whereClause,
            include: includeClause,
            raw: true, nest: true
        })
    }

    async ReadOne(subscription_id: string | number) {
        return HolderModel.findOne({
            include: [{
                model: UserModel,
                as: 'user'
            }, {
                model: ContractRegistryModel,
                as: 'subscription',
                where: { id_conveniado: subscription_id },
                attributes: { exclude: ['id_titular', 'id_convenio'] },
                include: [{
                    model: BusinessContractModel,
                    as: 'contract',
                    attributes: { exclude: ['id_convenio'] }
                }]
            }], raw: true, nest: true,
        })
    }

    async Update(body: IContractRegistry) {
        return ContractRegistryModel.update(body, {
            where: { id_conveniado: body.id_conveniado }
        })
    }

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