import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {topolovaFootMinimapMarker5181} from './osm-topolova-foot-minimap-5181.js';
const job={version:'5.179',sourceWayId:'1314665579',next:0,
 checkpoints:[{x:0,z:-100},{x:1000,z:-1000},{x:30,z:-20}]};
const p={x:0,z:0};
const ahead=topolovaFootMinimapMarker5181(job,p,0);
assert(ahead);
assert.equal(ahead.version,'5.181');
assert.equal(ahead.sourceWayId,'1314665579');
assert.equal(ahead.checkpoint,1);
assert.equal(ahead.total,3);
assert.equal(ahead.x,0);
assert.equal(ahead.y,-30);
assert.equal(ahead.clamped,false);
assert.equal(ahead.directPointNotRoute,true);
assert.equal(ahead.createdWorldMarkers,0);
const rotated=topolovaFootMinimapMarker5181(job,p,Math.PI/2);
assert(Math.abs(rotated.x+30)<.00001);
assert(Math.abs(rotated.y)<.00001);
const behind=topolovaFootMinimapMarker5181(job,p,Math.PI);
assert(Math.abs(behind.y-30)<.00001);
const far=topolovaFootMinimapMarker5181({...job,next:1},p,0);
assert.equal(far.clamped,true);
assert(Math.abs(far.x)<=72&&Math.abs(far.y)<=72);
assert.equal(far.worldDistanceMetres,Math.hypot(1000,1000));
assert.equal(topolovaFootMinimapMarker5181({...job,next:3},p,0),null);
assert.equal(topolovaFootMinimapMarker5181(job,p,NaN),null);
assert.equal(topolovaFootMinimapMarker5181(job,p,0,-1),null);
assert.equal(topolovaFootMinimapMarker5181({...job,version:'broken'},p,0),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const mark of [
 "from './scripts/osm-topolova-foot-minimap-5181.js?v=518100'",
 'topolovaFootMinimapMarker5181(',
 'window.__miloviceTopolovaFootMinimapRuntime5181=()=>',
 "mc.fillText('PĚŠKY'"
])assert(html.includes(mark),'missing actual minimap integration: '+mark);
console.log('PASS 5.181: 2D foot job minimap marker, rotation, viewport clamp, no world assets');
