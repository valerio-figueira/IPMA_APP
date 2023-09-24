import { Router } from "express";
import DependentController from "../controllers/DependentController";


const dependentController = new DependentController();

const router = Router();

// CREATE
router.post("/:holder", async (req, res) => {
    dependentController.Create(req, res);
});

// READ ALL
router.get("/:holder", async (req, res) => {
    dependentController.ReadAll(req, res);
});

// READ ONE
router.get("/:holder/:dependent", async (req, res) => {
    dependentController.ReadOne(req, res);
});

// UPDATE
router.put("/:holder/:dependent", async (req, res) => {
    dependentController.Update(req, res);
});

// DELETE
router.delete("/:holder/:dependent", async (req, res) => {
    dependentController.Delete(req, res);
});


export default router