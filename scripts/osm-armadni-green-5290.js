/** Milovice RP 5.290 — one tiny LOW-GPU decorative grass batch,
 * inside FOUR existing OSM landuse=grass polygons beside Armádní C13–C16.
 * The OSM grass areas are mapped; individual blades, shade and height are
 * purely model estimates, NOT surveyed landscaping or private gardens.
 * Every placement is guarded against ALL indexed road/footway ribbons and
 * original building footprints. No changes to lawn surfaces or collisions.
 */
export const ARMADNI_GREEN_5290=Object.freeze({
 regionId:'mlada',materialColor:0x719557,
 polygons:Object.freeze([
  Object.freeze({id:'1468803911',hash:'c7ceb279',nodes:8,maxTufts:5,houseArea:'west 886/887'}),
  Object.freeze({id:'1468803935',hash:'be913b93',nodes:6,maxTufts:4,houseArea:'west 886/887'}),
  Object.freeze({id:'1468803941',hash:'5fdeb513',nodes:6,maxTufts:6,houseArea:'east 890'}),
  Object.freeze({id:'1468803951',hash:'265067ff',nodes:8,maxTufts:24,houseArea:'east 891'})
 ]),
 source:'© OpenStreetMap contributors, checked-in mlada.json',
 exactBladePositionsVerified:false,exactSpeciesVerified:false,
 landscapingTypeEstimated:true,physicalCollidersAdded:0
});
const finite=v=>Number.isFinite(v);
const hash=g=>{
 let h=2166136261;
 for(const ch of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=ch.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const fract=x=>x-Math.floor(x);
const segDist=(p,a,b)=>{
 const dx=b.x-a.x,dz=b.z-a.z;
 const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz||1)));
 return Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);
};
const within=(p,poly)=>{
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.z>p.z)!==(b.z>p.z)&&
   p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)inside=!inside;
 }
 return inside;
};
export function planArmadniGreen5290({regionId,ways,toWorld,roads,buildings}={}){
 const conf=ARMADNI_GREEN_5290;
 if(regionId!==conf.regionId||!Array.isArray(ways)||
  typeof toWorld!=='function'||typeof roads?.isClear!=='function'||
  typeof buildings?.isClear!=='function')return null;
 const plans=[];
 for(const [index,info] of conf.polygons.entries()){
  const el=ways.find(e=>String(e?.id)===info.id);
  const g=el?.geometry;
  if(el?.tags?.landuse!=='grass'||Object.keys(el.tags).length!==1||
   !Array.isArray(g)||g.length!==info.nodes||
   g.some(p=>!finite(p?.lat)||!finite(p?.lon))||
   g[0].lat!==g.at(-1).lat||g[0].lon!==g.at(-1).lon||
   hash(g)!==info.hash)return null;
  const poly=g.map(toWorld).map(p=>({x:p.x,z:p.z??p.y}));
  if(poly.some(p=>!finite(p.x)||!finite(p.z)))return null;
  const closed=poly.slice(0,-1),origin=closed[0];
  const area=Math.abs(closed.reduce((n,p,i)=>{
   const q=closed[(i+1)%closed.length];
   return n+(p.x-origin.x)*(q.z-origin.z)-
    (p.z-origin.z)*(q.x-origin.x);
  },0)/2);
  // Reject altered footprints, not just altered OSM IDs or text labels.
  if(area<7||area>180)return null;
  const x0=Math.min(...closed.map(p=>p.x)),x1=Math.max(...closed.map(p=>p.x));
  const z0=Math.min(...closed.map(p=>p.z)),z1=Math.max(...closed.map(p=>p.z));
  const tufts=[];
  for(let i=1;i<=480&&tufts.length<info.maxTufts;i++){
   // Bounded low-discrepancy walk: NO Math.random or time-driven variation.
   const x=x0+fract(i*.61803398875+index*.173)*(x1-x0);
   const z=z0+fract(i*.41421356237+index*.239)*(z1-z0);
   const p={x,z};
   if(!within(p,closed))continue;
   if(Math.min(...closed.map((a,j)=>segDist(p,a,closed[(j+1)%closed.length])))<.33)
    continue; // Keep tiny tufts fully within original grass outline.
   if(!roads.isClear(x,z,.24,.05)||!buildings.isClear(x,z,.33))continue;
   if(tufts.some(q=>Math.hypot(q.x-x,q.z-z)<.92))continue;
   const n=tufts.length;
   tufts.push(Object.freeze({x,z,
    width:.16+(n%3)*.025,height:.19+(n%4)*.035,
    sourceOSMId:info.id,positionIsEstimate:true}));
  }
  plans.push(Object.freeze({sourceOSMId:info.id,sourceHash:info.hash,
   areaSquareMetres:+area.toFixed(2),sourceNodes:info.nodes,
   houseArea:info.houseArea,tufts:Object.freeze(tufts),
   maxTufts:info.maxTufts,sourceLanduse:'grass'}));
 }
 return Object.freeze({
  version:'5.290',sourceRegion:regionId,
  sourcePolygonIds:plans.map(p=>p.sourceOSMId),
  polygons:Object.freeze(plans),
  totalTufts:plans.reduce((n,p)=>n+p.tufts.length,0),
  modelBladePositionEstimated:true,modelBladeHeightEstimated:true,
  originalGrassPolygonVerticesUntouched:true,roadsAndFootwaysUnchanged:true,
  newLawnPolygons:0,newFootways:0,newRoads:0,newParkedCars:0,
  newColliders:0,newTrees:0,newEntrances:0
 });
}
const mats=new WeakMap();
export function renderArmadniGreen5290(THREE,{
 plan,terrainAt,layer
}={}){
 const conf=ARMADNI_GREEN_5290;
 if(plan?.version!=='5.290'||plan.sourceRegion!==conf.regionId||
  plan.modelBladePositionEstimated!==true||
  !Array.isArray(plan.polygons)||plan.polygons.length!==conf.polygons.length||
  !plan.polygons.every((p,i)=>
   p.sourceOSMId===conf.polygons[i].id&&
   p.sourceHash===conf.polygons[i].hash&&
   p.tufts.length<=conf.polygons[i].maxTufts)||
  plan.totalTufts<1||plan.totalTufts>39||
  !THREE?.Mesh||!THREE?.MeshLambertMaterial||
  !THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||
  typeof terrainAt!=='function'||!layer?.add)return null;
 const vertices=[];
 for(const poly of plan.polygons){
  for(const tuft of poly.tufts){
   const {x,z,width:w,height:h}=tuft;
   if(![x,z,w,h].every(finite))return null;
   const y=terrainAt(x,z);
   if(!finite(y))return null;
   // Two upright blades at right angles, double-sided, no horizontal
   // quad, no billboard texture, and no added movement obstruction.
   const bottom=y+.075,top=bottom+h;
   vertices.push(x-w,bottom,z,x+w,bottom,z,x,top,z,
    x,bottom,z-w,x,bottom,z+w,x,top,z);
  }
 }
 if(vertices.length!==plan.totalTufts*18)return null;
 let mat=mats.get(THREE);
 if(!mat){
  mat=new THREE.MeshLambertMaterial({
   color:conf.materialColor,side:THREE.DoubleSide,
   transparent:false,depthWrite:true
  });
  mats.set(THREE,mat);
 }
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 geo.computeVertexNormals();geo.computeBoundingSphere();
 const mesh=new THREE.Mesh(geo,mat);
 mesh.name='Milovice_Armadni_OSM_GrassPockets_5290';
 mesh.userData.sourceOSMIds=plan.sourcePolygonIds;
 mesh.userData.lodDetail=false;
 mesh.userData.surveyedBladePositions=false;
 mesh.userData.neverBlockFootways=true;
 mesh.receiveShadow=false;
 layer.add(mesh);
 const visible=()=>{for(let m=mesh;m;m=m.parent)
  if(m.visible===false)return 0;return 1;};
 return {
  version:'5.290',sourcePolygonIds:plan.sourcePolygonIds,
  originalMappedGrassPolygonCount:plan.polygons.length,
  tuftCount:plan.totalTufts,meshCount:1,
  triangleCount:plan.totalTufts*2,
  sourceLanduseVerified:true,positionsEstimated:true,
  allInScene:()=>mesh.parent===layer,
  visibleAfterLOD:visible,
  newLawnPolygons:0,newFootways:0,newRoads:0,
  newParkedCars:0,newColliders:0,newTrees:0
 };
}
