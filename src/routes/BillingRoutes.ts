import { Router } from "express";
import BillingController from "../controllers/BillingController";


const billingController = new BillingController();

const router = Router();


// CREATE
router.post("/", async (req, res) => {
    billingController.Create(req, res)
});

// READ ALL
router.get("/", async (req, res) => {
    billingController.ReadAll(req, res)
});

// READ ONE
router.get("/:id", async (req, res) => {
    billingController.ReadOne(req, res)
});

// UPDATE
router.put("/:id", async (req, res) => {
    billingController.Update(req, res)
})

// DELETE
router.delete("/:id", async (req, res) => {
    billingController.Delete(req, res)
})


export default router;