import { Request, Response } from "express";
import AuthenticationService from "../services/AuthenticationService";
import Controller from "../utils/decorators/ControllerDecorator";
import { Delete, Get, Post, Put } from "../utils/decorators/HandlersDecorator";
import JWT from "../authentication/JWT";
import Database from "../db/Database";


@Controller('/api/v1/authentications')
class AuthenticationController {
    private authenticationService: AuthenticationService;
    private db: Database

    constructor() {
        this.db = new Database()
        this.authenticationService = new AuthenticationService(this.db);
    }

    @Post('/')
    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.authenticationService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/')
    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.authenticationService.ReadAll(req.query))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/:id')
    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.authenticationService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Put('/')
    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.authenticationService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Delete('/:id')
    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.authenticationService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Post('/login')
    async Login(req: Request, res: Response) {
        JWT.Login(req, res)
    }

}

export default AuthenticationController