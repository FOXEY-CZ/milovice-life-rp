/** Milovice RP 5.205 — close tiny existing paving-ribbon gaps at mapped
 * Višňová corners near the original two-floor RÚIAN parking house.
 * There are NO new footways: just the narrow missing triangles between two
 * previously rendered segments of the SAME original OSM way. Coordinates,
 * widths and surface tags stay untouched; photo appearance is not claimed.
 */
import {planMladaFootwayCorners} from './osm-mlada-footway-joins-5106.js';
import {planVisnovaTaggedPavers5204,VISNOVA_TAGGED_PAVERS_5204}
 from './osm-visnova-tagged-pavers-5204.js';
import {planVisnovaParkingMap5203} from './osm-visnova-parking-map-5203.js';

const MAX_DISTANCE=230;
export function planVisnovaPaverCorners5205({
 regionId,ways,parkingHouse,toWorld,roads,buildings
}={}){
 if(regionId!=='mlada'||!Array.isArray(ways)||
  !roads?.isClear||!buildings?.isClear||typeof toWorld!=='function')return null;
 const pin=planVisnovaParkingMap5203({
  regionId,building:parkingHouse,toWorld
 });
 if(!pin?.insideMappedBuilding)return null;
 const sourceWays=[];
 for(const source of VISNOVA_TAGGED_PAVERS_5204.ways){
  const matching=ways.filter(w=>String(w?.id)===source.id);
  if(matching.length!==1)return null;
  const way=matching[0];
  if(!planVisnovaTaggedPavers5204(regionId,way))return null;
  const points=way.geometry.map(toWorld);
  if(points.some(p=>!Number.isFinite(p?.x)||
   !Number.isFinite(p?.y??p?.z)))return null;
  sourceWays.push({id:way.id,tags:way.tags,points});
 }
 const old=planMladaFootwayCorners(sourceWays,{
  anchor:{x:pin.point.x,z:pin.point.z,sourceId:pin.sourceBuildingId},
  maxDistance:MAX_DISTANCE,maxTriangles:80,roads,buildings
 });
 if(old.triangles.some(t=>
  !VISNOVA_TAGGED_PAVERS_5204.ways.some(s=>s.id===t.sourceWayId)||
  t.materialSource!=='paving_stones'||!t.onlyFillsExistingPathBend
 ))return null;
 return {
  version:'5.205',
  sourceParkingHouseId:pin.sourceBuildingId,
  sourcePaverWayIds:VISNOVA_TAGGED_PAVERS_5204.ways.map(w=>w.id),
  renderedCornerWayIds:[...new Set(old.triangles.map(t=>t.sourceWayId))],
  anchorIsInsideMappedParkingHouse:true,
  material:VISNOVA_TAGGED_PAVERS_5204.material,
  cornerTriangles:old.triangles,plannedTriangles:old.triangles.length,
  rejectedRoad:old.skippedNearCarriageway,
  rejectedBuilding:old.skippedNearBuilding,
  sourceGeometryUntouched:true,sourceRoadWidthsUntouched:true,
  photoVerifiedAppearance:false,
  newFootways:0,newRoads:0,newCrossings:0,newColliders:0
 };
}

export function renderVisnovaPaverCorners5205(THREE,{
 plan,layer,terrainAt,material
}={}){
 if(plan?.version!=='5.205'||!Array.isArray(plan.cornerTriangles)||
  !THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||!THREE?.Mesh||
  !material||typeof layer?.add!=='function'||typeof terrainAt!=='function')
  return null;
 const positions=[],uv=[];
 for(const {a,b,c} of plan.cornerTriangles){
  if([a,b,c].some(p=>!Number.isFinite(p?.x)||
   !Number.isFinite(p?.z)))return null;
  const winding=(a.x-c.x)*(b.z-c.z)-(a.z-c.z)*(b.x-c.x);
  if(Math.abs(winding)<1e-8)return null;
  const triangle=winding>0?[c,b,a]:[c,a,b];
  for(const p of triangle){
   const y=terrainAt(p.x,p.z)+.137;
   if(!Number.isFinite(y))return null;
   positions.push(p.x,y,p.z);
   uv.push(p.x/8,p.z/8);
  }
 }
 if(!positions.length)return {version:'5.205',triangles:0,drawMeshes:0,
  visibleMeshes:()=>0,ready:true};
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
 geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
 geometry.computeVertexNormals();geometry.computeBoundingSphere();
 const mesh=new THREE.Mesh(geometry,material);
 mesh.name='Višňová_původní_dlážděné_rohy_5205';
 mesh.userData={sourceOSMWays:plan.renderedCornerWayIds,
  sourceParkingHouse:plan.sourceParkingHouseId,
  onlyExistingOSMFootwayBends:true,photoVerified:false};
 layer.add(mesh);
 return {version:'5.205',triangles:positions.length/9,drawMeshes:1,
  ready:mesh.parent===layer,
  visibleMeshes:()=>{
   for(let node=mesh;node;node=node.parent)if(node.visible===false)return 0;
   return mesh.parent===layer?1:0;
  }};
}
