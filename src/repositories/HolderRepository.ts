import { IUserAttributes } from "../interfaces/IUser";
import UserRepository from "./UserRepository";
import HolderModel from "../models/HolderModel";
import Database from "../db/Database";
import CustomError from '../utils/CustomError';
import { Transaction } from 'sequelize';
import UserModel from "../models/user/UserModel";
import Queries from "../db/Queries";
import ContractRegistryModel from "../models/MemberModel";
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
            const { user, document, contact, location } = await this.userRepository.CreateWithTransaction(query, t);

            const holder = await HolderModel.create(query.holder, { transaction: t, raw: true })

            await t.commit();
            return this.createNestedObj([holder, user, document, contact, location])
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

    async ReadOneSummary(holder_id: string | number) {
        return HolderModel.findByPk(holder_id, {
            include: Queries.IncludeUserDataSummary,
            raw: true, nest: true
        })
    }

    async Update(query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const holder = await HolderModel.findByPk(query.holder?.holder_id, { transaction: t, raw: true });

            if (!holder) throw new CustomError('Usuário não encontrado', 404)

            const userResult = await this.userRepository.UpdateWithTransaction(holder.user_id, query, t)

            const [holderResult] = await HolderModel.update(query.holder!, {
                where: { user_id: query.user.user_id },
                transaction: t
            })

            if (!userResult && !holderResult) throw new CustomError(`Nenhum dado foi alterado para ${query.user.name}`, 400)

            await t.commit()

            return await this.ReadOne(holder.holder_id)
        } catch (error: any) {
            await t.rollback()
            throw new CustomError(error.message || 'Não foi possível atualizar os dados do usuário', error.status || 500)
        }
    }

    async Delete(holder_id: string) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const holder = await HolderModel.findByPk(holder_id, { raw: true })
            const user_id = holder!['user_id']
            const user = await UserModel.findByPk(user_id, { raw: true })
            const dependents = await DependentModel.findAll({
                where: { holder_id }
            })

            if (dependents.length > 0) {
                for (let dependent of dependents) {
                    await ContractRegistryModel.destroy({
                        where: { holder_id },
                        transaction: t,
                    })

                    await DependentModel.destroy({
                        where: { dependent_id: dependent.dependent_id },
                        transaction: t,
                    })
                }
            }

            await HolderModel.destroy({
                where: { user_id },
                transaction: t,
            })

            await this.userRepository.DeleteWithTransaction((user_id as number), t)

            await t.commit()

            return { message: `O usuário ${user?.name} foi removido juntamente com todas as suas dependências` }
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Falha ao remover titular: ${error.message}`, 500)
        }
    }

    createNestedObj(data: any[]) {
        return {
            holder: {
                ...data[0].toJSON(),
                user: {
                    ...data[1].toJSON(),
                    document: data[2].toJSON(),
                    contact: data[3].toJSON(),
                    location: data[4].toJSON(),
                }
            }
        }
    }

}