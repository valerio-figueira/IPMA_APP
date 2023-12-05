import { IDoctor } from "../interfaces/IDoctor"
import Database from "../db/Database"
import { Op } from "sequelize"


export default class DoctorRepository {
    private db: Database
    private model

    constructor(db: Database) {
        this.db = db
        this.model = this.db.models.Doctor
    }



    async Create(query: IDoctor) {
        return await this.model.create(query, { raw: true })
    }




    async BulkCreate(query: any[]) {
        query.forEach(async doctor => {
            const doctorFound = await this.model.findOne({
                where: {
                    provider_code: doctor.provider_code,
                    doctor_name: doctor.doctor_name,
                    speciality: doctor.speciality,
                    address: doctor.address,
                    neighborhood: doctor.neighborhood,
                    zip_code: doctor.zip_code,
                    location: doctor.location,
                    phone_number: doctor.phone_number
                }
            })

            if (doctorFound) {
                await this.model.update(doctor, { where: { doctor_id: doctorFound.doctor_id } })
            } else {
                await this.model.create(doctor)
            }
        })

        return { message: 'O banco de dados foi atualizado!' }
    }




    async ReadAll(query: any) {
        const page = query.page || 1;
        const pageSize = query.pageSize || 10;
        const offset = (page - 1) * pageSize;
        const whereClause: any = {}
        this.setParams(query, whereClause)

        return this.model.findAll({
            offset,
            limit: pageSize,
            order: [['speciality', 'ASC']],
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



    async BulkDelete() {
        return this.model.destroy({ where: {} })
    }



    async totalCount(query: any) {
        const whereClause: any = {}
        this.setParams(query, whereClause)
        return this.model.count({ where: whereClause })
    }



    private setParams(query: any, whereClause: any) {
        if (query.speciality) {
            whereClause['speciality'] = { [Op.like]: `%${query.speciality}%` }
        }
    }
}