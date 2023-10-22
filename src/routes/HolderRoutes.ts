import { Router } from "express";
import HolderController from "../controllers/HolderController";
import Database from "../db/Database";


class HolderRoutes {
    private controller: HolderController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.controller = new HolderController(this.db)
        this.initialize()
    }

    initialize() {
        this.router.post('/', this.controller.Create.bind(this.controller))
        this.router.get('/', this.controller.ReadAll.bind(this.controller))
        this.router.get('/:id', this.controller.ReadOne.bind(this.controller))
        this.router.put('/', this.controller.Update.bind(this.controller))
        this.router.delete('/:id', this.controller.Delete.bind(this.controller))
    }

}


export default HolderRoutes