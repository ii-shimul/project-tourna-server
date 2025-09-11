import pool from "../db.js";

export async function getTournaments(req, res) {
	try {
		const {userId} = req.query;
		const result = await pool.execute(
			"SELECT * FROM tournaments WHERE created_by = ?",
			[userId]
		);
		res.status(200).json({
			success: true,
			tournaments: result[0],
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: "Failed to fetch tournaments",
		});
	}
}

export async function createTournament(req, res) {
	try {
		const { name, format, start_date, status, created_by, data_json } =
			req.body;
		let dataJsonString;
		if (data_json && typeof data_json === "object") {
			dataJsonString = JSON.stringify(data_json);
		} else {
			dataJsonString = JSON.stringify({
				teams: [],
				matches: [],
			});
		}
		const [result] = await pool.execute(
			"INSERT INTO tournaments (name, format, start_date, status, created_by, data_json) VALUES (?, ?, ?, ?, ?, ?)",
			[
				name,
				format || "single_elimination",
				start_date || new Date().toISOString().split("T")[0],
				status || "upcoming",
				created_by || null,
				dataJsonString,
			]
		);

		res.status(201).json({
			success: true,
			message: "Tournament created successfully",
			data: {
				id: result.insertId,
				name,
				format: format || "single_elimination",
				status: status || "upcoming",
				teams_count: data_json?.teams?.length || 0,
			},
		});
	} catch (error) {
		console.error("Error creating tournament:", error);
		res.status(500).json({
			success: false,
			error: `Failed to create tournament: ${error.code || error.message}`,
		});
	}
}

export async function getTournamentById(req, res) {
	try {
		const { id } = req.params;

		const tournament = await pool.execute(
			"SELECT * FROM tournaments WHERE id = ?",
			[id]
		);

		res.status(200).json({
			success: true,
			tournament: tournament[0],
		});
	} catch (error) {
		console.error("Error fetching tournament:", error);
		res.status(500).json({
			success: false,
			error: `Failed to fetch tournament: ${error.code || error.message}`,
		});
	}
}

export async function updateTournament(req, res) {
	try {
		const { id } = req.params;
		const { status, data_json } = req.body;

		// Convert data_json to string if it's an object
		let dataJsonString;
		if (typeof data_json === "object") {
			dataJsonString = JSON.stringify(data_json);
		} else {
			dataJsonString = data_json;
		}

		// Execute update
		const [result] = await pool.execute(
			`UPDATE tournaments SET status = ?, data_json = ? WHERE id = ?`,
			[status, dataJsonString, id]
		);

		res.status(200).json({
			success: true,
			message: "Tournament updated successfully",
		});
	} catch (error) {
		console.error("Error updating tournament:", error);
		res.status(500).json({
			success: false,
			error: `Failed to update tournament: ${error.code || error.message}`,
		});
	}
}

export async function deleteTournament(req, res) {
	try {
		const { id } = req.params;

		// Delete the tournament
		await pool.execute("DELETE FROM tournaments WHERE id = ?", [id]);

		res.status(200).json({
			success: true,
			message: "Tournament deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting tournament:", error);
		res.status(500).json({
			success: false,
			error: `Failed to delete tournament: ${error.code || error.message}`,
		});
	}
}
