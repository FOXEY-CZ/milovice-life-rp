/** Milovice RP 5.220 — continuous two-way original OSM paving-stone
 * sidewalks along THREE RÚIAN residential buildings on east Višňová.
 *
 * Confirmed OSM: original geometry, footway=sidewalk, lit=yes,
 * surface=paving_stones. Unknown: true brick size, pattern, shade,
 * curbs. This is a material treatment of ALREADY RENDERED 371.6m
 * footpaths plus tiny wedge corrections at ORIGINAL sharp turns.
 * No new way vertices, routes, width changes, curbs, parking, collisions.
 */
import {planMladaFootwayCorners} from './osm-mlada-footway-joins-5106.js';
export const VISNOVA_ESTATE_PAVERS_5220=Object.freeze({
 region:'mlada',material:'visnova-tagged-paving-stones',
 paths:Object.freeze([
  Object.freeze({id:'1005977571',nodes:7,hash:'263e12b3',
   expectedLength:301.170}),
  Object.freeze({id:'1057549994',nodes:6,hash:'02767378',
   expectedLength:70.465})
 ]),
 modelWidthMeters:1.8,exactPaverPatternPhotoVerified:false
});
const k=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(k).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({
 x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320
});
export function planVisnovaEstatePavers5220(regionId,way){
 const c=VISNOVA_ESTATE_PAVERS_5220;
 if(regionId!==c.region)return null;
 const spec=c.paths.find(p=>p.id===String(way?.id));
 if(!spec)return null;
 const g=way?.geometry,t=way?.tags||{};
 if(t.highway!=='footway'||t.footway!=='sidewalk'||
  t.lit!=='yes'||t.surface!=='paving_stones'||
  Object.keys(t).length!==4||
  !Array.isArray(g)||g.length!==spec.nodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(g)!==spec.hash)return null;
 const points=g.map(xy);
 let length=0;
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i];
  const dist=Math.hypot(a.x-b.x,a.z-b.z);
  if(dist<.5||dist>250)return null;
  length+=dist;
 }
 if(Math.abs(length-spec.expectedLength)>.35)return null;
 return {
  version:'5.220',sourceOSMId:spec.id,sourceHash:spec.hash,
  originalNodes:spec.nodes,sourceSegments:spec.nodes-1,
  originalLengthMeters:+length.toFixed(3),
  material:c.material,
  originalTag:'paving_stones',modelPaverShadeUnverified:true,
  originalOSMGeometryUntouched:true,sourceSidewalkWidthUnchanged:true,
  newFootways:0,newRoads:0,newColliders:0,newParkingSpaces:0,
  changedRoadCoordinates:0
 };
}
export function planVisnovaEstatePaverTurns5220({
 regionId,ways,toWorld,roads,buildings
}={}){
 const cfg=VISNOVA_ESTATE_PAVERS_5220;
 if(regionId!==cfg.region||!Array.isArray(ways)||
  typeof toWorld!=='function'||typeof roads?.isClear!=='function'||
  typeof buildings?.isClear!=='function')return null;
 // Validate ALL relevant ways before generating any geometry. This must
 // fail closed if even the visually straight 301m street route changes.
 const source=cfg.paths.map(spec=>{
  const matching=ways.filter(w=>String(w?.id)===spec.id);
  return matching.length===1&&planVisnovaEstatePavers5220(regionId,matching[0])
   ?matching[0]:null;
 });
 if(source.some(s=>!s))return null;
 const original=source.map(w=>({
  id:w.id,tags:w.tags,points:w.geometry.map(toWorld)
 }));
 const anchor=original[1].points[0];
 if(!Number.isFinite(anchor?.x)||
  !Number.isFinite(anchor?.z??anchor?.y))return null;
 const old=planMladaFootwayCorners(original,{
  anchor:{x:anchor.x,z:anchor.z??anchor.y,
   sourceId:cfg.paths[1].id},
  maxDistance:240,maxTriangles:12,roads,buildings
 });
 const triangles=old.triangles.filter(t=>
  cfg.paths.some(s=>s.id===t.sourceWayId)&&
  t.materialSource==='paving_stones'&&
  t.kind==='footway'&&t.onlyFillsExistingPathBend===true&&
  t.area>.001&&t.area<1);
 if(triangles.length!==old.triangles.length)return null;
 return {
  version:'5.220',
  sourceWayIds:source.map(s=>String(s.id)),
  sourceNodes:source.map(s=>s.geometry.length),
  originalLengthMeters:cfg.paths.reduce((sum,p)=>sum+p.expectedLength,0),
  sourceSegments:cfg.paths.reduce((sum,p)=>sum+p.nodes-1,0),
  material:cfg.material,cornerTriangles:triangles,
  candidateTurns:triangles.length,
  rejectedNearCarriageway:old.skippedNearCarriageway,
  rejectedNearBuildings:old.skippedNearBuilding,
  rejectedShallowBends:old.skippedStraightOrSharp,
  originalFootwayGeometryUntouched:true,
  originalRoadWidthsUntouched:true,
  exactPaverPatternPhotoVerified:false,
  newFootwayRoutes:0,newRoads:0,newCrossings:0,
  newColliders:0,newTrees:0,newKerbs:0
 };
}
export function renderVisnovaEstatePaverTurns5220(THREE,{
 plan,layer,terrainAt,material
}={}){
 if(plan?.version!=='5.220'||!Array.isArray(plan.cornerTriangles)||
  typeof layer?.add!=='function'||typeof terrainAt!=='function'||
  !THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||
  !THREE?.Mesh||!material)return null;
 const positions=[],uvs=[];
 for(const {a,b,c} of plan.cornerTriangles){
  if([a,b,c].some(v=>!Number.isFinite(v?.x)||
   !Number.isFinite(v?.z)))return null;
  const winding=(a.x-c.x)*(b.z-c.z)-(a.z-c.z)*(b.x-c.x);
  if(Math.abs(winding)<1e-8)return null;
  const oriented=winding>0?[c,b,a]:[c,a,b];
  for(const p of oriented){
   const y=terrainAt(p.x,p.z)+.137;
   if(!Number.isFinite(y))return null;
   positions.push(p.x,y,p.z);
   uvs.push(p.x/8,p.z/8);
  }
 }
 if(!positions.length)return {
  triangles:0,drawMeshes:0,attached:()=>true,
  visibleAfterLOD:()=>0,noGeometryNeeded:true
 };
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',
  new THREE.Float32BufferAttribute(positions,3));
 geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
 geo.computeVertexNormals();geo.computeBoundingSphere();
 const mesh=new THREE.Mesh(geo,material);
 mesh.name='Milovice_Visnova_Original_Estate_Paving_Corners_5220';
 mesh.userData={sourceOSMIds:plan.sourceWayIds,
  onlyOriginalOSMFootwayBends:true,modelShadePhotoVerified:false};
 layer.add(mesh);
 return {
  triangles:positions.length/9,drawMeshes:1,
  attached:()=>mesh.parent===layer,
  visibleAfterLOD:()=>{
   if(mesh.parent!==layer)return 0;
   for(let p=mesh;p;p=p.parent)if(p.visible===false)return 0;
   return 1;
  },
  materialIsOriginalTaggedPaving:true
 };
}
