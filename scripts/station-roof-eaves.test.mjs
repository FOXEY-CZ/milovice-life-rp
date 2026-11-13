import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planFootprintPitchedRoof} from './station-roof-geometry.js';
import {planStationRoofEaves} from './station-roof-eaves.js';
const p=(x,z)=>({x,z});
const rectangles=(x0,z0,x1,z1)=>[
 [p(x0,z0),p(x1,z0),p(x1,z1)],
 [p(x0,z0),p(x1,z1),p(x0,z1)]
];
const full=[p(0,0),p(12,0),p(12,8),p(0,8)];
const half=[p(0,0),p(6,0),p(6,8),p(0,8)];
const origin=p(0,0),axis={ax:1,az:0};
const makeRoof=(triangles,kind='hip')=>planFootprintPitchedRoof({
 triangles,origin,axis,kind,eaveY:4.1,rise:1.8
});
function validate(result){
 assert(result?.closedUnderside&&result.onlyMappedExterior);
 assert(result.tiles.length>0&&result.soffit.length>0&&result.fascia.length>0);
 assert(result.maxActualOverhang>=.30&&result.maxActualOverhang<.65);
 for(const group of [result.tiles,result.soffit,result.fascia])
  for(const triangle of group){
   assert.equal(triangle.length,3);
   for(const pt of triangle)assert([pt.x,pt.y,pt.z,pt.u,pt.v].every(Number.isFinite),
    'All fascia, tile and soffit vertices must be finite');
  }
}
for(const outline of [full,[...full].reverse()]){
 const roof=makeRoof(rectangles(0,0,12,8));
 const p=planStationRoofEaves({outline,originalOutline:full,roof,origin});
 validate(p);
 assert.equal(p.exteriorEdges,4);
 assert.equal(p.excludedInteriorEdges,0);
}
// A section cut between low wing and taller centre is NOT a building facade.
// Only the three truly mapped sides of a half-station get roof overhangs.
const partial=planStationRoofEaves({
 outline:half,originalOutline:full,roof:makeRoof(rectangles(0,0,6,8)),origin
});
validate(partial);
assert.equal(partial.exteriorEdges,3);
assert.equal(partial.excludedInteriorEdges,1);
assert(!partial.tiles.some(face=>face.every(v=>Math.abs(v.x-6)<1e-5)),
 'No floating eave plane on the false middle section cut');
// Shape edges preserve geometry when the OSM outline contains notches.
const L=[p(0,0),p(15,0),p(15,4),p(10,4),p(10,9),p(0,9)];
const lr=makeRoof([...rectangles(0,0,15,4),...rectangles(0,4,10,9)]);
const eave=planStationRoofEaves({outline:L,originalOutline:L,roof:lr,origin});
validate(eave);
assert.equal(eave.exteriorEdges,6);
assert.equal(eave.excludedInteriorEdges,0);
assert(eave.tiles.length<180&&eave.fascia.length<250,
 'Roof edge meshes should remain cheap enough for mobile phones');
assert.equal(planStationRoofEaves({outline:[],originalOutline:L,roof:lr,origin}),null);
assert.equal(planStationRoofEaves({outline:L,originalOutline:L,roof:lr,origin,width:3}),null);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(game.includes("import {planStationRoofEaves} from './scripts/station-roof-eaves.js"));
assert(game.includes("const eaves=planStationRoofEaves({"));
assert(game.includes('Milovice_station_eave_soffit'));
assert(game.includes('Milovice_station_eave_fascia'));
console.log('Station eaves: 4 exterior edges, three-only clipped section, L outline, sealed soffits and fascias PASS');
