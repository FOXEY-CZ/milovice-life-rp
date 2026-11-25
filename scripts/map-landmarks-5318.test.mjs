import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXTRA_MAP_LANDMARKS_5318 as P,extraMapLandmarks5318 as extra} from './map-landmarks-5318.js';
const {elements}=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
function hash(g){let h=2166136261;for(const ch of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')}
function inside(g,[lat,lon]){let v=false;for(let i=0,j=g.length-2;i<g.length-1;j=i++){const a=g[i],b=g[j];if((a.lat>lat)!==(b.lat>lat)&&lon<(b.lon-a.lon)*(lat-a.lat)/(b.lat-a.lat)+a.lon)v=!v;}return v;}
assert.equal(P.length,7);assert.equal(new Set(P.map(p=>p.sourceOSMId)).size,7);
for(const p of P){
 const w=elements.find(e=>String(e.id)===p.sourceOSMId);
 assert(w?.tags.building);assert.equal(hash(w.geometry),p.hash);assert(inside(w.geometry,p.gps));
 assert(Object.isFrozen(p.gps));assert(Object.isFrozen(p));
}
const result=extra();assert.equal(result.length,7);assert(result.every(p=>p.entranceVerified===false));
assert.equal(extra([{sourceOSMId:P[0].sourceOSMId}]).length,6);
assert.equal(extra([{name:P[1].name}]).length,6);
result[0].gps[0]=0;assert.notEqual(P[0].gps[0],0);
console.log('PASS 5.318 source-locked map landmark locations and duplicate guards');
