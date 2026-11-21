/** Milovice RP 5.251 - additional ORIGINAL north facade edges of the
 * historic Vojenske zatisi, supported by a newly found public Rakouska photo.
 * 
 * Source photograph: Stanislav Doronenko, Rakouska (Milovice) 15.jpg,
 * 20 August 2025, CC BY-SA 4.0, 50.226027 N / 14.874584 E
 * https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg
 *
 * The photo GPS supports an additional viewing direction; edge visibility
 * is inferred solely from the unchanged original OSM footprint. Any facade
 * paint/wear on newly included walls is a visual MODEL extrapolation and
 * is NOT claimed photo-measured. No new footprints, doors or colliders.
 */
import {ITALSKA_VOJENSKE_ZATISI_5249 as source}
 from './osm-italska-vojen-zatisi-5249.js';
export const RAKOUSKA_NORTH_PHOTO_5251=Object.freeze({
 regionId:'mlada',osmId:'53865882',ruianId:'40057411',
 sourceHash:'7aec42bc',vertices:29,
 camera:Object.freeze({lat:50.226027,lon:14.874584}),
 image:'https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg',
 author:'Stanislav Doronenko',date:'2025-08-20',license:'CC BY-SA 4.0',
 northCameraEstimatedHeading:168,
 exactFacadeDetailsMeasured:false
});
const project=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const oriented=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
const occludes=(a,b,c,d)=>{
 const p=oriented(a,b,c),q=oriented(a,b,d);
 const r=oriented(c,d,a),s=oriented(c,d,b);
 return p*q< -1e-7&&r*s< -1e-7;
};
const fmt=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
function hash(geometry){
 let h=2166136261;
 for(const c of geometry.map(fmt).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
}
const oldIndices=[6,9,11,12,13,14,16,18,19,21,22,24];
export function extendRakouskaNorthPhoto5251({plan,geometry}={}){
 const c=RAKOUSKA_NORTH_PHOTO_5251;
 if(plan?.version!=='5.250'||plan?.sourceOsmId!==c.osmId||
  plan?.sourceRuianId!==c.ruianId||
  plan?.sourceHash!==c.sourceHash||
  plan?.originalVertices!==c.vertices||
  plan?.photoFacingCandidates5250!==15||
  plan?.occludedOriginalWallEdges5250!==3||
  !Array.isArray(plan.visibleEdges)||
  plan.visibleEdges.length!==oldIndices.length||
  !oldIndices.every((v,i)=>plan.visibleEdges[i]?.edge===v)||
  !Array.isArray(geometry)||geometry.length!==c.vertices||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  fmt(geometry[0])!==fmt(geometry.at(-1))||
  hash(geometry)!==c.sourceHash)return null;
 const pts=geometry.slice(0,-1).map(project);
 let signedArea2=0;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length];
  signedArea2+=a.x*b.z-b.x*a.z;
 }
 if(!Number.isFinite(signedArea2)||Math.abs(signedArea2)*.5<912||
  Math.abs(signedArea2)*.5>916)return null;
 const winding=Math.sign(signedArea2),camera=project(c.camera);
 const used=new Set(oldIndices),added=[];
 let facing=0,blocked=0;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length],len=distance(a,b);
  if(len<1.6||used.has(i))continue;
  const nx=winding*(b.z-a.z)/len,nz=-winding*(b.x-a.x)/len;
  const mid={x:(a.x+b.x)*.5,z:(a.z+b.z)*.5};
  const dx=camera.x-mid.x,dz=camera.z-mid.z,d=Math.hypot(dx,dz);
  if(!(d>3&&d<95&&(dx*nx+dz*nz)/d>.25))continue;
  facing++;
  if(pts.some((p,j)=>j!==i&&occludes(camera,mid,p,pts[(j+1)%pts.length]))){
   blocked++;continue;
  }
  added.push({edge:i,a,b,len,nx,nz,photoCameraCount:1,
   modelEstimated:true,rakouskaPhotoVisible5251:true,
   sightlineUnobstructed5250:true});
 }
 if(added.length!==6||added.some(e=>!Number.isFinite(e.len)))return null;
 const combined=[...plan.visibleEdges,...added].sort((a,b)=>a.edge-b.edge);
 if(combined.length!==18)return null;
 return {...plan,version:'5.251',visibleEdges:combined,
  photoViews:3,photoSources:[...plan.photoSources,c.image],
  rakouskaNewPhotoSource5251:c.image,
  rakouskaNorthVisibleEdgeIds5251:added.map(e=>e.edge),
  rakouskaNorthAddedEdges5251:added.length,
  rakouskaNorthFacingCandidates5251:facing,
  rakouskaNorthSelfOccluded5251:blocked,
  originalFootprintPreserved:true,
  sourceGeometryPreserved:true,
  photoHeadingEstimated:true,
  newlyDecoratedFacadesPhotoMeasured:false,
  newlyDecoratedFacadesModelEstimated:true,
  newWindows:0,newEntrances:0,newColliders:0,newBuildings:0,
  newStreetFurniture:0};
}
