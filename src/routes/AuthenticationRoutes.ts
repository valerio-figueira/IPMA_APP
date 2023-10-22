import { Router } from "express";
import AuthenticationController from "../controllers/AuthenticationController";
import Database from "../db/Database";


class AuthenticationRoutes {
    private controller: AuthenticationController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.controller = new AuthenticationController(this.db)
        this.initialize()
    }

    initialize() {
        this.router.post('/', this.controller.Create.bind(this.controller))
        this.router.get('/', this.controller.ReadAll.bind(this.controller))
        this.router.get('/:id', this.controller.ReadOne.bind(this.controller))
        this.router.put('/', this.controller.Update.bind(this.controller))
        this.router.delete('/:id', this.controller.Delete.bind(this.controller))
        this.router.post('/login', this.controller.Login.bind(this.controller))
    }

}


export default AuthenticationRoutes