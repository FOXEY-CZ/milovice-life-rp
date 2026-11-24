import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inspectJuventaTurf5301 as inspect} from './osm-juventa-turf-5301.js';
import {planCityLanduseBatches} from './landscapes.js';
for(const region of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+region+'.json',import.meta.url),'utf8')).elements;
 const matched=ways.map(inspect).filter(Boolean);
 assert.equal(matched.length,1);assert.equal(matched[0].sourceOSMId,'1472419116');
 const way=ways.find(w=>String(w.id)==='1472419116');
 const convert=p=>({x:(p.lon-14.866674)*71180,y:(50.225972-p.lat)*111320});
 const plan=planCityLanduseBatches([way],convert);
 assert.equal(plan.entries.length,1);
 assert.equal(plan.entries[0].renderMaterial,'pitchTurf');
 assert.deepEqual(plan.entries[0].pts,way.geometry.slice(0,-1).map(convert));
 assert.equal(inspect({...way,tags:{...way.tags,surface:'grass'}}),null);
 assert.equal(inspect({...way,id:1}),null);
 const geometry=way.geometry.map(p=>({...p}));geometry[0].lat+=.00001;
 assert.equal(inspect({...way,geometry}),null);
 const other={...way,id:1};
 assert.equal(planCityLanduseBatches([other],convert).entries[0].renderMaterial,'pitch');
}
console.log('PASS 5.301: existing turf material, exact source polygon, two regions, no geometry change');
