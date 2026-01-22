import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import db from "../db/config.js";
import { fileURLToPath } from "url";

export const generateAttestationConge = async (req, res) => {
  try {
    const employeeId = req.params.id
    const type = req.body.type
    const duty = req.body.duty
    const subtitueEmployee = req.body.subtitueEmployee
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const currentYear = new Date().getFullYear()

    const [rows] = await db.query(
        "SELECT * FROM company_employees WHERE employee_id = ?",
      [employeeId]
    )

    if (!rows.length) {
      return res.status(404).json({ message: "Employee not found" })
    }

    const emp = rows[0]

    const fullName = `${emp.nom} ${emp.prenom}`

    const grade = emp.cadre_actuel
    const employe_id = String(emp.employee_id)
    const cin = emp.cin
    const date = new Date().toLocaleDateString("fr-FR")

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "ATTESTATION DE CONGE (2).png"
    )

    const fontPath = path.join(
      __dirname,
      "..",
      "fonts",
      "Amiri-Regular.ttf"
    )

    const fileName = `${employeeId}_attestation_DE_CONGE_${Date.now()}.pdf`
    const generatedDir = path.join(__dirname, "..", "generated")
    const filePath = path.join(generatedDir, fileName)

    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true })
    }

    const doc = new PDFDocument({ size: "A4", margin: 0 })

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    )

    const fileStream = fs.createWriteStream(filePath);
    doc.pipe(fileStream)
    doc.pipe(res)

    doc.image(templatePath, 0, 0, { width: 595, height: 842 });
    doc.font(fontPath).fontSize(12)
const rightColumnX = 60
const columnWidth = 180


doc.text(fullName, 250, 165, {
  width: columnWidth,
  align: "right",
})

doc.text(grade, 250, 190, {
  width: columnWidth,
  align: "right",
})

doc.text(employe_id, 250, 210, {
  width: columnWidth,
  align: "right",
})


doc.text(duty, 210, 250, {
  width: columnWidth,
  align: "right",
})

doc.text(cin, 240, 295, {
  width: columnWidth,
  align: "right",
})

doc.text(subtitueEmployee, 50, 310, {
  width: columnWidth,
  align: "right",
})

doc.text(startDate, 250, 395, {
  width: columnWidth,
  align: "right",
})

doc.text(endDate, 120, 395, {
  width: columnWidth,
  align: "right",
})

doc.text(String(currentYear), 300, 375, {
  width: columnWidth,
  align: "right",
})


doc.text(date, 205, 695, {
  width: 180,
  align: "right",
})
    doc.end()


    fileStream.on("finish", async () => {
      await db.query(
        `
        INSERT INTO certificates 
        (certificate_type, file_name, employee_id)
        VALUES (?, ?, ?)
        `,
        [type, fileName, employeeId]
      )
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "PDF generation failed" })
  }
};
