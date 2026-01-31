import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import db from "../db/config.js";
import { fileURLToPath } from "url";
import { PassThrough } from "stream";

export const generateJudicialAttestation = (req, res) => {
  try {
    const employeeId = req.params.id;
    const type = req.body.type;

    const emp = db.prepare(`
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
      WHERE employee_id = ?
    `).get(employeeId);

    if (!emp) return res.status(404).json({ message: "Employee not found" });

    const fullName = `${emp.nom} ${emp.prenom}`;
    const grade = emp.cadre_actuel;
    const employe_id = String(emp.employee_id);
    const cin = emp.cin;
    const date = new Date().toLocaleDateString("fr-FR");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(__dirname, "..", "templates", "ATTESTATION DE TRAVAIL temp (1).jpg");
    const fontPath = path.join(__dirname, "..", "fonts", "Amiri-Regular.ttf");

    const fileName = `${employeeId}_judicial_attestation_${Date.now()}.pdf`;
    const generatedDir = path.join(__dirname, "..", "generated");
    const filePath = path.join(generatedDir, fileName);

    if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const doc = new PDFDocument({ size: "A4", margin: 0 });

    const fileStream = fs.createWriteStream(filePath);
    const tee = new PassThrough();

    fileStream.on("finish", () => {
      try {
        db.prepare(`
          INSERT INTO certificates (certificate_type, file_name, employee_id)
          VALUES (?, ?, ?)
        `).run(type, fileName, employeeId);
      } catch (e) {
        console.error("DB insert failed:", e.message);
      }
    });

    fileStream.on("error", (e) => console.error("fileStream error:", e.message));
    res.on("error", (e) => console.error("res error:", e.message));

    doc.pipe(tee);
    tee.pipe(res);
    tee.pipe(fileStream);

    doc.image(templatePath, 0, 0, { width: 595, height: 842 });
    doc.font(fontPath).fontSize(12);

    doc.text(fullName, 60, 375, { width: 180, align: "right" });
    doc.text(grade, 60, 405, { width: 180, align: "right" });
    doc.text(employe_id, 60, 435, { width: 180, align: "right" });
    doc.text(cin, 60, 465, { width: 180, align: "right" });
    doc.text(date, 205, 695, { width: 180, align: "right" });

    doc.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
};
