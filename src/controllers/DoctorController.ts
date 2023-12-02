import { Request, Response } from "express";
import DoctorService from "../services/DoctorService";
import Database from "../db/Database";



class DoctorController {
    private doctorService: DoctorService
    private db: Database

    constructor(database: Database) {
        this.db = database
        this.doctorService = new DoctorService(this.db)
    }



    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.doctorService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.ReadAll(req.query))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async BulkDelete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.BulkDelete())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ExtractData(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.ExtractData(req))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}

export default DoctorController