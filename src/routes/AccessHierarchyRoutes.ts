import { Router } from "express";
import AccessHierarchyController from "../controllers/AccessHierarchyController";


const accessHierarchyController = new AccessHierarchyController();

const router = Router();


// CREATE
router.post("/", async (req, res) => {
    accessHierarchyController.Create(req, res)
});

// READ ALL
router.get("/", async (req, res) => {
    accessHierarchyController.ReadAll(req, res)
});

// READ ONE
router.get("/:id", async (req, res) => {
    accessHierarchyController.ReadOne(req, res)
});

// UPDATE
router.put("/", async (req, res) => {
    accessHierarchyController.Update(req, res)
})

// DELETE
router.delete("/:id", async (req, res) => {
    accessHierarchyController.Delete(req, res)
})


export default router;