import express from "express";
import cors from "cors";
import { createUser, getUsers, userLogin } from "./routes/users.js";
import notFound from "./middlewares/notFound.js";
import Error from "./middlewares/Error.js";
import { createTeam, deleteTeam, getTeams } from "./routes/teams.js";
import {
	createTournament,
	deleteTournament,
	getTournamentById,
	getTournaments,
	updateTournament,
} from "./routes/tournament.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
	cors({
		origin: ["http://localhost:5173", "https://tourna-nine.vercel.app"],
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to the Express server!" });
});

app.post("/signup", createUser);

app.post("/login", userLogin);

app.get("/users", getUsers);

app.post("/teams", createTeam);

app.get("/teams", getTeams);

app.delete("/teams/:id", deleteTeam);

app.get("/tournaments", getTournaments);

app.get("/tournaments/:id", getTournamentById);

app.post("/tournaments", createTournament);

app.delete("/tournaments/:id", deleteTournament);

app.patch("/tournaments/:id", updateTournament);

// Error handling middleware
app.use(Error);

// 404 handler
app.use(notFound);

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
