import Database from "../db/Database";
import AppointmentRepository from "../repositories/AppointmentRepository";
import IAppointment from "../interfaces/IAppointment";
import { UploadedFile } from "express-fileupload";
import { Request } from "express";
import CustomError from "../utils/CustomError";
import ExtractAndCreateData from "../helpers/ExtractAndCreateData";
import { validateAndConvertDate } from "../helpers/ConvertDate";




class AppointmentService {
    private appointmentRepository: AppointmentRepository

    constructor(db: Database) {
        this.appointmentRepository = new AppointmentRepository(db)
    }




    async Create(query: IAppointment) {
        return this.appointmentRepository.Create(query)
    }





    async BulkCreate(req: Request) {
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new CustomError('Nenhuma planilha foi enviada', 400)
        }

        const table = req.files.table as UploadedFile

        const { message, fileName, filePath } = await ExtractAndCreateData(
            table, 'appointments-list',
            this.createJsonFromTable.bind(this),
            this.appointmentRepository.BulkCreate.bind(this.appointmentRepository))

        return { message, fileName, filePath }
    }





    async ReadAll(query: Record<string, any>) {
        return this.appointmentRepository.ReadAll(query)
    }




    async ReadOne(appointment_id: string | number) {
        return this.appointmentRepository.ReadOne(appointment_id)
    }




    async Update(query: IAppointment) {
        return this.appointmentRepository.Update(query)
    }




    async Delete(appointment_id: string | number) {
        return this.appointmentRepository.Delete(appointment_id)
    }




    private createJsonFromTable(columns: any[], rows: any[]) {
        return rows.slice(1).map((row: any) => {
            const appointment: Record<string, any> = {}
            const columnNames = ['amount', 'total_amount']

            row.forEach((value: any, index: any) => {
                const column = columns[index]
                if (column === 'appointment_date') value = validateAndConvertDate(value)
                if (columnNames.includes(column)) value = Number(value)
                appointment[column] = value
            })

            this.validateAppointmentInfo(appointment)
            if (appointment.cpf) return appointment

            return null
        }).filter(Boolean)
    }



    private validateAppointmentInfo(appointment: Record<string, any>) {
        if (!appointment.cpf) throw new CustomError('Está faltando o CPF do usuário!', 400)
        if (!appointment.reference_month) throw new CustomError('Está faltando o mês de referência!', 400)
        if (!appointment.reference_year) throw new CustomError('Está faltando o ano de referência!', 400)
        if (!appointment.description) throw new CustomError('Está faltando a descrição!', 400)
        if (!appointment.amount) throw new CustomError('Está faltando o valor de cobrança!', 400)
        if (!appointment.total_amount) throw new CustomError('Está faltando o valor total!', 400)
    }
}


export default AppointmentService