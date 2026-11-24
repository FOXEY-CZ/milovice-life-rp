import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inspectJuventaLongJump5302 as inspect} from './osm-juventa-long-jump-5302.js';
import {planCityLanduseBatches} from './landscapes.js';
for(const region of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+region+'.json',import.meta.url),'utf8')).elements;
 const matched=ways.map(inspect).filter(Boolean);
 assert.equal(matched.length,1);
 const way=ways.find(w=>String(w.id)==='1472419120');
 assert.equal(matched[0].sourceHash,'6f18862d');
 assert.equal(matched[0].currentSurfaceVerified,false);
 const convert=p=>({x:(p.lon-14.866674)*71180,y:(50.225972-p.lat)*111320});
 const entry=planCityLanduseBatches([way],convert).entries[0];
 assert.equal(entry.renderMaterial,'pitchSand');
 assert.deepEqual(entry.pts,way.geometry.slice(0,-1).map(convert));
 assert.equal(inspect({...way,tags:{...way.tags,surface:'grass'}}),null);
 assert.equal(inspect({...way,id:1}),null);
 const geometry=way.geometry.map(p=>({...p}));geometry[0].lat+=.00001;
 assert.equal(inspect({...way,geometry}),null);
 assert.equal(inspect(ways.find(w=>String(w.id)==='1472419115')),null);
}
console.log('PASS 5.302: exact long-jump polygon, inferred sand surface, no new geometry');
