import DoctorModel from "../models/DoctorModel"
import { IDoctor } from "../interfaces/IDoctor"
import Doctors from '../json/doctors.json'
export default class DoctorRepository {

    constructor() { }

    async Create(query: IDoctor) {
        return await DoctorModel.create(query, { raw: true })
    }

    async BulkCreate() {
        return await DoctorModel.bulkCreate(Doctors)
    }

    async ReadAll(query: any) {
        return await DoctorModel.findAll({ raw: true })
    }

    async ReadOne(id_doctor: string | number) {
        return await DoctorModel.findOne({
            where: { id_medico: id_doctor }
        })
    }

    async Update(query: IDoctor) {
        return await DoctorModel.update(query, {
            where: { id_medico: query.id_medico }
        })
    }

    async Delete(id_doctor: string | number) {
        return await DoctorModel.destroy({
            where: { id_medico: id_doctor }
        })
    }

}