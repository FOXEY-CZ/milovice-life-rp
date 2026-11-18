import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STREET_AUDIT_SECTIONS,streetAuditCategory,shortStreetAuditLabel}
 from './street-audit-menu-5101.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const nav=html.match(/<nav><a href="\?v=58530&streetAudit=5kv">([\s\S]*?)<\/nav>/)?.[0];
assert(nav,'Keep the original review URLs, playgrounds and street width cameras');
const ids=[...nav.matchAll(/streetAudit=([^"&]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,45);
assert.equal(new Set(ids).size,45,'Do not lose or duplicate a review camera URL');
const expected={streets:33,sidewalks:2,water:2,forests:2,sports:2,playgrounds:2,lighting:2};
assert.deepEqual(STREET_AUDIT_SECTIONS.map(s=>s.id),Object.keys(expected));
for(const [group,count] of Object.entries(expected))
 assert.equal(ids.filter(id=>streetAuditCategory(id)===group).length,count,
  'All source links must remain in their correct section: '+group);
assert.equal(streetAuditCategory('lit-italska-5100'),'lighting');
assert.equal(streetAuditCategory('pitch-tennis-599'),'sports');
assert.equal(streetAuditCategory('play-mlada-5103'),'playgrounds');
assert.equal(streetAuditCategory('play-vrutice-5103'),'playgrounds');
assert.equal(streetAuditCategory('estate-mlada-5105'),'streets');
assert.equal(streetAuditCategory('road-slepa-5108'),'streets');
assert.equal(streetAuditCategory('slepa-houses-5112'),'streets');
assert.equal(streetAuditCategory('road-vruticka-5108'),'streets');
assert.equal(streetAuditCategory('clinic-verge-trees-5129'),'streets');
assert.equal(streetAuditCategory('spojovaci-north-crossing-5130'),'streets');
assert.equal(streetAuditCategory('tyrsova-terrace-5131'),'streets');
assert.equal(streetAuditCategory('armadni-island-zebra-5131'),'streets');
assert(ids.includes('tyrsova-terrace-5131')&&ids.includes('armadni-island-zebra-5131'));
assert(ids.includes('spojovaci-north-crossing-5130'),'Keep 43rd OSM crossing camera');
assert(ids.includes('clinic-verge-trees-5129'),'Protect direct source-backed tree camera');
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
 "from './scripts/street-audit-menu-5101.js?v=511200'"));
assert(html.includes("mountStreetAuditMenu(panel,"));
assert(html.includes('#street-audit-nav'));
assert(html.includes('max-height:min(44dvh,'));
assert(html.includes('max-height:112px'));
assert(html.includes('#street-audit-exit'));
assert(html.includes('#street-audit-info-toggle'));
assert(html.includes('#street-block-audit .street-audit-links a{'));
assert(html.includes('white-space:normal!important'));
assert(html.includes('flex:0 0 auto;min-height:38px'));
assert(html.includes('flex-shrink:0'));
assert(html.includes('height:auto!important;min-height:40px!important'));

assert(html.includes("if(statusText)statusText.textContent=rpStreetAuditView.osmHouseClusterId?"));
assert(html.includes("rpStreetAuditView.osmWidthWayId?"));
const menuScript=readFileSync(new URL('./street-audit-menu-5101.js',import.meta.url),'utf8');
assert(menuScript.includes("group.open=!mobile&&section.id===selectedGroup"));
assert(menuScript.includes("setInfoExpanded(false)"));
assert(menuScript.includes("if(!expanded)setInfoExpanded(false)"));
assert(html.includes('street-audit-quicklinks'));
const id=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(id&&meta===id&&hud===id,'All three build labels must remain synchronized');
console.log('PASS 5.131 mobile review menu and 45 source cameras in 7 categories');
