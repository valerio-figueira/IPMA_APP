import { IUserAttributes } from "../interfaces/IUser";
import UserModel from "../models/user/UserModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import { Transaction } from 'sequelize';

export default class UserRepository {

    async Create(query: IUserAttributes, transaction: Transaction) {
        const user = await UserModel.create(query.user, { transaction });

        this.insertIdValues(query, user.id_usuario);

        const document = await DocumentModel.create(query.document, { transaction });
        const contact = await ContactModel.create(query.contact, { transaction });
        const location = await LocationModel.create(query.location, { transaction });

        return { user, document, contact, location }
    }

    async ReadAll() { }

    async ReadOne(user_id: number) {
        return await UserModel.findOne({
            where: { id_usuario: user_id },
            include: [ContactModel, DocumentModel, LocationModel],
        })
    }

    async Update() { }

    async Delete() { }

    insertIdValues(data: IUserAttributes, user_id: number) {
        data.contact.id_usuario = user_id
        data.document.id_usuario = user_id
        data.location.id_usuario = user_id
        data.user.id_usuario = user_id
        data.holder!.id_usuario = user_id
    }
}