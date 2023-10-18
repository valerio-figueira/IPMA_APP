import DoctorModel from "../models/DoctorModel"
import { IDoctor } from "../interfaces/IDoctor"
import Doctors from '../json/doctors.json'

export default class DoctorRepository {
    private model

    constructor() {
        this.model = DoctorModel
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
        const whereClause: any = {}

        if (query.speciality) {
            whereClause['speciality'] = query.speciality
        }

        return this.model.findAll({
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