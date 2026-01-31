import db from "../db/config.js";

export const getJudicialEmployes = (req, res) => {
  const rows = db
    .prepare(`
      SELECT 
        judicial_employees.judicial_entity_id,
        judicial_entities.entity_type,
        employee_id,
        cin,
        nom,
        prenom,
        telephone,
        cadre_actuel,
        department,
        nom_ville,
        status,
        hire_date
      FROM judicial_employees
      JOIN judicial_entities
        ON judicial_employees.judicial_entity_id = judicial_entities.id
    `)
    .all();

  res.status(200).json(rows);
};

export const getJudicialEmployeById = (req, res) => {
  const emp_id = req.params.id;

  const row = db
    .prepare(`
      SELECT 
        employee_id,
        cin,
        nom,
        prenom,
        telephone,
        cadre_actuel,
        department,
        nom_ville,
        status,
        hire_date,
        entity_type
      FROM judicial_employees 
      JOIN judicial_entities 
        ON judicial_employees.judicial_entity_id = judicial_entities.id 
      WHERE employee_id = ?
    `)
    .get(emp_id);

  const certificatesRows = db.prepare(`
  SELECT * FROM certificates
  WHERE employee_id = ? AND employee_scope = 'judicial'
  ORDER BY uploaded_at DESC
`).all(emp_id);


  if (!row) {
    return res
      .status(401)
      .json({ message: `employe with this ${emp_id} is not found` });
  }

  res.status(200).json({
    employee: row,
    certificates: certificatesRows,
  });
};

export const getJudicialEmployeByName = (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;

  const row = db
    .prepare(`
      SELECT 
        employee_id,
        cin,
        nom,
        prenom,
        telephone,
        cadre_actuel,
        department,
        nom_ville,
        status,
        hire_date,
        entity_type
      FROM judicial_employees 
      JOIN judicial_entities 
        ON judicial_employees.judicial_entity_id = judicial_entities.id 
      WHERE nom = ? OR prenom = ?
    `)
    .all(nom, prenom);

  if (row.length === 0) {
    return res.status(401).json({
      message: `post with this id : ${nom} or this name : ${prenom} is not found`,
    });
  }

  res.status(200).json(row);
};

export const postJudicialEmploye = (req, res) => {
  try {
    const {
      employe_id,
      cin,
      nom,
      prenom,
      telephone,
      cadre_actuel,
      judicial_entity_id,
      department,
      statut,
      date_embauche,
    } = req.body;

    if (
      employe_id == null ||
      !cin ||
      !nom ||
      !prenom ||
      !telephone ||
      !cadre_actuel ||
      judicial_entity_id == null ||
      !department ||
      !statut ||
      !date_embauche
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const dep = String(department).trim();
    const st = String(statut).trim();

    const allowedDepartments = ["النيابة العامة", "رئاسة"];
    if (!allowedDepartments.includes(dep)) {
      return res.status(400).json({
        message: "Invalid department",
        received: dep,
        allowed: allowedDepartments,
      });
    }

    const allowedStatus = ["active", "non active"];
    if (!allowedStatus.includes(st)) {
      return res.status(400).json({
        message: "Invalid statut",
        received: st,
        allowed: allowedStatus,
      });
    }

    const entityExists = db
      .prepare("SELECT id FROM judicial_entities WHERE id = ?")
      .get(judicial_entity_id);

    if (!entityExists) {
      return res.status(400).json({
        message: `judicial_entity_id ${judicial_entity_id} does not exist`,
      });
    }

    const exists = db
      .prepare(
        "SELECT employee_id FROM judicial_employees WHERE employee_id = ? OR cin = ?"
      )
      .get(employe_id, cin);

    if (exists) {
      return res.status(409).json({
        message: "Employee with this ID or CIN already exists",
      });
    }

    db.prepare(`
      INSERT INTO judicial_employees
      (employee_id, cin, nom, prenom, telephone, cadre_actuel, judicial_entity_id, department, status, hire_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      employe_id,
      cin,
      nom,
      prenom,
      telephone,
      cadre_actuel,
      judicial_entity_id,
      dep,  
      st,   
      date_embauche
    );

    return res.status(201).json({ message: "Employee added successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Insert failed",
      error: err.message,
    });
  }
};

export const deleteJudicialEmploye = (req, res) => {
  const { id } = req.params;

  const isExists = db
    .prepare("SELECT employee_id FROM judicial_employees WHERE employee_id = ?")
    .all(id);

  if (isExists.length <= 0) {
    return res.status(409).json({ message: "There is no employe with this id !" });
  }

  db.prepare("DELETE FROM judicial_employees WHERE employee_id = ?").run(id);

  res
    .status(200)
    .json({ message: "the employe has been deleted successfuly" });
};
