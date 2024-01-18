import { Router } from "express";
import SecurityKeyController from "../controllers/SecurityKeyController";
import Database from "../db/Database";


class SecurityKeyRoutes {
    private controller: SecurityKeyController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.controller = new SecurityKeyController(this.db)
        this.initialize()
    }

    initialize() {
        this.router.get('/generate-rsa-keys', this.controller.GenerateRSAKeys.bind(this.controller))
        this.router.get('/generate-symmetric-key', this.controller.GenerateSymmetricKey.bind(this.controller))
    }
}


export default SecurityKeyRoutes