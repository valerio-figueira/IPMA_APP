import { Router } from "express";
import AgreementController from "../controllers/AgreementController";


const agreementController = new AgreementController();

const router = Router();


// CREATE
router.post("/", async (req, res) => {
    agreementController.Create(req, res)
});

// READ ALL
router.get("/", async (req, res) => {
    agreementController.ReadAll(req, res)
});

// READ ONE
router.get("/:id", async (req, res) => {
    agreementController.ReadOne(req, res)
});

// UPDATE
router.put("/", async (req, res) => {
    agreementController.Update(req, res)
})

// DELETE
router.delete("/", async (req, res) => {
    agreementController.Delete(req, res)
})


export default router;