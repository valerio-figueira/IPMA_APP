import { IHolder } from "../interfaces/IHolder";
import { IUserAttributes } from "../interfaces/IUser";
import UserRepository from "./UserRepository";
import HolderModel from "../models/HolderModel";
import Database from "../db/Database";
import CustomError from '../classes/CustomError';
import { Transaction } from 'sequelize';
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import UserModel from "../models/user/UserModel";

export default class HolderRepository {
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

            const holder = await HolderModel.create(query.holder, { transaction: t, raw: true })

            await t.commit();
            return { user, document, contact, location, holder };
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Erro ao criar o titular: ${error}`, 500)
        }
    }

    async ReadAll() {
        try {
            return HolderModel.findAll({
                include: [
                    {
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
                    }
                ]
            })
        } catch (error: any) {
            throw new CustomError(`Erro ao consultar titulares: ${error}`, 500)
        }
    }

    async ReadOne(holder_id: string) {
        try {
            const holder = await HolderModel.findOne({ where: { id_titular: holder_id }, raw: true })
            const user = await this.userRepository.ReadOne(holder!.id_usuario)
            return { holder, user }
        } catch (error: any) {
            throw new CustomError(`Titular não encontrado: ${error.message}`, 500)
        }
    }

    async Update(holder_id: string, query: IHolder) { }

    async Delete(holder_id: string) { }

}