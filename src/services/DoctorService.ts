import DoctorRepository from "../repositories/DoctorRepository";
import { readFile, utils } from "xlsx";
import { FileArray, UploadedFile } from "express-fileupload";
import CustomError from "../utils/CustomError";
import { IDoctor } from "../interfaces/IDoctor";
import Database from "../db/Database";
const path = require('path')
const fs = require('fs')

export default class DoctorService {
    doctorRepository: DoctorRepository;

    constructor(db: Database) {
        this.doctorRepository = new DoctorRepository(db);
    }




    async Create(body: IDoctor) {
        return this.doctorRepository.Create(body)
    }




    async BulkCreate() {
        const doctors = await this.doctorRepository.BulkCreate()

        if (!doctors || doctors.length === 0) {
            throw new CustomError('Nenhum médico foi registrado', 500)
        }

        return { message: 'Os médicos foram registrados no sistema' }
    }




    async ReadAll(query: any) {
        const doctors = await this.doctorRepository.ReadAll(query)

        const totalCount = doctors.length
        const totalPages = Math.ceil(totalCount / query.pageSize || 10)
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




    async ExtractData(files: FileArray | undefined | null) {
        if (!files || Object.keys(files).length === 0) throw new CustomError('Nenhuma planilha foi enviada', 400)

        const table = files.table as UploadedFile;

        try {
            const currentDir = path.resolve(__dirname)
            const tempFilePath = path.join(currentDir, '../temp/medicos.xlsx')
            table.mv(tempFilePath)

            const workbook = readFile(tempFilePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = utils.sheet_to_json(sheet, { header: 1 });
            const columns: any = rows[0];

            const jsonResult = this.createJsonFromTable(columns, rows)

            await fs.writeFileSync(path.join(currentDir, `../json/doctors.json`), JSON.stringify(jsonResult, null, 2));

            return { message: 'Planilha recebida e processada com sucesso!' }
        } catch (error: any) {
            throw new CustomError('Erro ao processar a planilha.', 500)
        }
    }




    createJsonFromTable(columns: any, rows: any[]) {
        return rows.slice(1).map((row: any) => {
            const doctor: Record<string, any> = {};
            row.forEach((value: any, index: any) => {
                const column = this.replaceColumnName(columns[index]);
                if (typeof value === 'string') value = value.toUpperCase();
                doctor[column] = value;
                doctor['registration_date'] = new Date(Date.now());
            });
            return doctor;
        });
    }




    replaceColumnName(column: string) {
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