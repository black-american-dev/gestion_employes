import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import db from "../db/config.js";
import { getAnnualAbsencesDir } from "../utils/storage.js";

export const importAnnualAbsence = (req, res) => {
  const { year } = req.body;

  if (!year) {
    return res.status(400).json({ message: "Year is required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Excel file is required" });
  }

  try {
    const annualDir = getAnnualAbsencesDir();
    const filePath = path.join(annualDir, req.file.filename);

    const importResult = db
      .prepare(
        `INSERT INTO annual_absence_imports (year, file_name)
         VALUES (?, ?)`
      )
      .run(year, req.file.filename);

    const importId = importResult.lastInsertRowid;

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const insertStmt = db.prepare(
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    for (const row of rows) {
      insertStmt.run(
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
      );
    }

    res.json({
      message: "Annual absence imported successfully",
      year,
      totalRows: rows.length,
    });

    console.log("multer saved:", req.file.path);
    console.log("controller reads:", filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Import failed",
      error: error.message,
    });
  }
};

export const getAnnualAbsent = (req, res) => {
  const rows = db
    .prepare(`
      SELECT *
      FROM annual_absences
    `)
    .all();

  res.status(200).json(rows);
};

export const updateAnnualAbsenceCell = (req, res) => {
  const { id } = req.params;
  const { field, value } = req.body;

  const allowedFields = [
    "cin",
    "nom",
    "prenom",
    "fullName",
    "cadre_actuel",
    "departement",
    "situation",
  ];

  if (!allowedFields.includes(field)) {
    return res.status(400).json({ message: "Invalid field" });
  }

  try {
    db.prepare(`UPDATE annual_absences SET ${field} = ? WHERE id = ?`).run(
      value,
      id
    );

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportAnnualAbsencesToExcel = (req, res) => {
  const { year } = req.query;

  try {
    let query = "SELECT * FROM annual_absences";
    const params = [];

    if (year) {
      query += " WHERE year = ?";
      params.push(year);
    }

    const rows = db.prepare(query).all(...params);

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

export const getAnnualAbsenceYears = (req, res) => {
  try {
    const rows = db
      .prepare(`
        SELECT DISTINCT year
        FROM annual_absences
        ORDER BY year DESC
      `)
      .all();

    const years = rows.map((r) => r.year);

    res.json(years);
  } catch (error) {
    console.error("Error fetching years:", error);
    res.status(500).json({ message: "Failed to fetch years" });
  }
};