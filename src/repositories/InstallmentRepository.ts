import Database from "../db/Database";



class InstallmentRepository {
    private db: Database

    constructor(database: Database) {
        this.db = database
    }


    async Create(query: Record<string, string & number>) { }



    async ReadAll(query: Record<string, any>) { }



    async ReadOne(query: string | number) { }



    async Update(query: Record<string, string & number>) { }



    async Delete(installment_id: string | number) { }

}


export default InstallmentRepository