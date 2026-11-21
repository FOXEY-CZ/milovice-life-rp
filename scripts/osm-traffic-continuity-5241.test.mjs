// Milovice RP 5.241 — no arbitrary street teleport at one-way dead ends.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planNpcJunction5241 as route,
 planOffscreenNpcRecycle5241 as recycle} from './osm-traffic-continuity-5241.js';
const p=(x,y)=>({x,y});
const seg=(a,b,oneway=0,width=7,id='road')=>({
 a,b,len:Math.hypot(b.x-a.x,b.y-a.y),oneway,width,osmId:id
});
const first=seg(p(0,0),p(50,0),1,7,'oneway-first');
const next=seg(p(50,0),p(80,0),1,7,'oneway-next');
const disjoint=seg(p(900,900),p(930,900),1,7,'far-road');
const opposite=seg(p(80,0),p(50,0),1,7,'reverse-connected');
assert.equal(route({segment:first,direction:1,outgoing:[]}).mode,'terminal');
const dead=route({segment:first,direction:1,outgoing:[
 {segment:disjoint,direction:1},{segment:opposite,direction:1}
]});
assert.equal(dead.mode,'terminal','never invent a junction');
assert.equal(dead.segment,first,'no arbitrary fallback segment');
assert.equal(dead.progress,1);
assert.equal(dead.teleported,false);
const continuous=route({segment:first,direction:1,
 outgoing:[{segment:next,direction:1},{segment:disjoint,direction:1}]});
assert.equal(continuous.mode,'connected');
assert.equal(continuous.segment,next);
assert.equal(continuous.progress,0);
assert.equal(continuous.direction,1);
assert.equal(continuous.turnIncrement,1);
assert.equal(continuous.teleported,false);
const twoWay=seg(p(0,0),p(50,0),0);
const turn=route({segment:twoWay,direction:1,outgoing:[]});
assert.equal(turn.mode,'turn-back');
assert.equal(turn.direction,-1);
assert.equal(turn.progress,1);
assert.equal(turn.segment,twoWay);
const prohibitedDirection=route({segment:first,direction:-1,outgoing:[]});
assert.equal(prohibitedDirection,null);
const wrongWay=route({segment:first,direction:1,
 outgoing:[{segment:next,direction:-1}]});
assert.equal(wrongWay.mode,'terminal','do not traverse against one-way');
const observers=[{x:0,z:0},{x:70,z:0}];
assert.equal(recycle({segments:[first,next],observers,seed:3}),null,
 'cannot relocate a car in camera-visible range');
const back=seg(p(650,0),p(720,0),0,7,'valid-far-road');
const safe=recycle({segments:[first,next,back],observers,seed:11});
assert(safe,'find eligible road outside all observers');
assert.equal(safe.segment,back);
assert(safe.progress>=0&&safe.progress<1);
assert.equal(safe.offscreenOnly,true);
assert.equal(safe.direction,1);
assert.equal(recycle({segments:[back],observers:[{x:660,z:0}]}),null);
assert.equal(recycle({segments:[back],observers,minDistance:20}),null,
 'cannot lower visibility safety bound');
assert.equal(recycle({segments:[seg(p(800,0),p(900,0),0,4)],observers}),null,
 'do not respawn on too narrow a lane');
// Regression: 5.240 source-locked emergency access remains in map data
// but never in the public NPC graph's eligible route list.
const mlada=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const fire=mlada.elements.filter(x=>String(x.id)==='1272081401');
assert.equal(fire.length,1);
assert.equal(fire[0].tags.motor_vehicle,'permit');
assert.equal(fire[0].tags.service,'emergency_access');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/osm-traffic-continuity-5241.js?v=524100'",
 'const decision=planNpcJunction5241({',
 'obj.trafficTerminal5241',
 'planOffscreenNpcRecycle5241({',
 'window.__miloviceTrafficContinuityRuntime5241=()=>'
])assert(html.includes(marker),'missing integrated 5.241 routing '+marker);
assert(Number(html.match(/Verze 5[.]([0-9]+)/)?.[1])>=241,
 'future game builds must keep the original 5.241 routing');
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&runtime&&meta===runtime&&runtime===hud);
console.log('PASS 5.241: OSM-adjacent turns, one-way terminals, offscreen-only NPC recycling and no invented streets');
