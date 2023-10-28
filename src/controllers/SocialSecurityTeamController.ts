import { Request, Response } from "express";
import SocialSecurityTeamService from "../services/SocialSecurityTeamService";
import JWT from "../authentication/JWT";
import Database from "../db/Database";



class SocialSecurityTeamController {
    private socialSecurityTeamService: SocialSecurityTeamService;
    private db: Database

    constructor(database: Database) {
        this.db = database
        this.socialSecurityTeamService = new SocialSecurityTeamService(this.db);
    }



    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.socialSecurityTeamService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.socialSecurityTeamService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.socialSecurityTeamService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.socialSecurityTeamService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.socialSecurityTeamService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}

export default SocialSecurityTeamController