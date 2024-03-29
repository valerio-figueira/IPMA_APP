import * as path from 'path';
import format from 'date-fns/format';
import ConvertSQLData from '../helpers/ConvertSQLData';


class OdontoCompanyForm {
    private static greenColor = '#158466'
    private static blackColor = '#000000'
    private static whiteColor = '#ffffff'
    private static grayColor = '#dddddd'





    static drawForm(doc: PDFKit.PDFDocument, data: Record<string, any>) {
        this.drawHeader(doc, data.formType)
        this.drawBody(doc, data)
        this.drawFooter(doc)
    }






    private static drawHeader(doc: PDFKit.PDFDocument, formType: string) {
        const logo = path.join(__dirname, '../../public/imgs', 'odonto-company-logo.png')
        doc.image(logo, 10, 10, { height: 45 })

        const subscription = formType === 'subscription' ? 'X' : '  '
        const inclusion = formType === 'inclusion' ? 'X' : '  '

        doc.font('Helvetica-Bold').fontSize(14).text('TERMO DE ADESÃO', 0, 65, { align: 'center', width: doc.page.width })
        doc.font('Helvetica').fontSize(12).text(`Inscrição (${subscription})`, -55, 85, { align: 'center', width: doc.page.width })
            .text(`Inclusão (${inclusion})`, 60, 85, { align: 'center', width: doc.page.width })
            .rect(205, 82, 190, 17).stroke()
    }






    private static drawBody(doc: PDFKit.PDFDocument, data: Record<string, any>) {
        this.drawHolderInfo(doc, data.holder)
        this.drawDependentsInfo(doc, data.dependents)
        this.drawAgreementInfo(doc)
    }







    private static drawFooter(doc: PDFKit.PDFDocument) {
        doc.font('Helvetica-Bold').fontSize(12)
            .text('ASSINATURA DO FUNCIONÁRIO', 10, doc.page.height - 30, { height: doc.page.height })
            .moveTo(10, doc.page.height - 35)
            .lineTo(doc.widthOfString('ASSINATURA DO FUNCIONÁRIO') + 10, doc.page.height - 35)
            .lineWidth(0.1).stroke(this.blackColor)

        doc.text('ASSINATURA E CARIMBO DA EMPRESA', 345, doc.page.height - 30,
            { height: doc.page.height, width: doc.page.width })
            .moveTo(345, doc.page.height - 35)
            .lineTo(580, doc.page.height - 35)
            .lineWidth(0.1).stroke(this.blackColor)
    }







    private static drawHolderInfo(doc: PDFKit.PDFDocument, holder: Record<string, any>) {
        doc.font('Helvetica-Bold').fontSize(14).text('DADOS DO TITULAR', 10, 109)
            .font('Helvetica').text('MATRÍCULA: ', doc.page.width - 240, 109)
            .image(path.join(__dirname, '../../public/imgs', 'squares.png'), doc.page.width - 150, 105, { height: 17 })


        let [lineWidth, lineHeight] = [doc.page.width - 10, 121]

        // HORIZONTAL LINES
        for (let i = 0; i < 8; i++) {
            doc.moveTo(10, lineHeight).lineTo(lineWidth, lineHeight)
                .lineWidth(0.1).stroke(this.blackColor)
            lineHeight += 16
        }

        // VERTICAL LINES
        doc.moveTo(10, 121).lineTo(10, 233).lineWidth(0.1).stroke(this.blackColor)
        doc.moveTo(lineWidth, 121).lineTo(lineWidth, 233).lineWidth(0.1).stroke(this.blackColor)

        doc.fontSize(11)
        doc.text('Nome:', 15, 125).text(holder.user.name, 55, 125)

        doc.text('RG:', 15, 141).text(holder.user.document.identity, 40, 141)
            .text('Data de Exp:', 160, 141).text(ConvertSQLData.convertDate(holder.user.document.issue_date) || '', 230, 141)
            .text('Órgão Emissor:', 330, 141).text(holder.user.document.issuing_authority || '', 415, 141)
            .text('Sexo:', 470, 141).text(holder.user.gender, 505, 141, { width: 200 })

        doc.text('CPF:', 15, 157).text(ConvertSQLData.convertCPF(holder.user.document.cpf) || '', 45, 157)
            .text('Estado Civil:', 160, 157).text(holder.user.marital_status, 225, 157)
            .text('Data Nasc:', 440, 157).text(ConvertSQLData.convertDate(holder.user.birth_date) || '', 500, 157, { width: 200 })

        doc.text('Endereço:', 15, 173).text(holder.user.location.address, 75, 173)
            .text('Nº:', 290, 173).text(holder.user.location.number, 310, 173)
            .text('Bairro:', 440, 173).text(holder.user.location.neighborhood, 480, 173, { width: 200 })

        doc.text('Cidade:', 15, 189).text(holder.user.location.city, 60, 189)
            .text('SUS:', 290, 189).text(holder.user.document.health_card, 320, 189)
            .text('Fone:', 440, 189)
            .text(ConvertSQLData.convertPhoneNumber(holder.user.contact.phone_number
                || holder.user.contact.residential_phone) || '', 475, 189, { width: 200 })

        doc.text('Empresa:', 15, 205).text('PREFEITURA DE MONTE ALEGRE', 70, 205)
            .text('Fone:', 290, 205).text('(34) 3283-3102', 325, 205)

        doc.text('Nome da mãe:', 15, 221).text(
            typeof holder.user.mother_name === 'string' ? holder.user.mother_name.substring(0, 28) : '', 90, 221)
            .text('Nome do pai:', 290, 221).text(holder.user.father_name, 360, 221, { width: 200 })
    }








