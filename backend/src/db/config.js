import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "nozomi.proxy.rlwy.net",
  user: "root",
  password: "CLosJAvWzkzzoGwDPjPgSWwgItQtWXkM",
  database: "hr_system",
  port: 36644,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default db;
