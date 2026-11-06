# COMP229 Portfolio — Assignment 3

Yuri Koller's full-stack portfolio uses React, Express, MongoDB/Mongoose and JWT authentication. Projects and education are loaded from MongoDB. Admins can create, read, update and delete projects, qualifications and contacts. Signed-in users can read records.

Repository: https://github.com/rnsnceman/COMP229-Portfolio

## Run locally

Use Node.js 22.12+ (or 24+) and MongoDB Community Server or a MongoDB Atlas connection.

```bash
npm ci
cp .env.example .env
```

Edit `.env`: set `MONGODB_URI` to your MongoDB connection string and replace `JWT_SECRET` with a random secret of at least 32 characters. Set `ADMIN_PASSWORD` to a password of your choice with at least 8 characters. You can generate one with `openssl rand -hex 32`. Start your local MongoDB service if using the default URI.

```bash
npm run seed
npm run dev
```

Open http://localhost:5173. Vite forwards `/api` requests to Express on port 5000. If MongoDB is unavailable, the backend reports the connection error rather than pretending records were saved.

For a single Express process serving the built frontend:

```bash
npm run build
npm start
```

Open http://localhost:5000. Direct links such as `/projects` and `/manage` also work.

The existing Vercel configuration serves the frontend only. To use a separate API host, configure `VITE_API_URL` before building the frontend and `CLIENT_ORIGIN` on the backend. For the assignment, use the local same-origin setup above so session cookies work without cross-site hosting changes.

## Accounts and roles

Run `npm run seed` once against your configured database. It creates the fixed assignment admin identity and role, with your chosen password stored as a bcrypt hash in MongoDB:

- Email: `admin@portfolio.local`
- Password: the `ADMIN_PASSWORD` you set in your local `.env` file

The role and admin identity are defined by the seed script; the password stays in the ignored local environment file. No admin password is committed to GitHub.

Sign up at `/signup` to create a regular User account. The server always assigns `user`, even if a request supplies `role: admin`. Users see read-only records at `/manage`; admins see forms and edit/delete controls. Refreshing the page restores the session through `/api/auth/me`.

The seeder is additive: it does not delete records or reset existing passwords. Existing portfolio descriptions, project links and images are retained. Project completion dates use December 31 of their existing display year because the original cards did not specify exact days; edit these dates if exact completion dates are needed. Certificate dates without a known year/month are left blank. Centennial's April 2028 date is an expected completion date.

## Demonstrate the assignment

1. Open Projects and Education to view records fetched from the API.
2. Sign up, inspect the User badge and read-only workspace, then sign out.
3. Sign in as the seeded admin. In Projects, add a record, refresh to confirm it remains, edit it, and delete it using the confirmation.
4. Repeat the CRUD flow in Education.
5. Submit the public Contact form. In the admin workspace, select Contacts to read, edit and delete the saved submission. The admin can also add a contact directly.
6. Sign out and open `/manage` to confirm the redirect to sign-in.

The public contact form intentionally allows visitors and users to submit inquiries. Apart from this necessary exception, resource creation, updates and deletion require Admin. Contact records require sign-in to read; this assignment gives all signed-in users read access as specified by its role rubric.

## API routes

All routes use the `/api` prefix. Cookie authentication is used by the React app; Bearer JWTs are also supported for API testing.

| Method | Route | Permission |
| --- | --- | --- |
| POST | `/auth/signup` | Public; always creates a User |
| POST | `/auth/signin` | Public |
| GET or POST | `/auth/signout` | Clears cookie and invalidates the account's issued JWTs |
| GET | `/auth/me` | Signed in |
| GET | `/projects`, `/projects/:id` | Public read |
| GET | `/qualifications`, `/qualifications/:id` | Public read |
| GET | `/contacts`, `/contacts/:id` | User or Admin |
| POST | `/projects`, `/qualifications` | Admin |
| POST | `/contacts` | Public contact submission or Admin form |
| PUT | `/{resource}/:id` | Admin |
| DELETE | `/{resource}/:id` or `/{resource}` | Admin |

`resource` is `projects`, `qualifications` or `contacts`. The UI deletes one record at a time with confirmation. Invalid input returns 400, missing/expired authentication returns 401, insufficient role returns 403, missing records return 404 and duplicate emails return 409.

## State and security

React Context holds the current account. Controlled form state tracks values, submission progress, errors and successful saves. The management list updates only after API success. Public lists fetch MongoDB records on page navigation. HttpOnly cookies hold one-day JWTs. The server loads the account and role from MongoDB for protected requests; sign-out increments a token version so old JWTs cannot be reused. Passwords are hashed with bcrypt. Resource updates use an allowlist of schema fields.

## Verification

```bash
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

`npm test` runs 11 integration tests against a real, disposable MongoDB 7.0.14 instance. Browser tests exercise signup/signin/signout, role restrictions, all three CRUD interfaces, refresh persistence, contact submission, validation, and mobile navigation. They generate screenshot evidence in `../evidence`. Tests use separate temporary databases and do not connect to or erase your configured application database. The first test run downloads a MongoDB binary; browser testing also requires Playwright's Chromium download. Stop any server occupying port 5000 before browser tests.

## Submit

Submit the project ZIP, the GitHub repository link and the separate Word document of application snapshots. The ZIP excludes dependencies, build output, environment secrets and Git history. Run `npm ci` after extracting it.
