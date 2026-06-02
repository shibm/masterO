# Employee Task Tracker

Full-stack assessment project built from the requirements in `Fullstack Skill Assessment Project.docx`.

## Tech Stack

- Backend: Node.js, Express, MySQL, JWT, bcrypt
- Frontend: React, Vite, React Router
- Extras: Dockerized backend setup, activity logs, filtering, pagination, role-based route protection

## Features Covered

### Backend

- `POST /auth/register` to create users with hashed passwords
- `POST /auth/login` to return a JWT token and user profile
- `GET /users` for admin-only employee listing
- `POST /tasks` for admin-only task creation
- `GET /tasks` with SQL `JOIN`, filtering, and pagination
- `GET /tasks/:id` for task details
- `PUT /tasks/:id` for admin edits and employee status updates
- `GET /users/:id/tasks` for employee-specific tasks
- JWT authentication middleware
- Role-based authorization middleware
- Clean folder structure with `routes`, `controllers`, `services`, `models`, `middleware`, `utils`
- Error handling with consistent JSON responses

### Frontend

- Login page with role-based redirects
- Admin dashboard
- Employee list
- Task creation form
- Task table with assigned user, status, and due date
- Task editing
- Employee dashboard with assigned task view
- Employee-only status progression from `pending` -> `in_progress` -> `completed`
- Route protection in React
- Filters and pagination

## Project Structure

```text
masterO/
  backend/
  frontend/
  postman_collection.json
```

## Setup

### 1. Database

Create a MySQL database by running:

```sql
SOURCE backend/sql/schema.sql;
```

The schema file seeds:

- `admin@example.com` / `Password@123`
- `alice@example.com` / `Password@123`
- `bob@example.com` / `Password@123`

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Default backend URL: `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

Set `VITE_API_URL` if the API is not running on port `5000`.

## Docker Option

For the optional dockerized backend setup:

```bash
cd backend
docker compose up --build
```

This starts MySQL and the backend service together.

## API Notes

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Users

- `GET /users` admin only
- `GET /users/:id/tasks` admin or the same employee

### Tasks

- `POST /tasks` admin only
- `GET /tasks`
  - Query params: `status`, `dueDate`, `page`, `limit`
- `GET /tasks/:id`
- `PUT /tasks/:id`

Employee updates only allow status progression:

- `pending` -> `in_progress`
- `in_progress` -> `completed`

## Deliverables Included

- Backend source code
- Frontend source code
- SQL schema dump: [backend/sql/schema.sql](/Users/hydear/Documents/masterO/backend/sql/schema.sql)
- README with setup instructions
- Postman collection: [postman_collection.json](/Users/hydear/Documents/masterO/postman_collection.json)

## Notes

- Passwords are hashed with `bcryptjs`.
- JWT payload includes `id`, `name`, `email`, and `role`.
- Activity logs are stored in `activity_logs` as a bonus feature.
