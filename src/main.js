import express from "express";
import cors from "cors";
import { createUser, getUsers, userLogin } from "./routes/users.js";
import notFound from "./middlewares/notFound.js";
import Error from "./middlewares/Error.js";

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

app.post("/signup", createUser);

app.post("/login", userLogin);

app.get("/users", getUsers);

// Error handling middleware
app.use(Error);

// 404 handler
app.use(notFound);

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
