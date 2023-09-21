import { Request, Response } from "express";
import MemberService from "../services/MemberServices";


export default class MemberController {
    memberService: MemberService;

    constructor() {
        this.memberService = new MemberService();
    }

    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.memberService.Create())
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.memberService.ReadAll())
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.memberService.ReadOne())
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.memberService.Update())
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.memberService.Delete())
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

}