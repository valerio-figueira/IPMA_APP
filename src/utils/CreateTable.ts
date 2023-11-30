import format from 'date-fns/format';
import * as path from 'path';
import groupBillings from './GroupBillings';

// Função para criar uma tabela no PDF
function createTable(doc: PDFKit.PDFDocument, data: any, query: any) {
    // Definir as coordenadas iniciais da tabela
    const startX = 50
    let startY = 100

    // Definir larguras das colunas
    const [col1Width, col2Width, col3Width, col4Width] = [50, 180, 55, 55]
    // Definir altura da linha
    const rowHeight = 15

    // Definir estilo da tabela
    doc.font('Helvetica-Bold').fillColor('#233257')
    doc.fontSize(9)

    // Adicionar cabeçalhos da tabela
    doc.text('Matrícula', startX, startY)
    doc.text('Nome', startX + col1Width, startY)
    doc.text('Unimed', startX + col1Width + col2Width, startY)
    doc.text('Uniodonto', startX + col1Width + col2Width + col3Width, startY)
    doc.text('Od. Company', startX + col1Width + col2Width + col3Width + col4Width, startY)

    const spaceInY = 15

    // Desenhar linha horizontal abaixo do cabeçalho
    doc.moveTo(startX, startY + spaceInY).lineTo(startX + 510, startY + spaceInY).stroke('#303c57')

    // Adicionar dados da tabela
    doc.font('Helvetica')
    const group = groupBillings(data)
    const sum = { unimed: 0, odontoCompany: 0, uniodonto: 0, usersCount: 0 }

    group.forEach((billing: any, index: number) => {
        const currentY = startY + spaceInY + (index + 1) * rowHeight

        // Verificar se há espaço suficiente na página atual
        /*if (currentY + rowHeight > doc.page.height - 50) {
            // Adicionar nova página
            doc.addPage();

            createHeader(doc, query)

            // Redefinir posição inicial
            startY = 50;

            // Adicionar cabeçalhos da tabela na nova página
            doc.text('Nome', startX, startY)
            doc.text('Convênio', startX + col1Width, startY)
            doc.text('Mensalidade', startX + col1Width + col2Width, startY)

            // Desenhar linha horizontal abaixo do cabeçalho
            doc.moveTo(startX, startY + 20).lineTo(startX + col1Width + col2Width + col2Width, startY + 20).stroke()
        }*/

        doc.text(billing.subscription_number, startX, currentY)
        doc.text(billing.name, startX + col1Width, currentY)
        sum.usersCount++

        billing.agreements.forEach((agreement: any) => {
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
        })
        //doc.text(`R$ ${billing.total_billing}`, startX + col1Width + col2Width, currentY)
        doc.moveTo(startX, currentY + 10).lineTo(startX + 510, currentY + 10).lineWidth(0.1).stroke('#303c57')
    })


    createFooter(sum, doc, col1Width, col2Width, col3Width, col4Width)
}


function createFooter(sum: any, doc: PDFKit.PDFDocument, ...args: number[]) {
    const color = '#233257'
    doc.moveDown()
    doc.font('Helvetica-Bold').fillColor(color)
    doc.text(`Qtd Usuários: ${sum.usersCount}`, args[0])
    doc.text(`Total Unimed: R$ ${Number(sum.unimed).toFixed(2)}`)
    doc.text(`Total Odonto Company: R$ ${Number(sum.odontoCompany).toFixed(2)}`, args[0])
    doc.text(`Total Uniodonto: R$ ${Number(sum.uniodonto).toFixed(2)}`, args[0])
    doc.fontSize(9).font('Helvetica')
        .text(`Data de Criação: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`, { align: 'right' })
}


export function createHeader(doc: PDFKit.PDFDocument, query: any) {
    const month = Number(query.reference_month) + 1
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