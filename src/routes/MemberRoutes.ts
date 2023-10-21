import { Router } from "express";
import MemberController from "../controllers/MemberController";
import Database from "../db/Database";


class MemberRoutes {
    private MemberController: MemberController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.MemberController = new MemberController(this.db)
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.post('/', this.MemberController.Create)
        this.router.get('/', this.MemberController.ReadAll)
        this.router.get('/:id', this.MemberController.ReadOne)
        this.router.put('/', this.MemberController.Update)
        this.router.delete('/:id', this.MemberController.Delete)
    }

}


export default MemberRoutes