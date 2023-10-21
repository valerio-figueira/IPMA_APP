import { Router } from "express";
import AgreementController from "../controllers/AgreementController";
import Database from "../db/Database";


class AgreementRoutes {
    private agreementController: AgreementController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.agreementController = new AgreementController(this.db)
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.post('/', this.agreementController.Create)
        this.router.get('/', this.agreementController.ReadAll)
        this.router.get('/:id', this.agreementController.ReadOne)
        this.router.put('/', this.agreementController.Update)
        this.router.delete('/:id', this.agreementController.Delete)
    }

}


export default AgreementRoutes