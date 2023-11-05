import MemberModel from "../models/MemberModel";
import IMember from "../interfaces/IMember";
import HolderModel from "../models/HolderModel";
import UserModel from "../models/user/UserModel";
import AgreementModel from "../models/AgreementModel";
import CustomError from "../utils/CustomError";
import Database from "../db/Database";
import DependentModel from "../models/DependentModel";
import { Op, col } from "sequelize";

export default class MemberRepository {
    private db: Database
    private models

    constructor(db: Database) {
        this.db = db
        this.models = {
            Member: MemberModel.INIT(this.db.sequelize),
            Agreement: AgreementModel.INIT(this.db.sequelize),
            Holder: HolderModel.INIT(this.db.sequelize),
            Dependent: DependentModel.INIT(this.db.sequelize)
        }
    }




    async Create(query: IMember) {
        return this.models.Member.create(query, { raw: true })
    }




    async ReadAll(query: any) {
        const page = query.page || 1;
        const pageSize = query.pageSize || 10;
        const offset = (page - 1) * pageSize;

        const where: any = {
            active: query.active || true,
            dependent_id: null,
        }

        const include: any = [{
            model: AgreementModel,
            as: 'agreement',
            attributes: { exclude: ['agreement_id'] }
        }, {
            model: this.models.Holder,
            as: 'holder',
            include: [{
                model: UserModel,
                as: 'user'
            }]
        }]

        if (query.active) where.active = query.active
        if (query.holder_id) where.holder_id = query.holder_id
        if (query.name) where['$holder.user.name$'] = { [Op.like]: `%${query.name}%` }
        if (query.agreement_name) include[0].where = { agreement_name: query.agreement_name }

        return this.models.Member.findAll({
            offset,
            limit: pageSize,
            where, include,
            order: [['created_at', 'DESC']],
            raw: true, nest: true
        })
    }




    async ReadOne(subscription_id: string | number) {
        return this.models.Holder.findOne({
            include: [{
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




    async Delete(body: IMember) {
        return this.models.Member.destroy({
            where: {
                member_id: body.member_id,
                agreement_id: body.agreement_id,
                holder_id: body.holder_id
            }
        })
    }




    async ifMemberExists(query: IMember, dependent_id: number | null = null) {
        return this.models.Member.findOne({
            where: {
                holder_id: query.holder_id,
                agreement_id: query.agreement_id,
                dependent_id: dependent_id
            }
        })
    }




    async updateExclusionOfDependents(query: IMember) {
        const transaction = await this.db.sequelize.transaction()
        const dependents = await DependentModel.findAll({ where: { holder_id: query.holder_id } })

        try {
            if (dependents.length === 0) return

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