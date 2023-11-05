import { IUserAttributes } from "../interfaces/IUser";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import { Transaction } from 'sequelize';
import Database from "../db/Database";
import Queries from "../db/Queries";
import CustomError from "../utils/CustomError";
import UserModel from "../models/user/UserModel";
import { ID } from "../types/ID";
import DocumentEntity from "../entities/DocumentEntity";
import AuthenticationModel from "../models/AuthenticationModel";
import AccessHierarchyModel from "../models/AccessHierarchyModel";
import { Op } from "sequelize";

type OptionalTransaction = Transaction | undefined;

export default class UserRepository {
    private db: Database
    private models

    constructor(database: Database) {
        this.db = database
        this.models = {
            UserModel: UserModel.INIT(this.db.sequelize),
            DocumentModel: DocumentModel.INIT(this.db.sequelize),
            LocationModel: LocationModel.INIT(this.db.sequelize),
            ContactModel: ContactModel.INIT(this.db.sequelize)
        }
    }




    async Create(query: IUserAttributes) {
        const transaction = await this.db.sequelize.transaction()

        try {
            return this.CreateWithTransaction(query, transaction)
        } catch (error: any) {
            transaction.rollback()
            throw new CustomError('Falha ao registrar dados do usuário', 500)
        }
    }




    async ReadAll() {
        return this.models.UserModel.findAll({
            include: [
                {
                    model: AuthenticationModel.INIT(this.db.sequelize),
                    as: 'authentication',
                    attributes: { exclude: ['user_id', 'password'] },
                    include: [{
                        model: AccessHierarchyModel.INIT(this.db.sequelize),
                        as: 'hierarchy'
                    }]
                },
                {
                    model: ContactModel,
                    as: 'contact',
                    attributes: { exclude: ['user_id', 'contact_id'] }
                },
                {
                    model: DocumentModel,
                    as: 'document',
                    attributes: { exclude: ['user_id', 'document_id'] },
                },
                {
                    model: LocationModel,
                    as: 'location',
                    attributes: { exclude: ['user_id', 'location_id'] }
                }
            ],
            raw: true, nest: true
        })
    }




    async ReadOne(user_id: ID) {
        return this.models.UserModel.findByPk(user_id, {
            include: [
                {
                    model: ContactModel,
                    as: 'contact',
                    attributes: { exclude: ['user_id', 'contact_id'] }
                },
                {
                    model: DocumentModel,
                    as: 'document',
                    attributes: { exclude: ['user_id', 'document_id'] },
                },
                {
                    model: LocationModel,
                    as: 'location',
                    attributes: { exclude: ['user_id', 'location_id'] }
                }
            ], raw: true, nest: true
        })
    }




    async ReadOneSummary(user_id: ID) {
        return this.models.UserModel.findByPk(user_id, {
            raw: true, nest: true
        })
    }





    async Update(user_id: number, query: IUserAttributes) {
        const transaction = await this.db.sequelize.transaction()

        try {
            const affectedCount = await this.UpdateWithTransaction(user_id, query, transaction)

            await transaction.commit()

            return affectedCount
        } catch (error: any) {
            await transaction.rollback()
            throw new CustomError('Não foi possível atualizar os dados do usuário', 500)
        }
    }





    async Delete(user_id: ID) {
        const transaction = await this.db.sequelize.transaction()

        try {
            await this.DeleteWithTransaction(user_id, transaction)
        } catch (error) {
            transaction.rollback()
            throw new CustomError('Não foi possível remover os dados do usuário', 500)
        }
    }




    async CreateWithTransaction(query: IUserAttributes, transaction: Transaction) {
        const user = await this.models.UserModel
            .create(query.user, { transaction, raw: true });

        this.insertIdValues(query, user.user_id);

        await this.models.DocumentModel
            .create(query.document, { transaction, raw: true });
        await this.models.ContactModel
            .create(query.contact, { transaction, raw: true });
        await this.models.LocationModel
            .create(query.location, { transaction, raw: true });
    }




    async UpdateWithTransaction(user_id: number, query: IUserAttributes, transaction: Transaction) {
        const [user] = await this.models.UserModel
            .update(query.user, {
                where: { user_id },
                transaction
            })

        const [contact] = await this.models.ContactModel
            .update(query.contact, {
                where: { user_id }, transaction
            })

        const [document] = await this.models.DocumentModel
            .update(query.document, {
                where: { user_id }, transaction
            })

        const [location] = await this.models.LocationModel
            .update(query.location, {
                where: { user_id }, transaction
            })

        return this.checkAffectedCount({ user, contact, document, location })
    }




    async DeleteWithTransaction(user_id: ID, transaction: OptionalTransaction) {
        return this.models.UserModel.destroy({
            where: { user_id }, transaction
        });
    }




    async Exists(query: DocumentEntity) {
        const whereClause: any = { cpf: query.cpf }
        if (query.identity) whereClause.identity = query.identity

        return this.models.DocumentModel.findOne({
            where: {
                [Op.or]: whereClause
            }
        })
    }



    async ExistsById(user_id: string | number) {
        return this.models.UserModel.findByPk(user_id)
    }





    private insertIdValues(data: Record<string, any>, user_id: number) {
        for (let key in data) {
            if (typeof data[key] === 'object') data[key].user_id = user_id
        }
    }




    private checkAffectedCount(data: any) {
        for (let entry in data) {
            if (data[entry]) return true
        }
        return false
    }
}