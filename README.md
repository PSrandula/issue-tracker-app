# Issue Tracker Application

A full-stack Issue Tracker application built using React (Vite), Express.js, and MongoDB.
The system allows users to create, manage, update, and track issues efficiently.

## Features
- User Registration & Login (JWT Authentication)
- Create, Read, Update, Delete Issues
- Issue Status & Priority Badges
- Search & Filter Issues
- Pagination
- Secure Password Hashing
- RESTful API

## Tech Stack
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Authentication: JWT

## Installation

Quick start

1. Backend

- Open `backend/.env` and ensure `MONGO_URI` is set (Atlas connection string or local MongoDB).
- From `backend` folder:

cd backend
npm install
npm start

Server runs on `http://localhost:5000` by default.

2. Frontend

- By default the project can run in mock mode. To use the real backend, create or edit `frontend/.env` and set:

VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api

- From `frontend` folder:

cd frontend
npm install
npm run dev

3. Auth / API

- Register and Login endpoints live at `/api/auth/register` and `/api/auth/login`.
- Issue endpoints are at `/api/issues` and require a Bearer token.

Notes

- The frontend will attach the JWT from `localStorage` automatically.
- To run the frontend in mock mode, set `VITE_USE_MOCK=true` or remove the `.env` entry.

If you want, I can run the servers locally (installing deps) and verify the end-to-end flow next.