    private static drawDependentsInfo(doc: PDFKit.PDFDocument, dependents: any[]) {
        doc.font('Helvetica-Bold').fontSize(14).text('DADOS DOS DEPENDENTES', 10, 241)
        doc.moveDown(16)

        let [lineWidth, lineHeight] = [doc.page.width - 10, 260]

        // ADD FOUR BLOCKS OF INFO
        for (let i = 0; i < 4; i++) {
            let [verticalLineStart, verticalLineEnd] = [lineHeight, 0]
            const dependent = typeof dependents[i] === 'object' ? dependents[i] : undefined

            doc.font('Helvetica').fontSize(11)
            doc.text('Nome:', 15, lineHeight + 4).text(dependent ? dependent.user.name : '', 60, lineHeight + 4)

            lineHeight += this.drawLine(doc, lineWidth, lineHeight)

            doc.text('RG:', 15, lineHeight + 4).text(dependent ? dependent.user.document.identity : '', 50, lineHeight + 4)
                .text('Data de Exp:', 160, lineHeight + 4).text(dependent ? dependent.user.document.issue_date : '', 230, lineHeight + 4)
                .text('Órgão Emissor:', 330, lineHeight + 4).text(dependent ? dependent.user.document.issuing_authority : '', 415, lineHeight + 4)
                .text('Sexo:', 470, lineHeight + 4).text(dependent ? dependent.user.gender : '', 510, lineHeight + 4, { width: 200 })

            lineHeight += this.drawLine(doc, lineWidth, lineHeight)

            doc.text('CPF:', 15, lineHeight + 4).text(ConvertSQLData.convertCPF(dependent ? dependent.user.document.cpf : null) || '', 50, lineHeight + 4)
                .text('Estado Civil:', 160, lineHeight + 4).text(dependent ? dependent.user.marital_status : '', 230, lineHeight + 4)
                .text('Data Nasc:', 440, lineHeight + 4).text(ConvertSQLData.convertDate(dependent ? dependent.user.birth_date : '') || '', 500, lineHeight + 4, { width: 200 })

            lineHeight += this.drawLine(doc, lineWidth, lineHeight)

            doc.text('Endereço:', 15, lineHeight + 4).text(dependent ? dependent.user.location.address : '', 75, lineHeight + 4)
                .text('Nº:', 290, lineHeight + 4).text(dependent ? dependent.user.location.number : '', 310, lineHeight + 4)
                .text('Bairro:', 440, lineHeight + 4).text(dependent ? dependent.user.location.neighborhood : '', 480, lineHeight + 4, { width: 200 })

            lineHeight += this.drawLine(doc, lineWidth, lineHeight)

            doc.text('Cidade:', 15, lineHeight + 4).text(dependent ? dependent.user.location.city : '', 60, lineHeight + 4)
                .text('SUS:', 195, lineHeight + 4).text(dependent ? dependent.user.document.health_card : '', 225, lineHeight + 4)
                .text('Grau de Parentesco:', 350, lineHeight + 4).text(dependent ? dependent.relationship_degree : '', 460, lineHeight + 4, { width: 200 })

            lineHeight += this.drawLine(doc, lineWidth, lineHeight)

            doc.text('Nome da mãe:', 15, lineHeight + 4).text(dependent ? dependent.user.mother_name : '', 95, lineHeight + 4)
                .text('Fone:', 350, lineHeight + 4)
                .text(ConvertSQLData.convertPhoneNumber(dependent ? dependent.user.contact.phone_number
                    || dependent.user.contact.residential_phone : '') || '', 385, lineHeight + 4)

            lineHeight += this.drawLine(doc, lineWidth, lineHeight)
            lineHeight += this.drawLine(doc, lineWidth, lineHeight)

            // VERTICAL LINES
            verticalLineEnd = lineHeight - 16
            doc.moveTo(10, verticalLineStart).lineTo(10, verticalLineEnd).lineWidth(0.1).stroke(this.blackColor)
            doc.moveTo(lineWidth, verticalLineStart).lineTo(lineWidth, verticalLineEnd).lineWidth(0.1).stroke(this.blackColor)
        }
    }








    private static drawAgreementInfo(doc: PDFKit.PDFDocument) {
        doc.font('Helvetica').fontSize(9)
            .text('Declaro estar integralmente ciente dos termos de contrato firmado entre minha EMPREGADORA e a ODONTOCOMPANY, para prestação de serviços odontológicos, mediante contraprestação mensal, ao qual aceito inteiramente e sem reservas, o que desde já autorizo o desconto em minha folha de pagamento. - Obrigatório: Apresentação de documentos pessoais; apresentação de comprovante de vínculo (contracheque) com a EMPREGADORA (PREFEITURA MUNICIPAL DE MONTE ALEGRE DE MINAS - MG)',
                10, doc.page.height - 140, {
                height: doc.page.height,
                width: doc.page.width - 20,
                align: 'justify'
            })

        doc.moveDown().font('Helvetica-Bold').fontSize(11)
            .text(`Monte Alegre de Minas, ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`,
                doc.page.width - 245, doc.page.height - 90, { width: doc.page.width, height: doc.page.height })
    }







    private static drawLine(doc: PDFKit.PDFDocument, w: number, h: number) {
        doc.moveTo(10, h).lineTo(w, h).lineWidth(0.1).stroke(this.blackColor)
        return 16
    }
}


export default OdontoCompanyForm