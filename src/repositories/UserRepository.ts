import { IUserAttributes } from "../interfaces/IUser";
import UserModel from "../models/user/UserModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import { Transaction } from 'sequelize';
import Database from "../db/Database";
import Queries from "../db/Queries";
import CustomError from "../utils/CustomError";

type OptionalTransaction = Transaction | undefined;

export default class UserRepository {
    db: Database

    constructor() {
        this.db = new Database();
    }

    async Create(query: IUserAttributes) {
        const transaction = await this.db.sequelize.transaction()

        try {
            return this.CreateUserData(query, transaction)
        } catch (error: any) {
            transaction.rollback()
            throw new CustomError('Falha ao registrar dados do usuário', 500)
        }
    }

    async ReadAll() {
        return UserModel.findAll({
            include: Queries.IncludeUserData,
            raw: true
        })
    }

    async ReadOne(user_id: number | string) {
        return UserModel.findByPk(user_id, {
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
            ], plain: true, raw: true
        })
    }

    async Update(user_id: number, query: IUserAttributes) {
        const transaction = await this.db.sequelize.transaction()

        try {
            return this.UpdateUserData(user_id, query, transaction)
        } catch (error: any) {
            transaction.rollback()
            throw new CustomError('Não foi possível atualizar os dados do usuário', 500)
        }
    }

    async Delete(user_id: number | string) {
        const transaction = await this.db.sequelize.transaction()

        try {
            await this.DeleteUserData(user_id, transaction)
        } catch (error) {
            transaction.rollback()
            throw new CustomError('Não foi possível remover os dados do usuário', 500)
        }
    }

    async CreateWithTransaction(query: IUserAttributes, transaction: Transaction) {
        return this.CreateUserData(query, transaction)
    }

    async UpdateWithTransaction(user_id: number, query: IUserAttributes, transaction: Transaction) {
        return this.UpdateUserData(user_id, query, transaction)
    }

    async DeleteWithTransaction(user_id: number | string, transaction: OptionalTransaction) {
        await this.DeleteUserData(user_id, transaction)
    }

    private async CreateUserData(query: IUserAttributes, transaction: Transaction) {
        const user = await UserModel.create(query.user, { transaction, raw: true });

        this.insertIdValues(query, user.user_id);

        const document = await DocumentModel.create(query.document, { transaction, raw: true });
        const contact = await ContactModel.create(query.contact, { transaction, raw: true });
        const location = await LocationModel.create(query.location, { transaction, raw: true });

        return { user, document, contact, location }
    }

    private async UpdateUserData(user_id: number, query: IUserAttributes, transaction: Transaction) {
        const [user] = await UserModel.update(query.user, {
            where: { user_id },
            transaction
        })

        const [contact] = await ContactModel.update(query.contact, {
            where: { user_id }, transaction
        })

        const [document] = await DocumentModel.update(query.document, {
            where: { user_id }, transaction
        })

        const [location] = await LocationModel.update(query.location, {
            where: { user_id }, transaction
        })

        return this.checkAffectedCount({ user, contact, document, location })
    }

    private async DeleteUserData(user_id: number | string, transaction: OptionalTransaction) {
        await DocumentModel.destroy({
            where: { user_id }, transaction
        });

        await LocationModel.destroy({
            where: { user_id }, transaction
        });

        await ContactModel.destroy({
            where: { user_id }, transaction
        });

        await UserModel.destroy({
            where: { user_id }, transaction
        });
    }

    private insertIdValues(data: IUserAttributes, user_id: number) {
        for (let key in data) {
            data[key].user_id = user_id
        }
    }

    private checkAffectedCount(data: any) {
        for (let entry in data) {
            if (data[entry]) return true
        }
        return false
    }
}