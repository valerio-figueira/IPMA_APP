import DoctorModel from "../models/DoctorModel"
import { IDoctor } from "../interfaces/IDoctor"
import Doctors from '../json/doctors.json'
export default class DoctorRepository {

    constructor() { }

    async Create(query: IDoctor) {
        return await DoctorModel.create(query, { raw: true })
    }

    async BulkCreate() {
        const doctors: IDoctor[] | null = Doctors

        if (doctors) return await DoctorModel.bulkCreate(doctors)
        else return null
    }

    async ReadAll(query: any) {
        const whereClause: any = {}

        if (query.speciality) {
            whereClause['speciality'] = query.speciality
        }

        return DoctorModel.findAll({
            where: whereClause, raw: true
        })
    }

    async ReadOne(id_doctor: string | number) {
        return DoctorModel.findOne({
            where: { doctor_id: id_doctor },
            raw: true
        })
    }

    async Update(query: IDoctor) {
        return DoctorModel.update(query, {
            where: { doctor_id: query.doctor_id }
        })
    }

    async Delete(id_doctor: string | number) {
        return DoctorModel.destroy({
            where: { doctor_id: id_doctor }
        })
    }

}