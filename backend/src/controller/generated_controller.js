import PDFDocument from "pdfkit";
import path from "path";
import db from "../db/config.js";
import { fileURLToPath } from "url";

export const generateAttestation = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const type = req.body.type;

    const [rows] = await db.query(
      "SELECT * FROM company_employees WHERE employee_id = ?",
      [employeeId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const emp = rows[0];

    const fullName = `${emp.nom} ${emp.prenom}`;
    const grade = emp.cadre_actuel;
    const employe_id = String(emp.employee_id);
    const cin = emp.cin;
    const date = new Date().toLocaleDateString("fr-FR");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "ATTESTATION DE TRAVAIL temp (1).jpg"
    );

    const fontPath = path.join(
      __dirname,
      "..",
      "fonts",
      "Amiri-Regular.ttf"
    );

    const fileName = `${employeeId}_attestation_${Date.now()}.pdf`;

    const doc = new PDFDocument({ size: "A4", margin: 0 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    // ✅ ONLY stream to response
    doc.pipe(res);

    doc.image(templatePath, 0, 0, { width: 595, height: 842 });
    doc.font(fontPath).fontSize(12);

    doc.text(fullName, 60, 375, { width: 180, align: "right" });
    doc.text(grade, 60, 405, { width: 180, align: "right" });
    doc.text(employe_id, 60, 435, { width: 180, align: "right" });
    doc.text(cin, 60, 465, { width: 180, align: "right" });
    doc.text(date, 205, 695, { width: 180, align: "right" });

    // ✅ INSERT INTO DB (independent of filesystem)
    await db.query(
      `
      INSERT INTO certificates 
      (certificate_type, file_name, employee_id)
      VALUES (?, ?, ?)
      `,
      [type, fileName, employeeId]
    );

    doc.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: "PDF generation failed" });
    }
  }
};
