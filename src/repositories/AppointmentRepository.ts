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
        const transaction: Transaction = await this.db.sequelize.transaction()

        try {
            for (let appointment of json) {
                let { cpf } = appointment
                if (!cpf) throw new CustomError('Está faltando o CPF do usuário!', 400)

                const userFound = await this.findOneUser('Holder', cpf, transaction) ||
                    await this.findOneUser('Dependent', cpf, transaction)

                if (userFound) await this.CreateAppointment(appointment, userFound, transaction)
            }

            await transaction.commit()
        } catch (error: any) {
            await transaction.rollback()
            console.error(error)
            throw new Error(error.message)
        }

        return { message: 'Banco de dados atualizado!' }
    }




    async ReadAll(query: Record<string, any>) {
        const whereClause: Record<string, any> = {}

        if (query.member_id) whereClause.member_id = query.member_id
        if (query.reference_month) whereClause.reference_month = query.reference_month
        if (query.reference_year) whereClause.reference_year = query.reference_year

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
            where: { appointment_id }, nest: true, raw: true,
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
        if (!json[0].contract_number) throw new CustomError('Número do contrato não encontrado!', 400)

        return this.models.Appointment.destroy({
            where: {
                reference_month: json[0].reference_month,
                reference_year: json[0].reference_year,
                contract_number: json[0].contract_number
            }
        })
    }




    private async findOneUser(typeOfUser: string, cpf: string, transaction: Transaction) {
        if (typeOfUser === 'Holder') {
            return this.models.Member.findOne({
                where: { '$holder.user.document.cpf$': cpf, agreement_id: 1 },
                include: Queries.AppointmentQueryBulkCreate, transaction, raw: true
            })
        }

        if (typeOfUser === 'Dependent') {
            return this.models.Member.findOne({
                where: { '$dependent.user.document.cpf$': cpf, agreement_id: 1 },
                include: Queries.AppointmentQueryFindDependent, transaction, raw: true
            })
        }

        return null
    }




    private async CreateAppointment(appointment: IAppointment,
        memberFound: MemberModel, transaction: Transaction) {
        appointment.member_id = memberFound.member_id
        return this.models.Appointment.create(appointment, { raw: true, transaction })
    }
}


export default AppointmentRepository