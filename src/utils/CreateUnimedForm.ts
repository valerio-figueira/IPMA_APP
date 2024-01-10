import * as path from 'path';


class CreateUnimedForm {


    static drawForm(doc: PDFKit.PDFDocument, data: any[],
        coordinates: Record<string, number | number[]>) {

        const { startX, startY, colWidths } = coordinates
        const [spaceInY, rowHeight] = [15, 15]

        this.drawHeader(doc)
        // Adicionar dados da tabela
    }




    private static drawHeader(doc: PDFKit.PDFDocument) {
        const headerImg = path.join(__dirname, '../../public/imgs', 'unimed_header.png')

        doc.image(headerImg, 0, 0)


    }



}


export default CreateUnimedForm