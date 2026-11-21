/** Milovice RP 5.226 — ORIGINAL Mladá Lesní footway branch network.
 * Validates one lit but surface-untagged pedestrian route, TWO existing
 * short footway connections to original OSM residential road vertices,
 * and the exact source-tagged paved sidewalk at its opposite end.
 * No invented footpaths, curbs, zebra, road crossing or entrance.
 * A small wedge at the ONE original distinct bend is permitted only
 * after clearance checks against both buildings and carriageways.
 */
import {planMladaFootwayCorners} from './osm-mlada-footway-joins-5106.js';
export const LESNI_FOOTWAY_BRANCHES_5226=Object.freeze({
 region:'mlada',material:'visnova-footway-model',
 main:Object.freeze({id:'1352859035',nodes:5,hash:'bb42422e',
  meters:49.415,segments:4,lit:'yes'}),
 branches:Object.freeze([
  Object.freeze({id:'1352859040',nodes:2,hash:'4af0a7a6',meters:3.710,segments:1,
   atMainNode:2,atRoadNode:2}),
  Object.freeze({id:'1352859041',nodes:2,hash:'12c5eac0',meters:3.430,segments:1,
   atMainNode:1,atRoadNode:1})
 ]),
 paved:Object.freeze({id:'1057549994',nodes:6,hash:'02767378',
  meters:70.465,segments:5,surface:'paving_stones',lit:'yes'}),
 road:Object.freeze({id:'1044078106',nodes:6,hash:'d1ac81dd',
  highway:'residential',meters:55.052}),
 existingSourceSegments:11,existingNetworkMeters:127.020,
 modeledFootwaySegments:6,modeledFootwayMeters:56.555,
 originalBendNode:3,modelFootwayWidth:1.8,
 actualSurfaceNotDocumented:true,photoVerified:false
});
const canonical=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(canonical).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320});
const length=g=>{
 const pts=g.map(xy);let s=0;
 for(let i=1;i<pts.length;i++){
  const n=Math.hypot(pts[i].x-pts[i-1].x,pts[i].z-pts[i-1].z);
  if(!(n>.3&&n<250))return NaN;
  s+=n;
 }
 return s;
};
const exactTags=(t,keys)=>!!t&&Object.keys(t).length===keys.length&&
 keys.every(k=>Object.hasOwn(t,k));
