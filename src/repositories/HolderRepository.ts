import { IUserAttributes } from "../interfaces/IUser";
import UserRepository from "./UserRepository";
import HolderModel from "../models/HolderModel";
import Database from "../db/Database";
import CustomError from '../utils/CustomError';
import { Transaction } from 'sequelize';
import UserModel from "../models/user/UserModel";
import Queries from "../db/Queries";
import ContractRegistryModel from "../models/ContractRegistryModel";
import DependentModel from "../models/DependentModel";

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
        return HolderModel.findAll({
            include: Queries.IncludeUserData,
            raw: true, nest: true
        })
    }

    async ReadOne(holder_id: string | number) {
        return HolderModel.findByPk(holder_id, {
            include: Queries.IncludeUserData,
            raw: true, nest: true
        })
    }

    async Update(query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const holder = await HolderModel.findByPk(query.holder?.id_titular, { transaction: t, raw: true });

            if (!holder) throw new CustomError('Usuário não encontrado', 404)

            const userResult = await this.userRepository.Update(holder.id_usuario, query, t)

            const [holderResult] = await HolderModel.update(query.holder!, {
                where: { id_usuario: query.user.id_usuario },
                transaction: t
            })

            if (!userResult && !holderResult) throw new CustomError(`Nenhum dado foi alterado para ${query.user.nome}`, 400)

            await t.commit()

            return await this.ReadOne(holder.id_titular)
        } catch (error: any) {
            await t.rollback()
            throw new CustomError(error.message || 'Não foi possível atualizar os dados do usuário', error.status || 500)
        }
    }

    async Delete(holder_id: string) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const holder = await HolderModel.findByPk(holder_id, { raw: true })
            const user_id = holder!['id_usuario']
            const user = await UserModel.findByPk(user_id, { raw: true })
            const dependents = await DependentModel.findAll({
                where: { id_titular: holder_id }
            })

            if (dependents.length > 0) {
                for (let dependent of dependents) {
                    await ContractRegistryModel.destroy({
                        where: { id_titular: holder_id },
                        transaction: t,
                    })

                    await DependentModel.destroy({
                        where: { id_dependente: dependent.id_dependente },
                        transaction: t,
                    })
                }
            }

            await HolderModel.destroy({
                where: { id_usuario: user_id },
                transaction: t,
            })

            await this.userRepository.Delete((user_id as number), t)

            await t.commit()

            return { message: `O usuário ${user?.nome} foi removido juntamente com todas as suas dependências` }
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Falha ao remover titular: ${error.message}`, 500)
        }
    }

}