import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';


const pool = mysql.createPool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT || 3306),
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	ssl: { rejectUnauthorized: true },
});

export default pool;