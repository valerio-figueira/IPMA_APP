import { Router } from "express";
import DependentController from "../controllers/DependentController";
import Database from "../db/Database";


class DependentRoutes {
    private controller: DependentController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.controller = new DependentController(this.db)
        this.initialize()
    }

    initialize() {
        this.router.post('/:holder', this.controller.Create.bind(this.controller))
        this.router.get('/:holder', this.controller.ReadAll.bind(this.controller))
        this.router.get('/:holder/:dependent', this.controller.ReadOne.bind(this.controller))
        this.router.put('/:holder', this.controller.Update.bind(this.controller))
        this.router.delete('/:holder/:dependent', this.controller.Delete.bind(this.controller))
    }

}


export default DependentRoutes