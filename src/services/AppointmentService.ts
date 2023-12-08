import Database from "../db/Database";
import AppointmentRepository from "../repositories/AppointmentRepository";
import IAppointment from "../interfaces/IAppointment";
import { UploadedFile } from "express-fileupload";
import { format } from "date-fns";
import { Request } from "express";
import * as path from "path";
import * as fs from "fs";
import CustomError from "../utils/CustomError";
import ExtractDataFromTable from "../helpers/ExtractDataFromTable";
import ExtractAndCreateData from "../helpers/ExtractAndCreateData";




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
            table,
            'appointments-list',
            this.createJsonFromTable,
            this.appointmentRepository.BulkCreate)

        return { message: fs.createReadStream(message), fileName, filePath }
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




    private createJsonFromTable(columns: any, rows: any[]) {
        return rows.slice(1).map((row: any) => {
            const appointment: Record<string, any> = {}

            row.forEach((value: any, index: any) => {
                const column = columns[index]
                if (column === 'appointment_date') {
                    value = format(new Date(value), 'yyyy-MM-dd')
                }
                appointment[column] = value
            })

            if (appointment.description) return appointment

            return null
        }).filter(Boolean)
    }
}


export default AppointmentService