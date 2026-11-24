import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const baseline = JSON.parse(await readFile('docs/performance-baseline.json', 'utf8'));
const files = await readdir('public/assets');
const optimized = {};
for (const file of files.filter(file => /\.(png|webp)$/.test(file))) optimized[file] = (await stat(`public/assets/${file}`)).size;
const assets = await readdir('dist/assets');
const js = assets.filter(file => file.endsWith('.js'));
const entry = js.find(file => file.startsWith('index-'));
const report = {
  imageBytesBefore: Object.values(baseline.imageBytesBefore).reduce((a,b) => a+b,0),
  imageBytesAfter: Object.values(optimized).reduce((a,b) => a+b,0),
  javascriptBytesBefore: baseline.javascriptBytesBefore,
  javascriptEntryBytesAfter: (await stat(`dist/assets/${entry}`)).size,
  javascriptEntryGzipBytesAfter: gzipSync(await readFile(`dist/assets/${entry}`)).length,
  lazyJavascriptChunks: js.filter(file => file !== entry).length,
  optimizedImages: optimized,
};
report.imageReductionPercent = Number((100 * (1 - report.imageBytesAfter/report.imageBytesBefore)).toFixed(1));
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/performance-results.json', JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if (report.imageBytesAfter >= report.imageBytesBefore || report.javascriptEntryBytesAfter > 350000) process.exitCode = 1;
