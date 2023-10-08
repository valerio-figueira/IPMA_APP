import { Request, Response } from "express";
import DoctorService from "../services/DoctorService";
import Controller from "../utils/decorators/ControllerDecorator";
import { Delete, Get, Post, Put } from "../utils/decorators/HandlersDecorator";


@Controller('/api/v1/doctors')
class DoctorController {
    doctorService: DoctorService;

    constructor() {
        this.doctorService = new DoctorService();
    }

    @Post('/')
    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.doctorService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Post('/bulk-create')
    async BulkCreate(req: Request, res: Response) {
        try {
            res.status(201).json(await this.doctorService.BulkCreate())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/')
    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.ReadAll(req.query))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/:id')
    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Put('/')
    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Delete('/:id')
    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Post('/extract-data')
    async ExtractData(req: Request, res: Response) {
        try {
            res.status(200).json(await this.doctorService.ExtractData(req.files))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}

export default DoctorController