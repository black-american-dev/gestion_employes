import express from "express"
import {getCompanyEmployes,
    getCompanyEmployeByName,
    getCompanyEmployeById,
    postCompanyEmploye,
    deleteCompanyEmploye} 
    from "../controller/employee_controller.js"
import {getJudicialEmployes,
    getJudicialEmployeByName,
    getJudicialEmployeById,
    postJudicialEmploye,
    deleteJudicialEmploye} 
    from "../controller/judicialEmployees_controller.js"
import { generateAttestation } from "../controller/generated_controller.js"
import { importAnnualAbsence } from "../controller/annualAbsence_controller.js"
import uploadExcel from "../middelwares/uploadExcel.js"


const router = express.Router()
// companyEmployes :
router.get("/companyEmployes", getCompanyEmployes)
router.get("/companyEmploye/:id", getCompanyEmployeById)
router.post("/companyEmployeByName", getCompanyEmployeByName)
router.post("/companyEmploye", postCompanyEmploye)
router.delete("/companyEmploye/:id", deleteCompanyEmploye)
//  judicialEmployees :
router.get("/judicialEmployees", getJudicialEmployes)
router.get("/judicialEmploye/:id", getJudicialEmployeById)
router.post("/judicialEmployeByName", getJudicialEmployeByName)
router.post("/judicialEmploye", postJudicialEmploye)
router.delete("/judicialEmploye/:id" , deleteJudicialEmploye)
// pdf generated :
router.post("/generate/:id" , generateAttestation)
// annual absences :
router.post("/annual-absence/import", uploadExcel.single("file"), importAnnualAbsence)

export default router;