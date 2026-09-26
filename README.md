# Task Management System

A full-stack task management application where users can register, log in, and manage their own tasks. Built for the Earnest Data Analytics Full Stack Developer assignment.

## Features

- User registration and JWT-based login
- Refresh token sessions with rotation (persistent login across page reloads)
- Task CRUD: create, read, update, delete
- Mark tasks as completed or pending
- Filter tasks by status (All, Pending, Completed)
- Responsive UI for mobile and desktop
- User-scoped data isolation (each user sees only their tasks)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand |
| Backend | NestJS 10, TypeScript, TypeORM |
| Database | PostgreSQL |
| Auth | JWT access + refresh tokens, bcrypt password hashing |

## Prerequisites

- **Node.js 20+**
- **PostgreSQL 14+** (local install or hosted via Neon/Supabase)
- **npm**

## Local Setup (No Docker)

### 1. Clone and install dependencies

```bash
cd "Project Management Platform"

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env` with your PostgreSQL connection details and strong JWT secrets.

**Important:** Use a fresh database (e.g. `task_management_db`). If you previously ran the old project-management schema, create a new database to avoid conflicts.

```sql
CREATE DATABASE task_management_db;
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

Backend runs at `http://localhost:3001`. TypeORM auto-syncs the schema in development.

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:3000`.

### 5. Create a test user

Open `http://localhost:3000/register` and sign up with any email and password (minimum 8 characters).

Or via curl:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register `{ email, password }` |
| POST | `/api/auth/login` | Login, returns access + refresh tokens |
| POST | `/api/auth/refresh` | Rotate tokens `{ refreshToken }` |
| POST | `/api/auth/logout` | Invalidate refresh token (JWT required) |
| GET | `/api/auth/me` | Current user profile (JWT required) |

### Tasks (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks?status=&search=` | List user's tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/complete` | Toggle completed status |
| DELETE | `/api/tasks/:id` | Delete task |

## Deployment

### Frontend → Vercel

1. Import the `frontend/` directory as a Vercel project
2. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
3. Deploy

### Backend → Render or Railway

1. Create a Node web service pointing to `backend/`
2. Build command: `npm install && npm run build`
3. Start command: `npm run start`
4. Set environment variables from `backend/.env.example`
5. Set `NODE_ENV=production` and use `DATABASE_URL` from Neon

### Database → Neon or Supabase

1. Create a PostgreSQL project
2. Copy the connection string into backend `DATABASE_URL`
3. Schema sync runs on first deploy (or run migrations manually for production)

## Running Tests

```bash
cd backend
npm test
```

Tests cover auth register/login, refresh token rotation, task CRUD, and user isolation.

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── auth/          # JWT auth + refresh tokens
│   │   ├── users/         # User module
│   │   ├── tasks/         # Task CRUD API
│   │   ├── entities/      # User + Task entities
│   │   ├── common/        # Exception filters
│   │   ├── main.ts
│   │   └── app.module.ts
│   └── .env.example
├── frontend/
│   ├── src/app/           # login, register, dashboard
│   ├── src/lib/api.ts     # API client with refresh retry
│   ├── src/store/         # Zustand auth store
│   └── .env.example
└── README.md
```

## License

UNLICENSED — assignment submission project.
