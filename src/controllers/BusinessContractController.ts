import { Request, Response } from "express";
import BusinessContractService from "../services/BusinessContractService";


export default class BusinessContractController {
    businessContractService: BusinessContractService;

    constructor() {
        this.businessContractService = new BusinessContractService();
    }

    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.businessContractService.Create())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.businessContractService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.businessContractService.ReadOne())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.businessContractService.Update())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.businessContractService.Delete())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}