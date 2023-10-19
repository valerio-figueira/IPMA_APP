import { Request, Response } from "express";
import HolderService from "../services/HolderService";
import UserValidator from "./validation/UserValidator";
import Controller from "../utils/decorators/ControllerDecorator";
import { Get, Post, Put, Delete } from "../utils/decorators/HandlersDecorator";
import Database from "../db/Database";

@Controller('/api/v1/holders')
class HolderController {
    private holderService: HolderService
    private db: Database

    constructor() {
        this.db = new Database()
        this.holderService = new HolderService(this.db);
    }

    @Post('/')
    async Create(req: Request, res: Response) {
        try {
            UserValidator.validate(req.body)
            res.status(201).json(await this.holderService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/')
    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.holderService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/:id')
    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.holderService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Put('/')
    async Update(req: Request, res: Response) {
        try {
            UserValidator.validateIdentifications(req.body)
            res.status(200).json(await this.holderService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Delete('/:id')
    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.holderService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}


export default HolderController