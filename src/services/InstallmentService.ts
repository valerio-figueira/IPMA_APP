import Database from "../db/Database";
import InstallmentRepository from "../repositories/InstallmentRepository";



class InstallmentService {
    private installmentRepository: InstallmentRepository

    constructor(database: Database) {
        this.installmentRepository = new InstallmentRepository(database)
    }



    async Create(body: Record<string, string & number>) {
        return this.installmentRepository.Create(body)
    }



    async ReadAll(query: Record<string, any>) {
        return this.installmentRepository.ReadAll(query)
    }



    async ReadOne(query: string | number) {
        return this.installmentRepository.ReadOne(query)
    }



    async Update(body: Record<string, string & number>) {
        return this.installmentRepository.Update(body)
    }



    async Delete(installment_id: string | number) {
        return this.installmentRepository.Delete(installment_id)
    }

}


export default InstallmentService