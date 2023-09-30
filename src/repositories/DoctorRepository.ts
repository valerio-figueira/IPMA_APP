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
        const whereClause: any = {}

        if (query.especialidade) {
            whereClause['especialidade'] = query.especialidade
        }

        return DoctorModel.findAll({
            where: whereClause, raw: true
        })
    }

    async ReadOne(id_doctor: string | number) {
        return DoctorModel.findOne({
            where: { id_medico: id_doctor },
            raw: true
        })
    }

    async Update(query: IDoctor) {
        return DoctorModel.update(query, {
            where: { id_medico: query.id_medico }
        })
    }

    async Delete(id_doctor: string | number) {
        return DoctorModel.destroy({
            where: { id_medico: id_doctor }
        })
    }

}