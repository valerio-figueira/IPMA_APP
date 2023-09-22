import BillingRepository from "../repositories/BillingRepository";


export default class BillingService {
    billingRepository: BillingRepository;

    constructor() {
        this.billingRepository = new BillingRepository();
    }

    async Create() {
        return this.billingRepository.Create(undefined);
    }

    async ReadAll() {
        return this.billingRepository.ReadAll();
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

}