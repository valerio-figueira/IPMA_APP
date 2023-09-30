import { Request, Response } from "express";
import DoctorService from "../services/DoctorService";


export default class DoctorController {
    doctorService: DoctorService;

    constructor() {
        this.doctorService = new DoctorService();
    }

    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.doctorService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async BulkCreate(req: Request, res: Response) {
        try {
            res.status(201).json(await this.doctorService.BulkCreate())
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

    async ExtractData(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.ExtractData(req.files))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}