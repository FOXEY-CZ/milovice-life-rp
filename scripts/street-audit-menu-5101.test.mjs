import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STREET_AUDIT_SECTIONS,streetAuditCategory,shortStreetAuditLabel}
 from './street-audit-menu-5101.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const nav=html.match(/<nav><a href="\?v=58530&streetAudit=5kv">([\s\S]*?)<\/nav>/)?.[0];
assert(nav,'Keep the 28 existing source URLs in the game HTML');
const ids=[...nav.matchAll(/streetAudit=([^"&]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,28);
assert.equal(new Set(ids).size,28,'Do not lose or duplicate a review camera URL');
const expected={streets:18,sidewalks:2,water:2,forests:2,sports:2,lighting:2};
assert.deepEqual(STREET_AUDIT_SECTIONS.map(s=>s.id),Object.keys(expected));
for(const [group,count] of Object.entries(expected))
 assert.equal(ids.filter(id=>streetAuditCategory(id)===group).length,count,
  'All source links must remain in their correct section: '+group);
assert.equal(streetAuditCategory('lit-italska-5100'),'lighting');
assert.equal(streetAuditCategory('pitch-tennis-599'),'sports');
assert.equal(streetAuditCategory('forest-mlada-597'),'forests');
assert.equal(streetAuditCategory('water-svodnice-596'),'water');
assert.equal(streetAuditCategory('topolova-sidewalk-595'),'sidewalks');
assert.equal(streetAuditCategory('pionyru-forward'),'streets');
assert.equal(shortStreetAuditLabel(
 'Italská · Mladá · OSM lit=yes (LAMPY JSOU MODEL)',
 'lit-italska-5100'),'Italská · Mladá');
assert.equal(shortStreetAuditLabel(
 'Mladá · Juventský les · technická kamera dle OSM (NENÍ foto)',
 'forest-mlada-597'),'Mladá · Juventský les');
assert.equal(shortStreetAuditLabel(
 'Mladá · antukové tenisové kurty · OSM model (NENÍ foto)',
 'pitch-tennis-599'),'Mladá · antukové tenisové kurty');
assert(html.includes(
 "from './scripts/street-audit-menu-5101.js?v=510100'"));
assert(html.includes("mountStreetAuditMenu(panel,"));
assert(html.includes('#street-audit-nav'));
assert(html.includes('max-height:min(58dvh,'));
assert(html.includes('street-audit-quicklinks'));
const id=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(id&&meta===id&&hud===id,'All three build labels must remain synchronized');
console.log('PASS 5.101 categorized street menu, all 28 existing links, source labels');
