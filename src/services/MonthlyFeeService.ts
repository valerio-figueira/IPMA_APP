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

export default class MonthlyFeeService {
    monthlyFeeRepository: MonthlyFeeRepository;

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
        return this.monthlyFeeRepository.ReadAll(query);
    }




    async ReadAllSummary(params: any, query: any) {
        return this.monthlyFeeRepository.ReadAllSummary(params, query);
    }




    async ReadOne(billing_id: string | number) {
        return this.monthlyFeeRepository.ReadOne(billing_id);
    }




    async Update() {
        return this.monthlyFeeRepository.Update();
    }




    async Delete(billing_id: string | number) {
        const affectedCount = await this.monthlyFeeRepository.Delete(billing_id)

        if (affectedCount === 0) throw new CustomError('Não houve alterações', 400)
        if (affectedCount === 1) return { message: `Houve ${affectedCount} alteração.` }
        if (affectedCount > 1) return { message: `Houve ${affectedCount} alterações.` }
    }




    async BillingReport(query: any) {
        if (!query.reference_month) throw new Error('Insira o mês de referência!')
        if (!query.reference_year) throw new Error('Insira o ano de referência!')

        const billingsReport: any[] | null = await this.monthlyFeeRepository.BillingReport(query)
        if (!billingsReport) throw new Error('Nenhuma informação encontrada!')

        const doc = new PDFDocument();
        const month = Number(query.reference_month) + 1;
        const year = query.reference_year;
        const dir = path.join(__dirname, `../temp/relatorio-${month}-${year}.pdf`)

        doc.pipe(fs.createWriteStream(dir))
        createHeader(doc, query)

        createTable(doc, billingsReport, query)

        doc.end()

        return fs.createReadStream(dir)
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