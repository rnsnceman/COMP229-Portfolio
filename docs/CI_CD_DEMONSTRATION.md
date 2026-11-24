# Assignment 4 CI/CD demonstration

This is a procedure to perform after the first successful cloud deployment. It is not a record of an already completed deployment.

1. Open the live Render URL and capture `deployment-before.png`. Record the current `/api/health` revision.
2. From a clean, current local clone, run `git switch main`, `git pull --ff-only`, and `git switch -c assignment4-content-update`.
3. In `src/pages/Home.jsx`, add this paragraph immediately after the existing `hero-lead` paragraph:

```jsx
<p className="hero-lead">I build full stack web applications with React, Express and MongoDB.</p>
```

4. Run `npm run test:unit` and `npm run build`. Commit the changed page, then push the branch:

```bash
git add src/pages/Home.jsx
git commit -m "Add full stack development introduction"
git push -u origin assignment4-content-update
```

5. Open a pull request from `assignment4-content-update` into `main`. Capture the branch/PR and passing Portfolio CI check. Download the `portfolio-assignment4-evidence` workflow artifact for the Cypress recording and results.
6. Merge the PR. Render is configured with `autoDeployTrigger: checksPass`, so it should deploy after the main branch CI check passes. Confirm the service is linked to the user's GitHub account; public-URL-only repository deployments do not automatically follow commits.
7. Wait for the new Render deploy to become Live. Open `/api/health` and verify its revision equals the new main commit SHA.
8. Refresh the same live homepage URL and capture `deployment-after.png` with the added paragraph visible. Capture the Render successful deploy entry as supporting evidence.
9. Add the actual live URL, GitHub link, unit-test screenshot, Cypress screenshot, cloud deployment evidence and before/after screenshots to the final Word report. Include the Cypress source and actual MP4 recording as the instructor requests.

Do not substitute local before/after images for evidence of a cloud redeployment. Do not remove the paragraph until grading is complete.
