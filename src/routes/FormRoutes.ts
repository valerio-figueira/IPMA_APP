import { Router } from "express";
import FormController from "../controllers/FormController";
import Database from "../db/Database";


class FormRoutes {
    private controller: FormController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.controller = new FormController(this.db)
        this.initialize()
    }

    initialize() {
        this.router.get('/:type', this.controller.CreateForm.bind(this.controller))
    }

}


export default FormRoutes