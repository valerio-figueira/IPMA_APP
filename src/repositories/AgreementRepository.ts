import Database from "../db/Database";
import IAgreement from "../interfaces/IAgreement";
import AgreementModel from "../models/AgreementModel";

export default class AgreementRepository {
    private db: Database
    private model

    constructor(db: Database) {
        this.db = db
        this.model = AgreementModel.INIT(this.db.sequelize)
    }




    async Create(query: IAgreement) {
        return this.model.create(query, { raw: true })
    }




    async ReadAll() {
        return this.model.findAll({ raw: true })
    }




    async ReadOne(agreement_id: string | number) {
        return this.model.findOne({
            where: { agreement_id },
            raw: true
        })
    }




    async Update(query: IAgreement) {
        return this.model.update(query, {
            where: { agreement_id: query.agreement_id }
        })
    }




    async Delete(query: IAgreement) {
        return this.model.destroy({
            where: { agreement_id: query.agreement_id }
        })
    }

}