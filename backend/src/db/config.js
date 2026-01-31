import Database from "better-sqlite3";
import path from "path";

const dbDir = process.env.DATABASE_DIR || process.cwd();
const dbPath = path.join(dbDir, "hr_system.db");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

export default db;
