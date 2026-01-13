import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host : "localhost",
    user : "root",
    password: "Habib2006",
    database: "hr_system"
})

export default pool;