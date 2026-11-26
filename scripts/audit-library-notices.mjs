import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Normalize line endings and wrapping whitespace, but preserve every word and symbol.
const normalize = s => s.replace(/\s+/gu, ' ').trim();
const decode = s => s.replace(/&(?:amp|lt|gt);/g, token => ({'&amp;':'&','&lt;':'<','&gt;':'>'})[token]);
const [pagePath, threePath, leafletPath] = process.argv.slice(2);
assert.ok(pagePath && threePath && leafletPath, 'Usage: audit-library-notices.mjs <credits.html> <three LICENSE> <leaflet LICENSE>');
const page = readFileSync(pagePath, 'utf8');
for (const [id,path] of [['three-license',threePath],['leaflet-license',leafletPath]]) {
  const matches = [...page.matchAll(new RegExp('<pre id="' + id + '"[^>]*>([\\s\\S]*?)</pre>', 'g'))];
  assert.equal(matches.length,1,'Exactly one notice required: '+id);
  const expected = normalize(readFileSync(path,'utf8'));
  assert.ok(expected.length > 500,'Unexpectedly short upstream license: '+id);
  assert.equal(normalize(decode(matches[0][1])),expected,'Notice mismatch: '+id);
  console.log('PASS complete '+id+' matches pinned npm package');
}
