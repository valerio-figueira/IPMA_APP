import { Router } from "express";
import ReportController from "../controllers/ReportController";
import Database from "../db/Database";


class ReportRoutes {
    private controller: ReportController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.controller = new ReportController(this.db)
        this.initialize()
    }

    initialize() {
        this.router.post('/', this.controller.Create.bind(this.controller))
    }

}


export default ReportRoutes