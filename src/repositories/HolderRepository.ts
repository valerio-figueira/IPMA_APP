import { IHolder } from "../interfaces/IHolder";
import { IUserAttributes } from "../interfaces/IUser";
import UserRepository from "./UserRepository";
import HolderModel from "../models/HolderModel";
import Database from "../db/Database";
import CustomError from '../classes/CustomError';
import { Transaction } from 'sequelize';

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

            const holder = await HolderModel.create(query.holder, { transaction: t })

            await t.commit();
            return { user, document, contact, location, holder };
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Erro ao criar o titular: ${error.message}`, 500)
        }
    }

    async ReadAll(query: { nome: string, tipo: string }) { }

    async ReadOne(holder_id: string) {
        try {
            const holder = await HolderModel.findOne({ where: { id_titular: holder_id } })
            const user = await this.userRepository.ReadOne(holder!.id_titular)
            return { holder, user }
        } catch (error: any) {
            throw new CustomError(`Titular não encontrado: ${error.message}`, 500)
        }
    }

    async Update(holder_id: string, query: IHolder) { }

    async Delete(holder_id: string) { }

}