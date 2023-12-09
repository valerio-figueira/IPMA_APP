import Database from "../db/Database";
import Models from "../models";
import { Op } from "sequelize";
import Queries from "../db/Queries";



export default class ReportRepository {
    private models: Models
    private db: Database

    constructor(db: Database) {
        this.db = db
        this.models = this.db.models
    }



    async BillingReport(query: any) {
        const whereClause: any = {
            active: query.active || 1,
            '$billing.member_id$': { [Op.not]: null }
        }

        if (query.reference_year)
            whereClause['$billing.reference_year$'] = query.reference_year;

        if (query.reference_month)
            whereClause['$billing.reference_month$'] = query.reference_month;

        return this.models.Member.findAll({
            where: whereClause,
            attributes: [
                'holder.subscription_number',
                'holder.holder_id',
                'holder.status',
                [this.db.sequelize.fn('SUM', this.db.sequelize.col('billing.amount')), 'total_billing'],
                'holder.user.name',
                'agreement.agreement_id',
                'billing.reference_month',
                'billing.reference_year'
            ],
            include: Queries.MemberIncludeAll,
            group: [
                'holder.subscription_number',
                'holder.holder_id',
                'holder.status',
                'holder.user.name',
                'billing.reference_month',
                'billing.reference_year',
                'agreement.agreement_id'],
            raw: true, nest: true
        })
    }
}