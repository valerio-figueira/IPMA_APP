import { Router } from "express";
import HolderController from "../controllers/HolderController";


const holderController = new HolderController();

const router = Router();

// CREATE
router.post("/", async (req, res) => {
    holderController.Create(req, res);
});

// READ
router.get("/", async (req, res) => {
    holderController.ReadAll(req, res);
});

// READ ONE
router.get("/:id", async (req, res) => {
    holderController.ReadOne(req, res);
});

// UPDATE
router.put("/", async (req, res) => {
    holderController.Update(req, res);
})

// PATCH ATUALIZA UM CAMPO INDIVIDUAL
router.patch("/:id", async (req, res) => {

})

// DELETE
router.delete("/:id", async (req, res) => {
    holderController.Delete(req, res);
})

export default router