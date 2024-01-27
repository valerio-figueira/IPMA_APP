import IMember from "../interfaces/IMember";
import CustomError from "../utils/CustomError";
import Database from "../db/Database";
import { Op, Transaction } from "sequelize";
import MemberEntity from "../entities/MemberEntity";
import MemberModel from "../models/MemberModel";



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
            where: whereClause, include: [{
                model: this.db.models.Agreement, as: 'agreement'
            }, {
                model: this.db.models.Holder, as: 'holder',
                include: [{
                    model: this.db.models.User,
                    as: 'user'
                }]
            }],
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
                    as: 'agreement'
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
            throw new Error(error.message)
        }

        return { message: 'Banco de dados atualizado!' }
    }




    async ReadDependentsMembers(holder_id: string | number) {
        return this.db.models.Dependent.findAll({
            where: { holder_id },
            include: [{
                model: this.db.models.User,
                as: 'user',
                attributes: { exclude: ['user_id'] },
                include: [
                    {
                        model: this.db.models.Contact, as: 'contact',
                        attributes: { exclude: ['user_id', 'contact_id'] }
                    },
                    {
                        model: this.db.models.Document, as: 'document',
                        attributes: { exclude: ['user_id', 'document_id'] },
                    },
                    {
                        model: this.db.models.Location, as: 'location',
                        attributes: { exclude: ['user_id', 'location_id'] }
                    }
                ]
            }, {
                model: this.db.models.Member, as: 'subscription',
                include: [{
                    model: this.db.models.Agreement, as: 'agreement'
                }]
            }], raw: true, nest: true
        })
    }





    async ReviveMember(body: MemberEntity, transaction: Transaction) {
        const { member_id, dependent_id } = await this.models.Member.create(body, { raw: true, transaction })
        return { member_id, dependent_id }
    }





    async ReadOneByUserType(member_id: string | number, member_type: 'Holder' | 'Dependent') {
        const query = {
            include: [{
                model: this.models.User,
                as: 'user'
            }, {
                model: this.models.Member,
                as: 'subscription',
                where: { member_id: member_id },
                attributes: { exclude: ['holder_id'] },
                include: [{
                    model: this.models.Agreement,
                    as: 'agreement'
                }]
            }], raw: true, nest: true
        }

        if (member_type === 'Dependent') return this.models.Dependent.findOne(query)
        if (member_type === 'Holder') return this.models.Holder.findOne(query)

        throw new CustomError('O conveniado não existe!', 400)
    }





    async totalCount(query: any) {
        const whereClause: any = {}
        this.setParams(query, whereClause)
        return this.models.Member.count({
            where: whereClause,
            include: [
                {
                    model: this.db.models.Agreement,
                    as: 'agreement'
                },
                {
                    model: this.db.models.Holder,
                    as: 'holder',
                    include: [{ model: this.db.models.User, as: 'user' }]
                }
            ]
        })
    }




    async ifMemberExists(query: IMember, dependent_id: number | null = null) {
        const where: any = {
            holder_id: query.holder_id,
            agreement_id: query.agreement_id,
            active: true
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




    async DeactiveMembers(query: IMember): Promise<[affectedCount: number]> {
        const dependents = await this.models.Dependent
            .findAll({ where: { holder_id: query.holder_id } })

        if (dependents.length > 0) {
            const transaction = await this.db.sequelize.transaction()

            try {
                let affectedCount = 0

                for (let dependent of dependents) {
                    const { dependent_id } = dependent
                    const subscriptions = await this.db.models.Member.findAll({ where: { dependent_id } })

                    subscriptions.forEach(async subscription => {
                        if (subscription.agreement_id == query.agreement_id) {
                            let [count] = await this.deactiveDependentMember(subscription, transaction)
                            affectedCount += count
                        }
                    })
                }

                const [count] = await this.deactiveHolderMember(query, transaction)

                transaction.commit()
                affectedCount += count
                return [affectedCount]
            } catch (error: any) {
                await transaction.rollback()
                throw new CustomError(error.message, error.status || 500)
            }
        } else {
            return this.models.Member.update(query, {
                where: { member_id: query.member_id }
            })
        }
    }






    private async deactiveHolderMember(query: IMember,
        transaction: Transaction, dependent_id: number | null = null) {
        const whereClause: Record<string, any> = {
            member_id: query.member_id,
            holder_id: query.holder_id
        }

        if (dependent_id) whereClause.dependent_id = dependent_id

        return this.models.Member.update(query, {
            where: whereClause, transaction
        })
    }






    private async deactiveDependentMember(query: MemberModel,
        transaction: Transaction) {
        const whereClause: Record<string, any> = {
            member_id: query.member_id
        }

        const values = {
            member_id: query.member_id,
            holder_id: query.holder_id,
            dependent_id: query.dependent_id,
            agreement_id: query.agreement_id,
            exclusion_date: query.exclusion_date = new Date(),
            active: query.active = false
        }

        return this.models.Member.update(values, {
            where: whereClause, transaction
        })
    }
}