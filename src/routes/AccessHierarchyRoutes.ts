import { Router } from "express";
import AccessHierarchyController from "../controllers/AccessHierarchyController";
import Database from "../db/Database";


class AccessHierarchyRoutes {
    private controller: AccessHierarchyController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.controller = new AccessHierarchyController(this.db)
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


export default AccessHierarchyRoutes