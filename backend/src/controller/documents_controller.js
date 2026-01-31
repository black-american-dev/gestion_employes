import db from "../db/config.js";

export const getDocuments = (req, res) => {
  const rows = db.prepare(`
  SELECT c.*,
         COALESCE(ce.nom, je.nom) AS nom,
         COALESCE(ce.prenom, je.prenom) AS prenom,
         COALESCE(ce.cin, je.cin) AS cin,
         c.employee_scope
  FROM certificates c
  LEFT JOIN company_employees ce
    ON c.employee_scope = 'company' AND c.employee_id = ce.employee_id
  LEFT JOIN judicial_employees je
    ON c.employee_scope = 'judicial' AND c.employee_id = je.employee_id
  ORDER BY c.uploaded_at DESC
`).all();


  res.status(200).json(rows);
};
