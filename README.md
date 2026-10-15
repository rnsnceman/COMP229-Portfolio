# Yuri Koller Portfolio — Assignment 2

React/Vite portfolio with an Express REST API, MongoDB/Mongoose models, CRUD endpoints, and JWT authentication.

## Requirements

- Node.js 18 or later
- MongoDB locally or a MongoDB Atlas connection string

## Setup

1. Create a MongoDB database named `Portfolio`. MongoDB creates the four collections on the first insert: `contacts`, `projects`, `qualifications`, and `users`.
2. Copy `.env.example` to `.env`, then set `MONGODB_URI` and replace `JWT_SECRET` with a random secret. Keep `.env` private.
3. Install dependencies from the project root: `npm install`.
4. Start the frontend and backend together: `npm run dev`.
5. Open the Vite URL, normally `http://localhost:5173`. The API runs at `http://localhost:5000`; its root displays the portfolio welcome message.

The contact form posts to the API. To use a different API host, set `VITE_API_URL` in `.env` (for example, `http://localhost:5000`).

## API routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET / POST | `/api/contacts` | List / create contacts (POST accepts firstname, lastname, email, and optional phone/message) |
| GET / PUT / DELETE | `/api/contacts/:id` | Read / update / delete one contact |
| DELETE | `/api/contacts` | Delete all contacts |
| GET / POST | `/api/projects` | List / create projects |
| GET / PUT / DELETE | `/api/projects/:id` | Read / update / delete one project |
| DELETE | `/api/projects` | Delete all projects |
| GET / POST | `/api/qualifications` | List / create qualifications |
| GET / PUT / DELETE | `/api/qualifications/:id` | Read / update / delete one qualification |
| DELETE | `/api/qualifications` | Delete all qualifications |
| POST | `/api/auth/signup` or `/api/users` | Create an account and sign in |
| POST | `/api/auth/signin` | Sign in; returns a JWT and sets an HTTP-only cookie |
| POST | `/api/auth/signout` | Clear the authentication cookie |
| GET | `/api/auth/me` | Get current signed-in account |
| GET | `/api/users` | List users (passwords are never returned) |
| GET / PUT / DELETE | `/api/users/:id` | Read / update / delete your own account |
| DELETE | `/api/users` | Disabled to prevent accidental account deletion |

Project and qualification fields: `title`, `firstname`, `lastname`, `email`, `completion` (date), `description`. User fields: `name`, `email`, `password`, `created`, `updated`.

### Authentication

For browser clients, the API sets an HTTP-only cookie. For Postman or other clients, use the `token` from signup/signin as `Authorization: Bearer <token>`. Protected requests include `/api/auth/me` and `/api/users`. Passwords are hashed with bcrypt before storage. The contact create endpoint and portfolio read endpoints remain available without an account.

## Testing examples

```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/contacts -H 'Content-Type: application/json' \\
  -d '{"firstname":"Yuri","lastname":"Koller","email":"yuri@example.com","message":"Hello"}'
```

Sign up with `POST /api/auth/signup` and JSON `{ "name": "Yuri Koller", "email": "yuri@example.com", "password": "a-strong-password" }`. Then add `Authorization: Bearer <token>` to protected API requests. `PUT` requests accept JSON fields to update.
