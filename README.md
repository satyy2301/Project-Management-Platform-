# Project Management Platform

A modern, full-stack project management application built with **Next.js**, **NestJS**, **PostgreSQL**, and **Docker**. Features role-based access control (RBAC), dark theme, and intuitive team management.

## 🌟 Features

- **Authentication & Authorization**
  - JWT-based authentication with secure password hashing (bcryptjs)
  - Role-based access control (Admin, Member roles)
  - Persistent authentication via secure cookies
  - Protected routes and API endpoints

- **Project Management**
  - Create, read, update, and delete projects
  - Role-based permissions (Owners, Developers, Viewers)
  - Project filtering (All Projects, Created by Me, Assigned to Me)
  - Team member assignment and role management
  - Member lookup by email with dropdown selector

- **User Interface**
  - Modern dark theme with Tailwind CSS
  - Responsive design for desktop, tablet, and mobile
  - Smooth transitions and hover effects
  - Emoji indicators for roles and status
  - User-friendly error and success messaging

- **Developer Experience**
  - Full TypeScript support (both frontend and backend)
  - Docker containerization for easy deployment
  - Comprehensive API documentation via code
  - Clean, modular code structure
  - Database migrations via TypeORM

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.2 with App Router and Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **HTTP Client**: Custom API helper with JWT auth
- **Runtime**: Node.js 20

### Backend
- **Framework**: NestJS 10.3.0
- **Language**: TypeScript
- **Database**: PostgreSQL 15 with TypeORM
- **Authentication**: JWT (@nestjs/jwt)
- **Password Hashing**: bcryptjs
- **Validation**: Class validators
- **CORS**: Enabled for frontend communication

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15 Alpine
- **Networks**: Custom Docker network for service communication

## 📋 Prerequisites

- Docker Desktop (includes Docker and Docker Compose)
- Git (for version control)
- No local Node.js installation needed (runs in containers)

## 🚀 Quick Start

### 1. Clone/Setup the Project
```bash
cd "Project Management Platform"
```

### 2. Environment Configuration

Create/verify `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_DEFAULT_CLIENT_ID=96f410d6-bfc1-422b-8d77-676362966a1b
```

Create/verify `.env` file in the backend directory:
```env
DB_HOST=project_management_db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=project_management_db
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
```

### 3. Start Services

```bash
# Start all services (PostgreSQL, Backend API, Frontend)
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001/api
# PostgreSQL: localhost:5432
```

### 4. Initial Access

**Demo Account** (auto-created on first run):
- Email: `admin@example.com`
- Password: `password123`
- Role: `admin`

Or create a new account using the registration page.

### 5. Stop Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (careful - removes database!)
docker-compose down -v
```

## 📂 Project Structure

```
Project Management Platform/
├── frontend/                          # Next.js application
│   ├── src/
│   │   ├── app/                      # App Router pages
│   │   │   ├── layout.tsx            # Root layout with auth init
│   │   │   ├── globals.css           # Dark theme styles
│   │   │   ├── page.tsx              # Home redirect
│   │   │   ├── login/page.tsx        # Login page
│   │   │   ├── register/page.tsx     # Registration page
│   │   │   ├── dashboard/page.tsx    # Project dashboard
│   │   │   └── projects/[id]/page.tsx # Project details
│   │   ├── store/
│   │   │   └── authStore.ts          # Zustand auth state
│   │   └── lib/
│   │       └── api.ts                # Centralized API client
│   ├── public/                       # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── .env.local                    # Frontend env vars
│   └── Dockerfile
│
├── backend/                           # NestJS application
│   ├── src/
│   │   ├── main.ts                   # Application entry point
│   │   ├── app.module.ts             # Root module
│   │   ├── auth/                     # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── users/                    # Users module
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── user.entity.ts
│   │   ├── projects/                 # Projects module
│   │   │   ├── project.controller.ts
│   │   │   ├── project.service.ts
│   │   │   ├── project.entity.ts
│   │   │   ├── project-user.entity.ts
│   │   │   └── role.guard.ts         # RBAC enforcement
│   │   ├── clients/                  # Clients module
│   │   │   ├── client.entity.ts
│   │   │   ├── client.service.ts
│   │   │   └── client.controller.ts
│   │   └── database/                 # Database configuration
│   │       └── database.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                          # Backend env vars
│   └── Dockerfile
│
├── docker-compose.yml                # Service orchestration
├── README.md                          # This file
└── .gitignore
```

## 🔐 Authentication & Authorization

### Authentication Flow
1. User registers/logs in via `/register` or `/login`
2. Backend validates credentials and issues JWT token
3. Token stored in secure HTTP-only cookie
4. Zustand store persists auth state in memory
5. Protected routes redirect to login if not authenticated

### Role-Based Access Control (RBAC)
- **Admin**: Full system access, can manage all projects and users
- **Member**: Can create projects, manage team members in owned projects
- **Viewer** (Project role): Read-only access to assigned projects
- **Developer** (Project role): Can edit project content and manage members
- **Owner** (Project role): Full control over assigned project

### Protected Endpoints
All API endpoints require JWT authentication except:
- `POST /api/auth/register` - Registration
- `POST /api/auth/login` - Login

## 🎨 Dark Theme

The application uses a professional dark color scheme:
- **Primary Background**: `#0f172a` (Slate-900)
- **Secondary Background**: `#1e293b` (Slate-800)
- **Borders**: `#334155` (Slate-700)
- **Text**: `#f1f5f9` (Slate-50)
- **Accent**: `#3b82f6` (Blue-500)

