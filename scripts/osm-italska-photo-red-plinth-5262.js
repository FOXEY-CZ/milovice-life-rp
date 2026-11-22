/** Milovice RP 5.262 — the faded brick-red lower wall BAND visible in
 * Wikimedia Commons "Italská, Milovice 05.jpg", 20 Aug 2025, Doronenko,
 * CC BY-SA 4.0. Photo camera GPS: 50.225548,14.875192.
 * Original source building OSM 53865882 / RÚIAN 40057411, not a new wall.
 *
 * Placement along exact original edges is a conservative geometric estimate.
 * Height, red hue, plaster loss and precise bays are NOT measured from photo.
 * Do not invent doors/windows, plot lines, fencing, road furniture or a roof.
 */
import {ITALSKA_VOJENSKE_ZATISI_5249 as buildingSource}
 from './osm-italska-vojen-zatisi-5249.js';

export const ITALSKA_PHOTO_RED_PLINTH_5262=Object.freeze({
 regionId:'mlada',osmId:'53865882',ruianId:'40057411',
 originalHash:'7aec42bc',originalNodes:29,
 camera:Object.freeze({lat:50.225548,lon:14.875192}),
 photo:'https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_05.jpg',
 photoDate:'2025-08-20',author:'Stanislav Doronenko',
 licence:'CC BY-SA 4.0',
 // Only the substantial original walls that face this geotagged camera
 // AND survive 5.250 self-occlusion. Selection is geometric, not photo-fit.
 modelExteriorEdges:Object.freeze([11,12,13,14,16]),
 modelBaseHeightMetres:.12,modelTopHeightMetres:.84,
 modelRed:'#a17677',modelChipped:'#c2afa5',
 heightPhotoMeasured:false,redColourPhotoMeasured:false
});
const fmt=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const project=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const fingerprint=g=>{
 let h=2166136261;
 for(const ch of g.map(fmt).join(';')){
  h^=ch.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const cross=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
const intersect=(a,b,c,d)=>{
 const p=cross(a,b,c),q=cross(a,b,d),r=cross(c,d,a),s=cross(c,d,b);
 return p*q< -1e-7&&r*s< -1e-7;
};
export function planItalskaPhotoRedPlinth5262({regionId,building,plan}={}){
 const src=ITALSKA_PHOTO_RED_PLINTH_5262;
 if(regionId!==src.regionId||!building||String(building.id)!==src.osmId||
  building.tags?.building!=='yes'||
  building.tags?.source!=='cuzk:ruian'||
  building.tags?.['ref:ruian:building']!==src.ruianId||
  Object.keys(building.tags).length!==3||
  plan?.version!=='5.251'||plan?.sourceOsmId!==src.osmId||
  plan?.sourceRuianId!==src.ruianId||
  plan?.sourceHash!==src.originalHash||
  plan?.originalVertices!==src.originalNodes||
  plan?.rakouskaNorthAddedEdges5251!==6||
  !Array.isArray(plan?.visibleEdges)||plan.visibleEdges.length!==18||
  !Array.isArray(building.geometry)||
  building.geometry.length!==src.originalNodes||
  building.geometry.some(p=>!Number.isFinite(p.lat)||!Number.isFinite(p.lon))||
  fmt(building.geometry[0])!==fmt(building.geometry.at(-1))||
  fingerprint(building.geometry)!==src.originalHash)return null;
 const vertices=building.geometry.slice(0,-1).map(project),photo=project(src.camera);
 const signed=vertices.reduce((sum,a,i)=>{
  const b=vertices[(i+1)%vertices.length];
  return sum+a.x*b.z-b.x*a.z;
 },0);
 if(!(Math.abs(signed)*.5>912&&Math.abs(signed)*.5<916))return null;
 const winding=Math.sign(signed),edges=[];
 for(const i of src.modelExteriorEdges){
  const a=vertices[i],b=vertices[(i+1)%vertices.length];
  const len=distance(a,b),nx=winding*(b.z-a.z)/len,
   nz=-winding*(b.x-a.x)/len;
  const mid={x:(a.x+b.x)*.5,z:(a.z+b.z)*.5};
  const dx=photo.x-mid.x,dz=photo.z-mid.z,d=Math.hypot(dx,dz);
  const sourceEdge=plan.visibleEdges.find(e=>e.edge===i);
  if(!sourceEdge||!sourceEdge.sightlineUnobstructed5250||
   !Number.isFinite(len)||len<2.5||d<3||d>95||
   (dx*nx+dz*nz)/d<=.30||
   Math.hypot(sourceEdge.a.x-a.x,sourceEdge.a.z-a.z)>.001||
   Math.hypot(sourceEdge.b.x-b.x,sourceEdge.b.z-b.z)>.001||
   vertices.some((p,j)=>j!==i&&
    intersect(photo,mid,p,vertices[(j+1)%vertices.length])))
    return null;
  edges.push({edge:i,a,b,nx,nz,lengthMetres:len,modelHeight:.72,
   cameraVisibilityEstimated:true,physicalWallPreserved:true});
 }
 if(edges.length!==5)return null;
 return {version:'5.262',sourceOSMId:src.osmId,
  sourceRUIANId:src.ruianId,sourceHash:src.originalHash,
  photo:src.photo,author:src.author,licence:src.licence,
  photoEvidence:'faded reddish lower wall finish on Italská 05',
  photoCamera:src.camera,selectedOriginalEdges:edges.map(e=>e.edge),
  walls:edges,modelBaseHeightMetres:src.modelBaseHeightMetres,
  modelTopHeightMetres:src.modelTopHeightMetres,
  modelRed:src.modelRed,modelChipped:src.modelChipped,
  measuredFacadeHeight:false,estimatedPaintBoundaries:true,
  sourceGeometryPreserved:true,photoAnglesCalibrated:false,
  originalRoofPreserved:true,originalTrafficPreserved:true,
  newEntrances:0,newWindows:0,newFences:0,newBuildings:0,
  newRoads:0,newFootways:0,newColliders:0};
}
export function renderItalskaPhotoRedPlinth5262(THREE,{
 plan,layer,baseHeight,roofHeight,terrainAt
}={}){
 if(plan?.version!=='5.262'||!Array.isArray(plan.walls)||
  plan.walls.length!==5||!THREE||!layer||
  typeof terrainAt!=='function'||
  !Number.isFinite(baseHeight)||!Number.isFinite(roofHeight)||
  roofHeight<4||roofHeight>16)return null;
 const band=[],chips=[];
 const quad=(out,a,b,c,d)=>{
  for(const p of [a,b,c,a,c,d])out.push(p.x,p.y,p.z);
 };
 let observedWalls=0,estimatedWornAreas=0;
 let groundSamples=0,maxBottomGapMetres=0,minBottomGapMetres=Infinity;
 for(const wall of plan.walls){
  const {a,b,nx,nz,lengthMetres:len,edge}=wall;
  const at=(t,y,out=.067)=>({
   x:a.x+(b.x-a.x)*t+nx*out,
   y:baseHeight+y,
   z:a.z+(b.z-a.z)*t+nz*out
  });
  // On sloping DEM the building foundation extends DOWN from its highest
  // original corner. A fixed baseHeight strip would float above that
  // foundation. Drape the *paint* to existing local terrain instead.
  // No new basement, road grade, foundation geometry or colliders.
  const t0=.07/len,t1=1-t0;
  const segments=Math.max(1,Math.ceil(len/2.2));
  for(let k=0;k<segments;k++){
   const lo=t0+(t1-t0)*k/segments,hi=t0+(t1-t0)*(k+1)/segments;
   const groundAt=t=>{
    const p=at(t,0);
    const ground=terrainAt(p.x-nx*.067,p.z-nz*.067);
    if(!Number.isFinite(ground))return null;
    const lower=Math.min(baseHeight+.10,ground+.055);
    groundSamples++;
    const gap=lower-ground;
    minBottomGapMetres=Math.min(minBottomGapMetres,gap);
    maxBottomGapMetres=Math.max(maxBottomGapMetres,gap);
    return {...p,y:lower};
   };
   const left=groundAt(lo),right=groundAt(hi);
   if(!left||!right)return null; // fail closed on invalid DEM
   quad(band,left,right,
    at(hi,plan.modelTopHeightMetres),
    at(lo,plan.modelTopHeightMetres));
  }
  observedWalls++;
  // Chipped plaster is photo-supported in principle, but its precise
  // contours and locations are deterministic MODELS, never photogrammetry.
  const count=Math.min(4,Math.floor(len/3.5));
  for(let j=0;j<count;j++){
   const t=(j+1)/(count+1)+(edge%3-1)*.014;
   const half=Math.min(.42,len*.035)/len;
   const y=.17+(j%2)*.09,top=.40+((edge+j)%3)*.10;
   quad(chips,at(t-half,y,.074),at(t+half,y+.04,.074),
    at(t+half*.78,top,.074),at(t-half*.64,top+.025,.074));
   estimatedWornAreas++;
  }
 }
 const meshes=[];
 for(const [label,coords,color] of [
  ['photo05-faded-red-lower-plaster',band,plan.modelRed],
  ['photo05-estimated-exposed-plaster',chips,plan.modelChipped]
 ]){
  if(!coords.length)continue;
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));
  geo.computeVertexNormals();geo.computeBoundingSphere();
  const material=new THREE.MeshStandardMaterial({
   color,roughness:1,side:THREE.DoubleSide,
   polygonOffset:true,polygonOffsetFactor:-1
  });
  const mesh=new THREE.Mesh(geo,material);
  mesh.name='Milovice_VojenskeZatisi_5262_'+label;
  mesh.userData.lodDetail=true;
  mesh.receiveShadow=true;
  layer.add(mesh);meshes.push(mesh);
 }
 return {version:'5.262',sourceOSMId:plan.sourceOSMId,
  sourcePhoto:plan.photo,drawMeshes:meshes.length,
  renderedOriginalWallEdges:observedWalls,
  selectedOriginalEdges:plan.selectedOriginalEdges,
  estimatedWornAreas,paintBandTriangles:band.length/9,
  wornAreaTriangles:chips.length/9,
  terrainDrapedLowerPaint:true,groundSamples,
  maxBottomGapMetres,minBottomGapMetres,
  originalGeometryPreserved:true,modelPlacementNotMeasured:true,
  photoMaterialCharacterObserved:true,newEntrances:0,
  newWindows:0,newColliders:0,
  inScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(m=>m.parent===layer&&m.visible).length};
}
