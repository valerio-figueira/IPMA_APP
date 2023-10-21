import { Router } from "express";
import HolderController from "../controllers/HolderController";
import Database from "../db/Database";


class HolderRoutes {
    private holderController: HolderController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.holderController = new HolderController(this.db)
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.post('/', this.holderController.Create)
        this.router.get('/', this.holderController.ReadAll)
        this.router.get('/:id', this.holderController.ReadOne)
        this.router.put('/', this.holderController.Update)
        this.router.delete('/:id', this.holderController.Delete)
    }

}


export default HolderRoutes