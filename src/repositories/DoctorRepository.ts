import DoctorModel from "../models/DoctorModel"
import { IDoctor } from "../interfaces/IDoctor"
import Doctors from '../json/doctors.json'
import Database from "../db/Database"

export default class DoctorRepository {
    private db: Database
    private model

    constructor(db: Database) {
        this.db = db
        this.model = DoctorModel.INIT(this.db.sequelize)
    }



    async Create(query: IDoctor) {
        return await this.model.create(query, { raw: true })
    }




    async BulkCreate() {
        const doctors: IDoctor[] | null = Doctors

        if (doctors) return await this.model.bulkCreate(doctors)
        else return null
    }




    async ReadAll(query: any) {
        const page = query.page || 1;
        const pageSize = query.pageSize || 10;
        const offset = (page - 1) * pageSize;
        const whereClause: any = {}

        if (query.speciality) {
            whereClause['speciality'] = query.speciality
        }

        return this.model.findAll({
            offset,
            limit: pageSize,
            where: whereClause, raw: true
        })
    }




    async ReadOne(id_doctor: string | number) {
        return this.model.findOne({
            where: { doctor_id: id_doctor },
            raw: true
        })
    }




    async Update(query: IDoctor) {
        return this.model.update(query, {
            where: { doctor_id: query.doctor_id }
        })
    }




    async Delete(id_doctor: string | number) {
        return this.model.destroy({
            where: { doctor_id: id_doctor }
        })
    }

}