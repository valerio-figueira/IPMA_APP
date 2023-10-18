import IMonthlyFee from "../interfaces/IMonthlyFee";
import MonthlyFeeModel from "../models/MonthlyFeeModel";
import HolderModel from "../models/HolderModel";
import UserModel from "../models/user/UserModel";
import AgreementModel from "../models/AgreementModel";
import { Op } from "sequelize";
import Queries from "../db/Queries";
import MemberModel from "../models/MemberModel";

export default class MonthlyFeeRepository {
    private models

    constructor() {
        this.models = { MonthlyFeeModel, MemberModel }
    }

    async Create(query: IMonthlyFee) {
        return this.models.MonthlyFeeModel
            .create(query, { raw: true })
    }

    async ReadAll(query: any) {
        const month = new Date().getMonth();
        const whereClause: any = {
            active: query.active || 1,
            '$billing.member_id$': { [Op.not]: null },
            '$billing.reference_month$': query.reference_month || month
        }

        if (query.agreement_name) {
            whereClause['$agreement.agreement_name$'] = query.agreement_name
        }

        return this.models.MemberModel.findAll({
            where: whereClause,
            include: Queries.MemberIncludeAll,
            raw: true, nest: true
        })
    }

    async ReadOne(monthly_fee_id: string | number) {
        return this.models.MemberModel.findOne({
            include: [{
                model: MonthlyFeeModel,
                as: 'billing',
                where: { monthly_fee_id },
                attributes: { exclude: ['member_id'] }
            }, {
                model: AgreementModel,
                as: 'agreement'
            }, {
                model: HolderModel,
                as: 'holder',
                attributes: { exclude: ['user_id'] },
                include: [{
                    model: UserModel,
                    as: 'user'
                }]
            }],
            raw: true, nest: true
        })
    }

    async Update() { }

    async Delete(monthly_fee_id: string | number) {
        return this.models.MonthlyFeeModel
            .destroy({
                where: { monthly_fee_id }
            })
    }

}