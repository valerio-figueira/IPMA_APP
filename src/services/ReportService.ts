import Database from "../db/Database";
import Queries from "../db/Queries";
import HolderModel from "../models/HolderModel";
import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import format from "date-fns/format";


export default class ReportService {
    private holder;

    constructor(db: Database) {
        this.holder = HolderModel.INIT(db.sequelize)
    }



    async Create(body: any) {
        const whereClause = { status: body.report_type }
        return this.HolderReport(whereClause)
    }


    private async HolderReport(whereClause: Record<string, any>) {
        const holders = await this.holder.findAll({
            include: Queries.IncludeUserData,
            where: whereClause
        })

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Titulares')

        // Adicionar cabeçalho
        worksheet.addRow(this.createRowsForHolderReport())

        // Adicionar dados da tabela de usuários
        holders.forEach(holder => {
            worksheet.addRow([holder.user_id, holder.holder_id, holder.user?.name, holder.user?.birth_date, holder.user?.gender, holder.user?.marital_status, holder.user?.father_name, holder.user?.mother_name, holder.user?.document.cpf, holder.user?.document.identity, holder.user?.document.issue_date, holder.user?.document.health_card, holder.user?.location.address, holder.user?.location.number, holder.user?.location.neighborhood, holder.user?.location.city, holder.user?.location.zipcode, holder.user?.location.state, holder.user?.contact.phone_number, holder.user?.contact.residential_phone, holder.user?.contact.email])
        })

        // Salvar o arquivo
        const currentTime = format(new Date(), 'dd-MM-yyyy')
        const fileName = `relatório-titulares-${currentTime}`
        const filePath = path.join(__dirname, '../temp', `/${fileName}`)
        await workbook.xlsx.writeFile(filePath) // Arquivo xlsx gerado com sucesso!

        return { readStream: fs.createReadStream(filePath), fileName, filePath }
    }




    private createRowsForHolderReport() {
        return [
            'user_id',
            'holder_id',
            'name',
            'birth_date',
            'gender',
            'marital_status',
            'father_name',
            'mother_name',
            'cpf',
            'identity',
            'issue_date',
            'health_card',
            'address',
            'number',
            'neighborhood',
            'city',
            'zipcode',
            'state',
            'phone_number',
            'residential_phone',
            'email'
        ]
    }
}