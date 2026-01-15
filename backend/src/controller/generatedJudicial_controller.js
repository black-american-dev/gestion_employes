import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import db from '../db/config.js';

import { fileURLToPath } from "url";

export const generateJudicialAttestation = async (req, res) => {
  try {
    const employeeId = req.params.id;

    // 1️⃣ Fetch employee
    const [rows] = await db.query(
      `
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
  WHERE employee_id = ?`,
      [employeeId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    const emp = rows[0];

    // 2️⃣ Load PDF template
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ SAFE, RELATIVE, ELECTRON-PROOF
const templatePath = path.join(
  __dirname,
  "..",
  "templates",
  "ATTESTATION DE TRAVAIL temp (1).pdf"
);


    const pdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // 3️⃣ Fill PDF fields (MUST MATCH DOCFLY)
    form.getTextField('fullName')
      .setText(`${emp.nom} ${emp.prenom}`);

    form.getTextField('grade')
      .setText(emp.nom_ville);

    form.getTextField('employe_id')
      .setText(String(emp.employee_id));

    form.getTextField('cin')
      .setText(emp.cin);

    form.getTextField('date')
      .setText(new Date().toLocaleDateString('fr-FR'));

    // 4️⃣ Flatten (VERY IMPORTANT)
    form.flatten();

    // 5️⃣ Save PDF
    const outputPdf = await pdfDoc.save();

    const outputPath = path.join(
      process.cwd(),
      'src',
      'generated',
      `${employeeId}_attestation.pdf`
    );

    fs.writeFileSync(outputPath, outputPdf);

    // 6️⃣ RESPOND TO CLIENT
    res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `attachment; filename="${employeeId}_attestation.pdf"`
);

return res.send(outputPdf);


  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "PDF generation failed"
    });
  }
};