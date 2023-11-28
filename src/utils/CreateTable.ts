import * as path from 'path';
import groupBillings from './GroupBillings';

// Função para criar uma tabela no PDF
function createTable(doc: PDFKit.PDFDocument, data: any, query: any) {
    // Definir as coordenadas iniciais da tabela
    const startX = 50
    let startY = 130

    // Definir larguras das colunas
    const col1Width = 50
    const col2Width = 180
    const col3Width = 55
    const col4Width = 65
    // Definir altura da linha
    const rowHeight = 15

    // Definir estilo da tabela
    doc.font('Helvetica-Bold')
    doc.fontSize(9)

    // Adicionar cabeçalhos da tabela
    doc.text('Matrícula', startX, startY)
    doc.text('Nome', startX + col1Width, startY)
    doc.text('Unimed', startX + col1Width + col2Width, startY)
    doc.text('Od. Company', startX + col1Width + col2Width + col3Width, startY)
    doc.text('Uniodonto', startX + col1Width + col2Width + col3Width + col4Width, startY)

    const height = 15

    // Desenhar linha horizontal abaixo do cabeçalho
    doc.moveTo(startX, startY + height).lineTo(startX + 510, startY + height).stroke()

    // Adicionar dados da tabela
    doc.font('Helvetica')
    const group = groupBillings(data)

    group.forEach((billing: any, index: number) => {
        const currentY = startY + height + (index + 1) * rowHeight


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

        billing.agreements.forEach((agreement: any) => {
            if (agreement.agreement_name === 'UNIMED') {
                doc.text('R$ ' + Number(agreement.total_billing).toFixed(2), startX + col1Width + col2Width, currentY)
            }

            if (agreement.agreement_name === 'ODONTO COMPANY') {
                doc.text('R$ ' + Number(agreement.total_billing).toFixed(2), startX + col1Width + col2Width + col3Width, currentY)
            }

            if (agreement.agreement_name === 'UNIODONTO') {
                doc.text('R$ ' + Number(agreement.total_billing).toFixed(2), startX + col1Width + col2Width + col3Width + col4Width, currentY)
            }
        })
        //doc.text(`R$ ${billing.total_billing}`, startX + col1Width + col2Width, currentY)
        doc.moveTo(startX, currentY + 10).lineTo(startX + 510, currentY + 10).lineWidth(0.1).stroke()
    })
}


export function createHeader(doc: PDFKit.PDFDocument, query: any) {
    const month = Number(query.reference_month) + 1
    const year = query.reference_year

    doc.image(path.join(__dirname, `../../public/imgs/brasão.png`), 100, 60, { width: 40 })
    doc.fontSize(16).text(`IPMA - Relatório de Mensalidades ${month}/${year}`, { align: 'center' })

    doc.moveDown()
}


export default createTable