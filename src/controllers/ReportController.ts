import { Request, Response } from "express";
import ReportService from "../services/ReportService";
import Database from "../db/Database";
import * as fs from "fs";


class ReportController {
    private reportService: ReportService


    constructor(database: Database) {
        this.reportService = new ReportService(database);
    }



    async Create(req: Request, res: Response) {
        try {
            const data = await this.reportService.Create(req.body)

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            res.setHeader('Content-Disposition', `attachment; filename=${data.fileName}`)

            data.readStream.pipe(res)
            data.readStream.on('end', () => fs.unlinkSync(data.filePath))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }
}


export default ReportController