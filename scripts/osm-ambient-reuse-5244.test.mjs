// Milovice RP 5.244 — pedestrian actor reuse must not pop into view.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planOffscreenAmbientReuse5244 as reuse} from './osm-ambient-reuse-5244.js';
const point=(x,z)=>({x,z});
const segment=(id,x,z)=>({
 a:{x,y:z},b:{x:x+40,y:z},len:40,width:0,
 kind:'mapped-footway',sourceOSMWayId:String(id),
 clippedFromOriginalRoadSafePiece:true,noMappedBuildingOverlap:true,
 roadShoulder:false
});
const ambient=(s,x,z,visible=false)=>({
 mappedAmbient5243:true,seg:s,g:{position:point(x,z),visible}
});
const close=segment(1,110,0),safe=segment(2,175,0),
 safe2=segment(3,215,0),tooFar=segment(4,520,0);
const farActor=ambient(close,720,30);
const special={mappedAmbient5243:false,seg:tooFar,
 g:{position:point(700,10),visible:false}};
const visible=ambient(close,700,0,true);
const local=ambient(close,30,0,false);
const nearCamera=ambient(close,710,0,false);
const output=reuse({actors:[farActor,special,visible,local],
 segments:[safe,close,tooFar,safe2],
 focus:point(0,0),observers:[point(0,0)],limit:4});
assert.equal(output.length,1);
assert.equal(output[0].actor,farActor);
assert.equal(output[0].segment,safe);
assert.equal(output[0].oldInvisible,true);
assert.equal(output[0].newInvisible,true);
assert.equal(output[0].sourceGeometryChanged,false);
assert.equal(output[0].sourceOSMWayId,'2');
assert.equal(farActor.seg,close,'pure planning must not move actors itself');
assert.equal(visible.g.position.x,700,'visible actor never reused');
assert.equal(reuse({actors:[nearCamera],segments:[safe],
 focus:point(0,0),observers:[point(0,0),point(710,0)]}).length,0,
 'actor near an audit camera must remain in place');
assert.equal(reuse({actors:[farActor],segments:[safe],
 focus:point(0,0),observers:[point(0,0),point(180,0)]}).length,0,
 'new actor cannot spawn within audit camera visibility');
assert.equal(reuse({actors:[farActor],segments:[safe],
 focus:point(0,0),observers:[point(0,0)],newMinDistance:40}).length,0,
 'visibility safety margin cannot be reduced below 140');
assert.equal(reuse({actors:[farActor],segments:[safe],
 focus:point(0,0),observers:[point(0,0)],oldMinDistance:80}).length,0,
 'old actor protection margin cannot drop below 280');
assert.equal(reuse({actors:[farActor],segments:[safe],
 focus:point(0,0),observers:[point(0,0)],limit:100}).length,0,
 'work per update must remain bounded');
const wrong={...safe,kind:'residential'};
assert.equal(reuse({actors:[farActor],segments:[wrong],
 focus:point(0,0)}).length,0,'never reuse a walker on a road');
const colliding={...safe,noMappedBuildingOverlap:false};
assert.equal(reuse({actors:[farActor],segments:[colliding],
 focus:point(0,0)}).length,0,'reject routes crossing buildings');
const forbidden={...safe,roadShoulder:true};
assert.equal(reuse({actors:[farActor],segments:[forbidden],
 focus:point(0,0)}).length,0,'no guessed road-shoulder movement');
const reservedActor=ambient(safe,180,0,false);
const chooseOther=reuse({actors:[farActor,reservedActor],segments:[safe,safe2],
 focus:point(0,0),observers:[point(0,0)]});
assert.equal(chooseOther.length,1);
assert.equal(chooseOther[0].segment,safe2,'do not stack multiple NPCs on same fragment');
// Regression: the actual Mlada OSM source and the 5.243 path plan remain intact.
const original=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
assert(original.elements.some(e=>String(e.id)==='1005977571'&&e.tags?.highway==='footway'));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/osm-ambient-reuse-5244.js?v=524400'",
 'function rpRebalanceMappedAmbient5244(){',
 'const proposed=planOffscreenAmbientReuse5244({',
 'window.__miloviceAmbientReuseRuntime5244=()=>',
 'rpRebalanceMappedAmbient5244();',
 'mappedAmbient5243:true',
 'window.__miloviceMappedAmbientWalkersRuntime5243=()=>'
])assert(html.includes(marker),'5.244 missing actual integration '+marker);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud);
assert(Number(html.match(/Verze 5[.]([0-9]+)/)?.[1])>=244);
console.log('PASS 5.244: invisible pedestrian reuse, distinct mapped footways, camera safety and bounded work');
