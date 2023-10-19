import { Request, Response } from "express";
import DependentService from "../services/DependentService";
import Controller from "../utils/decorators/ControllerDecorator";
import { Delete, Get, Post, Put } from "../utils/decorators/HandlersDecorator";
import Database from "../db/Database";


@Controller('/api/vi/dependents')
class DependentController {
    private dependentService: DependentService
    private db: Database

    constructor() {
        this.db = new Database()
        this.dependentService = new DependentService(this.db);
    }

    @Post('/:holder')
    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.dependentService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/:holder')
    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.dependentService.ReadAll(req.params.holder))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/:holder/:dependent')
    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.dependentService.ReadOne(req.params.holder, req.params.dependent))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Put('/:holder')
    async Update(req: Request, res: Response) { }

    @Delete('/:holder/:dependent')
    async Delete(req: Request, res: Response) { }

}


export default DependentController