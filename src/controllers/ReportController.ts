import { Request, Response } from "express";
import ReportService from "../services/ReportService";
import Database from "../db/Database";
import * as fs from "fs";


class ReportController {
    private reportService: ReportService


    constructor(database: Database) {
        this.reportService = new ReportService(database);
    }



    async CreateSpreadsheet(req: Request, res: Response) {
        try {
            const data = await this.reportService.CreateSpreadsheet(req.body)

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            res.setHeader('Content-Disposition', `attachment; filename=${data.fileName}`)

            data.readStream.pipe(res)
            data.readStream.on('end', () => fs.unlinkSync(data.filePath))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async CreatePDF(req: Request, res: Response) {
        try {
            const data = await this.reportService.CreatePDF(req.body)

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${data.filename}`)

            data.doc.on('error', (err) => {
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


export default ReportController