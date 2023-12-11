import format from 'date-fns/format';
import * as path from 'path';
import groupBillings from './GroupBillings';








const createColumns = (doc: PDFKit.PDFDocument, options: Record<string, number>) => {
    const { startX, startY, col1Width, col2Width, col3Width, col4Width } = options
    doc.font('Helvetica-Bold').fillColor('#233257').fontSize(9)
    doc.text('Matrícula', startX, startY)
    doc.text('Nome', startX + col1Width, startY)
    doc.text('Unimed', startX + col1Width + col2Width, startY)
    doc.text('Uniodonto', startX + col1Width + col2Width + col3Width, startY)
    doc.text('Od. Company', startX + col1Width + col2Width + col3Width + col4Width, startY)
    doc.moveTo(startX, startY + 15).lineTo(startX + 510, startY + 15).stroke('#303c57')
}







const selectActualColumnAndInsertData = (agreement: Record<string, any>, doc: PDFKit.PDFDocument, options: any) => {
    const { sum, startX, currentY, col1Width, col2Width, col3Width, col4Width } = options
    if (agreement.agreement_name === 'UNIMED') {
        const currentX = startX + col1Width + col2Width
        sum.unimed += agreement.total_billing
        doc.text('R$ ' + Number(agreement.total_billing).toFixed(2), currentX, currentY)
    }

    if (agreement.agreement_name === 'ODONTO COMPANY') {
        const currentX = startX + col1Width + col2Width + col3Width + col4Width
        sum.odontoCompany += agreement.total_billing
        doc.text('R$ ' + Number(agreement.total_billing).toFixed(2), currentX, currentY)
    }

    if (agreement.agreement_name === 'UNIODONTO') {
        const currentX = startX + col1Width + col2Width + col3Width
        sum.uniodonto += agreement.total_billing
        doc.text('R$ ' + Number(agreement.total_billing).toFixed(2), currentX, currentY)
    }
}







const insertRows = (billing: any, doc: PDFKit.PDFDocument, options: any) => {
    const { sum, startX, currentY, col1Width, col2Width, col3Width, col4Width } = options

    // const name = billing.name.length >= 32 ? billing.name.slice(0, 32).trim() : billing.name

    doc.font('Helvetica')
    doc.text(billing.subscription_number, startX, currentY)
    doc.text(billing.name, startX + col1Width, currentY)
    sum.usersCount++

    billing.agreements.forEach((agreement: Record<string, any>) => {
        selectActualColumnAndInsertData(agreement, doc, {
            sum, startX, currentY, col1Width, col2Width, col3Width, col4Width
        })
    })

    doc.moveTo(startX, currentY + 10).lineTo(startX + 510, currentY + 10).lineWidth(0.1).stroke('#303c57')
}






const addDateAndPageNumberAtBottom = (doc: PDFKit.PDFDocument, options: Record<string, any>) => {
    const { pageNumber } = options

    doc.fontSize(9).font('Helvetica') // ADD DATE BEFORE NEW PAGE
        .text(`Data de Criação: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`,
            doc.page.width - 215, doc.page.height - 100, { align: 'right', width: 170 })

    doc.fontSize(9) // ADD PAGE NUMBER BEFORE NEW PAGE
        .text(`Página: ${pageNumber}`,
            doc.page.width - 215, doc.page.height - 85, { align: 'right', width: 170 })
}







// Função para criar uma tabela no PDF
function createTable(doc: PDFKit.PDFDocument, data: any, query: any) {
    // Definir as coordenadas iniciais da tabela
    const startX = 40
    const startY = 100
    const [col1Width, col2Width, col3Width, col4Width] = [50, 220, 75, 80]
    const availableSpaceOnPage = doc.page.height - startY
    const spaceInY = 15
    const rowHeight = 15

    // Adicionar cabeçalhos da tabela
    createColumns(doc, { startX, startY, col1Width, col2Width, col3Width, col4Width })

    // Adicionar dados da tabela
    const group = groupBillings(data)
    const sum = { unimed: 0, odontoCompany: 0, uniodonto: 0, usersCount: 0 }
    let index = 1
    let pageNumber = 1

    for (let billing of group) {
        let currentY = startY + spaceInY + index * rowHeight

        // Verificar se há espaço suficiente na página atual
        if (currentY + rowHeight + 10 > availableSpaceOnPage) {
            addDateAndPageNumberAtBottom(doc, { pageNumber })
            pageNumber++
            doc.addPage()
            createHeader(doc, query)
            index = 1
            currentY = startY + spaceInY + index * rowHeight
            // Adicionar cabeçalhos da tabela na nova página
            createColumns(doc, { startX, startY, col1Width, col2Width, col3Width, col4Width })
        }
        insertRows(billing, doc, { sum, startX, currentY, col1Width, col2Width, col3Width, col4Width })
        index++
    }

    createFooter(sum, doc, { col1Width, pageNumber })
}







function createFooter(sum: Record<string, any>, doc: PDFKit.PDFDocument, options: any) {
    const { col1Width, pageNumber } = options

    const color = '#233257'
    doc.moveDown()
    doc.font('Helvetica-Bold').fillColor(color)
    doc.text(`Qtd Usuários: ${sum.usersCount}`, col1Width)
    doc.text(`Total Unimed: R$ ${Number(sum.unimed).toFixed(2)}`)
    doc.text(`Total Odonto Company: R$ ${Number(sum.odontoCompany).toFixed(2)}`, col1Width)
    doc.text(`Total Uniodonto: R$ ${Number(sum.uniodonto).toFixed(2)}`, col1Width)
    addDateAndPageNumberAtBottom(doc, { pageNumber })
}







export function createHeader(doc: PDFKit.PDFDocument, query: Record<string, any>) {
    const month = Number(query.reference_month)
    const year = query.reference_year

    doc.image(path.join(__dirname, `../../public/imgs/brasão.png`), 100, 30, { width: 40 })
    doc.font('Helvetica-Bold').fillColor('#233257').fontSize(15).y = 30
    doc.text(`IPMA - Relatório de Mensalidades ${month}/${year}`, { align: 'left', wordSpacing: 2, width: 400, indent: 80 })
    doc.font('Helvetica').fontSize(9)
    doc.text(`Rua Amélia Rezende de Oliveira, N°. 40 - CNPJ 03.650.395/0001-66`, { align: 'left', wordSpacing: 3.7, width: 400, indent: 80 })
    doc.text('Monte Alegre de Minas - Estado de Minas Gerais - (34) 3283-3102', { align: 'left', wordSpacing: 3.8, width: 400, indent: 80 })
    doc.moveDown()
}


export default createTable