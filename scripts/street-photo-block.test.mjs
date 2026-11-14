import assert from 'node:assert/strict';
import {PHOTO_STREET_BLOCK,photoFacingEdges,pointFromGps,planDormerRoofSlopes,planArchedDormerWindow,
 planPhotographedRooflight} from './street-photo-block.js';
import {planCityBuildingRoof} from './city-roof-geometry.js';
import {roofHeightAtPoint} from './roof-opening-geometry.js';
assert.equal(PHOTO_STREET_BLOCK.length,3);
assert.deepEqual(PHOTO_STREET_BLOCK.map(x=>x.id),['202367194','202367254','118487980']);
assert(PHOTO_STREET_BLOCK.every(x=>x.photoDate==='2024-05-30'&&x.license==='CC BY 4.0'&&
 x.source.includes('commons.wikimedia.org/wiki/File:')&&x.author==='ŠJů'));
const pts=[{x:0,y:0},{x:15,y:0},{x:15,y:9},{x:0,y:9}];
const front=photoFacingEdges(pts,{x:7.5,z:-12},{limit:2});
assert.equal(front[0].index,0,'photo on north side should choose corresponding visible wall');
assert(front.every(e=>e.len>=4&&e.visibility>-.12));
assert.equal(photoFacingEdges(pts,{x:999,z:999},{minLength:16}).length,0);
const p=pointFromGps(50.226,14.889);
assert(Math.abs(p.x)<1e-3&&Math.abs(p.z)<1e-3);
console.log('Photo street block OK: 3 independently georeferenced Commons landmarks, exterior wall selection and no fake dimensions');

for(const width of [2.12,2.35,2.65]){
 const [left,right]=planDormerRoofSlopes(width,.94);
 assert.equal(left.side,-1);assert.equal(right.side,1);
 assert(left.rotationZ>0&&right.rotationZ<0);
 assert(Math.abs(left.rotationZ+right.rotationZ)<1e-9);
 assert(Math.abs(left.panelLength-right.panelLength)<1e-9);
}

