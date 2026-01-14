import db from "../db/config.js"

export const getCompanyEmployes = async (req,res)=>{
    const [rows] = await db.query(`
    SELECT 
      company_employees.departement_id,
      departements.departement_nom,
      employee_id,
      cin,
      nom,
      prenom,
      cadre_actuel,
      nom_ville,
      status,
      hire_date
    FROM company_employees
    JOIN departements
      ON company_employees.departement_id = departements.id
  `)
    res.status(200).json(rows)
}
export const getCompanyEmployeById = async (req,res)=>{
    const emp_id = req.params.id
    
    const [row] = await db.query(`
      SELECT employee_id,cin,nom,prenom,cadre_actuel,nom_ville,status,hire_date,departement_nom FROM company_employees 
      join departements on company_employees.departement_id = departements.id WHERE employee_id = ?
      `,[emp_id])
    if(row.length === 0) {
        return res.status(401).json({message: `employe with this ${emp_id} is not found`})
    }
    res.status(200).json(row)
}
export const getCompanyEmployeByName = async (req,res)=>{
    const nom = req.body.nom
    const prenom = req.body.prenom
  
    
    const [row] = await db.query(`
      SELECT employee_id,cin,nom,prenom,cadre_actuel,nom_ville,status,hire_date,departement_nom FROM company_employees 
      join departements on company_employees.departement_id = departements.id WHERE nom = ? or prenom = ?
      `,[nom,prenom])
    if(row.length === 0) {
        return res.status(401).json({message: `post with this this name : ${nom} or this prenom : ${prenom} is not found`})
    }
    res.status(200).json(row)
}
export const postCompanyEmploye = async (req, res) => {
  const {
    employe_id,
    cin,
    nom,
    prenom,
    ville,
    departement,
    date_embauche,
    statut,
  } = req.body;

  if (!employe_id || !cin || !nom || !prenom || !ville || !departement || !date_embauche || !statut) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const [exists] = await db.query(
    "SELECT employee_id FROM company_employees WHERE employee_id = ? OR cin = ?",
    [employe_id, cin]
  );

  if (exists.length > 0) {
    return res.status(409).json({
      message: "Employee with this ID or CIN already exists",
    });
  }

  await db.query(
  `INSERT INTO company_employees 
    (employee_id, cin, nom, prenom, nom_ville, departement_id, hire_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [employe_id, cin, nom, prenom, ville, departement, date_embauche, statut]
  );


  res.status(201).json({ message: "Employee added successfully" });
};
export const deleteCompanyEmploye = async (req,res)=> {
  const {id} = req.params
  const [isExists] = await db.query("SELECT employee_id FROM company_employees WHERE employee_id = ?", [id])

  if (isExists.length <= 0) {
    return res.status(409).json({message: "There is no employe with this id !"})
  }
  await db.query("DELETE FROM company_employees WHERE employee_id = ?", [id])
  res.status(200).json({message: "the employe has been deleted successfuly"})
} 