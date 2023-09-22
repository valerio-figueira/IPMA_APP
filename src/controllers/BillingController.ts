import { Request, Response } from "express";
import BillingService from "../services/BillingService";

export default class BillingController {
    billingService: BillingService;

    constructor() {
        this.billingService = new BillingService();
    }

    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.billingService.Create())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.billingService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.billingService.ReadOne())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.billingService.Update())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.billingService.Delete())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}