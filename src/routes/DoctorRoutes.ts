import { Router } from "express";
import DoctorController from "../controllers/DoctorController";
import Database from "../db/Database";


class DoctorRoutes {
    private controller: DoctorController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.controller = new DoctorController(this.db)
        this.initialize()
    }

    initialize() {
        this.router.post('/', this.controller.Create.bind(this.controller))
        this.router.post('/bulk-create', this.controller.BulkCreate.bind(this.controller))
        this.router.get('/', this.controller.ReadAll.bind(this.controller))
        this.router.get('/:id', this.controller.ReadOne.bind(this.controller))
        this.router.put('/', this.controller.Update.bind(this.controller))
        this.router.delete('/:id', this.controller.Delete.bind(this.controller))
        this.router.post('/extract-data', this.controller.ExtractData.bind(this.controller))
    }

}


export default DoctorRoutes