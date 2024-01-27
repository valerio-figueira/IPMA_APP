import format from 'date-fns/format';
import * as path from 'path';
import groupBillings from './GroupBillings';








const createColumns = (doc: PDFKit.PDFDocument, options: Record<string, any>) => {
    const { startX, startY, colWidths, title } = options
    doc.font('Helvetica-Bold').fillColor('#233257').fontSize(9)
    doc.text('Matrícula', startX, startY)
    doc.text('Nome', startX + colWidths[0], startY)
    doc.text('Unimed', startX + colWidths[0] + colWidths[1], startY)
    doc.text('Uniodonto', startX + colWidths[0] + colWidths[1] + colWidths[2], startY)
    doc.text('Od. Company', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], startY)
    if (title === 'Convênios') {
        doc.text('Consultas', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], startY)
    }
    doc.moveTo(startX, startY + 15).lineTo(startX + 510, startY + 15).stroke('#303c57')
}







const selectActualColumnAndInsertData = (agreement: Record<string, any>,
    doc: PDFKit.PDFDocument, options: Record<string, any>) => {
    const { sum, startX, currentY, colWidths } = options
    if (agreement.agreement_name.match('UNIMED')) {
        const currentX = startX + colWidths[0] + colWidths[1]
        sum.unimed += agreement.total_billing
        doc.text('R$ ' + Number(agreement.total_billing).toFixed(2), currentX, currentY)
    }

    if (agreement.agreement_name === 'ODONTO COMPANY') {
        const currentX = startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]
        sum.odontoCompany += agreement.total_billing
        doc.text('R$ ' + Number(agreement.total_billing).toFixed(2), currentX, currentY)
    }

    if (agreement.agreement_name === 'UNIODONTO') {
        const currentX = startX + colWidths[0] + colWidths[1] + colWidths[2]
        sum.uniodonto += agreement.total_billing
        doc.text('R$ ' + Number(agreement.total_billing).toFixed(2), currentX, currentY)
    }
}







const insertRows = (billing: any, doc: PDFKit.PDFDocument, options: any) => {
    const { sum, startX, currentY, colWidths } = options

    // const name = billing.name.length >= 32 ? billing.name.slice(0, 32).trim() : billing.name

    doc.font('Helvetica')
    doc.text(billing.subscription_number, startX, currentY)
    doc.text(billing.name, startX + colWidths[0], currentY)
    sum.usersCount++

    billing.agreements.forEach((agreement: Record<string, any>) => {
        selectActualColumnAndInsertData(agreement, doc, {
            sum, startX, currentY, colWidths
        })
    })

    doc.moveTo(startX, currentY + 10).lineTo(startX + 510, currentY + 10).lineWidth(0.1).stroke('#303c57')
}






const addDateAndPageNumberAtBottom = (doc: PDFKit.PDFDocument, options: Record<string, any>) => {
    const { pageNumber } = options

    doc.fontSize(9).font('Helvetica') // ADD DATE BEFORE NEW PAGE
        .text(`Data de Criação: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`,
            -22, doc.page.height - 45,
            { align: 'right', width: doc.page.width, height: doc.page.height })

    doc.fontSize(9) // ADD PAGE NUMBER BEFORE NEW PAGE
        .text(`Página: ${pageNumber}`,
            -22, doc.page.height - 30,
            { align: 'right', width: doc.page.width, height: doc.page.height })
}







// Função para criar uma tabela no PDF
function createPdfTable(doc: PDFKit.PDFDocument,
    data: any,
    query: any,
    coordinates: any,
    title: any) {
    // Definir as coordenadas iniciais da tabela
    const { startX, startY, colWidths } = coordinates
    const availableSpaceOnPage = doc.page.height - 70
    const [spaceInY, rowHeight] = [15, 15]

    createHeader(doc, query, title)
    createColumns(doc, { startX, startY, colWidths, title })

    // Adicionar dados da tabela
    const sum = { unimed: 0, odontoCompany: 0, uniodonto: 0, usersCount: 0 }
    let index = 1
    let pageNumber = 1

    for (let billing of data) {
        let currentY = startY + spaceInY + index * rowHeight

        // Verificar se há espaço suficiente na página atual
        if (currentY + rowHeight + 10 > availableSpaceOnPage) {
            addDateAndPageNumberAtBottom(doc, { pageNumber })
            pageNumber++
            doc.addPage()
            createHeader(doc, query, title)
            index = 1
            currentY = startY + spaceInY + index * rowHeight
            // Adicionar cabeçalhos da tabela na nova página
            createColumns(doc, { startX, startY, colWidths, title })
        }
        insertRows(billing, doc, { sum, startX, currentY, colWidths })
        index++
    }

    createFooter(sum, doc, { colWidths, pageNumber })
}







function createFooter(sum: Record<string, any>, doc: PDFKit.PDFDocument, options: any) {
    const { colWidths, pageNumber } = options

    const color = '#233257'
    doc.moveDown()
    doc.font('Helvetica-Bold').fillColor(color)
    doc.text(`Qtd Usuários: ${sum.usersCount}`, colWidths[0])
    doc.text(`Total Unimed: R$ ${Number(sum.unimed).toFixed(2)}`)
    doc.text(`Total Odonto Company: R$ ${Number(sum.odontoCompany).toFixed(2)}`, colWidths[0])
    doc.text(`Total Uniodonto: R$ ${Number(sum.uniodonto).toFixed(2)}`, colWidths[0])
    addDateAndPageNumberAtBottom(doc, { pageNumber })
}







export function createHeader(doc: PDFKit.PDFDocument, query: Record<string, any>, title: string) {
    const month = Number(query.reference_month)
    const year = query.reference_year

    doc.image(path.join(__dirname, `../../public/imgs/logo.png`), 100, 26, { width: 40 })
    doc.font('Helvetica-Bold').fillColor('#2C1D70').fontSize(15).y = 30
    doc.text(`IPMA - Relatório de ${title} ${month}/${year}`, { align: 'left', wordSpacing: 2, width: 400, indent: 80 })
    doc.font('Helvetica').fontSize(9)
    doc.text(`Rua Amélia Rezende de Oliveira, N°. 40 - CNPJ 03.650.395/0001-66`, { align: 'left', wordSpacing: 3.7, width: 400, indent: 80 })
    doc.text('Monte Alegre de Minas - Estado de Minas Gerais - (34) 3283-3102', { align: 'left', wordSpacing: 3.8, width: 400, indent: 80 })
    doc.moveDown()
}


export default createPdfTable