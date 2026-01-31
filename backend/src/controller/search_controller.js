import db from "../db/config.js";

export const globalSearch = (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Search query required" });
  }

  // 🔹 COMPANY EMPLOYEES
  const company = db
    .prepare(
      `
      SELECT 
        employee_id,
        cin,
        nom,
        prenom,
        cadre_actuel,
        nom_ville AS location,
        'company' AS source
      FROM company_employees
      WHERE employee_id = ? 
         OR nom LIKE ? 
         OR prenom LIKE ?
      `
    )
    .all(query, `%${query}%`, `%${query}%`);

  // 🔹 JUDICIAL EMPLOYEES
  const judicial = db
    .prepare(
      `
      SELECT 
        employee_id,
        cin,
        nom,
        prenom,
        cadre_actuel,
        department AS location,
        'judicial' AS source
      FROM judicial_employees
      WHERE employee_id = ? 
         OR nom LIKE ? 
         OR prenom LIKE ?
      `
    )
    .all(query, `%${query}%`, `%${query}%`);

  res.status(200).json({
    total: company.length + judicial.length,
    company,
    judicial,
  });
};