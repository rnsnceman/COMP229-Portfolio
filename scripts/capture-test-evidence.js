import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const strip = text => text.replace(/\x1b\[[0-9;]*m/g, '');
await mkdir('artifacts/evidence', { recursive: true });
const unit = strip(await readFile('artifacts/unit-tests.txt','utf8'));
const api = strip(await readFile('artifacts/api-tests.txt','utf8'));
const performance = JSON.parse(await readFile('artifacts/performance-results.json','utf8'));
const sections = [
  ['unit-tests','React component unit tests','Captured Vitest output from npm run test:unit',unit.split('\n').filter(line => !/npm warn|npm notice|JSON report written|^>/.test(line)).join('\n')],
  ['api-tests','Backend integration tests','Captured Node test runner output from npm run test:api',api.split('\n').filter(line => !/npm warn|npm notice|^>/.test(line)).join('\n')],
  ['performance','Performance measurements','Measured production file sizes; these are not Lighthouse scores',JSON.stringify(performance,null,2)],
];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
for (const [name,title,subtitle,text] of sections) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escape(title)}</title><style>body{font:18px/1.6 Arial,sans-serif;margin:42px;color:#172033;background:white}h1{font-size:32px;margin-bottom:8px}p{color:#465267;margin-top:0}pre{font:16px/1.7 monospace;white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f5f8;padding:28px;border:1px solid #d9dfe9;border-radius:8px}</style></head><body><h1>${escape(title)}</h1><p>${escape(subtitle)}</p><pre>${escape(text.trim())}</pre></body></html>`;
  await writeFile(`artifacts/evidence/${name}.html`,html);
  await page.setContent(html);
  await page.screenshot({ path: `artifacts/evidence/${name}.png`, fullPage: true });
}
await browser.close();
console.log('Captured unit, integration and performance result images from actual run outputs.');
