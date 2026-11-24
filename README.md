# Yuri Koller COMP229 Portfolio

Assignment 4 extends the Assignment 3 React/Express/MongoDB portfolio with component unit tests, AI-assisted Cypress E2E tests and video recording, performance improvements, Render deployment configuration and GitHub Actions CI.

## Local setup

Use Node.js 24. Run `npm ci`, copy `.env.example` to `.env`, and configure your MongoDB URI, a JWT secret of at least 32 characters, and an admin password of at least eight characters. Generate a secret with `openssl rand -hex 32` and keep it only in your ignored `.env` or the cloud service's secret settings.

```bash
npm run seed
npm run dev
```

Open the Vite URL printed in Terminal (normally http://localhost:5173). The backend defaults to **5001**, avoiding macOS AirPlay's port 5000. Keep `PORT=5001` in `.env`; Vite proxies `/api` to 127.0.0.1:5001. Keep `VITE_API_URL` empty for the same-origin setup.

Admin email: `admin@portfolio.local`. Its password is the `ADMIN_PASSWORD` used when the seed script first creates it. Rerunning the seed does not reset existing passwords. New signups are always Users. Users can read portfolio records; Admins can manage them. Public contact submission is intentionally available to visitors.

## Tests and recording

```bash
npm run build
npm run test:unit
npm run test:api
npx cypress install
npm run test:cypress
npm run test:performance
```

- Unit tests: `tests/unit/Contact.test.jsx` and `tests/unit/ResourceList.test.jsx` (Vitest and React Testing Library).
- API tests: `tests/api.test.js` against disposable MongoDB, including authorization, CRUD, compression, caching and readiness.
- AI-assisted Cypress E2E source: `cypress/e2e/portfolio.cy.js`. Uses real API calls and a separate disposable MongoDB instance, not mocked CRUD responses. Runs signup, sign-in/out, read-only role protection, contact submission, all three Admin CRUD flows and mobile navigation.
- Actual Cypress MP4 recordings: `artifacts/cypress/videos/`.
- Cypress snapshots: `artifacts/cypress/screenshots/`.
- Result summaries: `artifacts/cypress-results.json` and `artifacts/performance-results.json`.
- Tests use port 5010 to avoid interfering with the normal application. First run downloads the MongoDB and Cypress binaries. If npm blocks Cypress's postinstall, `npx cypress install` performs the explicit download.
- The existing Playwright regression remains available with `npm run test:e2e` after `npx playwright install chromium`.

Never run the disposable test server as your cloud production service. Only `npm start` starts the real application against your configured database.

## Performance changes

Project images were resized to at most 1280 pixels and recompressed as WebP. Existing PNG URLs remain supported through optimized originals; the hero and new seed data use WebP. Project images below the first two cards load lazily. Secondary pages are split into dynamically loaded chunks. Express compresses responses, fingerprints JavaScript/CSS receive immutable caching, HTML revalidates and API responses use `no-store`. Database lists use lean reads and an index on their creation timestamp.

Run `npm run build && npm run test:performance` to compare asset bytes with the original baseline. These are file-transfer budgets, not fabricated Lighthouse scores or claims about measured internet latency.

## Cloud deployment

`render.yaml` defines one free Node web service in Ohio, serving frontend and API from the same origin with a MongoDB Atlas database supplied separately. It has a readiness check at `/api/health` and automatic deployment after CI checks pass. No live service URL should be claimed until a real deployment succeeds.

Before deploying, connect the repository through Render's GitHub integration and ensure the assignment changes are pushed to main. Configure:

| Variable | Value |
| --- | --- |
| MONGODB_URI | Private Atlas SRV connection string ending in `/comp229_portfolio` |
| JWT_SECRET | Platform-generated secret (Blueprint) or a random value of at least 32 characters |
| ADMIN_PASSWORD | Your chosen private admin password |
| NODE_ENV | production |
| NODE_VERSION | 24 |
| SEED_ON_START | true (additive seed; never deletes existing records) |
| CYPRESS_INSTALL_BINARY | 0 on Render builds only |
| MONGOMS_DISABLE_POSTINSTALL | true on Render builds only |

Build command: `npm ci --include=dev && npm run build`. Start command: `npm start`. Let Render supply PORT. The server binds to 0.0.0.0. Do not copy localhost API URLs into a cloud frontend build.

Create an Atlas user limited to read/write on `comp229_portfolio` and scope Atlas network access to the Render service's outbound addresses. Existing local MongoDB data is not automatically migrated; the additive seed recreates the original portfolio projects/education in the new database, while local contacts/accounts remain local unless explicitly migrated.

## GitHub Actions and CI/CD evidence

`.github/workflows/portfolio-ci.yml` runs unit tests, the production build, API tests, performance budgets and Cypress E2E. Test artifacts and video recordings are uploaded even when a later test fails. No production credentials are needed for CI.

Follow `docs/CI_CD_DEMONSTRATION.md` only after the first live deployment. It describes the required content-update branch, pull request, merge into main and before/after cloud screenshots. A workflow file alone is not proof that CI ran or that the site redeployed.

## Submission

Assignment 4 requires the deployed URL, GitHub URL and a Word document with screenshots, plus the requested Cypress test source and recording. Final cloud and CI/CD evidence must be captured after the real deployment and merge. Local test results do not establish cloud deployment success.
