# ProjectPulse — React + Tailwind

Desktop-first React implementation inspired by the four supplied Stitch screens.

## Included screens

- Dashboard
- Projects portfolio
- Project detail for P104 / Pune Metro Line 4
- Operational Risk Radar
- Alerts & Escalations
- AI Operational Assistant

## Run

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Vercel deployment

Deploy this repository as one Vercel project **with this folder as the Root
Directory**. The included `api/[...path].js` function serves the Express API at
`/api`; `vercel.json` routes API requests to that function before the React SPA
fallback. In Vercel → Settings → Environment Variables, set a strong
`JWT_SECRET`. For persistent production data, also set `DATABASE_MODE=mongodb`
and provide `MONGODB_URI` (and optionally `MONGODB_DB_NAME`). Do not set
`VITE_API_URL` for this single-deployment setup.

After deploying, open `/api/health`. It must return JSON such as
`{"status":"ok", ...}` before attempting to sign in. If it does not, Vercel
is deploying a different root directory or an older commit.

## Backend-ready structure

The UI currently uses local mock data in `src/App.jsx`. Replace the `projects` array and action handlers with API calls later. Recommended next step:

- `src/api/projects.js`
- `src/api/alerts.js`
- `src/api/telemetry.js`
- `src/api/assistant.js`

Keep the present component props and replace mock values with server responses.
