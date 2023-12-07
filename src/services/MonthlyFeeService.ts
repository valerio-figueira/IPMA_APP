import MonthlyFeeRepository from "../repositories/MonthlyFeeRepository";
import MonthlyFeeSchema from "../entities/MonthlyFeeEntity";
import IMonthlyFee from "../interfaces/IMonthlyFee";
import CustomError from "../utils/CustomError";
import MonthlyFeeModel from "../models/MonthlyFeeModel";
import Database from "../db/Database";
import { validateMonthlyFee } from "../utils/decorators/validateBody";
import { Transaction } from "sequelize";
import PDFDocument from 'pdfkit';
import * as fs from 'fs'
import * as path from 'path'
import createTable, { createHeader } from "../utils/CreateTable";
import { groupDetailedBillings } from "../utils/GroupBillings";

export default class MonthlyFeeService {
    private monthlyFeeRepository: MonthlyFeeRepository;

    constructor(db: Database) {
        this.monthlyFeeRepository = new MonthlyFeeRepository(db);
    }



    @validateMonthlyFee
    async Create(body: IMonthlyFee, transaction: Transaction | undefined = undefined) {
        const billing = new MonthlyFeeSchema(body)

        this.verifyDate(billing)
        this.verifyAmount(billing)

        await this.findDuplicateBilling(billing)

        const createdBilling = await this.monthlyFeeRepository.Create(billing, transaction);

        if (!createdBilling) throw new CustomError('Não foi possível salvar a mensalidade', 500)

        return createdBilling
    }





    async ReadAll(query: any) {
        const billings = await this.monthlyFeeRepository.ReadAll(query)
        const totalCount = await this.monthlyFeeRepository.totalCount(query)

        const totalPages = Math.ceil(totalCount / (query.pageSize || 10))
        const groupedBillings = groupDetailedBillings(billings)
        const response = []
        response.push(groupedBillings, {
            currentPage: query.page || 1,
            pageSize: query.pageSize || 10,
            totalCount: totalCount,
            totalPages: totalPages
        })

        return response
    }




    async ReadAllSummary(params: any, query: any) {
        return this.monthlyFeeRepository.ReadAllSummary(params, query);
    }




    async ReadOne(billing_id: string | number) {
        return this.monthlyFeeRepository.ReadOne(billing_id);
    }




    async Update(body: Record<string, any>) {
        if(!body.monthly_fee_id) throw new Error('Insira a identificação do pagamento.')
        if(!body.reference_month) throw new Error('Insira o mês de referência do pagamento.')
        if(!body.reference_year) throw new Error('Insira o ano de referência do pagamento.')
        return this.monthlyFeeRepository.Update(body);
    }




    async Delete(billing_id: string | number) {
        const affectedCount = await this.monthlyFeeRepository.Delete(billing_id)

        if (affectedCount === 0) throw new CustomError('Não houve alterações', 400)
        if (affectedCount === 1) return { message: `Houve ${affectedCount} alteração.` }
        if (affectedCount > 1) return { message: `Houve ${affectedCount} alterações.` }
    }




    async BillingReport(query: Record<string, any>) {
        if (!query.reference_month) throw new Error('Insira o mês de referência!')
        if (!query.reference_year) throw new Error('Insira o ano de referência!')
        if (!query.report_type) throw new Error('Insira o tipo de relatório!')

        const billingsReport: any[] | null = await this.fetchDataForReport(query)
        if (!billingsReport) throw new Error('Nenhuma informação encontrada!')

        const doc = new PDFDocument()
        const month = Number(query.reference_month) + 1
        const year = query.reference_year

        const filename = `relatorio-${month}-${year}.pdf`
        const dir = path.join(__dirname, `../temp/${filename}`)
        const writeStream = fs.createWriteStream(dir)

        doc.pipe(writeStream)

        createHeader(doc, query)
        createTable(doc, billingsReport)

        return { filename, doc }
    }




    private fetchDataForReport<T extends Record<string, string | number>>(query: T) {
        if (query.report_type === 'monthlyFees') return this.monthlyFeeRepository.BillingReport(query)
        if (query.report_type === 'appointments') return null
        if (query.report_type === 'odontoCompanyMembers') return null
        if (query.report_type === 'odontoCompanyInstallments') return null
        if (query.report_type === 'uniodontoInstallments') return null
        if (query.report_type === 'townhall') return null

        return null
    }





    private verifyDate(billing: IMonthlyFee) {
        if (!billing.reference_year) billing.reference_year = new Date().getFullYear()
        if (!billing.reference_month) billing.reference_month = Number(billing.reference_month)
    }




    private verifyAmount(billing: IMonthlyFee) {
        if (typeof billing.amount === 'string') {
            billing.amount = Number(billing.amount)
        }
    }




    private async findDuplicateBilling(body: IMonthlyFee) {
        const billing: any = await MonthlyFeeModel.findOne({
            where: { member_id: body.member_id },
            raw: true
        })

        if (!billing) return

        if (body.reference_month === billing.reference_month) {
            if (body.reference_year === billing.reference_year) {
                throw new CustomError('Já existe o registro dessa cobrança', 400)
            }
        }
    }

}