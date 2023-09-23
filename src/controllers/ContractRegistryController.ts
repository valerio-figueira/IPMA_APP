import { Request, Response } from "express";
import ContractRegistryService from "../services/ContractRegistryService";
import ContractRegistryValidator from "./validation/ContractRegistryValidator";


export default class ContractRegistryController {
    contractRegistryService: ContractRegistryService;

    constructor() {
        this.contractRegistryService = new ContractRegistryService();
    }

    async Create(req: Request, res: Response) {
        try {
            ContractRegistryValidator.validate(req.body)
            res.status(201).json(await this.contractRegistryService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.contractRegistryService.ReadAll(req.query))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.contractRegistryService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Update(req: Request, res: Response) {
        try {
            ContractRegistryValidator.validate(req.body)
            ContractRegistryValidator.validateMember(req.body)
            res.status(200).json(await this.contractRegistryService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Delete(req: Request, res: Response) {
        try {
            ContractRegistryValidator.validate(req.body)
            ContractRegistryValidator.validateMember(req.body)
            res.status(200).json(await this.contractRegistryService.Delete(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}