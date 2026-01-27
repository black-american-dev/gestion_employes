import PDFDocument from "pdfkit";
import path from "path";
import db from "../db/config.js";
import { fileURLToPath } from "url";

export const generateAttestationConge = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const {
      type,
      duty,
      subtitueEmployee,
      startDate,
      endDate,
    } = req.body;

    const currentYear = new Date().getFullYear();

    const [rows] = await db.query(
      "SELECT * FROM company_employees WHERE employee_id = ?",
      [employeeId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const emp = rows[0];

    const fullName = `${emp.nom} ${emp.prenom}`;
    const cadre = emp.cadre_actuel || "";
    const telephone = emp.telephone || "";
    const employe_id = String(emp.employee_id);
    const cin = emp.cin || "";
    const date = new Date().toLocaleDateString("fr-FR");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // ✅ DEFINE TEMPLATE + FONT (change filenames to your real conge template)
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "ATTESTATION DE CONGE (2).png" // <-- put the real file name here
    );

    const fontPath = path.join(
      __dirname,
      "..",
      "fonts",
      "Amiri-Regular.ttf"
    );

    const fileName = `${employeeId}_attestation_DE_CONGE_${Date.now()}.pdf`;

    const doc = new PDFDocument({ size: "A4", margin: 0 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // ✅ ONLY stream to response (avoid write-after-end)
    doc.pipe(res);

    // If PDFKit errors, just end response (don’t send JSON after stream)
    doc.on("error", (e) => {
      console.error("PDFKit error:", e);
      try { res.end(); } catch (_) {}
    });

    // ---------- DRAW ----------
    doc.image(templatePath, 0, 0, { width: 595, height: 842 });
    doc.font(fontPath).fontSize(12);

    const columnWidth = 180;

    doc.text(fullName, 250, 165, { width: columnWidth, align: "right" });
    doc.text(cadre, 250, 190, { width: columnWidth, align: "right" });
    doc.text(employe_id, 250, 210, { width: columnWidth, align: "right" });

    doc.text(duty || "", 210, 250, { width: columnWidth, align: "right" });
    doc.text(telephone, 240, 295, { width: columnWidth, align: "right" });

    doc.text(subtitueEmployee || "", 50, 310, { width: columnWidth, align: "right" });

    doc.text(startDate || "", 250, 395, { width: columnWidth, align: "right" });
    doc.text(endDate || "", 120, 395, { width: columnWidth, align: "right" });

    doc.text(String(currentYear), 300, 375, { width: columnWidth, align: "right" });

    doc.text(date, 205, 695, { width: 180, align: "right" });

    // ✅ INSERT BEFORE ending (like working controller)
    await db.query(
      `INSERT INTO certificates (certificate_type, file_name, employee_id)
       VALUES (?, ?, ?)`,
      [type, fileName, employeeId]
    );

    doc.end();
  } catch (error) {
    console.error(error);

    // ✅ if stream already started, don't write JSON
    if (!res.headersSent) {
      res.status(500).json({ message: "PDF generation failed", error: error.message });
    } else {
      try { res.end(); } catch (_) {}
    }
  }
};
