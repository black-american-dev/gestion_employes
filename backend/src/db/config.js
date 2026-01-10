import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host : "localhost",
    user : "root",
    password: "Habib2006",
    database: "entreprise_principale_db"
})

export default pool;