import { IHolder } from "../interfaces/IHolder";
import { IUserAttributes } from "../interfaces/IUser";
import UserModel from "../models/user/UserModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import HolderModel from "../models/HolderModel";
import Database from "../db/Database";
import CustomError from '../classes/CustomError';
import { Transaction } from 'sequelize';

export default class HolderRepository {
    db: Database;

    constructor() {
        this.db = new Database();
    }

    async Create(query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const user = await UserModel.create(query.user, { transaction: t });
            query.user.id_usuario = user.id_usuario;
            const document = await DocumentModel.create(query.document, { transaction: t });
            const contact = await ContactModel.create(query.contact, { transaction: t });
            const location = await LocationModel.create(query.location, { transaction: t });
            const holder = await HolderModel.create(query.holder, { transaction: t });

            await t.commit();
            return { user, document, contact, location, holder };
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Erro ao criar o titular: ${error.message}`, 500)
        }
    }

    async ReadAll(query: { nome: string, tipo: string }) { }

    async ReadOne(holder_id: string) { }

    async Update(holder_id: string, query: IHolder) { }

    async Delete(holder_id: string) { }
}