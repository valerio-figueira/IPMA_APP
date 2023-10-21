import { Router } from "express";
import AccessHierarchyController from "../controllers/AccessHierarchyController";
import Database from "../db/Database";


class AccessHierarchyRoutes {
    private accessHierarchyController: AccessHierarchyController
    private db: Database
    public router: Router

    constructor(database: Database) {
        this.db = database
        this.router = Router()
        this.accessHierarchyController = new AccessHierarchyController(this.db)
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.post('/', this.accessHierarchyController.Create)
        this.router.get('/', this.accessHierarchyController.ReadAll)
        this.router.get('/:id', this.accessHierarchyController.ReadOne)
        this.router.put('/', this.accessHierarchyController.Update)
        this.router.delete('/:id', this.accessHierarchyController.Delete)
    }

}


export default AccessHierarchyRoutes