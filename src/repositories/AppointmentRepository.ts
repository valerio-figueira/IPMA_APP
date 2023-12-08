import { Transaction } from "sequelize";
import Database from "../db/Database";
import IAppointment from "../interfaces/IAppointment";
import Models from "../models";
import Queries from "../db/Queries";
import MemberModel from "../models/MemberModel";
import HolderModel from "../models/HolderModel";
import UserModel from "../models/user/UserModel";
import CustomError from "../utils/CustomError";


class AppointmentRepository {
    private db: Database
    private models: Models

    constructor(db: Database) {
        this.db = db
        this.models = this.db.models
    }




    async Create(query: IAppointment) {
        return this.models.Appointment.create(query)
    }





    async BulkCreate(json: IAppointment[]) {
        await this.ClearBeforeBulk(json)
        for (let appointment of json) {
            const transaction: Transaction = await this.db.sequelize.transaction()
            let { cpf } = appointment

            try {
                const result = await this.models.Member.findOne({
                    where: { '$holder.user.document.cpf$': cpf, agreement_id: 1 },
                    include: Queries.AppointmentQueryBulkCreate, transaction, raw: true
                })

                if (result) {
                    appointment.member_id = result.member_id
                    await this.models.Appointment.create(appointment, { raw: true, transaction })
                }

                await transaction.commit()
            } catch (error: any) {
                await transaction.rollback()
                console.error(error)
                throw new Error(error.message)
            }
        }

        return { message: 'Banco de dados atualizado!' }
    }




    async ReadAll(query: Record<string, any>) {
        const whereClause: Record<string, any> = {}

        if (query.member_id) whereClause.member_id = query.member_id

        return this.models.Appointment.findAll({
            where: whereClause, nest: true, raw: true,
            include: [{
                model: MemberModel,
                as: 'subscription',
                include: [{
                    model: HolderModel,
                    as: 'holder',
                    include: [{
                        model: UserModel,
                        as: 'user'
                    }]
                }]
            }]
        })
    }




    async ReadOne(appointment_id: string | number) {
        return this.models.Appointment.findAll({
            where: { appointment_id }
        })
    }




    async Update(query: IAppointment) {
        const { appointment_id } = query
        return this.models.Appointment.update(query, {
            where: { appointment_id }
        })
    }




    async Delete(appointment_id: string | number) {
        return this.models.Appointment.destroy({
            where: { appointment_id }
        })
    }



    private async ClearBeforeBulk(json: IAppointment[]) {
        if (!json[0].reference_month) throw new CustomError('Mês de referência não encontrado!', 400)
        if (!json[0].reference_year) throw new CustomError('Ano de referência não encontrado!', 400)

        return this.models.Appointment.destroy({
            where: {
                reference_month: json[0].reference_month,
                reference_year: json[0].reference_year
            }
        })
    }

}


export default AppointmentRepository