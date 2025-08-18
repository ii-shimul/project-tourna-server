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

		console.log("Connection params:", {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			database: process.env.DB_NAME,
		});

		// Insert new user into database
		const [result] = await pool.execute(
			"INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
			[name, email, hashedPassword]
		);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			data: {
				name,
				email,
				hashedPassword,
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

export async function userLogin(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				error: "Email and password are required",
			});
		}

		const [rows] = await pool.execute(
			"SELECT name, password FROM users WHERE email = ?",
			[email]
		);
		const hashedPassword = rows.length > 0 ? rows[0].password : null;

		const name = rows.length > 0 ? rows[0].name : null;
		const isPasswordValid = await bcrypt.compare(password, hashedPassword);
		if (isPasswordValid) {
			return res.status(200).json({
				success: true,
				message: "Login successful",
				data: {
					name,
					email,
					hashedPassword,
				},
			});
		} else {
			return res.status(401).json({
				success: false,
				error: "Invalid credentials",
			});
		}
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({
			success: false,
			error: "Failed to process login",
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
