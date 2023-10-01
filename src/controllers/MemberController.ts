import { Request, Response } from "express";
import MemberService from "../services/MemberService";
import MemberValidator from "./validation/MemberValidator";


export default class MemberController {
    memberService: MemberService;

    constructor() {
        this.memberService = new MemberService();
    }

    async Create(req: Request, res: Response) {
        try {
            MemberValidator.validate(req.body)
            res.status(201).json(await this.memberService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.memberService.ReadAll(req.query))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.memberService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

    async Update(req: Request, res: Response) {
        try {
            MemberValidator.validate(req.body)
            MemberValidator.validateMember(req.body)
            res.status(200).json(await this.memberService.Update(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

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