import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {directionTopolovaFootJob5180} from './osm-topolova-foot-navigation-5180.js';
const job={version:'5.179',next:0,arrivalRadiusMetres:5,
 checkpoints:[{x:0,z:-100},{x:20,z:-100},{x:40,z:-100}]};
const player={x:0,z:0};
const compass=(goal,yaw=0)=>directionTopolovaFootJob5180({...job,
 checkpoints:[goal,{x:20,z:0},{x:40,z:0}]},player,yaw);
assert.equal(compass({x:0,z:-100}).arrow,'↑');
assert.equal(compass({x:-100,z:0}).arrow,'←');
assert.equal(compass({x:100,z:0}).arrow,'→');
assert.equal(compass({x:0,z:100}).arrow,'↓');
assert.equal(compass({x:-100,z:-100}).arrow,'↖');
assert.equal(compass({x:100,z:-100}).arrow,'↗');
assert.equal(compass({x:-100,z:100}).arrow,'↙');
assert.equal(compass({x:100,z:100}).arrow,'↘');
assert.equal(compass({x:0,z:-100},Math.PI/2).arrow,'→',
 'when player turns left, forward waypoint must be on the right');
assert.equal(compass({x:0,z:-100},-Math.PI/2).arrow,'←');
assert.equal(compass({x:0,z:-4}).arrow,'✓');
assert.equal(compass({x:0,z:-100}).checkpoint,1);
assert.equal(compass({x:0,z:-100}).total,3);
assert.equal(compass({x:0,z:-100}).directBearingOnly,true);
assert.equal(compass({x:0,z:-100}).noInferredStreetRoute,true);
assert.equal(compass({x:0,z:-100}).distanceMetres,100);
assert.equal(directionTopolovaFootJob5180({...job,next:3},player,0),null);
assert.equal(directionTopolovaFootJob5180(job,player,Infinity),null);
assert.equal(directionTopolovaFootJob5180({...job,checkpoints:[]},player,0),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const part of [
 "from './scripts/osm-topolova-foot-navigation-5180.js?v=518000'",
 'id="topolova-foot-job-direction"',
 'const nav=directionTopolovaFootJob5180(job,{x:px,z:pz},orbitYaw);',
 "document.getElementById('topolova-foot-job-direction').textContent=nav?.arrow||'–';",
 'direction:topolovaFootJob5179?directionTopolovaFootJob5180('
])assert(html.includes(part),'missing live compass integration: '+part);
console.log('PASS 5.180: 8 arrow directions, camera rotation, arrival, invalid state, in-game HUD wiring');
