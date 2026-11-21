/** Milovice RP 5.249 — photograph-informed restoration of ONE original
 * Italská OSM footprint (way 53865882 / RÚIAN 40057411).
 *
 * Photos: "Italská, Milovice 04.jpg" and "05.jpg", Stanislav Doronenko,
 * 20 August 2025, CC BY-SA 4.0, Wikimedia Commons:
 * https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_04.jpg
 * https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_05.jpg
 *
 * Photographs show an aged off-white, apparently two-storey former
 * Vojenské zátiší / army garrison building with a horizontal moulding,
 * pale worn render and exposed brick/plaster patches. The original OSM
 * record only says building=yes; neither floor count nor precise
 * roof/windows/door measurements follow from OSM.
 *
 * NO photo pixels are embedded. The deterministic decorative meshes are
 * explicitly estimated and only attached to SOURCE exterior walls visible
 * from the two geotagged photo camera positions. No doors, windows,
 * new footprints, guessed fences, colliders or traffic edits.
 */
export const ITALSKA_VOJENSKE_ZATISI_5249=Object.freeze({
 regionId:'mlada',osmId:'53865882',ruianId:'40057411',
 sourceHash:'7aec42bc',vertices:29,areaMin:912,areaMax:916,
 approximateWall:'#e2ded3',approximateRoof:'#655e54',
 photoVerifiedSiteStyle:true,photoMeasuredDetails:false,
 cameras:Object.freeze([
  Object.freeze({lat:50.225218,lon:14.874681,source:'04'}),
  Object.freeze({lat:50.225548,lon:14.875192,source:'05'})
 ]),
 photos:Object.freeze([
  'https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_04.jpg',
  'https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_05.jpg'
 ]),
 author:'Stanislav Doronenko',license:'CC BY-SA 4.0',date:'2025-08-20'
});
const valid=p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon);
const fmt=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const fingerprint=g=>{
 let h=2166136261;
 for(const c of g.map(fmt).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const project=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const length=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);
function sourceGeometry(geometry){
 if(!Array.isArray(geometry)||geometry.length!==ITALSKA_VOJENSKE_ZATISI_5249.vertices||
    geometry.some(p=>!valid(p))||fmt(geometry[0])!==fmt(geometry.at(-1))||
    fingerprint(geometry)!==ITALSKA_VOJENSKE_ZATISI_5249.sourceHash)
  return null;
 const pts=geometry.slice(0,-1).map(project);
 let twice=0;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length];twice+=a.x*b.z-b.x*a.z;
 }
 const area=Math.abs(twice)*.5;
 if(area<ITALSKA_VOJENSKE_ZATISI_5249.areaMin||
    area>ITALSKA_VOJENSKE_ZATISI_5249.areaMax)return null;
 return {pts,winding:Math.sign(twice),area};
}
export function planItalskaVojenskeZatisi5249({
 regionId,building,photoReviewed=false,approvedArchitecture=false
}={}){
 const c=ITALSKA_VOJENSKE_ZATISI_5249;
 if(regionId!==c.regionId||String(building?.id)!==c.osmId||
  photoReviewed!==false||approvedArchitecture!==false)return null;
 const tags=building?.tags;
 if(!tags||tags.building!=='yes'||tags.source!=='cuzk:ruian'||
  tags['ref:ruian:building']!==c.ruianId||Object.keys(tags).length!==3)
  return null;
 const original=sourceGeometry(building.geometry);
 if(!original)return null;
 const cams=c.cameras.map(project);
 const visibleEdges=[];
 for(let i=0;i<original.pts.length;i++){
  const a=original.pts[i],b=original.pts[(i+1)%original.pts.length];
  const len=length(a,b);
  if(len<1.6)continue;
  const nx=original.winding*(b.z-a.z)/len,
    nz=-original.winding*(b.x-a.x)/len;
  const mid={x:(a.x+b.x)/2,z:(a.z+b.z)/2};
  const cameraViews=cams.filter(camera=>{
   const dx=camera.x-mid.x,dz=camera.z-mid.z;
   const d=Math.hypot(dx,dz);
   return d>3&&d<95&&(dx*nx+dz*nz)/d>.25;
  });
  if(!cameraViews.length)continue;
  visibleEdges.push({edge:i,a,b,len,nx,nz,
   photoCameraCount:cameraViews.length,modelEstimated:true});
 }
 if(!visibleEdges.length)return null;
 return {
  version:'5.249',sourceOsmId:c.osmId,sourceRuianId:c.ruianId,
  sourceHash:c.sourceHash,originalVertices:c.vertices,
  originalAreaSquareMetres:+original.area.toFixed(2),
  visibleEdges,photoViews:2,
  wallHex:c.approximateWall,roofHex:c.approximateRoof,
  photoSources:c.photos,author:c.author,license:c.license,
  photoShowsTwoFloors:true,osmFloorCountUnspecified:true,
  materialColoursEstimated:true,wearPatchLocationsEstimated:true,
  originalFootprintPreserved:true,originalRoofGeometryPreserved:true,
  newWindows:0,newEntrances:0,newColliders:0,newBuildings:0,
  newStreetFurniture:0
 };
}
export function renderItalskaVojenskeZatisi5249(THREE,{
 plan,layer,baseHeight,roofHeight
}={}){
 if(!plan?.visibleEdges?.length||!THREE||!layer||
  !Number.isFinite(baseHeight)||!Number.isFinite(roofHeight)||
  roofHeight<4||roofHeight>16)return null;
 const trim=[],wear=[];
 // A thin mid-storey belt and peeling-render marks, painted OUTSIDE source
 // walls. Heights and damaged patches are not surveyed; they follow the
 // photo's general aged appearance rather than pixel tracing.
 const quad=(dst,a,b,c,d)=>{
  for(const p of [a,b,c,a,c,d])dst.push(p.x,p.y,p.z);
 };
 let trimEdges=0,wearPatches=0;
 for(const e of plan.visibleEdges){
  const {a,b,len,nx,nz}=e;
  const at=(t,y,out=.035)=>({
   x:a.x+(b.x-a.x)*t+nx*out,
   y:baseHeight+y,
   z:a.z+(b.z-a.z)*t+nz*out
  });
  const lo=.09/len,hi=1-lo;
  quad(trim,at(lo,2.97),at(hi,2.97),at(hi,3.10),at(lo,3.10));
  trimEdges++;
  // Only longer PHOTO-FACING walls get any wear; no guessed patterned
  // doors, windows, balconies, arches, fences, kerbs or entrances.
  if(len<4.4)continue;
  const count=Math.min(3,Math.floor(len/8)+1);
  for(let j=0;j<count;j++){
   const t=(j+1)/(count+1)+(e.edge%3-1)*.022;
   const width=Math.min(1.4,len*.12),halfT=width/(2*len);
   const y=.58+((e.edge*3+j*5)%7)*.19;
   const span=.60+((e.edge+j)%3)*.13;
   const seed=(e.edge*17+j*23)%5;
   const poly=[
    at(t-halfT,y+.12,.044),
    at(t-halfT*.55,y+span+.06,.044),
    at(t+halfT*.55,y+span-.10,.044),
    at(t+halfT,y+.15+.015*seed,.044),
    at(t+halfT*.20,y,.044),
    at(t-halfT*.64,y+.01,.044)
   ];
   for(let k=1;k<poly.length-1;k++){
    for(const p of [poly[0],poly[k],poly[k+1]])
     wear.push(p.x,p.y,p.z);
   }
   wearPatches++;
  }
 }
 const meshes=[];
 for(const [name,vertices,color] of [
  ['photo-horizontal-plaster-course',trim,0xc2b8a9],
  ['estimated-aged-plaster-marks',wear,0xa18b7d]
 ]){
  if(!vertices.length)continue;
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geo.computeVertexNormals();geo.computeBoundingSphere();
  const mat=new THREE.MeshStandardMaterial({color,roughness:1,
   side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1});
  const mesh=new THREE.Mesh(geo,mat);
  mesh.name='Milovice_Italska_VojenskeZatisi_5249_'+name;
  mesh.userData.lodDetail=true;
  mesh.receiveShadow=true;
  layer.add(mesh);meshes.push(mesh);
 }
 return {
  drawMeshes:meshes.length,decorativeTriangles:(trim.length+wear.length)/9,
  trimEdges,wearPatches,
  sourceBuildingId:plan.sourceOsmId,originalAreaSquareMetres:plan.originalAreaSquareMetres,
  sourceGeometryPreserved:true,photoObservedWeathering:true,
  wearLocationsMeasured:false,newColliders:0,
  inScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(m=>m.parent===layer&&m.visible).length
 };
}
