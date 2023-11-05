import { Request, Response } from "express";
import Database from "../db/Database";



class DatabaseController {
    private db: Database

    constructor(database: Database) {
        this.db = database
    }



    async SyncModels(req: Request, res: Response) {
        try {
            res.status(200).json(await this.db.syncModels())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Authenticate(req: Request, res: Response) {
        try {
            res.status(200).json(this.db.authenticate)
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ClearDatabase(req: Request, res: Response) {
        try {
            res.status(200).json(await this.db.clearDatabase())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }


    async CreateIndex(req: Request, res: Response) {
        try {
            res.status(200).json(this.db.createIndex)
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async UpdateIndex(req: Request, res: Response) {
        try {
            res.status(200).json(this.db.updateIndex)
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async DropIndex(req: Request, res: Response) {
        try {
            res.status(200).json(this.db.dropIndex)
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}


export default DatabaseController