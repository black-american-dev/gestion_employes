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
export const postEmploye = async (req, res) => {
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
    "SELECT employee_id FROM employes WHERE employee_id = ? OR cin = ?",
    [employe_id, cin]
  );

  if (exists.length > 0) {
    return res.status(409).json({
      message: "Employee with this ID or CIN already exists",
    });
  }

  await db.query(
    `INSERT INTO employes 
     (employee_id, cin, nom, prenom, nom_ville, id_departement, date_embauche, statut)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [employe_id, cin, nom, prenom, ville, departement, date_embauche, statut]
  );

  res.status(201).json({ message: "Employee added successfully" });
};
