import { Router } from "express";
import AuthenticationController from "../controllers/AuthenticationController";
import JWT from "../authentication/JWT";


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
router.put("/", async (req, res) => {
    authenticationController.Update(req, res)
})

// DELETE
router.delete("/:id", async (req, res) => {
    authenticationController.Delete(req, res)
})

// LOGIN
router.post('/login', async (req, res) => {
    JWT.Login(req, res)
})

export default router;