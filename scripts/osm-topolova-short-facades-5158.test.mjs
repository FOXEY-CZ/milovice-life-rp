import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolova646Photo5156} from './osm-topolova-photo-646-5156.js';
import {planTopolova646BothFacades5157} from './osm-topolova-photo-646-5157.js';
const j=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const b=j.elements.find(x=>x.id===53866048),neighbor=j.elements.find(x=>x.id===53866045);
assert(b&&neighbor);
const originals=JSON.stringify([b,neighbor]);
const photo=planTopolova646Photo5156({id:b.id,regionId:'mlada',tags:b.tags,geometry:b.geometry,baseFloors:1});
const both=planTopolova646BothFacades5157({oldPhotoPlan:photo,geometry:b.geometry});
assert(both);
assert.equal(both.sourceOSMHash,'73d119b1');
assert.deepEqual(both.photoExteriorEdges,[5,7]);
const short=[0,1,2,3,4,6],expected=[6.337,3.452,7.253,3.434,2.874,16.515];
const length=(p,q)=>Math.hypot((p.lat-q.lat)*111320,
 (p.lon-q.lon)*111320*Math.cos(50.226*Math.PI/180));
short.forEach((i,k)=>assert(Math.abs(length(b.geometry[i],b.geometry[i+1])-expected[k])<.035));
assert.equal(new Set([...short,...both.photoExteriorEdges]).size,8);
assert.equal(JSON.stringify([b,neighbor]),originals);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const text of [
 'genericShortFacadesSuppressed:0,',
 'if(topolova646BothPlan&&!topolova646BothPlan.photoExteriorEdges.includes(i)){',
 'window.__miloviceTopolovaShortEndsRuntime=()=>{',
 "'topolova-646-short-5158':{"
])assert(html.includes(text),text);
console.log('PASS 5.158 Topolova 646 6 short exact OSM walls free of unverified generic fixtures');
