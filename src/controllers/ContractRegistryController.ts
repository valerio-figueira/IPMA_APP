import { Request, Response } from "express";
import ContractRegistryService from "../services/ContractRegistryService";


export default class ContractRegistryController {
    contractRegistryService: ContractRegistryService;

    constructor() {
        this.contractRegistryService = new ContractRegistryService();
    }

    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.contractRegistryService.Create())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.contractRegistryService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.contractRegistryService.ReadOne())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.contractRegistryService.Update())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.contractRegistryService.Delete())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}