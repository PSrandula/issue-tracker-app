# Issue Tracker — Local Setup

This repo contains a simple Issue Tracker with a React + Vite frontend and Express backend (MongoDB).

Quick start

1. Backend

- Open `backend/.env` and ensure `MONGO_URI` is set (Atlas connection string or local MongoDB).
- From `backend` folder:

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000` by default.

2. Frontend

- By default the project can run in mock mode. To use the real backend, create or edit `frontend/.env` and set:

```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api
```

- From `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

3. Auth / API

- Register and Login endpoints live at `/api/auth/register` and `/api/auth/login`.
- Issue endpoints are at `/api/issues` and require a Bearer token.

Notes

- The frontend will attach the JWT from `localStorage` automatically.
- To run the frontend in mock mode, set `VITE_USE_MOCK=true` or remove the `.env` entry.

If you want, I can run the servers locally (installing deps) and verify the end-to-end flow next.
