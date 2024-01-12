import Database from "../db/Database";
import UnimedForm from "../utils/UnimedForm";
import UniodontoForm from "../utils/UniodontoForm";
import FormRepository from "../repositories/FormRepository";
import PDFDocument from 'pdfkit';
import * as path from 'path';
import * as fs from 'fs';
import CustomError from "../utils/CustomError";


class FormService {
    private formRepository: FormRepository


    constructor(database: Database) {
        this.formRepository = new FormRepository(database)
    }




    createTempFile(fileName: string) {
        const [month, year] = [new Date().getMonth() + 1, new Date().getFullYear()]
        const filename = `${fileName}-${month}-${year}.pdf`
        const filePath = path.join(__dirname, `../temp/${filename}`)
        fs.createWriteStream(filePath)

        return { filename, filePath }
    }





    async CreateUnimedFormSubscription() {
        const doc = new PDFDocument({ size: 'A4' })

        const { filename, filePath } = this.createTempFile(`inscricao-unimed`)

        UnimedForm.drawForm(doc, [], {
            startX: 20,
            startY: 0,
            colWidths: []
        })

        return { filename, filePath, doc }
    }





    async CreateUniodontoForm(holder_id: string) {
        const holder = await this.formRepository.ReadHolderInfo(holder_id)
        if (!holder) throw new CustomError('Usuário não encontrado!', 400)

        const doc = new PDFDocument({ size: 'A4' })
        const { filename, filePath } = this.createTempFile('inscricao-uniodonto')

        UniodontoForm.drawForm(doc, { holderData: holder })

        return { filename, filePath, doc }
    }
}


export default FormService