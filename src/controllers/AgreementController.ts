import { Request, Response } from "express";
import AgreementService from "../services/AgreementService";
import Database from "../db/Database";



class AgreementController {
    private db: Database
    private agreementService: AgreementService;

    constructor(database: Database) {
        this.db = database
        this.agreementService = new AgreementService(this.db);
    }



    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.agreementService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.agreementService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.agreementService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.agreementService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.agreementService.Delete(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}

export default AgreementController