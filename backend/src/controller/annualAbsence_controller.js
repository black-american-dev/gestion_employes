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
    const [importResult] = await db.query(
      `INSERT INTO annual_absence_imports (year, file_name)
       VALUES (?, ?)`,
      [year, req.file.filename]
    );

    const importId = importResult.insertId;

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

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
          fullName,
          departement,
          situation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          importId,
          year,
          row.employee_id,
          row.cin,
          row.cadre_actuel,
          row.nom,
          row.prenom,
          row.fullName,
          row.departement,
          row.situation
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

export const updateAnnualAbsenceCell = async (req, res) => {
  const { id } = req.params;
  const { field, value } = req.body;

  const allowedFields = [
    "cin",
    "nom",
    "prenom",
    "fullName",
    "cadre_actuel",
    "departement",
    "situation"
  ];

  if (!allowedFields.includes(field)) {
    return res.status(400).json({ message: "Invalid field" });
  }

  try {
    await db.query(
      `UPDATE annual_absences SET ${field} = ? WHERE id = ?`,
      [value, id]
    );
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const exportAnnualAbsencesToExcel = async (req, res) => {
  const { year } = req.query;

  try {
    let query = "SELECT * FROM annual_absences";
    let params = [];

    if (year) {
      query += " WHERE year = ?";
      params.push(year);
    }

    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No data to export" });
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AnnualAbsences");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=annual_absences_${year || "all"}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);

  } catch (error) {
    console.error("EXPORT ERROR:", error);
    res.status(500).json({ message: "Export failed", error: error.message });
  }
};
