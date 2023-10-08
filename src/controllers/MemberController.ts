import { Request, Response } from "express";
import MemberService from "../services/MemberService";
import MemberValidator from "./validation/MemberValidator";
import Controller from "../utils/decorators/ControllerDecorator";
import { Delete, Get, Post, Put } from "../utils/decorators/HandlersDecorator";

@Controller('/api/v1/members')
class MemberController {
    memberService: MemberService;

    constructor() {
        this.memberService = new MemberService();
    }

    @Post('/')
    async Create(req: Request, res: Response) {
        try {
            MemberValidator.validate(req.body)
            res.status(201).json(await this.memberService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/')
    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.memberService.ReadAll(req.query))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Get('/:id')
    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.memberService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Put('/')
    async Update(req: Request, res: Response) {
        try {
            MemberValidator.validate(req.body)
            MemberValidator.validateMember(req.body)
            res.status(200).json(await this.memberService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    @Delete('/')
    async Delete(req: Request, res: Response) {
        try {
            MemberValidator.validate(req.body)
            MemberValidator.validateMember(req.body)
            res.status(200).json(await this.memberService.Delete(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}


export default MemberController