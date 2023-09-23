import BillingRepository from "../repositories/BillingRepository";
import BillingSchema from "../classes/BillingSchema";
import IBilling from "../interfaces/IBilling";
import CustomError from "../utils/CustomError";

export default class BillingService {
    billingRepository: BillingRepository;

    constructor() {
        this.billingRepository = new BillingRepository();
    }

    async Create(body: IBilling) {
        const billing = new BillingSchema(body)

        this.verifyDate(billing)

        const createdBilling = await this.billingRepository.Create(billing);

        if(!createdBilling) throw new CustomError('Não foi possível salvar a mensalidade', 500)

        return createdBilling
    }

    async ReadAll(query: any) {
        return this.billingRepository.ReadAll(query);
    }

    async ReadOne() {
        return this.billingRepository.ReadOne();
    }

    async Update() {
        return this.billingRepository.Update();
    }

    async Delete() {
        return this.billingRepository.Delete();
    }

    verifyDate(billing: IBilling) {
        if (!billing.data_referencia) billing.data_referencia = new Date(Date.now())
        if (!billing.ano_referencia) billing.ano_referencia = new Date().getFullYear()
        if (!billing.mes_referencia) billing.mes_referencia = new Date().getMonth()
    }

}