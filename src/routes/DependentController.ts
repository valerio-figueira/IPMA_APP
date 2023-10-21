import { Router } from "express";
import DependentController from "../controllers/DependentController";
import Database from "../db/Database";


class DependentRoutes {
    private dependentController: DependentController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.dependentController = new DependentController(this.db)
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.post('/:holder', this.dependentController.Create)
        this.router.get('/:holder', this.dependentController.ReadAll)
        this.router.get('/:holder/:dependent', this.dependentController.ReadOne)
        this.router.put('/:holder', this.dependentController.Update)
        this.router.delete('/:holder/:dependent', this.dependentController.Delete)
    }

}


export default DependentRoutes