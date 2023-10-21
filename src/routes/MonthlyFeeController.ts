import { Router } from "express";
import MonthlyFeeController from "../controllers/MonthlyFeeController";
import Database from "../db/Database";


class MonthlyFeeRoutes {
    private monthlyFeeController: MonthlyFeeController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.monthlyFeeController = new MonthlyFeeController(this.db)
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.post('/', this.monthlyFeeController.Create)
        this.router.get('/', this.monthlyFeeController.ReadAll)
        this.router.get('/:id', this.monthlyFeeController.ReadOne)
        this.router.put('/', this.monthlyFeeController.Update)
        this.router.delete('/:id', this.monthlyFeeController.Delete)
    }

}


export default MonthlyFeeRoutes