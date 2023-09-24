import BillingRepository from "../repositories/BillingRepository";
import BillingSchema from "../classes/BillingSchema";
import IBilling from "../interfaces/IBilling";
import CustomError from "../utils/CustomError";
import BillingModel from "../models/BillingModel";

export default class BillingService {
    billingRepository: BillingRepository;

    constructor() {
        this.billingRepository = new BillingRepository();
    }

    async Create(body: IBilling) {
        const billing = new BillingSchema(body)

        this.verifyDate(billing)

        await this.findDuplicateBilling(billing)

        const createdBilling = await this.billingRepository.Create(billing);

        if (!createdBilling) throw new CustomError('Não foi possível salvar a mensalidade', 500)

        return createdBilling
    }

    async ReadAll(query: any) {
        return this.billingRepository.ReadAll(query);
    }

    async ReadOne(billing_id: string | number) {
        return this.billingRepository.ReadOne(billing_id);
    }

    async Update() {
        return this.billingRepository.Update();
    }

    async Delete(billing_id: string | number) {
        return this.billingRepository.Delete(billing_id);
    }

    verifyDate(billing: IBilling) {
        if (!billing.data_referencia) billing.data_referencia = new Date(Date.now())
        if (!billing.ano_referencia) billing.ano_referencia = new Date().getFullYear()
        if (!billing.mes_referencia) billing.mes_referencia = new Date().getMonth()
    }

    async findDuplicateBilling(body: IBilling) {
        const billing: any = await BillingModel.findOne({
            where: { id_conveniado: body.id_conveniado },
            raw: true
        })

        if (!billing) return

        if (body.mes_referencia === billing.mes_referencia) {
            if (body.ano_referencia === billing.ano_referencia) {
                throw new CustomError('Já existe o registro dessa cobrança', 400)
            }
        }
    }

}