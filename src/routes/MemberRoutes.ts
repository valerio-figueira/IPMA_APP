import { Router } from "express";
import MemberController from "../controllers/MemberController";


const memberController = new MemberController();

const router = Router();


// CREATE
router.post("/", async (req, res) => {
    memberController.Create(req, res)
});

// READ ALL
router.get("/", async (req, res) => {
    memberController.ReadAll(req, res)
});

// READ ONE
router.get("/:id", async (req, res) => {
    memberController.ReadOne(req, res)
});

// UPDATE
router.put("/", async (req, res) => {
    memberController.Update(req, res)
})

// DELETE
router.delete("/", async (req, res) => {
    memberController.Delete(req, res)
})


export default router;