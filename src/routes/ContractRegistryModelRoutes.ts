import { Router } from "express";
import ContractRegistryController from "../controllers/ContractRegistryController";


const contractRegistryController = new ContractRegistryController();

const router = Router();


// CREATE
router.post("/", async (req, res) => {
    contractRegistryController.Create(req, res)
});

// READ ALL
router.get("/", async (req, res) => {
    contractRegistryController.ReadAll(req, res)
});

// READ ONE
router.get("/:id", async (req, res) => {
    contractRegistryController.ReadOne(req, res)
});

// UPDATE
router.put("/:id", async (req, res) => {
    contractRegistryController.Update(req, res)
})

// DELETE
router.delete("/:id", async (req, res) => {
    contractRegistryController.Delete(req, res)
})


export default router;