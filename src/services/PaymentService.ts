import PaymentRepository from "../repositories/PaymentRepository";
import Database from "../db/Database";



class PaymentService {
    private paymentRepository: PaymentRepository

    constructor(database: Database) {
        this.paymentRepository = new PaymentRepository(database)
    }



    async Create(body: Record<string, any>) {
        return this.paymentRepository.Create(body)
    }



    async ReadAll(query: Record<string, any>) {
        return this.paymentRepository.ReadAll(query)
    }



    async ReadOne(payment_id: string | number) {
        return this.paymentRepository.ReadOne(payment_id)
    }



    async Update(body: Record<string, any>) {
        return this.paymentRepository.Update(body)
    }



    async Delete(payment_id: string | number) {
        return this.paymentRepository.Delete(payment_id)
    }

}


export default PaymentService