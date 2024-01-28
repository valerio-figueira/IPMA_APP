import IMonthlyFee from "../interfaces/IMonthlyFee";
import MonthlyFee from "../models/MonthlyFeeModel";
import HolderModel from "../models/HolderModel";
import UserModel from "../models/user/UserModel";
import AgreementModel from "../models/AgreementModel";
import { Op, QueryTypes, Transaction } from "sequelize";
import Database from "../db/Database";



export default class MonthlyFeeRepository {
    private db: Database
    private models

    constructor(db: Database) {
        this.db = db
        this.models = {
            Member: this.db.models.Member,
            MonthlyFee: this.db.models.MonthlyFee
        }
    }






    async Create(query: IMonthlyFee, transaction: Transaction | undefined = undefined) {
        return this.models.MonthlyFee
            .create(query, { raw: true, transaction })
    }







    async ReadAll(query: Record<string, any>) {
        const page = query.page || 1;
        const pageSize = query.pageSize || 10;
        const offset = (page - 1) * pageSize;
        const whereClause: Record<string, any> = {
            active: query.active || 1,
            '$billing.member_id$': { [Op.not]: null }
        }

        this.setParams(query, whereClause)

        return this.models.Member.findAll({
            where: whereClause,
            include: [{
                model: this.db.models.MonthlyFee, as: 'billing',
                attributes: ['monthly_fee_id', 'amount', 'reference_month', 'reference_year', 'created_at'],
            }, {
                model: this.db.models.Agreement,
                as: 'agreement', attributes: ['agreement_name']
            }, {
                model: this.db.models.Holder,
                as: 'holder', attributes: [],
                include: [{
                    model: this.db.models.User, as: 'user', attributes: ['name']
                }]
            }, {
                model: this.db.models.Dependent,
                as: 'dependent', attributes: ['relationship_degree'],
                include: [{
                    model: this.db.models.User, as: 'user', attributes: ['name']
                }]
            }],
            order: [['created_at', 'DESC']], raw: true, nest: true,
            limit: pageSize,
            offset
        })
    }







    async ReadAllSummary(params: Record<string, any>, query: any) {
        return this.db.sequelize.query(`SELECT
                m.holder_id,
                u.name,
                a.agreement_name AS AGREEMENT,
                SUM(billing.amount) AS total_billing,
                billing.reference_month,
                billing.reference_year
            FROM
                MONTHLY_FEE billing
                INNER JOIN MEMBER m ON billing.member_id = m.member_id
                INNER JOIN AGREEMENT a ON m.agreement_id = a.agreement_id
                INNER JOIN HOLDER h ON m.holder_id = h.holder_id
                INNER JOIN USER u ON h.user_id = u.user_id
            WHERE
                m.holder_id = :holderId AND
                billing.reference_month = :reference_month AND
                billing.reference_year = :reference_year
            GROUP BY
                m.holder_id,
                u.name,
                billing.reference_month,
                billing.reference_year,
                a.agreement_id
        `, {
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







    async Update(query: Record<string, any>) {
        return this.models.MonthlyFee
            .update(query, {
                where: { monthly_fee_id: query.monthly_fee_id }
            })
    }







    async Delete(monthly_fee_id: string | number) {
        return this.models.MonthlyFee
            .destroy({
                where: { monthly_fee_id }
            })
    }







    async BulkCreate(json: any[]) {
        const transaction: Transaction = await this.db.sequelize.transaction()

        try {
            for (let billing of json) {
                const { holder_id, member_id, agreement_id, reference_month, reference_year } = billing

                const memberExists = await this.models.Member.findOne({
                    where: { holder_id, member_id, agreement_id }, transaction
                })

                if (memberExists) {
                    const billingExists = await this.models.MonthlyFee.findOne({
                        where: { reference_month, reference_year, member_id }, transaction
                    })

                    if (!billingExists) await this.models.MonthlyFee.create(billing, { transaction })
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







    async totalCount(query: Record<string, any>) {
        const whereClause: Record<string, any> = {
            active: query.active || 1,
            '$billing.member_id$': { [Op.not]: null }
        }

        this.setParams(query, whereClause)

        return this.models.Member.count({
            where: whereClause, include: [{
                model: this.db.models.MonthlyFee, as: 'billing',
                attributes: ['monthly_fee_id', 'amount', 'reference_month', 'reference_year', 'created_at'],
            }, {
                model: this.db.models.Agreement,
                as: 'agreement', attributes: ['agreement_name']
            }, {
                model: this.db.models.Holder,
                as: 'holder', attributes: [],
                include: [{
                    model: this.db.models.User,
                    as: 'user', attributes: ['name']
                }]
            }, {
                model: this.db.models.Dependent,
                as: 'dependent', attributes: ['relationship_degree'],
                include: [{
                    model: this.db.models.User, as: 'user', attributes: ['name']
                }]
            }]
        })
    }






    setParams(query: Record<string, any>, whereClause: Record<string, any>) {
        if (query.name) whereClause['$holder.user.name$'] = { [Op.like]: `%${query.name}%` };
        if (query.agreement_name) whereClause['$agreement.agreement_name$'] = { [Op.like]: `%${query.agreement_name}%` };
        if (query.reference_year) whereClause['$billing.reference_year$'] = query.reference_year;
        if (query.reference_month) whereClause['$billing.reference_month$'] = query.reference_month;
    }
}