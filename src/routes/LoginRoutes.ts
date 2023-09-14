import { Router } from "express";

const router = Router();

router.post('/', async (req, res, next) => { })

router.get('/check-session', (req, res, next) => {
    if (req.session.user) res.status(200).json({ auth: true })
    else res.status(400).json({ auth: false })
})


export default router;