All colors configured in `frontend/src/app/globals.css` using CSS variables.

## 📊 Database Schema

### Entities

**Client**
- `id` (UUID, Primary Key)
- `name` (String)
- `created_at` (Timestamp)

**User**
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (Enum: admin, member)
- `client_id` (UUID, Foreign Key → Client)
- `created_at` (Timestamp)

**Project**
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text, Optional)
- `client_id` (UUID, Foreign Key → Client)
- `created_at` (Timestamp)

**ProjectUser** (Join Table)
- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key → Project)
- `user_id` (UUID, Foreign Key → User)
- `role` (Enum: owner, developer, viewer)
- `created_at` (Timestamp)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users/by-email/:email` - Lookup user by email (Protected)

### Projects
- `GET /api/projects` - List projects (Protected)
- `POST /api/projects` - Create project (Protected)
- `GET /api/projects/:id` - Get project details (Protected)
- `PUT /api/projects/:id` - Update project (Protected, Owner/Admin)
- `DELETE /api/projects/:id` - Delete project (Protected, Owner/Admin)

### Project Members
- `GET /api/projects/:id/users` - List project members (Protected)
- `POST /api/projects/:id/users` - Add team member (Protected, Owner/Admin)
- `PUT /api/projects/:id/users/:userId` - Update member role (Protected, Owner/Admin)
- `DELETE /api/projects/:id/users/:userId` - Remove member (Protected, Owner/Admin)

## 🐛 Troubleshooting

### Application won't start
```bash
# Check container status
docker ps -a

# View logs
docker logs project_management_frontend
docker logs project_management_backend
docker logs project_management_db

# Restart services
docker-compose restart
```

### Database connection errors
```bash
# Check if database is ready
docker logs project_management_db

# Verify network connectivity
docker network ls
docker network inspect projectmanagementplatform_default
```

### Port already in use
```bash
# Change ports in docker-compose.yml or kill existing process
# Frontend: 3000, Backend: 3001, Database: 5432

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Clear all data and restart fresh
```bash
docker-compose down -v
docker-compose up --build
```

## 🚢 Deployment Notes

### Production Checklist
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for your domain
- [ ] Use a managed PostgreSQL database
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Use a reverse proxy (nginx, CloudFlare)
- [ ] Enable rate limiting on API endpoints

### Docker Production Build
```bash
# Build optimized images
docker-compose -f docker-compose.yml build --no-cache

# Push to registry
docker tag projectmanagementplatform-frontend:latest your-registry/frontend:latest
docker push your-registry/frontend:latest
```

## 📝 Additional Notes

### Code Quality
- ✅ Full TypeScript strict mode enabled
- ✅ Clean separation of concerns (Frontend/Backend)
- ✅ Modular architecture with feature-based folders
- ✅ Comprehensive error handling
- ✅ Input validation on both frontend and backend
- ✅ CORS configured for cross-origin requests

### Security Features
- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ HTTP-only secure cookies
- ✅ RBAC guards on backend endpoints
- ✅ SQL injection prevention via TypeORM
- ✅ XSS protection via React sanitization

### Performance Optimizations
- ✅ Next.js App Router with Turbopack for fast builds
- ✅ Lazy loading of components
- ✅ Optimized images and assets
- ✅ Database indexing on frequently queried fields
- ✅ Connection pooling for database
- ✅ API response caching where appropriate

### Development Features
- ✅ Hot module reloading (both frontend and backend)
- ✅ Detailed error messages and logging
- ✅ TypeScript strict mode for type safety
- ✅ Docker Compose for easy local development
- ✅ Responsive design testing on multiple devices

## 📞 Support & Contact

For issues or questions:
1. Check the troubleshooting section
2. Review the project structure and code comments
3. Check Docker logs for errors
4. Verify environment variables are set correctly

## 📄 License

This project is provided as-is for educational and commercial use.
