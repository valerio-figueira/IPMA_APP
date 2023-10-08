import { Request, Response } from "express";
import AgreementService from "../services/AgreementService";
import Controller from "../utils/decorators/ControllerDecorator";
import { Delete, Get, Post, Put } from "../utils/decorators/HandlersDecorator";


@Controller('/api/v1/agreements')
class AgreementController {
    agreementService: AgreementService;

    constructor() {
        this.agreementService = new AgreementService();
    }

    @Post('/')
    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.agreementService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/')
    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.agreementService.ReadAll())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/:id')
    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.agreementService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Put('/')
    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.agreementService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Delete('/')
    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.agreementService.Delete(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}

export default AgreementController