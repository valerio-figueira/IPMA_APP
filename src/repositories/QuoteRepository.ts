import { ModelStatic } from "sequelize";
import Database from "../db/Database";
import QuoteModel from "../models/QuoteModel";



export default class QuoteRepository {
    private model: ModelStatic<QuoteModel>
    private db: Database

    constructor(db: Database) {
        this.db = db
        this.model = this.db.models.Quotes
    }



    async Create(body: any) {
        return this.model.create(body, { raw: true })
    }




    async ReadAll() {
        return this.model.findAll()
    }




    async ReadOne(quote_id: string | number) {
        return this.model.findOne({ where: { quote_id } })
    }




    async Update(body: any) {
        return this.model.update(body, {
            where: { quote_id: body.quote_id }
        })
    }




    async Delete(quote_id: string | number) {
        return this.model.destroy({ where: { quote_id } })
    }



    async TotalCount() { return this.model.count() }
}