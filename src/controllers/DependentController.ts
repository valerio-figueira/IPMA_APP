import { Request, Response } from "express";
import DependentService from "../services/DependentService";


export default class DependentController {
    dependentService: DependentService;

    constructor() {
        this.dependentService = new DependentService();
    }

    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.dependentService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.dependentService.ReadAll(req.params.holder))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.dependentService.ReadOne(req.params.holder, req.params.dependent))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Update(req: Request, res: Response) { }

    async Delete(req: Request, res: Response) { }

}