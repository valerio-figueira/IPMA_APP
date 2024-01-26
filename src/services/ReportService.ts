import Database from "../db/Database";
import Queries from "../db/Queries";
import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import format from "date-fns/format";
import { Op } from "sequelize";
import groupBillings, { groupDetailedBillings } from "../utils/GroupBillings";
import PDFDocument from 'pdfkit';
import createPdfTable from "../utils/CreatePDFTable";
import ReportRepository from "../repositories/ReportRepository";
import groupDependents, { groupMembersSummary } from "../utils/GroupUsersInfo";


export default class ReportService {
    private reportRepository: ReportRepository
    private db: Database
    private holder

    constructor(db: Database) {
        this.db = db
        this.holder = this.db.models.Holder
        this.reportRepository = new ReportRepository(this.db)
    }






    async CreateSpreadsheet(query: Record<string, any>) {
        const mandatoryValues = ['holder_data', 'holders_and_dependents', 'member_data', 'detailed_billings', 'appointments_billings']

        if (!mandatoryValues.includes(query.report_type)) throw new Error('Verifique o tipo de relatório')
        if (query.report_type === 'holder_data') return this.CreateHolderInfoReport(query)
        if (query.report_type === 'member_data') return this.CreateMemberInfoReport(query)
        if (query.report_type === 'detailed_billings') return this.DetailedBillingReport(query)
        if (query.report_type === 'appointments_billings') return this.AppointmentsReport(query)
        if (query.report_type === 'holders_and_dependents') return this.CreateHolderAndDependentReport(query)

        return { readStream: fs.createReadStream(''), fileName: '', filePath: '' }
    }





