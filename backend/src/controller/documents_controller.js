import db from "../db/config.js"

export const getDocuments = async (req,res)=>{
    const [rows] = await db.query(`
  SELECT * FROM certificates 
  join company_employees on certificates.employee_id = company_employees.employee_id`)
    res.status(200).json(rows)
}