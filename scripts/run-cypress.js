import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import cypress from 'cypress';
const password = randomBytes(24).toString('base64url');
const port = 5010;
const child = spawn(process.execPath, ['tests/serve.js'], { stdio: 'inherit', env: { ...process.env, TEST_ADMIN_PASSWORD: password, TEST_PORT: String(port) } });
let stopped = false;
child.on('exit', () => { stopped = true; });
try {
  let ready = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    if (stopped) throw new Error('The isolated test server stopped before becoming ready.');
    try { const response = await fetch(`http://127.0.0.1:${port}/api/health`); if (response.ok) { ready = true; break; } } catch { /* Wait for temporary MongoDB startup. */ }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  if (!ready) throw new Error('Test server did not become ready within 90 seconds.');
  const result = await cypress.run({ browser: process.env.CYPRESS_BROWSER || 'electron', env: { adminPassword: password }, config: { baseUrl: `http://127.0.0.1:${port}` } });
  await mkdir('artifacts', { recursive: true });
  const summary = { status: result.status, totalTests: result.totalTests, totalPassed: result.totalPassed, totalFailed: result.totalFailed, totalDuration: result.totalDuration, runs: result.runs?.map(run => ({ spec: run.spec.relative, video: run.video, stats: run.stats, screenshots: run.screenshots.map(({path}) => path) })) };
  await writeFile('artifacts/cypress-results.json', JSON.stringify(summary, null, 2));
  if (result.status === 'failed' || result.totalFailed) process.exitCode = 1;
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { if (!stopped) child.kill('SIGTERM'); }