    async CreatePDF(body: Record<string, any>) {
        const mandatoryValues = ['monthlyFee', 'townhall']
        const whereClause = { report_type: body.report_type }

        if (!mandatoryValues.includes(body.report_type)) throw new Error('Verifique o tipo de relatório')
        if (whereClause.report_type === 'townhall') return this.TownhallPDFReport(body)
        return this.MonthlyFeePDFReport(body)
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
            worksheet.addRow([holder.user_id, holder.holder_id, holder.user?.name, holder.status, holder.user?.birth_date, holder.user?.gender, holder.user?.marital_status, holder.user?.father_name, holder.user?.mother_name, holder.user?.document.cpf, holder.user?.document.identity, holder.user?.document.issue_date, holder.user?.document.health_card, holder.user?.location.address, holder.user?.location.number, holder.user?.location.neighborhood, holder.user?.location.city, holder.user?.location.zipcode, holder.user?.location.state, holder.user?.contact.phone_number, holder.user?.contact.residential_phone, holder.user?.contact.email])
        })

        // Salvar o arquivo
        const { filePath, fileName } = this.createPathAndFile('titulares')
        await workbook.xlsx.writeFile(filePath) // Arquivo xlsx gerado com sucesso!

        return { readStream: fs.createReadStream(filePath), fileName, filePath }
    }





    private async CreateMemberInfoReport(query: Record<string, any>) {
        const members = await this.reportRepository.MembersReport(query)

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Conveniados')

        // Adicionar cabeçalho
        worksheet.addRow(['ID_USUARIO', 'ID_TITULAR', 'ID_CONVENIADO', 'ID_DEPENDENTE', 'ID_CONVENIO', 'TITULAR', 'DEPENDENTE', 'CPF', 'NOME_CONVENIO'])

        // Adicionar dados da tabela de usuários
        groupMembersSummary(members).forEach(member => {
            worksheet.addRow([member.user_id, member.holder_id, member.member_id, '', member.agreement_id, member.holder, '', member.cpf, member.agreement_name])

            member.dependents.forEach(dependent => {
                worksheet.addRow([dependent.user_id, dependent.holder_id, dependent.member_id, dependent.dependent_id, dependent.agreement_id, '', dependent.dependent, dependent.cpf, dependent.agreement_name])
            })
        })

        // Salvar o arquivo
        const { filePath, fileName } = this.createPathAndFile('conveniados')
        await workbook.xlsx.writeFile(filePath) // Arquivo xlsx gerado com sucesso!

        return { readStream: fs.createReadStream(filePath), fileName, filePath }
    }





    private async CreateHolderAndDependentReport(query: Record<string, any>) {
        const whereClause: Record<string, any> = {}
        if (whereClause.holder_status) whereClause.status = query.holder_status

        const holders = await this.reportRepository.HoldersAndDependentsReport(query)

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Titulares e Dependentes')

        // Adicionar cabeçalho
        worksheet.addRow(this.createRowsForHolderAndDependentReport())

        // Adicionar dados da tabela de usuários
        groupDependents(holders).forEach(holder => {
            worksheet.addRow([holder.user_id, holder.holder_id, '', holder.holder, '', holder.status, holder.birth_date, holder.gender, holder.marital_status, holder.father_name, holder.mother_name, holder.cpf, holder.identity, holder.issue_date, holder.health_card, holder.address, holder.number, holder.neighborhood, holder.city, holder.zipcode, holder.state, holder.phone_number, holder.residential_phone, holder.email])

            holder.dependents.forEach(dependent => {
                worksheet.addRow([dependent.user_id, dependent.holder_id, dependent.dependent_id, '', dependent.dependent, '', dependent.birth_date, dependent.gender, dependent.marital_status, dependent.father_name, dependent.mother_name, dependent.cpf, dependent.identity, dependent.issue_date, dependent.health_card, dependent.address, dependent.number, dependent.neighborhood, dependent.city, dependent.zipcode, dependent.state, dependent.phone_number, dependent.residential_phone, dependent.email])
            })
        })

        // Salvar o arquivo
        const { filePath, fileName } = this.createPathAndFile('titulares-e-dependentes')
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
        worksheet.addRow(['ID_TITULAR', 'ID_CONVENIO', 'ID_CONVENIADO', 'TITULAR', 'NOME', 'CONVENIO', 'MENSALIDADE', 'MES', 'ANO'])

        // Adicionar dados da tabela de usuários
        const nestedInfo = groupDetailedBillings(billings)
        nestedInfo.forEach(billing => {
            worksheet.addRow([billing.holder_id, '', '', billing.name])
            billing.agreements.forEach(agreement => {
                worksheet.addRow([billing.holder_id, agreement.agreement_id, agreement.member_id, '', agreement.name, agreement.agreement_name, agreement.amount, agreement.reference_month, agreement.reference_year])
            })
        })

        // Salvar o arquivo
        const { filePath, fileName } = this.createPathAndFile('cobrancas-detalhadas')
        await workbook.xlsx.writeFile(filePath) // Arquivo xlsx gerado com sucesso!

        return { readStream: fs.createReadStream(filePath), fileName, filePath }
    }




    private async AppointmentsReport(query: Record<string, any>) {
        if (!query.reference_month) throw new Error('Insira o mês de referência!')
        if (!query.reference_year) throw new Error('Insira o ano de referência!')
        if (!query.report_type) throw new Error('Insira o tipo de relatório!')

        const appointments = await this.reportRepository.AppointmentReport(query)

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Titulares')

        // Adicionar cabeçalho
        worksheet.addRow(['ID_TITULAR', 'ID_DEPENDENTE', 'ID_CONVENIO', 'NOME', 'CONVENIO', 'DESCRICAO', 'VALOR', 'MES', 'ANO'])

        appointments.forEach(appointment => {
            worksheet.addRow([appointment.subscription?.holder_id, appointment.subscription?.dependent_id, appointment.subscription?.agreement_id, appointment.subscription?.dependent?.user?.name || appointment.subscription?.holder?.user?.name, appointment.subscription?.agreement?.agreement_name, appointment.description, appointment.amount, appointment.reference_month, appointment.reference_year])
        })

        // Salvar o arquivo
        const { filePath, fileName } = this.createPathAndFile('cobrancas-de-coparticipacao')
        await workbook.xlsx.writeFile(filePath) // Arquivo xlsx gerado com sucesso!

        return { readStream: fs.createReadStream(filePath), fileName, filePath }
    }






    private async MonthlyFeePDFReport(query: Record<string, any>) {
        if (!query.reference_month) throw new Error('Insira o mês de referência!')
        if (!query.reference_year) throw new Error('Insira o ano de referência!')
        if (!query.report_type) throw new Error('Insira o tipo de relatório!')

        const billingsReport: any[] | null = await this.reportRepository.BillingReport(query)
        if (!billingsReport) throw new Error('Nenhuma informação encontrada!')

        const doc = new PDFDocument({ size: 'A4' })
        const [month, year] = [Number(query.reference_month), Number(query.reference_year)]
        const filename = `relatorio-${month}-${year}.pdf`
        const filePath = path.join(__dirname, `../temp/${filename}`)
        const writeStream = fs.createWriteStream(filePath)

        doc.pipe(writeStream)

        const data = groupBillings(billingsReport)

        createPdfTable(doc, data, query, {
            startX: 40,
            startY: 100,
            colWidths: [50, 220, 75, 80],
        }, 'Mensalidades')

        return { filename, filePath, doc }
    }





    private async TownhallPDFReport(query: Record<string, any>) {
        if (!query.reference_month) throw new Error('Insira o mês de referência!')
        if (!query.reference_year) throw new Error('Insira o ano de referência!')

        const billingsReport: any[] | null = await this.reportRepository.TownhallBillingReport(query)

        const doc = new PDFDocument({ size: 'A4' })
        const [month, year] = [Number(query.reference_month), Number(query.reference_year)]
        const filename = `relatorio-prefeitura-${month}-${year}.pdf`
        const filePath = path.join(__dirname, `../temp/${filename}`)
        const writeStream = fs.createWriteStream(filePath)

        doc.pipe(writeStream)
        console.log(billingsReport)
        console.log(billingsReport.find(entry => entry.name.match('ROSANGELA')))
        const data = groupBillings(billingsReport)

        createPdfTable(doc, data, query, {
            startX: 40,
            startY: 100,
            colWidths: [50, 220, 50, 55, 64],
        }, 'Convênios')

        return { filename, filePath, doc }
    }






    private setDetailedBillingParams(query: any) {
        const whereClause: Record<string, any> = {}
        whereClause.active = query.active || 1
        whereClause['$billing.member_id$'] = { [Op.not]: null }
        if (query.name) whereClause['$holder.user.name$'] = { [Op.like]: `%${query.name}%` }
        if (query.holder_status) whereClause['$holder.status$'] = query.holder_status
        if (query.agreement_id) whereClause['agreement_id'] = query.agreement_id
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
            'ID_USUARIO',
            'ID_TITULAR',
            'NOME',
            'STATUS',
            'DATA_NASCIMENTO',
            'GENERO',
            'ESTADO_CIVIL',
            'NOME_DO_PAI',
            'NOME_DA_MAE',
            'CPF',
            'IDENTIDADE',
            'DATA_EXP',
            'CARTAO_SAUDE',
            'ENDERECO',
            'NUMERO',
            'BAIRRO',
            'CIDADE',
            'CEP',
            'ESTADO',
            'TELEFONE_MOVEL',
            'TELEFONE_RESIDENCIAL',
            'EMAIL'
        ]
    }





    private createRowsForHolderAndDependentReport() {
        return [
            'ID_USUARIO',
            'ID_TITULAR',
            'ID_DEPENDENTE',
            'TITULAR',
            'DEPENDENTE',
            'STATUS',
            'DATA_NASCIMENTO',
            'SEXO',
            'ESTADO_CIVIL',
            'NOME_DO_PAI',
            'NOME_DA_MAE',
            'CPF',
            'IDENTIDADE',
            'DATA_EXPEDICAO',
            'CARTAO_SAUDE',
            'ENDERECO',
            'NUMERO',
            'BAIRRO',
            'CIDADE',
            'CEP',
            'ESTADO',
            'TELEFONE_MOVEL',
            'TELEFONE_RESIDENCIAL',
            'EMAIL'
        ]
    }
}