import express from "express";
import cors from "cors";
import { createUser, getUsers } from "./routes/users.js";

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

// create a new user
app.post("/users", createUser);

// fetch all users
app.get("/users", getUsers);

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
