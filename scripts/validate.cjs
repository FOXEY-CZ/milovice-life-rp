const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL,fileURLToPath}=require('node:url');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
 .filter(x => !/\btype\s*=\s*["'](?:importmap|application\/json)["']/i.test(x[1]))
 .map(x => x[2]).filter(x => x.trim());
const importMaps=[...html.matchAll(/<script\s+type=["']importmap["']\s*>([\s\S]*?)<\/script>/gi)];
for(const entry of importMaps){
 const map=JSON.parse(entry[1]);
 assert(map.imports?.three && map.imports?.['three/addons/'], 'Missing consistent Three.js importmap paths');
}
assert(scripts.length, 'Missing inline game script');
// Check static local imports from all published HTML entry points, recursively.
// Strip browser cache-busting queries via fileURLToPath; never fetch remote dependencies.
const seenModules=new Set();
let localImportCount=0;
function verifyLocalImports(code,owner){
 const imports=/^\s*(?:import\s+(?:[^;]*?\bfrom\s*)?|export\s+(?:\*|\{[^}]*\})\s+from\s*)['"](\.[^'"\r\n]+)['"]/gm;
 for(const [,specifier] of code.matchAll(imports)){
  const target=fileURLToPath(new URL(specifier,pathToFileURL(path.resolve(owner))));
  assert(fs.existsSync(target)&&fs.statSync(target).isFile(),owner+' imports missing file '+specifier);
  localImportCount++;
  if(seenModules.has(target))continue;
  seenModules.add(target);
  if(/\.(?:m?js|cjs)$/.test(target))verifyLocalImports(fs.readFileSync(target,'utf8'),target);
 }
}
for(const page of ['index.html','editor.html','photo-pilot.html','rebuild.html','survey.html']){
 const source=fs.readFileSync(page,'utf8');
 for(const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  if(!/\btype\s*=\s*['"]module['"]/i.test(match[1]))continue;
  verifyLocalImports(match[2],page);
 }
}
assert(localImportCount>0,'Local module graph check did not inspect any imports');

// Release-audit-only files may be excluded from three expensive photo WebGL
// triggers, never from the general validator. Detect accidental runtime use.
const releaseOnly=['scripts/audit-release-glb.mjs','.github/workflows/glb-release-audit.yml'];
const releaseBasenames=releaseOnly.map(p=>path.basename(p));
for(const owner of [...seenModules,...['index.html','editor.html','photo-pilot.html','rebuild.html','survey.html','credits.html']]){
 const source=fs.readFileSync(owner,'utf8');
 for(const file of releaseBasenames)assert(!source.includes(file),owner+' references release-only tooling '+file+'; reconsider WebGL exclusions');
}
for(const name of ['station-photo-webgl','station-forecourt-webgl','street-block-webgl']){
 const workflow=fs.readFileSync('.github/workflows/'+name+'.yml','utf8');
 for(const event of ['push','pull_request']){
  const block=workflow.match(new RegExp('^  '+event+':\\n([\\s\\S]*?)(?=^  [a-z_]+:|^\\S)','m'));
  assert(block,name+' missing '+event+' trigger');
  const paths=[...block[1].matchAll(/^      - '([^']+)'$/gm)].map(m=>m[1]);
  assert.deepEqual(paths,['**/*.md','scripts/dev-check.mjs',...releaseOnly],name+' '+event+' unexpected ignored paths');
  assert(block[1].includes('paths-ignore:'),name+' '+event+' missing exclusion key');
 }
 assert(workflow.includes('  workflow_dispatch:'),name+' must retain manual verification');
}
console.log('OK: narrowly scoped release audit exclusions and static runtime separation');

console.log('OK: '+localImportCount+' static local imports across '+seenModules.size+' unique files');
// Parse browser module imports without executing remote URLs in the CI runner.
for (const [i, code] of scripts.entries()) {
  const syntaxOnly = code.replace(/^\s*import\s+[^;]+;\s*$/gm, '');
  new vm.Script(syntaxOnly, { filename: 'inline-' + i + '.js' });
}
for (const id of ['hud','perf','controls','minimap','maplaunch','realmap','speed','enter','doors','horn','camera','reset']) {
  assert(html.includes('id="' + id + '"'), 'Missing UI element: ' + id);
}
assert(html.includes('requestAnimationFrame(animate)'), 'Animation loop missing');
assert(html.includes('fetchMiloviceOSM'), 'OSM loader missing');
assert(html.includes('BUILD_ID'), 'Build identifier missing');
const embeddedBuild=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const metaBuild=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const labelBuild=html.match(/id="build-label">([^<]+)<\/strong>/)?.[1];
assert(embeddedBuild&&metaBuild&&labelBuild,
 'Build must be set in metadata, HUD and module runtime');
assert.equal(embeddedBuild,metaBuild,
 'Build metadata must match the actual JavaScript build ID');
assert.equal(embeddedBuild,labelBuild,
 'Build displayed in HUD must match runtime; stale labels break WebGL regression tests');
console.log('OK: inline JavaScript syntax, critical UI, game loop, OSM loader, build identifier');
