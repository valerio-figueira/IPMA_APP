import * as path from 'path';


class CreateUnimedForm {
    private static greenColor = '#158466'
    private static blackColor = '#000000'
    private static whiteColor = '#ffffff'
    private static grayColor = '#dddddd'



    static drawForm(doc: PDFKit.PDFDocument, data: any[],
        coordinates: Record<string, number | number[]>) {

        const { startX, startY, colWidths } = coordinates
        const [spaceInY, rowHeight] = [15, 15]

        this.drawHeader(doc)
        this.drawFooter(doc)
        // Adicionar dados da tabela
        this.drawBody(doc, data, coordinates)
    }




    private static drawHeader(doc: PDFKit.PDFDocument) {
        const headerImg = path.join(__dirname, '../../public/imgs', 'unimed_header.png')
        doc.image(headerImg, 0, 0, { fit: [doc.page.width, 150] })
    }




    private static drawFooter(doc: PDFKit.PDFDocument) {
        const footerImg = path.join(__dirname, '../../public/imgs', 'unimed_footer.png')
        doc.image(footerImg, 0, doc.page.height - 100, { fit: [doc.page.width, 150] })
    }




    private static drawBody(doc: PDFKit.PDFDocument, data: any[],
        coordinates: Record<string, number | number[]>) {

        this.drawHolderInfo(doc, data, coordinates)
    }




    private static drawHolderInfo(doc: PDFKit.PDFDocument, data: any[],
        coordinates: Record<string, number | number[]>) {

        doc.lineWidth(15).lineCap('butt') // IT GENERATES GREEN BOXES VECTORS
            .moveTo(10, 106).lineTo(100, 106).stroke(this.greenColor)
            .moveTo(340, 106).lineTo(400, 106).stroke(this.greenColor)
            .moveTo(10, 122).lineTo(100, 122).stroke(this.greenColor)
            .moveTo(10, 138).lineTo(100, 138).stroke(this.greenColor)
            .moveTo(340, 138).lineTo(420, 138).stroke(this.greenColor)
            .moveTo(10, 154).lineTo(doc.page.width - 10, 154).stroke(this.grayColor)
            .moveTo(10, 170).lineTo(doc.page.width - 10, 170).stroke(this.grayColor)

        doc.moveTo(10, 114).lineTo(doc.page.width - 10, 114).lineWidth(0.1).stroke(this.blackColor)
        doc.moveTo(10, 130).lineTo(doc.page.width - 10, 130).lineWidth(0.1).stroke(this.blackColor)
        doc.moveTo(10, 146).lineTo(doc.page.width - 10, 146).lineWidth(0.1).stroke(this.blackColor)
        doc.moveTo(120, 162).lineTo(doc.page.width - 10, 162).lineWidth(0.1).stroke(this.blackColor)
        doc.moveTo(220, 178).lineTo(doc.page.width - 10, 178).lineWidth(0.1).stroke(this.blackColor)

        doc.moveTo(10, 194).lineTo(doc.page.width - 10, 194).lineWidth(0.1).stroke(this.blackColor)
        doc.moveTo(10, 210).lineTo(doc.page.width - 10, 210).lineWidth(0.1).stroke(this.blackColor)
        doc.moveTo(10, 226).lineTo(doc.page.width - 10, 226).lineWidth(0.1).stroke(this.blackColor)
        doc.moveTo(10, 242).lineTo(doc.page.width - 10, 242).lineWidth(0.1).stroke(this.blackColor)
        doc.moveTo(10, 258).lineTo(doc.page.width - 10, 258).lineWidth(0.1).stroke(this.blackColor)
        doc.moveTo(10, 274).lineTo(doc.page.width - 10, 274).lineWidth(0.1).stroke(this.blackColor)


        doc.fontSize(10).font('Helvetica-Bold').fillColor(this.whiteColor).moveDown().text('CONTRATO', 26, 103).text('GRUPO', 350, 103)

        doc.text('PLANO', 35, 119)
            .font('Helvetica-Oblique').fillColor(this.blackColor).text('4633271000 - UDIPLAN EMPRESA FIXA ENFERMARIA', 106, 119)

        doc.font('Helvetica-Bold').fillColor(this.whiteColor).text('ABRANGÊNCIA', 18, 135)
            .font('Helvetica-Oblique').fillColor(this.blackColor).text('MUNICIPAL', 105, 135)
            .font('Helvetica-Bold').fillColor(this.whiteColor).text('ACOMODAÇÃO', 342, 135)
            .font('Helvetica').fillColor(this.blackColor).text('ENFERMARIA', 425, 135)

        doc.font('Helvetica-Bold').fillColor(this.greenColor).text('NOME DO TITULAR', 18, 151)
        doc.font('Helvetica').fillColor(this.blackColor).text('FULANO CICLANO', 120, 151)

        doc.text('Atividade principal desenvolvida - Profissão:', 18, 167).text('ADMINISTRADOR', 220, 167)

        doc.fontSize(11)
        doc.text('Data Nasc.', 18, 182).text('--/--/----', 76, 182)
            .text('Sexo', 125, 182).text('------------', 160, 182)
            .text('Estado Civil', 210, 182).text('---------------', 280, 182)
            .text('DT Admissão', 350, 182).text('--/--/----', 430, 182)
            .text('Matric.', 490, 182).text('--------', 530, 182)

        doc.text('Endereço', 18, 198).text('-----------------------------------------', 76, 198)
            .text('Nº', 350, 198).text('-----------', 370, 198)
            .text('Compl.', 420, 198).text('----------------', 470, 198, { width: 200 })

        doc.text('Bairro', 18, 214).text('-----------------------------------------', 60, 214)
            .text('Cidade', 270, 214).text('-----------', 310, 214)
            .text('CEP', 440, 214).text('----------------', 470, 214, { width: 200 })
    }

}


export default CreateUnimedForm