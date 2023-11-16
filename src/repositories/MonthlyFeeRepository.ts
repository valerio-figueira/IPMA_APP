import IMonthlyFee from "../interfaces/IMonthlyFee";
import MonthlyFee from "../models/MonthlyFeeModel";
import HolderModel from "../models/HolderModel";
import UserModel from "../models/user/UserModel";
import AgreementModel from "../models/AgreementModel";
import { Op, QueryTypes, Transaction } from "sequelize";
import Queries from "../db/Queries";
import MemberModel from "../models/MemberModel";
import Database from "../db/Database";
import MonthlyFeeModel from "../models/MonthlyFeeModel";

export default class MonthlyFeeRepository {
    private db: Database
    private models

    constructor(db: Database) {
        this.db = db
        this.models = {
            Member: MemberModel.INIT(this.db.sequelize),
            MonthlyFee: MonthlyFeeModel.INIT(this.db.sequelize)
        }
    }



    async Create(query: IMonthlyFee, transaction: Transaction | undefined = undefined) {
        return this.models.MonthlyFee
            .create(query, { raw: true, transaction })
    }




    async ReadAll(query: any) {
        const whereClause: any = {
            active: query.active || 1,
            '$billing.member_id$': { [Op.not]: null }
        }

        if (query.agreement_name)
            whereClause['$agreement.agreement_name$'] = { [Op.like]: `%${query.agreement_name}%` };

        if (query.reference_year)
            whereClause['$billing.reference_month$'] = query.reference_year;

        if (query.reference_month)
            whereClause['$billing.reference_month$'] = query.reference_month;

        return this.models.Member.findAll({
            where: whereClause,
            include: Queries.MonthlyFeeSummary,
            raw: true, nest: true
        })
    }



    async ReadAllSummary(params: any, query: any) {
        console.log(query)
        console.log(params)
        return this.db.sequelize.query(Queries.MonthlyFeeRawQuery, {
            replacements: {
                holderId: params.holder_id,
                reference_month: query.reference_month,
                reference_year: query.reference_year
            },
            type: QueryTypes.SELECT,
            raw: true
        })
    }




    async ReadOne(monthly_fee_id: string | number) {
        return this.models.Member.findOne({
            include: [{
                model: MonthlyFee,
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
        return this.models.MonthlyFee
            .destroy({
                where: { monthly_fee_id }
            })
    }

}