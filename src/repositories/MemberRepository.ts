import MemberModel from "../models/MemberModel";
import IMember from "../interfaces/IMember";
import HolderModel from "../models/HolderModel";
import UserModel from "../models/user/UserModel";
import AgreementModel from "../models/AgreementModel";

export default class MemberRepository {

    constructor() { }

    async Create(query: IMember) {
        return MemberModel.create(query, { raw: true })
    }

    async ReadAll(query: any) {
        const whereClause: any = { active: query.active || true }
        const includeClause: any = [{
            model: AgreementModel,
            as: 'contract',
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
                where: { id_conveniado: subscription_id },
                attributes: { exclude: ['holder_id', 'agreement_id'] },
                include: [{
                    model: AgreementModel,
                    as: 'contract',
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

}