import { Router } from "express";
// import InstallmentController from "../controllers/InstallmentController";

// const installmentController = new InstallmentController();
const router = Router();


// CREATE
router.post("/", async (req, res) => {
  // installmentController.Create(req, res);
});

// READ ALL
router.get("/", async (req, res) => {
  // installmentController.ReadAll(req, res);
});

// READ ONE
router.get("/:id", async (req, res) => {
  // installmentController.ReadOne(req, res);
});

// UPDATE
router.put("/:id", async (req, res) => {
  // installmentController.Update(req, res);
})

// DELETE
router.delete("/:id", async (req, res) => {
  // installmentController.Delete(req, res);
})


export default router;