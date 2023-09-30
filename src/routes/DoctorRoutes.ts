import { Router } from "express";
import DoctorController from "../controllers/DoctorController";


const doctorController = new DoctorController();

const router = Router();


// CREATE
router.post('/', async (req, res) => {
    doctorController.Create(req, res)
});

// BULK CREATE
router.post('/bulk-create', async (req, res) => {
    doctorController.BulkCreate(req, res)
})

// READ ALL
router.get('/', async (req, res) => {
    doctorController.ReadAll(req, res)
});

// READ ONE
router.get('/:id', async (req, res) => {
    doctorController.ReadOne(req, res)
});

// UPDATE
router.put('/', async (req, res) => {
    doctorController.Update(req, res)
})

// DELETE
router.delete('/', async (req, res) => {
    doctorController.Delete(req, res)
})

// EXTRACT DOCTOR FROM XLSX
router.post('/extract-xlsx', async (req, res) => {
    doctorController.ExtractData(req, res)
})


export default router;