import MemberModel from "../models/MemberModel";
import IMember from "../interfaces/IMember";
import HolderModel from "../models/HolderModel";
import UserModel from "../models/user/UserModel";
import AgreementModel from "../models/AgreementModel";
import CustomError from "../utils/CustomError";
import Database from "../db/Database";
import DependentModel from "../models/DependentModel";

export default class MemberRepository {
    db: Database

    constructor() {
        this.db = new Database()
    }

    async Create(query: IMember) {
        return MemberModel.create(query, { raw: true })
    }

    async ReadAll(query: any) {
        const whereClause: any = { active: query.active || true }
        const includeClause: any = [{
            model: AgreementModel,
            as: 'agreement',
            attributes: { exclude: ['agreement_id'] }
        }]

        if (query.holder_id) whereClause.holder_id = query.holder_id

        if (query.agreement_name) includeClause[0].where = {
            agreement_name: query.agreement_name
        }

        return MemberModel.findAll({
            where: whereClause,
            include: includeClause,
            raw: true, nest: true
        })
    }

    async ReadOne(subscription_id: string | number) {
        return HolderModel.findOne({
            include: [{
                model: UserModel,
                as: 'user'
            }, {
                model: MemberModel,
                as: 'subscription',
                where: { member_id: subscription_id },
                attributes: { exclude: ['holder_id'] },
                include: [{
                    model: AgreementModel,
                    as: 'agreement',
                    attributes: { exclude: ['agreement_id'] }
                }]
            }], raw: true, nest: true,
        })
    }

    async Update(body: IMember) {
        return MemberModel.update(body, {
            where: { member_id: body.member_id }
        })
    }

    async Delete(body: IMember) {
        return MemberModel.destroy({
            where: {
                member_id: body.member_id,
                agreement_id: body.agreement_id,
                holder_id: body.holder_id
            }
        })
    }

    async ifMemberExists(query: IMember, dependent_id: number | null = null) {
        return MemberModel.findOne({
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

        if (dependents.length === 0) return

        let affectedCount = 0
        for (let dependent of dependents) {
            let [count] = await MemberModel.update({ active: false }, {
                where: {
                    holder_id: query.holder_id,
                    dependent_id: dependent.dependent_id
                }, transaction
            })
            affectedCount += count
        }

        let [count] = await MemberModel.update({ active: false }, {
            where: { holder_id: query.holder_id },
            transaction
        })

        transaction.commit()
        affectedCount += count
        return affectedCount
    }


}