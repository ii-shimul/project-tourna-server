import pool from '../db.js';

export async function createUser(req, res) {
	try {
		const { name, email } = req.body;

		// Validate input
		if (!name || !email) {
			return res.status(400).json({
				success: false,
				error: "Name and email are required",
			});
		}

		// Insert new user into database
		const [result] = await pool.execute(
			"INSERT INTO users (name, email) VALUES (?, ?)",
			[name, email]
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
