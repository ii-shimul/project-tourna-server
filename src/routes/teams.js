import pool from "../db.js";

export async function createTeam(req, res) {
	try {
		const { owner_user_id, name, members } = req.body;

		if (!name || !owner_user_id || !members || !members.length) {
			return res.status(400).json({
				success: false,
				error: "Name, owner_user_id and members are required",
			});
		}

		const membersJSON = JSON.stringify(members);

		const result = await pool.execute(
			"INSERT INTO teams (name, owner_user_id, members) VALUES (?, ?, ?)",
			[name, owner_user_id, membersJSON]
		);
		res.status(201).json({
			success: true,
			message: "Team created successfully",
		});
	} catch (error) {
		console.error("Error creating team:", error);
		res.status(500).json({
			success: false,
			error: `Failed to create team: ${error.code || error.message}`,
		});
	}
}

export async function getTeams(req, res) {
	try {
		const { user_id } = req.query;
		const result = await pool.execute(
			"SELECT * FROM teams WHERE owner_user_id = ?",
			[user_id]
		);
		res.status(201).json({
			success: true,
			teams: result[0],
		});
	} catch (error) {
		console.log("Error fetching teams:", error);
		res.status(500).json({
			success: false,
			error: `Failed to fetch teams: ${error.code || error.message}`,
		});
	}
}

export async function deleteTeam(req, res) {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({
				success: false,
				error: "Team id is required",
			});
		}
		const result = await pool.execute("DELETE FROM teams WHERE id = ?", [id]);
		res.status(201).json({
			success: true,
			message: "Team deleted",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: `Failed to delete the team: ${error.code || error.message}`,
		});
	}
}
