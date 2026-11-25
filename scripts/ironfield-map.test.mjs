import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GAME_MAP_SOURCES,buildGameMap,loadGameMap} from './ironfield-map.js';
const snapshots=GAME_MAP_SOURCES.map(p=>JSON.parse(readFileSync(new URL('../'+p.slice(2),import.meta.url),'utf8')));
const names=new Map();
for(const s of snapshots)for(const e of s.elements)if(e.tags?.highway&&e.tags?.name&&!names.has(e.tags.name))names.set(e.tags.name,'Fiktivní '+(names.size+1));
const display=n=>names.get(n)||'Nepojmenovaná cesta';
const result=buildGameMap(snapshots,display);
assert.equal(result.stats.raw,6867);
assert(result.stats.uniqueWays>2000);
assert(result.stats.counts.building>1500);
assert(result.stats.counts.roadMinor>200);
assert(result.stats.labels>30);
assert.equal(result.stats.externalTiles,0);
assert.equal(result.geojson.features.length,Object.values(result.stats.counts).filter(Boolean).length);
assert(result.labels.every(l=>l.name.startsWith('Fiktivní ')&&Number.isFinite(l.lat)&&Number.isFinite(l.lon)));
for(const f of result.geojson.features){
 assert.deepEqual(Object.keys(f.properties),['kind']);
 assert(['MultiPolygon','MultiLineString'].includes(f.geometry.type));
}
const point=(lon,lat)=>({lon,lat});
const sample={elements:[
 {type:'way',id:1,tags:{highway:'residential',name:'Source'},geometry:[point(0,0),point(1,0)]},
 {type:'way',id:1,tags:{highway:'residential',name:'Source'},geometry:[point(0,0),point(1,0),point(2,0)]},
 {type:'way',id:2,tags:{building:'yes'},geometry:[point(0,0),point(1,0),point(1,1)]},
 {type:'way',id:3,tags:{building:'yes'},geometry:[point(0,0),point(1,0),point(1,1),point(0,0)]},
 {type:'way',id:4,tags:{highway:'residential'},geometry:[point(0,0),point(NaN,0)]}
]};
const small=buildGameMap([sample],()=> 'Game Street');
assert.equal(small.stats.uniqueWays,2);
assert.equal(small.stats.counts.roadMinor,1);
assert.equal(small.stats.counts.building,1);
assert.deepEqual(small.labels,[{name:'Game Street',lat:0,lon:1}]);
assert.equal(JSON.stringify(small).includes('Source'),false);
assert.throws(()=>buildGameMap([{}],display),TypeError);
const requested=[];
const fetched=await loadGameMap(display,async url=>{requested.push(url);return {ok:true,json:async()=>snapshots[GAME_MAP_SOURCES.indexOf(url)]};});
assert.deepEqual(requested,[...GAME_MAP_SOURCES]);
assert.deepEqual(fetched.stats,result.stats);
await assert.rejects(loadGameMap(display,async()=>({ok:false,status:404})),/404/);
console.log('PASS Ironfield source-only map, duplicate ways, polygon validation and fictional label data',JSON.stringify(result.stats));