export function planLesniFootwayBranches5226(regionId,ways){
 const cfg=LESNI_FOOTWAY_BRANCHES_5226;
 if(regionId!==cfg.region||!Array.isArray(ways))return null;
 const specs=[cfg.main,...cfg.branches,cfg.paved,cfg.road],items=[];
 for(const c of specs){
  const found=ways.filter(w=>String(w?.id)===c.id);
  if(found.length!==1)return null;
  const way=found[0],g=way.geometry,t=way.tags;
  if(!Array.isArray(g)||g.length!==c.nodes||
   g.some(v=>!Number.isFinite(v?.lat)||!Number.isFinite(v?.lon))||
   hash(g)!==c.hash||Math.abs(length(g)-c.meters)>.12)return null;
  if(c===cfg.main){
   if(!exactTags(t,['highway','lit'])||
    t.highway!=='footway'||t.lit!==c.lit)return null;
  }else if(cfg.branches.includes(c)){
   if(!exactTags(t,['highway'])||t.highway!=='footway')return null;
  }else if(c===cfg.paved){
   if(!exactTags(t,['footway','highway','lit','surface'])||
    t.highway!=='footway'||t.footway!=='sidewalk'||
    t.lit!==c.lit||t.surface!==c.surface)return null;
  }else{
   if(!exactTags(t,['highway'])||t.highway!==c.highway)return null;
  }
  items.push(way);
 }
 const [main,a,b,paved,road]=items.map(w=>w.geometry);
 if(canonical(main.at(-1))!==canonical(paved[1])||
  canonical(a[0])!==canonical(main[cfg.branches[0].atMainNode])||
  canonical(b[0])!==canonical(main[cfg.branches[1].atMainNode])||
  canonical(a.at(-1))!==canonical(road[cfg.branches[0].atRoadNode])||
  canonical(b.at(-1))!==canonical(road[cfg.branches[1].atRoadNode]))
  return null;
 const amount=[cfg.main,...cfg.branches,cfg.paved].reduce((n,c)=>n+c.meters,0);
 if(Math.abs(amount-cfg.existingNetworkMeters)>.001)return null;
 return {
  version:'5.226',sourceWayIds:specs.slice(0,4).map(c=>c.id),
  sourceHashes:specs.slice(0,4).map(c=>c.hash),
  sourceRoadId:cfg.road.id,sourceRoadHash:cfg.road.hash,
  originalFootwaySegments:cfg.existingSourceSegments,
  originalFootwayMeters:cfg.existingNetworkMeters,
  neutralFootwayIds:[cfg.main.id,...cfg.branches.map(b=>b.id)],
  neutralSourceSegments:cfg.modeledFootwaySegments,
  neutralOriginalMeters:cfg.modeledFootwayMeters,
  neutralMaterial:cfg.material,neutralSurfaceIsUntagged:true,
  pavedSourceWayId:cfg.paved.id,pavedSourceSurface:cfg.paved.surface,
  pavedOriginalSegments:cfg.paved.segments,
  mainToPavedJunctionGPS:canonical(main.at(-1)),
  branchToMainGPS:[canonical(a[0]),canonical(b[0])],
  branchToRoadGPS:[canonical(a.at(-1)),canonical(b.at(-1))],
  originalPedestrianConnections:true,
  realRoadJunctionsConfirmed:true,
  sourceGeometryPreserved:true,realSurfaceNotVerified:true,
  estimatedCornerPatchOnly:true,originalBendNode:cfg.originalBendNode,
  addedRoads:0,addedFootways:0,addedRoadCrossings:0,
  inventedZebraStripes:0,addedBuildings:0,addedColliders:0,
  addedTrees:0,addedKerbs:0,addedEntrances:0
 };
}
export function planLesniFootwayBranchCorner5226({
 regionId,ways,toWorld,roads,buildings
}={}){
 const base=planLesniFootwayBranches5226(regionId,ways);
 if(!base||typeof toWorld!=='function'||
  typeof roads?.isClear!=='function'||
  typeof buildings?.isClear!=='function')return null;
 const cfg=LESNI_FOOTWAY_BRANCHES_5226;
 const main=ways.find(w=>String(w.id)===cfg.main.id);
 const points=main.geometry.map(toWorld);
 if(points.some(p=>!Number.isFinite(p?.x)||
  !Number.isFinite(p?.z??p?.y)))return null;
 const node=points[cfg.originalBendNode];
 const old=planMladaFootwayCorners([{
  id:cfg.main.id,tags:main.tags,points
 }],{
  anchor:{x:node.x,z:node.z??node.y,sourceId:cfg.main.id},
  roads,buildings,maxDistance:80,maxTriangles:2
 });
 const tris=old.triangles.filter(t=>t.sourceWayId===cfg.main.id&&
  t.atNode===cfg.originalBendNode&&
  t.onlyFillsExistingPathBend===true&&t.kind==='footway'&&
  t.materialSource===null&&t.width===cfg.modelFootwayWidth&&
  t.area>.01&&t.area<.75);
 if(tris.length!==old.triangles.length||tris.length>1)return null;
 return {
  version:'5.226',sourceWayId:cfg.main.id,originalBendNode:cfg.originalBendNode,
  safeOriginalBendTriangles:tris,
  rejectedRoad:old.skippedNearCarriageway,
  rejectedBuilding:old.skippedNearBuilding,
  rejectedStraight:old.skippedStraightOrSharp,
  newWalkwayLength:0,newWalkwayRoutes:0,newColliders:0,
  modelMaterial:cfg.material,modelAppearanceOnly:true
 };
}
export function renderLesniFootwayBranchCorner5226(THREE,{
 plan,layer,material,terrainAt
}={}){
 if(plan?.version!=='5.226'||!Array.isArray(plan.safeOriginalBendTriangles)||
  plan.safeOriginalBendTriangles.length>1||
  !THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||
  !THREE?.Mesh||!material||typeof terrainAt!=='function'||
  typeof layer?.add!=='function')return null;
 const tri=plan.safeOriginalBendTriangles[0];
 if(!tri)return {
  triangles:0,meshCount:0,attached:()=>true,visibleAfterLOD:()=>0,
  skippedUnsafeOrNotNeeded:true
 };
 const a=tri.a,b=tri.b,c=tri.c;
 const winding=(a.x-c.x)*(b.z-c.z)-(a.z-c.z)*(b.x-c.x);
 if(!Number.isFinite(winding)||Math.abs(winding)<1e-8)return null;
 const order=winding>0?[c,b,a]:[c,a,b],positions=[],uvs=[];
 for(const p of order){
  const y=terrainAt(p.x,p.z)+.137;
  if(!Number.isFinite(y))return null;
  positions.push(p.x,y,p.z);uvs.push(p.x/8,p.z/8);
 }
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
 geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
 geo.computeVertexNormals();geo.computeBoundingSphere();
 const mesh=new THREE.Mesh(geo,material);
 mesh.name='Milovice_Lesni_Original_One_Footway_Corner_5226';
 mesh.userData={originalOSMWayId:plan.sourceWayId,
  originalOSMBendNode:plan.originalBendNode,
  onlyOriginalOSMBend:true,estimatedSurface:true,lodDetail:false};
 layer.add(mesh);
 return {
  triangles:1,meshCount:1,
  attached:()=>mesh.parent===layer,
  visibleAfterLOD:()=>{
   if(mesh.parent!==layer)return 0;
   for(let p=mesh;p;p=p.parent)if(p.visible===false)return 0;
   return 1;
  }
 };
}
