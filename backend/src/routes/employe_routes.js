import express from "express"
import {getEmployes,getEmployeByName,getEmployeById,postEmploye} from "../controller/employee_controller.js"


const router = express.Router()

router.get("/employes", getEmployes)
router.get("/employe/:id", getEmployeById)
router.post("/employeByName", getEmployeByName)
router.post("/employe", postEmploye)

export default router;