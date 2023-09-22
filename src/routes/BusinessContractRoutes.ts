import { Router } from "express";
import BusinessContractController from "../controllers/BusinessContractController";


const businessContractController = new BusinessContractController();

const router = Router();


// CREATE
router.post("/", async (req, res) => {
    businessContractController.Create(req, res)
});

// READ ALL
router.get("/", async (req, res) => {
    businessContractController.ReadAll(req, res)
});

// READ ONE
router.get("/:id", async (req, res) => {
    businessContractController.ReadOne(req, res)
});

// UPDATE
router.put("/:id", async (req, res) => {
    businessContractController.Update(req, res)
})

// DELETE
router.delete("/:id", async (req, res) => {
    businessContractController.Delete(req, res)
})


export default router;