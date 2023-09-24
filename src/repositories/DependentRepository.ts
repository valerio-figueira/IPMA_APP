import { Transaction } from "sequelize";
import Database from "../db/Database";
import { IUserAttributes } from "../interfaces/IUser";
import DependentModel from "../models/DependentModel";
import CustomError from "../utils/CustomError";
import UserRepository from "./UserRepository";
import HolderModel from "../models/HolderModel";
import UserModel from "../models/user/UserModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import ContractRegistryModel from "../models/ContractRegistryModel";


export default class DependentRepository {
    db: Database;
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.db = new Database();
    }

    async Create(query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const { user, document, contact, location } = await this.userRepository.Create(query, t);

            const dependent = await DependentModel.create(query.dependent, { transaction: t, raw: true })

            query.contract!.id_dependente = dependent.id_dependente

            const contract = await ContractRegistryModel.create(query.contract, { transaction: t, raw: true })

            await t.commit();

            return this.createNestedObj([dependent, user, document, contact, location, contract]);
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Erro ao cadastrar dependente: ${error}`, 500)
        }
    }

    async ReadAll(holder: string) {
        return DependentModel.findAll({
            where: { id_titular: holder },
            attributes: { exclude: ['id_usuario'] },
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
                        attributes: { exclude: ['id_usuario', 'id_documento'] },
                    },
                    {
                        model: LocationModel,
                        as: 'location',
                        attributes: { exclude: ['id_usuario', 'id_localizacao'] }
                    }
                ]
            }]
            , raw: true, nest: true
        })
    }

    async ReadOne(holder: string | number, id_dependente: string | number) {
        return DependentModel.findOne({
            where: { id_titular: holder, id_dependente },
            attributes: { exclude: ['id_usuario'] },
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
                        attributes: { exclude: ['id_usuario', 'id_documento'] },
                    },
                    {
                        model: LocationModel,
                        as: 'location',
                        attributes: { exclude: ['id_usuario', 'id_localizacao'] }
                    }
                ]
            }]
            , raw: true, nest: true
        })
    }

    async Update() { }

    async Delete() { }

    createNestedObj(data: any[]) {
        return {
            dependent: {
                ...data[0].toJSON(),
                user: {
                    ...data[1].toJSON(),
                    document: data[2].toJSON(),
                    contact: data[3].toJSON(),
                    location: data[4].toJSON(),
                },
                contract: data[5].toJSON()
            }
        }
    }
}