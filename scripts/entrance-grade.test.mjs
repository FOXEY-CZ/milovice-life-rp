import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planGroundedEntrance,doorwayWallHole,
 ENTRANCE_SURFACE_RISE,ENTRANCE_APPROACH_OFFSET} from './entrance-grade.js';
import {exteriorFacadeFrame,facadePoint,splitFacadeStripForOpening}
 from './facade-anchors.js';

const near=(a,b,tol=1e-7)=>Math.abs(a-b)<=tol;
const p=[{x:0,z:0},{x:14,z:0},{x:14,z:9},{x:0,z:9}];
const outside=[...p].reverse();
assert(near(ENTRANCE_SURFACE_RISE,.08));
assert(near(ENTRANCE_APPROACH_OFFSET,.55));
let front=exteriorFacadeFrame(p,0);
const entry=planGroundedEntrance(front,{
 terrainAt:(x,z)=>.03*x+.14*Math.abs(z),
 baseHeight:1.8,topY:4.20,along:-2
});
assert(entry);
const approach=facadePoint(front,-2,.55);
assert(near(entry.approachX,approach.x)&&near(entry.approachZ,approach.z));
assert(near(entry.groundY,.03*approach.x+.14*Math.abs(approach.z)));
assert(near(entry.floorY,entry.groundY+.08));
assert(near(entry.centerY-entry.doorHeight/2,entry.floorY));
assert(near(entry.centerY+entry.doorHeight/2,4.2));
assert(entry.formerGap>1.0,'Old top-of-foundation door must have been floating');
assert(entry.maxGroundStep<=.08+1e-9);
const hole=doorwayWallHole(entry,1.28);
assert(hole&&hole.y>=.01&&hole.h>2.3);
assert(near(hole.y+hole.h,entry.topY-entry.baseHeight));
const split=splitFacadeStripForOpening(front,{along:-2,width:1.28,padding:.055});
assert(split.length===2);
const openingLeft=-2-1.28/2-.055,openingRight=-2+1.28/2+.055;
for(const band of split){
 const from=band.along-band.width/2,to=band.along+band.width/2;
 assert(to<=openingLeft+1e-7||from>=openingRight-1e-7,
  'Foundation band hides the corrected floor-level door');
}
const reverseFrame=exteriorFacadeFrame(outside,3);
const reversed=planGroundedEntrance(reverseFrame,{
 terrainAt:(x,z)=>.03*x+.14*Math.abs(z),
 baseHeight:1.8,topY:4.20,along:2
});
assert(reversed);
assert(near(reversed.floorY,entry.floorY),
 'Reversed OSM footprint should not move the ground entry point');
assert(near(reversed.doorHeight,entry.doorHeight));
assert.equal(planGroundedEntrance(null,{terrainAt:()=>0,baseHeight:1,topY:4}),null);
assert.equal(planGroundedEntrance(front,{terrainAt:()=>NaN,baseHeight:1,topY:4}),null);
assert.equal(planGroundedEntrance(front,{terrainAt:()=>0,baseHeight:1,topY:2.5,surfaceRise:.19}),null);
assert.equal(planGroundedEntrance(front,{terrainAt:()=>2,baseHeight:1,topY:3}),null);
assert.equal(doorwayWallHole(null,1.2),null);
assert.equal(doorwayWallHole(entry,-1),null);
// A genuinely level facade should NOT grow a long door into its plinth.
const flat=planGroundedEntrance(front,{terrainAt:()=>0,
 baseHeight:.10,topY:2.55});
assert(near(flat.floorY,.08));
assert(flat.doorHeight>2);
assert(near(doorwayWallHole(flat,1.21).y,.01));

const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const hero=readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8');
assert(game.includes('recordEntranceGrade(grade,isSchool?')&&
 game.includes('recordEntranceGrade(garageGrade')&&
 game.includes('recordEntranceGrade(industrialGrade')&&
 game.includes('recordEntranceGrade(commerceGrade'),
 'Every rendered ordinary, school, garage, factory and shop entrance family needs local terrain grounding');
assert(game.includes("window.__miloviceEntranceGradeAudit=")&&
 game.includes('recordEntranceGrade(grade,')&&
 game.includes('grade.floorY+postTop')===false&&
 game.includes('(grade.floorY+postTop)*.5'),
 'Real school canopy posts must reach the same door grade');
assert(hero.includes('planGroundedEntrance(edgeFrame')&&
 hero.includes('doorwayWallHole(doorway,doorWidth)')&&
 hero.includes('splitFacadeStripForOpening(edgeFrame')&&
 hero.includes('holes.push({...planned.door,...opening})')&&
 hero.includes('doorway.floorY+.045')&&
 hero.includes('state.groundedDoors++'),
 'Hero cut-out walls, plinth and door frame must use the same terrain datum');
assert(game.includes('Math.min(base+.035,approachY+.025)'),
 'Preserve the already accepted Modra hvezda ground threshold');
console.log('5.45 local entry grade PASS: city, school, shops, industry, garages and hero facade cutouts');
