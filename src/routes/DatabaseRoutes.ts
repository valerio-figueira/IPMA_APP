import { Router } from "express";
import DatabaseController from "../controllers/DatabaseController";
import Database from "../db/Database";


class DatabaseRoutes {
    private controller: DatabaseController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.controller = new DatabaseController(this.db)
        this.initialize()
    }

    initialize() {
        this.router.get('/authenticate', this.controller.Authenticate.bind(this.controller))
        this.router.get('/sync-models', this.controller.SyncModels.bind(this.controller))
        this.router.get('/clear-db', this.controller.ClearDatabase.bind(this.controller))
        this.router.post('/backup', this.controller.Backup.bind(this.controller))
        this.router.post('/create-index', this.controller.CreateIndex.bind(this.controller))
        this.router.put('/update-index', this.controller.UpdateIndex.bind(this.controller))
        this.router.delete('/drop-index', this.controller.DropIndex.bind(this.controller))
    }

}


export default DatabaseRoutes