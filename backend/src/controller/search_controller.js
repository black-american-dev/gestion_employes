import db from "../db/config.js";

export const globalSearch = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Search query required" });
  }

  // 🔹 COMPANY EMPLOYEES
  const [company] = await db.query(
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
    `,
    [query, `%${query}%`, `%${query}%`]
  );

  // 🔹 JUDICIAL EMPLOYEES
  const [judicial] = await db.query(
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
    `,
    [query, `%${query}%`, `%${query}%`]
  );

  res.status(200).json({
    total: company.length + judicial.length,
    company,
    judicial,
  });
};
