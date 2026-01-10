import db from "../db/config.js"

export const getEmployes = async (req,res)=>{
    const[rows]= await db.query("SELECT * FROM employes")
    res.status(200).json(rows)
}
export const getEmployeById = async (req,res)=>{
    const emp_id = req.params.id
    
    const [row] = await db.query("SELECT * FROM employes WHERE employee_id = ?",[emp_id])
    if(row.length === 0) {
        return res.status(401).json({message: `employe with this ${emp_id} is not found`})
    }
    res.status(200).json(row)
}
export const getEmployeByName = async (req,res)=>{
    const emp_id = req.body.employe_id
    const name = req.body.name
    
    const [row] = await db.query("SELECT * FROM employes WHERE employee_id = ? OR nom = ?",[emp_id,name])
    if(row.length === 0) {
        return res.status(401).json({message: `post with this id : ${emp_id} or this name : ${name} is not found`})
    }
    res.status(200).json(row)
}