import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaRoadSidewalk5252} from './osm-italska-road-sidewalk-5252.js';
import {createItalskaRoadHeight5257,inspectItalskaRoadHeight5257,
 ITALSKA_ROAD_WHEEL_5257 as C} from './osm-italska-strip-wheel-height-5257.js';
const data=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(data).elements,find=id=>ways.find(x=>x.id===id);
const roadPlan=planItalskaRoadSidewalk5252({regionId:'mlada',
 road:find(8590284),sidewalk:find(1484073943),defaultWidth:7.8});
assert(roadPlan);
const xy=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 y:-p.lat*111320});
function make(id){
 const g=find(id).geometry;
 return g.slice(1).map((p,i)=>{
  const a=xy(g[i]),b=xy(p);
  return {osmId:id,kind:'residential',a,b,width:id===8590284?5:7.8,
   len:Math.hypot(b.x-a.x,b.y-a.y),oneway:0};
 }).filter(s=>s.len>=2.5&&s.len<=175);
}
const narrow=make(8590284),segments=[
 ...narrow,...make(8585601),...make(1107814416)];
const origin=narrow[0].a;
const dem=(x,z)=>1.4+.014*(x-origin.x)-.007*(z-origin.y)+
 .038*Math.sin((x-origin.x)*.27)*Math.cos((z-origin.y)*.13);
const model=createItalskaRoadHeight5257({roadPlan,segments,terrainAt:dem});
assert(model?.ready);
assert.equal(model.narrowSegments,8);
assert(model.roadVertices>100);
assert.equal(C.roadMeshOffset,.17);
assert.equal(C.localTyreBottom,.045);
assert.equal(C.visualAir,.006);
for(const s of narrow.slice(0,3)){
 const nx=-(s.b.y-s.a.y)/s.len,nz=(s.b.x-s.a.x)/s.len;
 for(const v of [-.5,0,.5]){
  const x=s.a.x+nx*s.width*v,z=s.a.y+nz*s.width*v;
  assert(Math.abs(model.originalStripHeight(s,x,z)-dem(x,z)-.17)<1e-6);
 }
}
const s=narrow.find(s=>s.len>7),along=Math.ceil(s.len/4);
assert(s,'Source-road minimum for DEM test');
const dx=(s.b.x-s.a.x)/s.len,dz=(s.b.y-s.a.y)/s.len;
const nx=-dz,nz=dx,t=.23,q=.17;
const at=(i,j)=>dem(s.a.x+dx*s.len*i/along+nx*(j/4-.5)*s.width,
 s.a.y+dz*s.len*i/along+nz*(j/4-.5)*s.width)+.17;
const x=s.a.x+dx*s.len*t/along+nx*(q/4-.5)*s.width;
const z=s.a.y+dz*s.len*t/along+nz*(q/4-.5)*s.width;
assert(Math.abs(model.originalStripHeight(s,x,z)-
 (at(0,0)+(at(0,1)-at(0,0))*q+(at(1,0)-at(0,0))*t))<1e-6);
assert.equal(model.sample(0,0),null);
assert.equal(model.wheelSupport({x:0,z:0,heading:0,length:4.45}),null);
let good=0;
for(const seg of narrow){
 const x=(seg.a.x+seg.b.x)*.5,z=(seg.a.y+seg.b.y)*.5,
 heading=Math.atan2(-(seg.b.x-seg.a.x),-(seg.b.y-seg.a.y));
 const w=model.wheelSupport({x,z,heading,length:4.45});
 if(!w)continue;
 good++;
 assert.equal(w.roadStripTrianglesInterpolated,undefined);
 assert.equal(w.tyreSamples,4);
 assert.equal(w.minWheelGap,.006);
 assert(w.maxWheelGap<=.146);
 assert(w.groupY>dem(x,z)+.045);
}
assert(good>=2,JSON.stringify({good}));
const audit=inspectItalskaRoadHeight5257(model,segments);
assert(audit.ready,JSON.stringify(audit));
assert(audit.baselineWheelEmbeddingMetres>.05);
assert.equal(audit.plannedVisualAirMetres,.006);
assert.equal(audit.playerTrafficUnchanged,true);
assert.equal(createItalskaRoadHeight5257({
 roadPlan:{...roadPlan,roadGeometryHash:'drift'},
 segments,terrainAt:dem}),null);
assert.equal(createItalskaRoadHeight5257({roadPlan,
 segments:segments.map(s=>s===narrow[0]?{...s,width:7.8}:s),
 terrainAt:dem}),null);
assert.equal(createItalskaRoadHeight5257({roadPlan,
 segments,terrainAt:()=>NaN}),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8'),
 models=readFileSync(new URL('./world-models.js',import.meta.url),'utf8');
for(const token of [
 'osm-italska-strip-wheel-height-5257.js?v=525700',
 'createItalskaRoadHeight5257({',
 'window.__miloviceItalskaRoadHeightRuntime5257=()=>',
 'italskaRoadHeightModel5257?.wheelSupport({',
 "const BUILD_ID='20261121-italska-npc-wheel-height-525700'",
 'const along=Math.max(1,Math.ceil(len/(width>=2?4:7))),across=width>=3?4:1;',
 'vertices.push(xx,terrainAt(xx,zz)+y,zz);',
 'indices.push(k,k+1,next,k+1,next+1,next);',
 'osmStrip(a,b,width,osmRoadMaterial,.17);'
])assert(html.includes(token),'Road mesh or 5.257 integration drift: '+token);
assert(models.includes('pivot.position.set(side*xOffset,radius+.045,z)'));
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),data);
console.log('PASS 5.257: '+good+' vehicle wheel probes match existing DEM road triangles and 6mm visual tyre clearance; OSM and player preserved');
