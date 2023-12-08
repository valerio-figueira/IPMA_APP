import { Request, Response } from "express";
import Database from "../db/Database";
import AppointmentService from "../services/AppointmentService";


class AppointmentController {
    private appointmentService: AppointmentService

    constructor(db: Database) {
        this.appointmentService = new AppointmentService(db)
    }




    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.appointmentService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }





    async BulkCreate(req: Request, res: Response) {
        try {
            res.status(201).json(await this.appointmentService.BulkCreate(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }





    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.appointmentService.ReadAll(req.query))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }




    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.appointmentService.ReadOne(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }




    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.appointmentService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }




    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.appointmentService.Delete(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}


export default AppointmentController