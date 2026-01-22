import db from "../db/config.js"

export const getJudicialEmployes = async (req,res)=>{
     const [rows] = await db.query(`
   SELECT 
      judicial_employees.judicial_entity_id,
      judicial_entities.entity_type,
      employee_id,
      cin,
      nom,
      prenom,
      cadre_actuel,
      department,
      nom_ville,
      status,
      hire_date
    FROM judicial_employees
    JOIN judicial_entities
      ON judicial_employees.judicial_entity_id = judicial_entities.id
  `)
    res.status(200).json(rows)
}
export const getJudicialEmployeById = async (req,res)=>{
    const emp_id = req.params.id
    
    const [row] = await db.query(`
      SELECT employee_id,cin,nom,prenom,cadre_actuel,department,nom_ville,status,hire_date,entity_type FROM judicial_employees 
      join judicial_entities on judicial_employees.judicial_entity_id = judicial_entities.id WHERE employee_id = ?
      `,[emp_id])
    const [certificatesRows] = await db.query("SELECT * FROM certificates where employee_id = ?",[emp_id])
    if(row.length === 0) {
        return res.status(401).json({message: `employe with this ${emp_id} is not found`})
    }
    res.status(200).json({
    employee: row[0],
    certificates: certificatesRows,
  })
}
export const getJudicialEmployeByName = async (req,res)=>{
    const nom = req.body.nom
    const prenom = req.body.prenom

    const [row] = await db.query(`
      SELECT employee_id,cin,nom,prenom,cadre_actuel,department,nom_ville,status,hire_date,entity_type FROM judicial_employees 
      join judicial_entities on judicial_employees.judicial_entity_id = judicial_entities.id WHERE nom = ? or prenom = ?
      `,[nom,prenom])
    if(row.length === 0) {
        return res.status(401).json({message: `post with this id : ${nom} or this name : ${prenom} is not found`})
    }
    res.status(200).json(row)
}
export const postJudicialEmploye = async (req, res) => {
  const {
    employe_id,
    cin,
    nom,
    prenom,
    cadre_actuel,
    judicial_entity_id,   
    department,    
    statut,
    date_embauche
  } = req.body;

  if (!employe_id || !cin || !nom || !prenom || !cadre_actuel || !judicial_entity_id || !department || !statut || !date_embauche ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const [exists] = await db.query(
    "SELECT employee_id FROM judicial_employees WHERE employee_id = ? OR cin = ?",
    [employe_id, cin]
  );

  if (exists.length > 0) {
    return res.status(409).json({
      message: "Employee with this ID or CIN already exists",
    });
  }

  await db.query(
    `INSERT INTO judicial_employees 
    (employee_id, cin, nom, prenom, cadre_actuel, judicial_entity_id, department, status, hire_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employe_id,
      cin,
      nom,
      prenom,
      cadre_actuel,
      judicial_entity_id,   
      department,    
      statut,
      date_embauche
    ]
  );


  res.status(201).json({ message: "Employee added successfully" });
};

export const deleteJudicialEmploye = async (req,res)=> {
  const {id} = req.params
  const [isExists] = await db.query("SELECT employee_id FROM judicial_employees WHERE employee_id = ?", [id])

  if (isExists.length <= 0) {
    return res.status(409).json({message: "There is no employe with this id !"})
  }
  await db.query("DELETE FROM judicial_employees WHERE employee_id = ?", [id])
  res.status(200).json({message: "the employe has been deleted successfuly"})
} 