for(const width of [.91,1.05,1.48]){
 const a=planArchedDormerWindow({width,segments:16});
 assert(a?.outer.length===19&&a.inner.length===19);
 assert(a.archTop>a.shoulder&&a.glassTop>a.shoulder);
 assert(a.glassTop<a.archTop);
 assert(Math.abs(a.outer[0].x+a.outer[1].x)<1e-10);
 assert(Math.abs(a.outer[0].y-a.outer[1].y)<1e-10);
 // The springline ends of both semicircles must actually meet their straight jambs.
 assert(Math.abs(a.outer[2].y-a.shoulder)<1e-10);
 assert(Math.abs(a.outer.at(-1).x+a.width*.5)<1e-8);
 assert(Math.abs(a.outer.at(-1).y-a.shoulder)<1e-8);
 assert(a.inner[0].x>a.outer[0].x&&a.inner[1].x<a.outer[1].x);
}
assert.equal(planArchedDormerWindow({width:0}),null);
assert.equal(planArchedDormerWindow({width:1,segments:2}),null);
assert.equal(planArchedDormerWindow({width:1,border:.7}),null);
const html=await import('node:fs').then(f=>f.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
assert(!html.includes('const roofTrim=new THREE.LineLoop('),'Never add generic horizontal dark borders to all pitched houses');
assert(html.includes('unverifiedRoofOutlinesSuppressed++'));
const hero=await import('node:fs').then(f=>f.readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8'));
assert(hero.includes('const photoAnchored=Boolean(override?.source)'));
assert(hero.includes('const useShutters=sideLayout?.shutters===true;'));
assert(!hero.includes('!photoAnchored&&randomShutters'),
 'No unreviewed house may get random shutters');
assert(!hero.includes("placement(chunk,'awning'"),
 'No invented blanket awnings over every house door');
assert(hero.includes('suppressedUnverifiedPhotoOrnaments'));
assert(!html.includes("archPart('shutter'"),
 'Citywide provisional facades may not spawn random shutters');
assert(html.includes('facadeSourceAudit.suppressedRandomBalconies++'),
 'Automatically generated balconies must be suppressed until photographed');
// Photo-driven multi-building regression. These names refer to real
// May 2024 Wikimedia Commons references, not a generic guessed style.
const city=JSON.parse((await import('node:fs')).readFileSync(
 new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const mirova=city.elements.find(b=>b.id===202367254);
assert(mirova,'The documented Mírová 36 OSM footprint was deleted');
const outline=mirova.geometry.slice(0,-1).map(p=>pointFromGps(p.lat,p.lon));
const visible=photoFacingEdges(outline,pointFromGps(50.2280572,14.8840981),
 {minLength:3.3,limit:6});
const mirovaFront=visible.find(e=>e.len>5.5);
const mirovaSide=visible.find(e=>e.index!==mirovaFront.index&&e.len>=4.3);
assert(mirovaFront&&mirovaSide,'Both photographed Mírová 36 streetfront edge groups must exist');
assert(mirovaFront.len>6&&mirovaFront.len<7,'Use the real 6.45m face, not a 20m bbox');
for(const [edge,offsets] of [[mirovaFront,[-.82]],[mirovaSide,[-.78,.78]]])
 for(const offset of offsets)
  assert(Math.abs(offset)<=edge.len*.5-.68,
   'Photo rooflight cannot extend beyond its source OSM facade');
const photoPass=(await import('node:fs')).readFileSync(
 new URL('./street-photo-block.js',import.meta.url),'utf8');
const sourceIdx=photoPass.indexOf("if(key==='202367254')");
assert(sourceIdx>0);
const sourceCode=photoPass.slice(sourceIdx,sourceIdx+1000);
assert(sourceCode.includes('roofRise:1.65')&&
 sourceCode.includes('addRooflights(face,base,height,[-.82],roofPlan)')&&
 sourceCode.includes('addRooflights(returnWall,base,height,[-.78,.78],roofPlan)'));
assert(photoPass.includes('const winW=w*(arched?.43:.72)'),
 'Mírová upper three-lite casement must be wider than an arched gable pane');
const game=html;
assert(game.includes('isMirova36?4.15')&&game.includes('isMirova36?2.55'),
 'The photographed one-storey street wing must not have 2+ storey eaves');
assert(game.includes('mirova36SourceStorefrontBays=bays')&&
 game.includes('blueStarSourceEntranceArch=true')&&
 game.includes('blueStarInventedBillboardRemoved=true'));
assert(!game.includes(' blueStarFacadeSign(entranceX+dirX*.55'),
 'A floating hotel billboard unsupported by the May 2024 photo must remain absent');
// 5.35: rooflights MUST follow the height of the modelled host roof,
// not stand as red/black plates hovering over a guessed -.43 rotation.
// Check 3 layers on every corner of a rotated/standard roof strip.
const rec=[{x:0,z:0},{x:14,z:0},{x:14,z:10},{x:0,z:10}];
const plan=planCityBuildingRoof({
 footprint:rec,triangles:[[rec[0],rec[1],rec[2]],[rec[0],rec[2],rec[3]]],
 baseY:12,rise:2.3,kind:'hip'
});
assert(plan,'Smoke roof material planner');
const edge={mx:7,mz:0,nx:0,nz:-1,ux:1,uz:0,len:14};
for(const offset of [-2,0,2]){
 const skylight=planPhotographedRooflight(plan,edge,offset);
 assert(skylight?.flushToHostRoof&&skylight.triangles===6);
 for(const [key,lift] of [['frame',.028],['glass',.037],['mullion',.045]])
  for(const tri of skylight[key])for(const v of tri){
   const y=roofHeightAtPoint(plan,v);
   assert(Math.abs(v.y-y-lift)<.0001,
    'Rooflight corner must be exactly on the host slope plus a paint-thin gap');
   assert(v.y>12);
  }
}
assert.equal(planPhotographedRooflight(plan,edge,8),null);
assert.equal(planPhotographedRooflight(null,edge,0),null);
assert(photoPass.includes('const joined=planSkolskaDormerRoof({')&&
 photoPass.includes('joinedOrdinaryDormerRoofs++')&&
 !photoPass.includes('part(p,slope.panelLength,.095,depth+.28,roof,'),
 'ALL photo gables must use one continuous roof rather than floating rotated plates');
assert(game.includes('blueStarGhostDoorsRemoved=true')&&
 game.includes('const railX=entranceX+dirX*1.38')&&
 !game.includes("archPart('windowBar',entranceX+dirX*.26"),
 'No solid fake doors or full-height black balcony rail slabs');
assert(game.includes('!isBlueStar&&!isMirova36){'),
 'No separate photo-house generic gutter rods can remain');
console.log('5.29.0 Školská 220/1 actual arched attic windows, no invented shutters or floating roof outlines PASS');
