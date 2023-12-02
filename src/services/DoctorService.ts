import DoctorRepository from "../repositories/DoctorRepository";
import { readFile, utils } from "xlsx";
import { UploadedFile } from "express-fileupload";
import CustomError from "../utils/CustomError";
import { IDoctor } from "../interfaces/IDoctor";
import Database from "../db/Database";
import format from "date-fns/format";
import * as fs from 'fs';
import * as path from 'path';
import { Request } from "express";

export default class DoctorService {
    doctorRepository: DoctorRepository;

    constructor(db: Database) {
        this.doctorRepository = new DoctorRepository(db);
    }




    async Create(body: IDoctor) {
        return this.doctorRepository.Create(body)
    }




    async ReadAll(query: any) {
        const doctors = await this.doctorRepository.ReadAll(query)
        const totalCount = await this.doctorRepository.totalCount(query)
        const totalPages = Math.ceil(totalCount / (query.pageSize || 10))
        const response = []

        response.push(doctors, {
            currentPage: query.page || 1,
            pageSize: query.pageSize || 10,
            totalCount: totalCount,
            totalPages: totalPages
        })

        return response
    }




    async ReadOne(id_doctor: string | number) {
        return this.doctorRepository.ReadOne(id_doctor)
    }




    async Update(query: IDoctor) {
        if (!query.doctor_id) throw new CustomError('Insira o código de identificação', 400)

        const [affectedCount] = await this.doctorRepository.Update(query)

        if (affectedCount === 0) throw new CustomError('Nenhum médico foi atualizado', 400)

        const doctor: any = await this.doctorRepository.ReadOne(query.doctor_id);

        if (!doctor) throw new CustomError('Nenhum médico foi encontrado', 400)

        return doctor
    }




    async Delete(id_doctor: string | number) {
        const doctor = await this.doctorRepository.ReadOne(id_doctor);

        if (!doctor) throw new CustomError('Nenhum médico foi encontrado', 400)

        const deletedDoctor = await this.doctorRepository.Delete(id_doctor)

        if (deletedDoctor === 0) throw new CustomError('Nenhum médico foi removido', 400)

        return { message: `${doctor.doctor_name} foi removido do sistema` }
    }




    async BulkDelete() {
        const deletedDoctor = await this.doctorRepository.BulkDelete()

        if (deletedDoctor === 0) throw new CustomError('Nenhum médico foi removido', 400)

        return { message: `Todos os médicos foram removidos do sistema` }
    }




    async ExtractData(req: Request) {
        const error = new CustomError('Nenhuma planilha foi enviada', 400)
        if (!req.files || Object.keys(req.files).length === 0) throw error

        const table = req.files.table as UploadedFile

        try {
            const currentTime = format(new Date(), 'dd-MM-yyyy')
            const tempFilePath = path.join(__dirname, '../temp', `doctor-table-${currentTime}.xlsx`)
            table.mv(tempFilePath)

            const workbook = readFile(tempFilePath)
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            const rows = utils.sheet_to_json(sheet, { header: 1 })
            const columns: any = rows[0]

            const jsonResult = this.createJsonFromTable(columns, rows)

            if (jsonResult) {
                return this.doctorRepository.BulkCreate(jsonResult)
            } else {
                return { error: 'Ocorreu um erro ao processar os dados!' }
            }
        } catch (error: any) {
            throw new CustomError('Erro ao processar a planilha.', 500)
        }
    }




    private createJsonFromTable(columns: any, rows: any[]) {
        return rows.slice(1).map((row: any) => {
            const doctor: Record<string, any> = {}

            row.forEach((value: any, index: any) => {
                const column = this.replaceColumnName(columns[index])
                if (typeof value === 'string') value = value.toUpperCase()
                doctor[column] = value
                doctor['registration_date'] = new Date(Date.now())
            })

            return doctor
        })
    }




    private replaceColumnName(column: string) {
        if (column.match(/Código\sPrestador/gi)) return 'provider_code'
        if (column.match(/Nome\sPrestador/gi)) return 'doctor_name'
        if (column.match(/Endereço/gi)) return 'address'
        if (column.match(/Especialidade/gi)) return 'speciality'
        if (column.match(/Localidade/gi)) return 'location'
        if (column.match(/CEP/gi)) return 'zip_code'
        if (column.match(/Bairro/gi)) return 'neighborhood'
        if (column.match(/Cidade/gi)) return 'city'
        if (column.match(/Telefone/gi)) return 'phone_number'
        return column.toLowerCase()
    }

}