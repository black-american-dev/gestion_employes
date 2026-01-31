// backend/src/init/init.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function initSqliteSchema(db) {
  const devSchemaPath = path.join(__dirname, "..", "db", "shema.sql");

  const assetsDir = process.env.ASSETS_DIR;
  const prodSchemaPath = assetsDir
    ? path.join(assetsDir, "db", "shema.sql")
    : null;

  const schemaPath =
    prodSchemaPath && fs.existsSync(prodSchemaPath)
      ? prodSchemaPath
      : devSchemaPath;

  if (!fs.existsSync(schemaPath)) {
    throw new Error(
      `Schema file not found. Tried: ${prodSchemaPath || ""} and ${devSchemaPath}`
    );
  }

  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  db.exec(schemaSql);
}
