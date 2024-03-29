import { Request, Response } from "express";
import MemberService from "../services/MemberService";
import MemberValidator from "./validation/MemberValidator";
import Database from "../db/Database";
import * as fs from "fs";


class MemberController {
    private memberService: MemberService
    private db: Database

    constructor(database: Database) {
        this.db = database
        this.memberService = new MemberService(this.db);
    }



    async Create(req: Request, res: Response) {
        try {
            MemberValidator.validate(req.body)
            res.status(201).json(await this.memberService.Create(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async BulkCreate(req: Request, res: Response) {
        try {
            const data = await this.memberService.BulkCreate(req)
            fs.unlinkSync(data.filePath)
            res.status(201).json({ message: data.message })
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
            res.status(200).json(await this.memberService.Delete(req.params.id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReviveMember(req: Request, res: Response) {
        try {
            MemberValidator.validate(req.body)
            res.status(201).json(await this.memberService.ReviveMember(req.body))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }



    async ReadDependentsMembers(req: Request, res: Response) {
        try {
            res.status(200).json(await this.memberService
                .ReadDependentsMembers(req.params.holder_id))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }
}


export default MemberController