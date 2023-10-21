import { Request, Response } from "express";
import AuthenticationService from "../services/AuthenticationService";
import JWT from "../authentication/JWT";
import Database from "../db/Database";



class AuthenticationController {
    private authenticationService: AuthenticationService;
    private db: Database

    constructor(database: Database) {
        this.db = database
        this.authenticationService = new AuthenticationService(this.db);
    }



    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.authenticationService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.authenticationService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.authenticationService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.authenticationService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.authenticationService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async Login(req: Request, res: Response) {
        JWT.Login(req, res)
    }

}

export default AuthenticationController