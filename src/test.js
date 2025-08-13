// src/routes/tournaments.js
import express from "express";
import { pool } from "./db.js";
const app = express();

// List tournaments
app.get("/", async (req, res, next) => {
	try {
		const [rows] = await pool.execute(
			"SELECT id, name, type, start_date, status FROM tournaments ORDER BY start_date DESC"
		);
		res.json(rows);
	} catch (err) {
		next(err);
	}
});

// Create tournament (example)
app.post("/", async (req, res, next) => {
	try {
		const { name, type, start_date, created_by } = req.body;
		const [result] = await pool.execute(
			"INSERT INTO tournaments (name, type, start_date, created_by) VALUES (?, ?, ?, ?)",
			[name, type, start_date, created_by]
		);
		res.status(201).json({ id: result.insertId });
	} catch (err) {
		next(err);
	}
});

export default app;
