import { Router } from "express";
import AuthenticationController from "../controllers/AuthenticationController";
import Database from "../db/Database";


class AuthenticationRoutes {
    private authenticationController: AuthenticationController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.authenticationController = new AuthenticationController(this.db)
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.post('/', this.authenticationController.Create)
        this.router.get('/', this.authenticationController.ReadAll)
        this.router.get('/:id', this.authenticationController.ReadOne)
        this.router.put('/', this.authenticationController.Update)
        this.router.delete('/:id', this.authenticationController.Delete)
        this.router.post('/login', this.authenticationController.Login)
    }

}


export default AuthenticationRoutes