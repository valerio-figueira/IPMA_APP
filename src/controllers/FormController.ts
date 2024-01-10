import { Request, Response } from "express";
import Database from "../db/Database";
import FormService from "../services/FormService";
import * as fs from "fs";


class FormController {
    formService: FormService

    constructor(database: Database) {
        this.formService = new FormService(database)
    }

    async CreateForm(req: Request, res: Response) {
        try {
            const data = await this.formService.CreateForm(req.params.type)

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${data.filename}`)

            data.doc.on('error', (err: any) => {
                console.error('Erro ao criar o documento PDF:', err)
                throw new Error('Erro ao criar o documento PDF.')
            })

            data.doc.compress
            data.doc.pipe(res)
            data.doc.end()
            data.doc.on('end', () => fs.unlinkSync(data.filePath))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}


export default FormController