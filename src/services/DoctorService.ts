import DoctorRepository from "../repositories/DoctorRepository";
import { readFile, utils } from "xlsx";
import { FileArray, UploadedFile } from "express-fileupload";
import CustomError from "../utils/CustomError";
import { IDoctor } from "../interfaces/IDoctor";
const path = require('path')
const fs = require('fs')

export default class DoctorService {
    doctorRepository: DoctorRepository;

    constructor() {
        this.doctorRepository = new DoctorRepository();
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
        return this.doctorRepository.ReadAll(query)
    }

    async ReadOne(id_doctor: string | number) {
        return this.doctorRepository.ReadOne(id_doctor)
    }

    async Update(query: IDoctor) {
        return this.doctorRepository.Update(query)
    }

    async Delete(id_doctor: string | number) {
        return this.doctorRepository.Delete(id_doctor)
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
                doctor['data_registro'] = new Date(Date.now());
            });
            return doctor;
        });
    }

    replaceColumnName(column: string) {
        if (column.match(/Código\sPrestador/gi)) return 'codigo_prestador'
        if (column.match(/Nome\sPrestador/gi)) return 'nome_medico'
        if (column.match(/Endereço/gi)) return 'endereco'
        return column.toLowerCase()
    }

}