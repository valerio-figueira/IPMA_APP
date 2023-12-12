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




    async SumAppointments(query: Record<string, any>) {
        const whereClause: Record<string, any> = {}

        if (query.member_id) whereClause.member_id = query.member_id
        if (query.reference_month) whereClause.reference_month = query.reference_month
        if (query.reference_year) whereClause.reference_year = query.reference_year

        return this.models.Appointment.findAll({
            attributes: [
                'member_id',
                [this.db.sequelize.fn('SUM', this.db.sequelize.col('amount')), 'total_amount'],
            ],
            group: ['member_id'],
        })
    }




    async AppointmentReport(query: Record<string, any>) {
        const whereClause: Record<string, any> = {
            '$subscription.active$': query.active || 1
        }

        if (query.holder_name)
            whereClause['$subscription.holder.user.name$'] = query.holder_name

        if (query.dependent_name)
            whereClause['$subscription.dependent.user.name$'] = query.dependent_name

        if (query.reference_year)
            whereClause['reference_year'] = query.reference_year;

        if (query.reference_month)
            whereClause['reference_month'] = query.reference_month;

        return this.models.Appointment.findAll({
            where: whereClause, nest: true, raw: true,
            include: [{
                model: this.models.Member,
                as: 'subscription',
                include: [{
                    model: this.models.Holder,
                    as: 'holder',
                    include: [{
                        model: this.models.User,
                        as: 'user'
                    }]
                }, {
                    model: this.models.Agreement,
                    as: 'agreement'
                }]
            }]
        })
    }







    async BillingReport(query: Record<string, any>) {
        const whereClause: Record<string, any> = {
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