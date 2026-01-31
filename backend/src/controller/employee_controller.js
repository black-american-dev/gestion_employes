import db from "../db/config.js";

export const getCompanyEmployes = (req, res) => {
  const rows = db
    .prepare(`
      SELECT 
        company_employees.departement_id,
        departements.departement_nom,
        employee_id,
        cin,
        nom,
        prenom,
        telephone,
        cadre_actuel,
        nom_ville,
        status,
        hire_date
      FROM company_employees
      JOIN departements
        ON company_employees.departement_id = departements.id
    `)
    .all();

  res.status(200).json(rows);
};

export const getCompanyEmployeById = (req, res) => {
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
        nom_ville,
        status,
        hire_date,
        departement_nom
      FROM company_employees
      JOIN departements
        ON company_employees.departement_id = departements.id
      WHERE employee_id = ?
    `)
    .get(emp_id);

  const certificatesRows = db
    .prepare(`
  SELECT * FROM certificates
  WHERE employee_id = ? AND employee_scope = 'company'
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

export const getCompanyEmployeByName = (req, res) => {
  const { nom, prenom } = req.body;

  if (!nom && !prenom) {
    return res.status(400).json({
      message: "nom or prenom is required",
    });
  }

  const rows = db
    .prepare(`
      SELECT 
        employee_id,
        cin,
        nom,
        prenom,
        telephone,
        cadre_actuel,
        nom_ville,
        status,
        hire_date,
        departement_nom
      FROM company_employees
      JOIN departements 
        ON company_employees.departement_id = departements.id
      WHERE nom = ? OR prenom = ?
    `)
    .all(nom, prenom);

  if (rows.length === 0) {
    return res.status(404).json({
      message: "Employee not found",
    });
  }

  res.status(200).json(rows);
};

export const postCompanyEmploye = (req, res) => {
  const {
    employe_id,
    cin,
    nom,
    prenom,
    telephone,
    cadre_actuel,
    ville,
    departement,
    date_embauche,
    statut,
  } = req.body;

  if (
    !employe_id ||
    !cin ||
    !nom ||
    !prenom ||
    !telephone ||
    !cadre_actuel ||
    !ville ||
    !departement ||
    !date_embauche ||
    !statut
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const exists = db
    .prepare(
      "SELECT employee_id FROM company_employees WHERE employee_id = ? OR cin = ?"
    )
    .all(employe_id, cin);

  if (exists.length > 0) {
    return res.status(409).json({
      message: "Employee with this ID or CIN already exists",
    });
  }

  db.prepare(`
      INSERT INTO company_employees
      (employee_id, cin, nom, prenom, telephone, cadre_actuel, nom_ville, departement_id, hire_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
    employe_id,
    cin,
    nom,
    prenom,
    telephone,
    cadre_actuel,
    ville,
    departement,
    date_embauche,
    statut
  );

  res.status(201).json({ message: "Employee added successfully" });
};

export const deleteCompanyEmploye = (req, res) => {
  const { id } = req.params;

  const isExists = db
    .prepare("SELECT employee_id FROM company_employees WHERE employee_id = ?")
    .all(id);

  if (isExists.length <= 0) {
    return res.status(409).json({ message: "There is no employe with this id !" });
  }

  db.prepare("DELETE FROM company_employees WHERE employee_id = ?").run(id);

  res.status(200).json({ message: "the employe has been deleted successfuly" });
};
