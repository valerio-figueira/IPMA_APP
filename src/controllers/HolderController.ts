import { Request, Response } from "express";
import HolderService from "../services/HolderService";
import UserValidator from "./validation/UserValidator";

export default class HolderController {
    holderService: HolderService;

    constructor() {
        this.holderService = new HolderService();
    }

    async Create(req: Request, res: Response) {
        try {
            UserValidator.validate(req.body)
            res.status(201).json(await this.holderService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.holderService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.holderService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Update(req: Request, res: Response) {
        try {
            UserValidator.validateIdentifications(req.body)
            res.status(200).json(await this.holderService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.holderService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}