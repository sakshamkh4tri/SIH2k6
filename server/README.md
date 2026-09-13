# ProjectPulse Express API

Run `npm run server` from the project root. The API runs at `http://localhost:4000` by default and persists development data in `server/data/db.json` (created automatically on first start).

Use the seeded account to log in:

- Email: `admin@projectpulse.local`
- Password: `ChangeMe123!`

Set `JWT_SECRET` in `.env` before deployment. Send the login token as `Authorization: Bearer <token>` to protected endpoints.

Main API groups: `/api/auth`, `/api/dashboard`, `/api/projects`, `/api/alerts`, `/api/risk-radar`, and `/api/assistant/query`. See `index.js` for payload details.
