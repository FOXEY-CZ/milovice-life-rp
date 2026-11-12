const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script\\b[^>]*>([\\s\\S]*?)<\\/script>/gi)].map(x => x[1]).filter(x => x.trim());
assert(scripts.length, 'Missing inline game script');
for (const [i, code] of scripts.entries()) new vm.Script(code, { filename: 'inline-' + i + '.js' });
for (const id of ['hud','perf','controls','minimap','maplaunch','realmap','speed','enter','doors','horn','camera','reset']) {
  assert(new RegExp('id=["\\x27]' + id + '["\\x27]').test(html), 'Missing UI element: ' + id);
}
assert(html.includes('requestAnimationFrame(animate)'), 'Animation loop missing');
assert(html.includes('fetchMiloviceOSM'), 'OSM loader missing');
assert(html.includes('BUILD_ID'), 'Build identifier missing');
console.log('OK: inline JavaScript syntax, critical UI, game loop, OSM loader, build identifier');
