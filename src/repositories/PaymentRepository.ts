import Database from "../db/Database";



class PaymentRepository {
    private db: Database

    constructor(database: Database) {
        this.db = database
    }


    async Create(query: Record<string, any>) { }



    async ReadAll(query: Record<string, any>) { }



    async ReadOne(payment_id: string | number) { }



    async Update(query: Record<string, any>) { }



    async Delete(payment_id: string | number) { }

}


export default PaymentRepository