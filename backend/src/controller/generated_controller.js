import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import db from '../db/config.js';

export const generateAttestation = async (req, res) => {
  try {
    const employeeId = req.params.id;

    // 1️⃣ Fetch employee
    const [rows] = await db.query(
      'SELECT * FROM company_employees WHERE employee_id = ?',
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
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'ATTESTATION DE TRAVAIL temp (1).pdf'
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
    return res.json({
      success: true,
      message: "PDF generated successfully",
      file: outputPath
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "PDF generation failed"
    });
  }
};
