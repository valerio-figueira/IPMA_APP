import { Request, Response } from "express";
import SecurityKeyService from "../services/SecurityKeyService";
import Database from "../db/Database";



class SecurityKeyController {
    private securityKeyService: SecurityKeyService;

    constructor(database: Database) {
        this.securityKeyService = new SecurityKeyService(database);
    }



    async GenerateRSAKeys(req: Request, res: Response) {
        try {
            res.status(200).json(this.securityKeyService.GenerateRSAKeys())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }


    async GenerateSymmetricKey(req: Request, res: Response) {
        try {
            res.status(200).json(await this.securityKeyService.GenerateSymmetricKey())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }
}

export default SecurityKeyController