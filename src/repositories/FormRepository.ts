import Database from "../db/Database";


class FormRepository {
    private db: Database


    constructor(db: Database) {
        this.db = db
    }



    async ReadHolderInfo(holder_id: string) {
        return this.db.models.Holder.findOne({
            where: { holder_id },
            include: [{
                model: this.db.models.User, as: 'user',
                include: [{
                    model: this.db.models.Document, as: 'document'
                }, {
                    model: this.db.models.Contact, as: 'contact'
                }, {
                    model: this.db.models.Location, as: 'location'
                }]
            }], raw: true, nest: true
        })
    }



    async ReadDependentsInfo(dependent_id: number) {
        return this.db.models.Dependent.findByPk(dependent_id, {
            include: [{
                model: this.db.models.User, as: 'user',
                include: [{
                    model: this.db.models.Document, as: 'document'
                }, {
                    model: this.db.models.Contact, as: 'contact'
                }, {
                    model: this.db.models.Location, as: 'location'
                }]
            }], raw: true, nest: true
        })
    }

}


export default FormRepository