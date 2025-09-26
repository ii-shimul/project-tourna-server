# Tourna Server

A minimal Express + MySQL backend for managing users, teams, and tournaments.

## Stack
- Node.js (ESM), Express 5
- MySQL (via `mysql2/promise`)
- CORS, dotenv, bcrypt

## Setup
- Requirements: Node 18+, MySQL 8+.
- Create `.env` in the project root with:
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
  - `PORT` (optional, defaults to `3000`)
- Install dependencies: `npm install`
- Start locally: `node src/main.js`

Notes:
- CORS allows `http://localhost:5173` and `https://tourna-nine.vercel.app`.
- Uses ESM (`type: module`); Node 18+ recommended.

## API
Base URL: `http://localhost:<PORT>`

- GET `/` — Health check, returns a welcome JSON.
- POST `/signup` — Create user. Body: `{ name, email, password }`.
- POST `/login` — Login with `{ email, password }`.
- GET `/users` — List all users.

Teams
- POST `/teams` — Create team. Body: `{ owner_user_id, name, members: [] }`.
- GET `/teams?user_id=<id>` — List teams for a user.
- DELETE `/teams/:id` — Delete team by id.

Tournaments
- GET `/tournaments?userId=<id>` — List tournaments created by a user.
- GET `/tournaments/:id` — Get a tournament by id.
- POST `/tournaments` — Create tournament. Body supports `{ name, format?, start_date?, status?, created_by?, data_json? }`.
- PATCH `/tournaments/:id` — Update `{ status, data_json }`.
- DELETE `/tournaments/:id` — Delete by id.

## Database
Expected tables (simplified):
- `users(id, name, email, password_hash)`
- `teams(id, name, owner_user_id, members)` — `members` stored as JSON string.
- `tournaments(id, name, format, start_date, status, created_by, data_json)` — `data_json` stored as JSON string.

## Deployment
- Configured for Vercel (`vercel.json`) with `src/main.js` as the entry.

## File Structure
- `src/main.js` — App entry and routes wiring
- `src/db.js` — MySQL pool using `.env`
- `src/routes/*` — Route handlers (users, teams, tournaments)
- `src/middlewares/*` — Error and 404 handlers
