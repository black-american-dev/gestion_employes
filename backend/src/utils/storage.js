import fs from 'fs'
import path from 'path'

// Base uploads directory (from Electron)
const baseUploads = process.env.UPLOADS_DIR

if (!baseUploads) {
  throw new Error('UPLOADS_DIR is not defined. Did Electron start first?')
}

export function getAnnualAbsencesDir() {
  const dir = path.join(baseUploads, 'annual_absences')

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  return dir
}


export function getCertificatesDir() {
  const dir = path.join(baseUploads, "certificates");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}