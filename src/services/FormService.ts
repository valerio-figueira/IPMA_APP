import Database from "../db/Database";
import CreateUnimedForm from "../utils/CreateUnimedForm";
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';


class FormService {
    private database: Database

    constructor(database: Database) {
        this.database = database
    }


    async CreateForm(type: string) {
        return this.drawUnimedForm()
    }


    async drawUnimedForm() {
        const doc = new PDFDocument({ size: 'A4' })

        const [month, year] = [new Date().getMonth() + 1, new Date().getFullYear()]
        const filename = `formulario-${month}-${year}.pdf`
        const filePath = path.join(__dirname, `../temp/${filename}`)
        fs.createWriteStream(filePath)

        CreateUnimedForm.drawForm(doc, [], {
            startX: 20,
            startY: 0,
            colWidths: []
        })

        return { filename, filePath, doc }
    }
}


export default FormService