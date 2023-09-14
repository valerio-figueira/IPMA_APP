import { Router } from "express";
// import PaymentController from "../controllers/PaymentController";

// const paymentsController = new PaymentController();
const router = Router();


// CREATE
router.post("/", async (req, res) => {
    // paymentsController.Create(req, res);
});

// READ ALL
router.get("/:holder", async (req, res) => {
    // paymentsController.ReadAll(req, res);
});

// READ ONE
router.get("/:holder/:payment", async (req, res) => {
    // paymentsController.ReadOne(req, res);
});

// UPDATE
router.put("/:id", async (req, res) => {
    // paymentsController.Update(req, res);
})

// DELETE
router.delete("/:payment_id", async (req, res) => {
    // paymentsController.Delete(req, res);
})


export default router;