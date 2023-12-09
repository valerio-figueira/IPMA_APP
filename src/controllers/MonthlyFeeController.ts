import { Request, Response } from "express";
import MonthlyFeeService from "../services/MonthlyFeeService";
import Database from "../db/Database";


class MonthlyFeeController {
    private db: Database
    private monthlyFeeService: MonthlyFeeService

    constructor(database: Database) {
        this.db = database
        this.monthlyFeeService = new MonthlyFeeService(this.db);
    }



    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.monthlyFeeService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.monthlyFeeService.ReadAll(req.query))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadAllSummary(req: Request, res: Response) {
        try {
            res.status(200).json(await this.monthlyFeeService.ReadAllSummary(req.params, req.query))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.monthlyFeeService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.monthlyFeeService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.monthlyFeeService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }
}


export default MonthlyFeeController