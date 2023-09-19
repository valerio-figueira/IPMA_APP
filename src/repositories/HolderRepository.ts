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
                ], raw: true, nest: true
            })
        } catch (error: any) {
            throw new CustomError(`Erro ao consultar titulares: ${error}`, 500)
        }
    }

    async ReadOne(holder_id: string) {
        try {
            return HolderModel.findByPk(holder_id, {
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
                ], raw: true, nest: true
            })
        } catch (error: any) {
            throw new CustomError(`Titular não encontrado: ${error.message}`, 500)
        }
    }

    async Update(holder_id: string, query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const user = await UserModel.findByPk(holder_id, { transaction: t });
    
            if (!user) {
                await t.rollback();
                throw new CustomError('Usuário não encontrado', 404);
            }

        } catch (error) {
            
        }
    }

    async Delete(holder_id: string) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const holder = await HolderModel.findByPk(holder_id, { raw: true })
            const user_id = holder!['id_usuario']
            const user = await UserModel.findByPk(user_id, { raw: true })

            await HolderModel.destroy({
                where: { id_usuario: user_id },
                transaction: t,
            })

            await this.userRepository.Delete((user_id as number), t)

            await t.commit()

            return { message: `O usuário ${user?.nome} foi removido` }
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Falha ao remover titular: ${error.message}`, 500)
        }
    }

}