import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planJuventaShotPut5303 as plan} from './osm-juventa-shot-put-5303.js';
import {planCityLanduseBatches} from './landscapes.js';
for(const region of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+region+'.json',import.meta.url),'utf8')).elements;
 const way=ways.find(w=>String(w.id)==='1472419115');
 const convert=p=>({x:(p.lon-14.866674)*71180,y:(50.225972-p.lat)*111320});
 const pts=way.geometry.slice(0,-1).map(convert),s=plan(way,pts);
 assert(s);assert(s.capArea>7&&s.capArea<8);assert(s.sectorArea>97&&s.sectorArea<99);
 assert(Math.abs(s.sectorArea+s.capArea-s.sourceArea)<1e-6);
 assert(s.sector.concat(s.cap).every(p=>pts.includes(p)));
 assert.equal(s.currentSurfaceVerified,false);assert.equal(s.regulationCircleVerified,false);
 assert.equal(plan({...way,tags:{...way.tags,surface:'grass'}},pts),null);
 assert.equal(plan({...way,id:1},pts),null);
 const geometry=way.geometry.map(p=>({...p}));geometry[0].lat+=.00001;
 assert.equal(plan({...way,geometry},pts),null);
 assert.equal(planCityLanduseBatches([way],convert).entries[0].juventaShotPut5303.sourceOSMId,'1472419115');
}
console.log('PASS 5.303: two source-locked shot-put polygons, exact area partition, inferred gray cap');
