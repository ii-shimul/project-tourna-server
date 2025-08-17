import pool from "../db.js";
import bcrypt from "bcrypt";

export async function createUser(req, res) {
	try {
		const { name, email, password } = req.body;

		// Validate input
		if (!name || !email || !password) {
			return res.status(400).json({
				success: false,
				error: "Name, email and password are required",
			});
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Insert new user into database
		const [result] = await pool.execute(
			"INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
			[name, email, hashedPassword]
		);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			data: {
				id: result.insertId,
				name,
				email,
			},
		});
	} catch (error) {
		console.error("Error creating user:", error);

		// Handle duplicate email error
		if (error.code === "ER_DUP_ENTRY") {
			return res.status(409).json({
				success: false,
				error: "Email already exists",
			});
		}

		res.status(500).json({
			success: false,
			error: "Failed to create user",
		});
	}
}

export async function getUsers(req, res) {
	try {
		const [rows] = await pool.execute("SELECT * FROM users");
		res.json({ success: true, data: rows });
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ success: false, error: "Failed to fetch users" });
	}
}
