import { Request, Response } from "express";
import AccessHierarchyService from "../services/AccessHierarchyService";
import Controller from "../utils/decorators/ControllerDecorator";
import { Delete, Get, Post, Put } from "../utils/decorators/HandlersDecorator";
import Database from "../db/Database";

@Controller('/api/v1/access-hierarchy')
class AccessHierarchyController {
    private db: Database
    private accessHierarchyService: AccessHierarchyService;

    constructor() {
        this.db = new Database()
        this.accessHierarchyService = new AccessHierarchyService(this.db);
    }

    @Post('/')
    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.accessHierarchyService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/')
    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.accessHierarchyService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/:id')
    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.accessHierarchyService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Put('/')
    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.accessHierarchyService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Delete('/:id')
    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.accessHierarchyService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}

export default AccessHierarchyController