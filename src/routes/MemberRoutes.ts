import { Router } from "express";
import MemberController from "../controllers/MemberController";
import Database from "../db/Database";


class MemberRoutes {
    private controller: MemberController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.controller = new MemberController(this.db)
        this.initialize()
    }

    initialize() {
        this.router.post('/', this.controller.Create.bind(this.controller))
        this.router.get('/', this.controller.ReadAll.bind(this.controller))
        this.router.post('/bulk-create', this.controller.BulkCreate.bind(this.controller))
        this.router.post('/revive-member', this.controller.ReviveMember.bind(this.controller))
        this.router.get('/:id', this.controller.ReadOne.bind(this.controller))
        this.router.put('/', this.controller.Update.bind(this.controller))
        this.router.delete('/:id', this.controller.Delete.bind(this.controller))
    }

}


export default MemberRoutes