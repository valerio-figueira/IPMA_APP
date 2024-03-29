import { IUserAttributes } from "../interfaces/IUser";
import UserRepository from "./UserRepository";
import Database from "../db/Database";
import CustomError from '../utils/CustomError';
import { Op, Transaction } from 'sequelize';
import RES from "../utils/messages/HolderResponses";
import HolderBundleEntities from "../entities/HolderBundleEntities";



export default class HolderRepository {
    private db: Database;
    private userRepository: UserRepository;
    private models

    constructor(db: Database) {
        this.db = db
        this.userRepository = new UserRepository(this.db)
        this.models = this.db.models
    }




    async Create(query: HolderBundleEntities) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            await this.userRepository.CreateWithTransaction(query, t);

            const holder = await this.models.Holder
                .create(query.holder, { transaction: t, raw: true })

            await t.commit();
            return this.ReadOne(holder.holder_id)
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(RES.ServerError, 500)
        }
    }




    async BulkCreate(query: HolderBundleEntities[]) {
        for (let user of query) {
            const transaction: Transaction = await this.db.sequelize.transaction()

            try {
                const result = await this.userRepository.CreateOrUpdate(user, transaction)

                if (result && result.status === 'UPDATE') {
                    const user_id = user.holder.user_id = result.user_id
                    await this.models.Holder.update(user.holder, { where: { user_id }, transaction })
                } else {
                    if (result && result.status === 'CREATE') {
                        await this.models.Holder.create(user.holder, { transaction })
                    }
                }

                await transaction.commit()
            } catch (error: any) {
                await transaction.rollback()
                console.error(error)
                throw new Error(error.message)
            }
        }

        return { message: 'O banco de dados foi atualizado!' }
    }




    async ReadAll(query: any) {
        const whereClause: any = {}
        const holderWhereClause: any = {}
        const page = query.page || 1
        const pageSize = query.pageSize || 10
        const offset = (page - 1) * pageSize

        if (query.name) whereClause.name = { [Op.like]: `%${query.name}%` }
        if (query.subscription_number) {
            holderWhereClause.subscription_number = query.subscription_number
        }

        return this.models.Holder
            .findAll({
                offset,
                limit: pageSize,
                where: holderWhereClause,
                include: [{
                    model: this.db.models.User, as: 'user',
                    where: whereClause,
                    attributes: { exclude: ['user_id'] },
                    include: [{
                        model: this.db.models.Authentication, as: 'authentication',
                        attributes: { exclude: ['user_id', 'password'] },
                        include: [{ model: this.db.models.AccessHierarchy, as: 'hierarchy' }]
                    }]
                }],
                raw: true, nest: true,
                order: [['created_at', 'DESC']]
            })
    }




    async ReadOne(holder_id: string | number) {
        return this.models.Holder
            .findByPk(holder_id, {
                include: [{
                    model: this.db.models.User, as: 'user', attributes: { exclude: ['user_id'] },
                    include: [{
                        model: this.db.models.Authentication, as: 'authentication',
                        attributes: { exclude: ['user_id', 'password'] },
                        include: [{ model: this.db.models.AccessHierarchy, as: 'hierarchy' }]
                    }, {
                        model: this.db.models.Contact, as: 'contact',
                        attributes: { exclude: ['user_id', 'contact_id'] }
                    }, {
                        model: this.db.models.Document, as: 'document',
                        attributes: { exclude: ['user_id', 'document_id'] },
                    }, {
                        model: this.db.models.Location, as: 'location',
                        attributes: { exclude: ['user_id', 'location_id'] }
                    }]
                }],
                raw: true, nest: true
            })
    }




    async ReadOneSummary(holder_id: string | number) {
        return this.models.Holder
            .findByPk(holder_id, {
                include: [{
                    model: this.db.models.User, as: 'user', attributes: { exclude: ['user_id'] },
                    include: [{
                        model: this.db.models.Authentication, as: 'authentication',
                        attributes: { exclude: ['user_id', 'password'] },
                        include: [{ model: this.db.models.AccessHierarchy, as: 'hierarchy' }]
                    }]
                }], raw: true, nest: true
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
            const subscriptions = await this.models.Member
                .findAll({ where: { holder_id } })

            subscriptions.forEach(async subscription => {
                await this.models.MonthlyFee.destroy({
                    where: { member_id: subscription.member_id }, transaction: t
                })
            })

            await this.models.Member.destroy({
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

            const result = await this.userRepository.DeleteWithTransaction(user.user_id, t)

            if (!result) throw new Error('Falha ao remover dados de usuário.')

            await t.commit()
            return { message: `O titular foi removido com todas as suas dependências` }
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(error, 500)
        }
    }





    async totalCount(query: any) {
        const whereClause: any = {}

        if (query.name) whereClause.name = { [Op.like]: `%${query.name}%` }

        return this.models.Holder.count({
            include: [{
                model: this.db.models.User, as: 'user',
                where: whereClause, attributes: { exclude: ['user_id'] },
                include: [{
                    model: this.db.models.Authentication, as: 'authentication',
                    attributes: { exclude: ['user_id', 'password'] },
                    include: [{ model: this.db.models.AccessHierarchy, as: 'hierarchy' }]
                }]
            }]
        })
    }





    async findHolderByUserId(user_id: number | string) {
        return this.models.Holder
            .findOne({
                where: { user_id }
            })
    }




    private async UpdateHolderInfo(query: any, transaction: Transaction) {
        return this.models.Holder
            .update(query.holder, {
                where: { user_id: query.user.user_id },
                transaction
            })
    }
}