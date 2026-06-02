# Employee Task Tracker

Full-stack task tracking app with a React frontend and a Node.js/Express backend backed by local MariaDB.

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express, JWT, bcryptjs
- Database: MariaDB using `mysql2`

## Project Structure

```text
masterO/
  backend/
  frontend/
  postman_collection.json
```

## Seeded Users

After importing the schema, these users are available:

- `admin@example.com` / `Password@123`
- `alice@example.com` / `Password@123`
- `bob@example.com` / `Password@123`

## Run The App

### 1. Start MariaDB and import the schema

Create the database and tables from [schema.sql](/Users/hydear/Documents/masterO/backend/sql/schema.sql):

```bash
mysql -u root -p < backend/sql/schema.sql
```

This creates the `employee_task_tracker` database and seeds sample data.

### 2. Run the backend

Backend env is already configured in [backend/.env](/Users/hydear/Documents/masterO/backend/.env) for:

- host: `localhost`
- port: `3306`
- database: `employee_task_tracker`
- app port: `5001`

Start it with:

```bash
cd backend
npm install
npm run dev
```

You can also run:

```bash
npm start
```

Health check:

```bash
curl http://localhost:5001/health
```

Expected response:

```json
{"status":"ok"}
```

If `5001` is already in use, run the backend on another port:

```bash
PORT=5002 npm run dev
```

### 3. Run the frontend

The frontend expects the backend at `http://localhost:5001` by default.

Start it with:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Vite will print the local URL, typically:

```text
http://localhost:5173
```

If your backend is running on a different port, update `VITE_API_URL` in `frontend/.env`.

## Postman

Import [postman_collection.json](/Users/hydear/Documents/masterO/postman_collection.json) into Postman.

Default collection variables:

- `baseUrl`: `http://localhost:5001`
- `token`: set this after login
- `userId`: sample employee ID
- `taskId`: sample task ID

Recommended flow:

1. Run `Login` with `admin@example.com`.
2. Copy the JWT from the response into the `token` collection variable.
3. Call `Get All Users`, `Create Task`, or other protected routes.

## API Summary

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Users

- `GET /users`
- `POST /users`
- `GET /users/:id/tasks`

### Tasks

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PUT /tasks/:id`

Supported task query params:

- `status`
- `dueDate`
- `page`
- `limit`

## Notes

- Admins can create new users directly from the admin dashboard UI.
- Employee task status flow is `pending` -> `in_progress` -> `completed`.
- Activity logs are stored in `activity_logs`.
- The frontend stores the JWT in local storage after login.
