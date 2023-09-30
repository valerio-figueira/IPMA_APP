import { IUserAttributes } from "../interfaces/IUser";
import UserModel from "../models/user/UserModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import { Transaction } from 'sequelize';
import { UserAttributes } from "../classes/UserSchema";
import CustomError from "../utils/CustomError";
import Database from "../db/Database";
import Queries from "../db/Queries";

type OptionalTransaction = Transaction | undefined;

export default class UserRepository {
    db: Database

    constructor() {
        this.db = new Database();
    }

    async Create(query: IUserAttributes, transaction: OptionalTransaction = undefined) {
        if (!transaction) transaction = await this.db.sequelize.transaction()
        const user = await UserModel.create(query.user, { transaction, raw: true });

        this.insertIdValues(query, user.id_usuario);

        const document = await DocumentModel.create(query.document, { transaction, raw: true });
        const contact = await ContactModel.create(query.contact, { transaction, raw: true });
        const location = await LocationModel.create(query.location, { transaction, raw: true });

        return { user, document, contact, location }
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
            ], plain: true, raw: true
        })
    }

    async Update(user_id: number, query: IUserAttributes, transaction: OptionalTransaction = undefined) {
        if (!transaction) transaction = await this.db.sequelize.transaction()

        const [user] = await UserModel.update(query.user, {
            where: { id_usuario: user_id },
            transaction
        })

        const [contact] = await ContactModel.update(query.contact, {
            where: { id_usuario: user_id },
            transaction
        })

        const [document] = await DocumentModel.update(query.document, {
            where: { id_usuario: user_id },
            transaction
        })

        const [location] = await LocationModel.update(query.location, {
            where: { id_usuario: user_id },
            transaction
        })

        return this.checkAffectedCount({ user, contact, document, location })
    }

    async Delete(user_id: number | string, transaction: OptionalTransaction = undefined) {
        if (!transaction) transaction = await this.db.sequelize.transaction()

        await DocumentModel.destroy({
            where: { id_usuario: user_id }, transaction
        });

        await LocationModel.destroy({
            where: { id_usuario: user_id }, transaction
        });

        await ContactModel.destroy({
            where: { id_usuario: user_id }, transaction
        });

        await UserModel.destroy({
            where: { id_usuario: user_id }, transaction
        });
    }

    insertIdValues(data: IUserAttributes, user_id: number) {
        for (let key in data) {
            data[key].id_usuario = user_id
        }
    }

    checkAffectedCount(data: any) {
        for (let entry in data) {
            if (data[entry]) return true
        }
        return false
    }
}