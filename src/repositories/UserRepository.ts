import { IUserAttributes } from "../interfaces/IUser";
import UserModel from "../models/user/UserModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import { Transaction } from 'sequelize';
import { UserAttributes } from "../classes/UserSchema";
import CustomError from "../classes/CustomError";

export default class UserRepository {

    async Create(query: IUserAttributes, transaction: Transaction) {
        const user = await UserModel.create(query.user, { transaction });

        this.insertIdValues(query, user.id_usuario);

        const document = await DocumentModel.create(query.document, { transaction, raw: true });
        const contact = await ContactModel.create(query.contact, { transaction, raw: true });
        const location = await LocationModel.create(query.location, { transaction, raw: true });

        return { user, document, contact, location }
    }

    async ReadAll() { }

    async ReadOne(user_id: number) {
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

    async Update(user_id: number, query: IUserAttributes, transaction: Transaction) {
        try {
            await UserModel.update(query.user, {
                where: { id_usuario: user_id },
                transaction
            })

            await ContactModel.update(query.contact, {
                where: { id_usuario: user_id },
                transaction
            })

            await DocumentModel.update(query.document, {
                where: { id_usuario: user_id },
                transaction
            })

            await LocationModel.update(query.location, {
                where: { id_usuario: user_id },
                transaction
            })
        } catch (error) {
            throw new CustomError(`Houve uma falha ao atualizar os dados pessoais do ${query.user.nome}`, 400)
        }
    }

    async Delete(user_id: number, transaction: Transaction) {
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
}