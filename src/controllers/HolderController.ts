import { Request, Response } from "express";
import HolderService from "../services/HolderService";
import Database from "../db/Database";
import * as fs from "fs";


class HolderController {
    private holderService: HolderService
    private db: Database

    constructor(database: Database) {
        this.db = database
        this.holderService = new HolderService(this.db);
    }



    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.holderService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async BulkCreate(req: Request, res: Response) {
        try {
            const data = await this.holderService.BulkCreate(req)
            fs.unlinkSync(data.filePath)
            res.status(201).json({ message: data.message })
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.holderService.ReadAll(req.query))
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


export default HolderController