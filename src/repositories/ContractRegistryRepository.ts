import ContractRegistryModel from "../models/ContractRegistryModel";
import IContractRegistry from "../interfaces/IContractRegistry";
import HolderModel from "../models/HolderModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import UserModel from "../models/user/UserModel";
import BusinessContractModel from "../models/BusinessContractModel";
import { Sequelize, Op } from "sequelize";

export default class ContractRegistryRepository {

    constructor() { }

    async Create(query: IContractRegistry) {
        return ContractRegistryModel.create(query, { raw: true })
    }

    async ReadAll() {
        return HolderModel.findAll({
            where: {
                '$subscription.id_titular$': { [Op.not]: null }
            },
            include: [{
                model: UserModel,
                as: 'user',
                attributes: { exclude: ['id_usuario'] },
                include: [
                    {
                        model: ContactModel,
                        as: 'contact',
                        attributes: { exclude: ['id_usuario', 'id_contato'] }
                    },
                    {
                        model: DocumentModel,
                        as: 'document',
                        attributes: { exclude: ['id_usuario', 'id_document'] }
                    },
                    {
                        model: LocationModel,
                        as: 'location',
                        attributes: { exclude: ['id_usuario', 'id_localizacao'] }
                    }
                ]
            }, {
                model: ContractRegistryModel,
                as: 'subscription',
                attributes: { exclude: ['id_titular', 'id_convenio'] },
                include: [{
                    model: BusinessContractModel,
                    as: 'contract',
                    attributes: { exclude: ['id_convenio'] }
                }]
            }], raw: true, nest: true
        })
    }

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