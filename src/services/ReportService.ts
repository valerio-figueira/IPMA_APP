import Database from "../db/Database";
import Queries from "../db/Queries";
import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import format from "date-fns/format";
import { Op } from "sequelize";
import { groupDetailedBillings } from "../utils/GroupBillings";


export default class ReportService {
    private db: Database
    private holder;

    constructor(db: Database) {
        this.db = db
        this.holder = this.db.models.Holder
    }






    async Create(body: any) {
        const whereClause = { report_type: body.report_type }

        if (whereClause.report_type === 'holder_data') return this.CreateHolderInfoReport(whereClause)
        if (whereClause.report_type === 'detailed_billings') return this.DetailedBillingReport(body)

        return { readStream: fs.createReadStream(''), fileName: '', filePath: '' }
    }





    private async CreateHolderInfoReport(query: Record<string, any>) {
        const whereClause: Record<string, any> = {}
        if (whereClause.holder_status) whereClause.status = query.holder_status

        const holders = await this.holder.findAll({
            include: Queries.IncludeUserData,
            where: whereClause, raw: true, nest: true
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
        const { filePath, fileName } = this.createPathAndFile('titulares')
        await workbook.xlsx.writeFile(filePath) // Arquivo xlsx gerado com sucesso!

        return { readStream: fs.createReadStream(filePath), fileName, filePath }
    }





    private async DetailedBillingReport(query: Record<string, any>) {
        const whereClause = this.setDetailedBillingParams(query)
        const billings = await this.db.models.Member.findAll({
            include: Queries.MonthlyFeeSummary,
            where: whereClause, raw: true, nest: true
        })

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Titulares')

        // Adicionar cabeçalho
        worksheet.addRow(['ID_TITULAR', 'ID_CONVÊNIO', 'TITULAR', 'NOME', 'CONVÊNIO', 'MENSALIDADE', 'MÊS', 'ANO'])

        // Adicionar dados da tabela de usuários
        const nestedInfo = groupDetailedBillings(billings)
        nestedInfo.forEach(billing => {
            worksheet.addRow([billing.holder_id, '', billing.name])
            billing.agreements.forEach(agreement => {
                worksheet.addRow([billing.holder_id, agreement.agreement_id, '', agreement.name, agreement.agreement_name, agreement.amount, agreement.reference_month, agreement.reference_year])
            })
        })

        // Salvar o arquivo
        const { filePath, fileName } = this.createPathAndFile('cobrancas-detalhadas')
        await workbook.xlsx.writeFile(filePath) // Arquivo xlsx gerado com sucesso!

        return { readStream: fs.createReadStream(filePath), fileName, filePath }
    }





    private setDetailedBillingParams(query: any) {
        const whereClause: Record<string, any> = {}
        whereClause.active = query.active || 1
        whereClause['$billing.member_id$'] = { [Op.not]: null }
        if (query.name) whereClause['$holder.user.name$'] = { [Op.like]: `%${query.name}%` }
        if (query.holder_status) whereClause['$holder.status$'] = query.holder_status
        if (query.agreement_name) whereClause['$agreement.agreement_name$'] = { [Op.like]: `%${query.agreement_name}%` }
        if (query.reference_year) whereClause['$billing.reference_year$'] = query.reference_year
        if (query.reference_month) whereClause['$billing.reference_month$'] = query.reference_month
        return whereClause
    }





    private createPathAndFile(name: string) {
        const currentTime = format(new Date(), 'dd-MM-yyyy')
        const fileName = `relatorio-${name}-${currentTime}`
        const filePath = path.join(__dirname, '../temp', `/${name}`)

        return { filePath, fileName }
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