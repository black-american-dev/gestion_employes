import XLSX from "xlsx";
import db from "../db/config.js";

export const importAnnualAbsence = async (req, res) => {
  const { year } = req.body;

  if (!year) {
    return res.status(400).json({ message: "Year is required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Excel file is required" });
  }

  try {
    // 1️⃣ Prevent duplicate year
    const [existing] = await db.query(
      "SELECT id FROM annual_absence_imports WHERE year = ?",
      [year]
    );

    if (existing.length) {
      return res.status(409).json({
        message: "This year is already imported"
      });
    }

    // 2️⃣ Save import history
    const [importResult] = await db.query(
      `INSERT INTO annual_absence_imports (year, file_name)
       VALUES (?, ?)`,
      [year, req.file.filename]
    );

    const importId = importResult.insertId;

    // 3️⃣ Read Excel
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // 4️⃣ Insert rows
    for (const row of rows) {
      await db.query(
        `INSERT INTO annual_absences (
          import_id,
          year,
          employee_id,
          cin,
          cadre_actuel,
          nom,
          prenom,
          departement
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          importId,
          year,
          row.employee_id,
          row.cin,
          row.cadre_actuel,
          row.nom,
          row.prenom,
          row.departement
        ]
      );
    }

    res.json({
      message: "Annual absence imported successfully",
      year,
      totalRows: rows.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Import failed",
      error: error.message
    });
  }
};


export const getAnnualAbsent = async (req,res) => {
   const [rows] = await db.query(`
    SELECT *
    FROM annual_absences
  `)
    res.status(200).json(rows)
}
