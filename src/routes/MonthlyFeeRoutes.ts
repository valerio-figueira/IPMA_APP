import { Router } from "express";
import MonthlyFeeController from "../controllers/MonthlyFeeController";


const monthlyFeeController = new MonthlyFeeController();

const router = Router();


// CREATE
router.post("/", async (req, res) => {
    monthlyFeeController.Create(req, res)
});

// READ ALL
router.get("/", async (req, res) => {
    monthlyFeeController.ReadAll(req, res)
});

// READ ONE
router.get("/:id", async (req, res) => {
    monthlyFeeController.ReadOne(req, res)
});

// UPDATE
router.put("/:id", async (req, res) => {
    monthlyFeeController.Update(req, res)
})

// DELETE
router.delete("/:id", async (req, res) => {
    monthlyFeeController.Delete(req, res)
})


export default router;