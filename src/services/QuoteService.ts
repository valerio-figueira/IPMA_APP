import QuoteRepository from "../repositories/QuoteRepository";
import CustomError from "../utils/CustomError";
import Database from "../db/Database";
import { BadRequest } from "../utils/messages/APIResponse";

export default class QuoteService {
    private quoteRepository: QuoteRepository

    constructor(db: Database) {
        this.quoteRepository = new QuoteRepository(db)
    }



    async Create(body: any) {
        return this.quoteRepository.Create(body)
    }




    async ReadAll() {
        return this.quoteRepository.ReadAll()
    }




    async ReadRandom() {
        const totalCount = await this.quoteRepository.TotalCount()
        const sortedNumber = Math.floor(Math.random() * totalCount + 1)

        return this.ReadOne(sortedNumber)
    }



    async ReadOne(quote_id: string | number) {
        return this.quoteRepository.ReadOne(quote_id)
    }




    async Update(body: any) {
        return this.quoteRepository.Update(body)
    }




    async Delete(quote_id: string | number) {
        return this.quoteRepository.Delete(quote_id)
    }
}