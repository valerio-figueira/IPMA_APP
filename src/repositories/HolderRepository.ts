import { IUserAttributes } from "../interfaces/IUser";
import UserRepository from "./UserRepository";
import HolderModel from "../models/HolderModel";
import Database from "../db/Database";
import CustomError from '../utils/CustomError';
import { Transaction } from 'sequelize';
import UserModel from "../models/user/UserModel";
import Queries from "../db/Queries";
import MemberModel from "../models/MemberModel";
import DependentModel from "../models/DependentModel";
import AccessHierarchyModel from "../models/AccessHierarchyModel";
import AuthenticationModel from "../models/AuthenticationModel";
import DocumentEntity from "../entities/DocumentEntity";

export default class HolderRepository {
    private db: Database;
    private userRepository: UserRepository;
    private models

    constructor(db: Database) {
        this.db = db
        this.userRepository = new UserRepository(this.db)
        this.models = {
            Holder: HolderModel.INIT(this.db.sequelize),
            AccessHierarchy: AccessHierarchyModel.INIT(this.db.sequelize),
            Authentication: AuthenticationModel.INIT(this.db.sequelize)
        }
    }




    async Create(query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            await this.userRepository.CreateWithTransaction(query, t);

            const holder = await this.models.Holder
                .create(query.holder, { transaction: t, raw: true })

            await t.commit();
            return this.ReadOne(holder.holder_id)
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Erro ao criar o titular: ${error}`, 500)
        }
    }




    async ReadAll() {
        return this.models.Holder
            .findAll({
                include: Queries.IncludeUserData,
                raw: true, nest: true
            })
    }




    async ReadOne(holder_id: string | number) {
        return this.models.Holder
            .findByPk(holder_id, {
                include: Queries.IncludeUserData,
                raw: true, nest: true
            })
    }




    async ReadOneSummary(holder_id: string | number) {
        return this.models.Holder
            .findByPk(holder_id, {
                include: Queries.IncludeUserDataSummary,
                raw: true, nest: true
            })
    }




    async Update(query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const userResult = await this.userRepository
                .UpdateWithTransaction(query.user.user_id!, query, t)

            const [holderResult] = await this.UpdateHolderInfo(query, t)

            if (!userResult && !holderResult) throw new CustomError(`Nenhum dado foi alterado para ${query.user.name}`, 400)

            await t.commit()

            return this.ReadOne(query.holder!.holder_id!)
        } catch (error: any) {
            await t.rollback()
            throw new CustomError(error.message || 'Não foi possível atualizar os dados do usuário', error.status || 500)
        }
    }




    async Delete(holder: HolderModel) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            await MemberModel.destroy({
                where: { holder_id: holder.holder_id },
                transaction: t,
            })

            await this.models.Holder.destroy({
                where: { user_id: holder.user_id },
                transaction: t,
            })

            await this.userRepository.DeleteWithTransaction(holder.user_id, t)

            await t.commit()

            return { message: `O titular foi removido com todas as suas dependências` }
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Falha ao remover titular: ${error.message}`, 500)
        }
    }




    private async UpdateHolderInfo(query: any, transaction: Transaction) {
        return this.models.Holder
            .update(query.holder!, {
                where: { user_id: query.user.user_id },
                transaction
            })
    }




    async verifyIfUserExists(user_id: number) {
        return this.userRepository.ReadOneSummary(user_id)
    }




    async Exists(query: DocumentEntity) {
        return this.userRepository.Exists(query)
    }
}