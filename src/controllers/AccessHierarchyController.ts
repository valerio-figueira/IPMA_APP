import { Request, Response } from "express";
import AccessHierarchyService from "../services/AccessHierarchyService";
import Database from "../db/Database";

class AccessHierarchyController {
    private db: Database
    private accessHierarchyService: AccessHierarchyService;

    constructor(database: Database) {
        this.db = database
        this.accessHierarchyService = new AccessHierarchyService(this.db);
    }



    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.accessHierarchyService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.accessHierarchyService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.accessHierarchyService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.accessHierarchyService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.accessHierarchyService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}

export default AccessHierarchyController