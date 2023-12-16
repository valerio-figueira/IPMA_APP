import IMember from "../interfaces/IMember";
import CustomError from "../utils/CustomError";
import Database from "../db/Database";
import { Op, Transaction } from "sequelize";
import Queries from "../db/Queries";



export default class MemberRepository {
    private db: Database
    private models

    constructor(db: Database) {
        this.db = db
        this.models = this.db.models
    }




    async Create(query: IMember, transaction: Transaction) {
        return this.models.Member.create(query, { raw: true, transaction })
    }




    async ReadAll(query: any) {
        const page = query.page || 1;
        const pageSize = query.pageSize || 10;
        const offset = (page - 1) * pageSize;

        const whereClause: any = { dependent_id: null }

        this.setParams(query, whereClause)

        return this.models.Member.findAll({
            offset,
            limit: pageSize,
            where: whereClause, include: Queries.MonthlyFeeQuery,
            order: [['created_at', 'DESC']],
            raw: true, nest: true
        })
    }




    async ReadOne(subscription_id: string | number) {
        return this.models.Holder.findOne({
            include: [{
                model: this.models.User,
                as: 'user',
            }, {
                model: this.models.Member,
                as: 'subscription',
                where: { member_id: subscription_id },
                attributes: { exclude: ['holder_id'] },
                include: [{
                    model: this.models.Agreement,
                    as: 'agreement',
                    attributes: { exclude: ['agreement_id'] }
                }]
            }], raw: true, nest: true,
        })
    }




    async Update(body: IMember) {
        return this.models.Member.update(body, {
            where: { member_id: body.member_id }
        })
    }




    async Delete(body: Record<string, any>) {
        return this.models.Member.destroy({
            where: {
                member_id: body.member_id,
                agreement_id: body.agreement_id,
                holder_id: body.holder_id
            }
        })
    }




    async BulkCreate(json: any[]) {
        const transaction: Transaction = await this.db.sequelize.transaction()

        try {
            for (let member of json) {
                const { holder_id, agreement_id } = member

                const result = await this.models.Member.findOne({
                    where: {
                        holder_id,
                        agreement_id,
                    }, transaction
                })

                if (result && member.agreement_id === result.agreement_id) {
                    await this.models.Member.update(member, { where: { member_id: result.member_id }, transaction })
                } else {
                    await this.models.Member.create(member, { transaction })
                }
            }

            await transaction.commit()
        } catch (error: any) {
            await transaction.rollback()
            console.error(error)
            throw new Error(error.message)
        }

        return { message: 'Banco de dados atualizado!' }
    }




    async totalCount(query: any) {
        const whereClause: any = {}
        this.setParams(query, whereClause)
        return this.models.Member.count({
            where: whereClause,
            include: Queries.MonthlyFeeQuery
        })
    }




    async ifMemberExists(query: IMember, dependent_id: number | null = null) {
        const where: any = {
            holder_id: query.holder_id,
            agreement_id: query.agreement_id
        }

        if (dependent_id) where.dependent_id = dependent_id

        return this.models.Member.findOne({ where })
    }




    private setParams(query: any, whereClause: any) {
        whereClause.dependent_id = null

        if (query.active) whereClause.active = query.active
        if (query.holder_id) whereClause.holder_id = query.holder_id
        if (query.name) whereClause['$holder.user.name$'] = { [Op.like]: `%${query.name}%` }
        if (query.agreement_name) whereClause['$agreement.agreement_name$'] = { [Op.like]: `%${query.agreement_name}%` }
    }




    async updateExclusionOfDependents(query: IMember) {
        const dependents = await this.models.Dependent
            .findAll({ where: { holder_id: query.holder_id } })

        if (dependents.length === 0) return

        const transaction = await this.db.sequelize.transaction()
        try {


            let affectedCount = 0
            for (let dependent of dependents) {
                let [count] = await this.models.Member.update({ active: false }, {
                    where: {
                        holder_id: query.holder_id,
                        dependent_id: dependent.dependent_id
                    }, transaction
                })
                affectedCount += count
            }

            let [count] = await this.models.Member.update({ active: false }, {
                where: { holder_id: query.holder_id },
                transaction
            })

            transaction.commit()
            affectedCount += count
            return affectedCount
        } catch (error: any) {
            await transaction.rollback()
            throw new CustomError(error.message || 'Não foi possível remover os dependentes ou titular', error.status || 500)
        }
    }


}