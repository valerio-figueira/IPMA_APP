import MonthlyFeeRepository from "../repositories/MonthlyFeeRepository";
import MonthlyFeeSchema from "../entities/MonthlyFeeEntity";
import IMonthlyFee from "../interfaces/IMonthlyFee";
import CustomError from "../utils/CustomError";
import MonthlyFeeModel from "../models/MonthlyFeeModel";
import Database from "../db/Database";
import { validateMonthlyFee } from "../utils/decorators/validateBody";
import { Transaction } from "sequelize";

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




    verifyDate(billing: IMonthlyFee) {
        if (!billing.reference_year) billing.reference_year = new Date().getFullYear()
        if (!billing.reference_month) billing.reference_month = Number(billing.reference_month)
    }

    verifyAmount(billing: IMonthlyFee) {
        if (typeof billing.amount === 'string') {
            billing.amount = Number(billing.amount)
        }
    }




    async findDuplicateBilling(body: IMonthlyFee) {
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