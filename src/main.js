import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to the Express server!" });
});

// fetch all users
app.get("/users", async (req, res) => {
	try {
		const [rows] = await pool.execute("SELECT * FROM users");
		res.json({ success: true, data: rows });
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ success: false, error: "Failed to fetch users" });
	}
});

// create a new user
app.post("/users", async (req, res) => {
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
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		error: "Something went wrong!",
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		success: false,
		error: "Route not found",
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
