import { Router } from "express";
import DoctorController from "../controllers/DoctorController";
import Database from "../db/Database";


class DoctorRoutes {
    private doctorController: DoctorController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.doctorController = new DoctorController(this.db)
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.post('/', this.doctorController.Create)
        this.router.post('/bulk-create', this.doctorController.BulkCreate)
        this.router.get('/', this.doctorController.ReadAll)
        this.router.get('/:id', this.doctorController.ReadOne)
        this.router.put('/', this.doctorController.Update)
        this.router.delete('/:id', this.doctorController.Delete)
        this.router.post('/extract-data', this.doctorController.ExtractData)
    }

}


export default DoctorRoutes