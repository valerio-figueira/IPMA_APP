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
        this.router.post('/unimed/:holder_id', this.controller.CreateUnimedFormSubscription.bind(this.controller))
        this.router.post('/uniodonto/:holder_id', this.controller.CreateUniodontoForm.bind(this.controller))
        this.router.post('/odonto-company/:holder_id', this.controller.CreateOdontoCompanyForm.bind(this.controller))
    }

}


export default FormRoutes