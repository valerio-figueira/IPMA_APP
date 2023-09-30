import { Router } from "express";
import AuthenticationController from "../controllers/AuthenticationController";


const authenticationController = new AuthenticationController();

const router = Router();


// CREATE
router.post("/", async (req, res) => {
    authenticationController.Create(req, res)
});

// READ ALL
router.get("/", async (req, res) => {
    authenticationController.ReadAll(req, res)
});

// READ ONE
router.get("/:id", async (req, res) => {
    authenticationController.ReadOne(req, res)
});

// UPDATE
router.put("/:id", async (req, res) => {
    authenticationController.Update(req, res)
})

// DELETE
router.delete("/:id", async (req, res) => {
    authenticationController.Delete(req, res)
})


export default router;