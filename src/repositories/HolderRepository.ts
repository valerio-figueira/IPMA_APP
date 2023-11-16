import { IUserAttributes } from "../interfaces/IUser";
import UserRepository from "./UserRepository";
import HolderModel from "../models/HolderModel";
import Database from "../db/Database";
import CustomError from '../utils/CustomError';
import { Op, Transaction } from 'sequelize';
import Queries from "../db/Queries";
import MemberModel from "../models/MemberModel";
import AccessHierarchyModel from "../models/AccessHierarchyModel";
import AuthenticationModel from "../models/AuthenticationModel";
import RES from "../utils/messages/HolderResponses";
import HolderBundleEntities from "../entities/HolderBundleEntities";
import MonthlyFeeModel from "../models/MonthlyFeeModel";

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




    async Create(query: HolderBundleEntities) {
        const t: Transaction = await this.db.sequelize.transaction();
        console.log(query)
        try {
            await this.userRepository.CreateWithTransaction(query, t);

            const holder = await this.models.Holder
                .create(query.holder, { transaction: t, raw: true })

            await t.commit();
            return this.ReadOne(holder.holder_id)
        } catch (error: any) {
            await t.rollback();
            console.log(error)
            throw new CustomError(RES.ServerError, 500)
        }
    }




    async ReadAll(query: any) {
        const whereClause: any = {}
        const holderWhereClause: any = {}

        if (query.name) whereClause.name = { [Op.like]: `%${query.name}%` }
        if (query.subscription_number) {
            holderWhereClause.subscription_number = query.subscription_number
        }

        return this.models.Holder
            .findAll({
                where: holderWhereClause,
                include: Queries.IncludeSummaryUser(whereClause),
                raw: true, nest: true,
                order: [['created_at', 'DESC']]
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

            if (!userResult && !holderResult) throw new CustomError(RES.NotAffected, 400)

            await t.commit()

            return this.ReadOne(query.holder!.holder_id!)
        } catch (error: any) {
            await t.rollback()
            throw new CustomError(RES.NotAffected, 500)
        }
    }




    async Delete(holder_id: string | number) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const subscriptions = await MemberModel.INIT(this.db.sequelize)
                .findAll({ where: { holder_id } })

            subscriptions.forEach(async subscription => {
                await MonthlyFeeModel.destroy({
                    where: { member_id: subscription.member_id }
                })
            })

            await MemberModel.destroy({
                where: { holder_id },
                transaction: t,
            })

            const holder = await this.ReadOneSummary(holder_id)
            if (!holder) throw new Error('Falha ao buscar dados do titular')

            const user = await this.userRepository.ReadOneSummary(holder.user_id)
            if (!user) throw new Error('Falha ao buscar dados de usuário')

            await this.models.Holder.destroy({
                where: { holder_id },
                transaction: t,
            })

            await this.userRepository.DeleteWithTransaction(user.user_id, t)

            await t.commit()

            return { message: `O titular foi removido com todas as suas dependências` }
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(error, 500)
        }
    }




    async findHolderByUserId(user_id: number | string) {
        return this.models.Holder
            .findOne({
                where: { user_id }
            })
    }




    private async UpdateHolderInfo(query: any, transaction: Transaction) {
        return this.models.Holder
            .update(query.holder!, {
                where: { user_id: query.user.user_id },
                transaction
            })
    }
}