// Milovice RP 5.67 — repairs the unpaved green wedge in the photographed
// Milovice railway-station forecourt. OSM defines the TWO bounding driveways;
// the user's 2022 Mapy.com screenshot independently confirms a broad pale
// paver island between asphalt lanes, with a rounded end. NO copyrighted
// screenshot pixels are imported or used as textures. Exact curb/stone outlines
// are NOT surveyed. Original 5.66 isolated narrow strips are removed.
import {isRoadFreeRect} from './road-clearance.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';

export const STATION_PARKING_REFERENCE=Object.freeze({
 westAccessWayId:675778842,eastStreetWayId:128308366,
 kind:'photo-and-OSM-anchored-forecourt-paver-island',
 photos:Object.freeze([
  {url:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B.jpg',
   lat:50.2297692,lon:14.8823936,heading:200,date:'2024-05-30'},
  {url:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B_(01).jpg',
   lat:50.2296525,lon:14.8823131,heading:200,date:'2024-05-30'}
 ]),
 author:'ŠJů',license:'CC BY 4.0',
 userReference:'user-shared 2022-05-17 Mapy.com comparison, observation only, no image retained',
 observed:['two dark asphalt routes bound a large pale paved parking island',
  'wide pale concrete-block paving rather than narrow detached strips',
  'rounded island tip and a low kerb','bike tower and rail-side vegetation'],
 excluded:['unlocated trees and traffic signs','imaginary parked cars','invented new asphalt roads'],
 accuracy:'Photo-informed broad surface and tip. Only OSM road centerlines are georeferenced. Edges, counts and paving pattern are approximations.'
});
const d2=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function closestPointToPolyline(p,poly){
 let best=null;
 for(let i=1;i<poly.length;i++){
  const a=poly[i-1],b=poly[i],dx=b.x-a.x,dz=b.z-a.z;
  const n=dx*dx+dz*dz;
  if(n<.0001)continue;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/n));
  const x=a.x+dx*t,z=a.z+dz*t;
  const distance=d2(p,{x,z});
  if(!best||distance<best.distance)best={x,z,distance,i,t};
 }
 return best;
}
function signedPolygonGap(p,poly){
 let inside=false,min=Infinity;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[j],b=poly[i],dx=b.x-a.x,dz=b.z-a.z,n=dx*dx+dz*dz;
  const t=n?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/n)):0;
  min=Math.min(min,Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz));
  if((a.z>p.z)!==(b.z>p.z)&&p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)
   inside=!inside;
 }
 return inside?-min:min;
}
function frame(a,b){
 const length=d2(a,b);
 if(length<55||length>95)return null;
 const ux=(b.x-a.x)/length,uz=(b.z-a.z)/length;
 return {a,b,length,ux,uz,nx:-uz,nz:ux,yaw:Math.atan2(-uz,ux)};
}
function at(f,along,offset){
 return {x:f.a.x+f.ux*along+f.nx*offset,z:f.a.z+f.uz*along+f.nz*offset};
}
export function planStationPhotoParking(elements,roadClearance){
 if(!Array.isArray(elements)||!roadClearance?.isClear)return null;
 const west=elements.find(e=>Number(e.id)===STATION_PARKING_REFERENCE.westAccessWayId);
 const east=elements.find(e=>Number(e.id)===STATION_PARKING_REFERENCE.eastStreetWayId);
 if(west?.tags?.highway!=='service'||west.tags.oneway!=='yes'||
    west.geometry?.length<2||east?.tags?.highway!=='residential'||
    east.geometry?.length<4)return null;
 const f=frame(stationGpsToWorld(west.geometry[0]),stationGpsToWorld(west.geometry[1]));
 if(!f)return null;
 const other=east.geometry.map(stationGpsToWorld);
 // 2024 geotagged photography shows the lane, not surveyed stone outlines.
 const cameras=STATION_PARKING_REFERENCE.photos.map(photo=>{
  const p=stationGpsToWorld(photo),q=closestPointToPolyline(p,
   west.geometry.map(stationGpsToWorld));
  return {...q,along:(p.x-f.a.x)*f.ux+(p.z-f.a.z)*f.uz};
 });
 if(cameras.some(c=>!c||c.distance>3||c.along<15||c.along>f.length))return null;
 const buildings=elements.filter(e=>e.tags?.building&&e.geometry?.length>=4)
  .map(e=>e.geometry.map(stationGpsToWorld))
  .filter(poly=>poly.some(p=>d2(p,f.a)<110));
 const rails=elements.filter(e=>e.tags?.railway==='rail'&&e.geometry?.length>=2)
  .map(e=>e.geometry.map(stationGpsToWorld))
  .filter(line=>line.some(p=>d2(p,f.a)<130));
 const cells=[],curbs=[],rejected=[];
 // Exact right-side offset is recalculated against the SECOND mapped road
 // every row. We never paint rectangles between arbitrary parallel vectors.
 const length=.74,depth=.72,alongStep=.76,acrossStep=.74;
 const rowStats=[];
 for(let along=3.6;along<f.length-3.6;along+=alongStep){
  const middle=at(f,along,0),near=closestPointToPolyline(middle,other);
  if(!near)continue;
  const gap=(near.x-middle.x)*f.nx+(near.z-middle.z)*f.nz;
  const longitudinal=(near.x-middle.x)*f.ux+(near.z-middle.z)*f.uz;
  if(gap<7||gap>20||Math.abs(longitudinal)>3.5)continue;
  // Modelled 4.5m western service and 7.8m eastern residential ways.
  // Do not turn OSM centreline buffers into a fictitious new vehicle road.
  let left=2.35,right=gap-3.98;
  if(right-left<1.3)continue;
  const center=(left+right)*.5;
  let half=(right-left)*.5;
  // The south tip is rounded instead of a sharp rectangular start.
  // Radius is an approximation informed by the supplied 2022 comparison.
  const nose=Math.max(0,Math.min(1,(along-2.5)/6,(f.length-2.5-along)/5));
  half*=Math.sqrt(Math.max(.01,1-(1-nose)**2));
  left=center-half;right=center+half;
  let acceptedRow=0;
  for(let offset=2.52;offset<gap-3.96;offset+=acrossStep){
   if(offset<left+depth*.47||offset>right-depth*.47)continue;
   const p=at(f,along,offset);
   // Whole tile's footprint (not just its centre) clears ALL OSM roads and
   // footpaths. False-painted asphalt and clipped sidewalks are forbidden.
   if(!isRoadFreeRect(roadClearance,{
    ...p,length,depth,yaw:f.yaw,buffer:.025,step:.33
   })){rejected.push({along,offset,reason:'road-or-footway'});continue}
   const safetyPoints=[
    p,at(f,along-length*.5,offset-depth*.5),
    at(f,along+length*.5,offset+depth*.5),
    at(f,along-length*.5,offset+depth*.5),
    at(f,along+length*.5,offset-depth*.5)
   ];
   if(safetyPoints.some(pt=>buildings.some(poly=>signedPolygonGap(pt,poly)<.22))){
    rejected.push({along,offset,reason:'building'});continue;
   }
   if(safetyPoints.some(pt=>rails.some(line=>
    (closestPointToPolyline(pt,line)?.distance??Infinity)<1.65))){
    rejected.push({along,offset,reason:'railway'});continue;
   }
   cells.push({...p,along,offset,length,depth,yaw:f.yaw});
   acceptedRow++;
  }
  rowStats.push({along,betweenRoadsMetres:gap,accepted:acceptedRow});
  if(acceptedRow){
   // Curbs border the PHOTO-APPROXIMATE island, not the carriageway.
   // Their tiny sections are each checked against mapped road surfaces.
   for(const edge of [2.52,gap-4.16]){
    const p=at(f,along,edge);
    if(!isRoadFreeRect(roadClearance,{
     ...p,length:.71,depth:.11,yaw:f.yaw,buffer:.03,step:.26
    }))continue;
    if(buildings.some(poly=>signedPolygonGap(p,poly)<.20))continue;
    curbs.push({...p,yaw:f.yaw});
   }
  }
 }
 if(!cells.length)return null;
 return {cells,curbs,rejected,rowStats,frame:f,cameras,
  sourceIds:[west.id,east.id],sourcePhotos:STATION_PARKING_REFERENCE.photos.length,
  groundType:'concrete-paving-island',exactParkingOutlineMeasured:false,
  photoInformed:true,modelledRoundedNose:true,legacyDetachedStripsRemoved:true,
  protectedRoadsAndPaths:true,protectedBuildings:true,protectedRailways:true,
  originalCarriagewaysUntouched:true};
}
export function makeStationPhotoParkingScene(THREE,{layer,terrainAt=()=>0,roadClearance}={}){
 const roots=[],geo=new THREE.BoxGeometry(1,1,1);
 const material={
  grout:new THREE.MeshLambertMaterial({color:0x92928a}),
  paver:new THREE.MeshLambertMaterial({color:0xc7c6bd}),
  curb:new THREE.MeshLambertMaterial({color:0xb9b9b3})
 };
 let planned=null,drawMeshes=0,instances=0;
 const stats=()=>({
  active:roots.length>0,sourceIds:planned?.sourceIds||[],
  photos:STATION_PARKING_REFERENCE.photos.length,
  pavingCells:planned?.cells.length||0,curbSegments:planned?.curbs.length||0,
  rejectedCells:planned?.rejected.length||0,
  coveredRows:planned?.rowStats.filter(r=>r.accepted>0).length||0,
  surface:'continuous-photo-informed-paved-median',
  oldDetachedPaverStripsRemoved:true,
  roundedTip:true,drawMeshes,instances,
  collisionSafe:true,estimatedLayout:true,noSyntheticCars:true,sourceAnchored:true
 });
 const publish=()=>{if(typeof window!=='undefined')window.__miloviceStationParking=stats()};
 function batch(group,mat,items,colors=null){
  if(!items.length)return;
  const mesh=new THREE.InstancedMesh(geo,mat,items.length);
  const dummy=new THREE.Object3D(),tint=new THREE.Color();
  for(let i=0;i<items.length;i++){
   const p=items[i];dummy.position.set(p.x,p.y,p.z);
   dummy.rotation.set(0,p.yaw,0);dummy.scale.set(p.sx,p.sy,p.sz);
   dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
   if(colors)mesh.setColorAt(i,tint.setHex(colors[i%colors.length]));
  }
  mesh.instanceMatrix.needsUpdate=true;
  if(colors)mesh.instanceColor.needsUpdate=true;
  mesh.computeBoundingSphere();group.add(mesh);drawMeshes++;instances+=items.length;
 }
 function create(elements){
  if(roots.length)return stats();
  planned=planStationPhotoParking(elements,roadClearance);
  if(!planned){publish();return stats()}
  const group=new THREE.Group();group.name='PhotoStationForecourtPavedIsland_2022_2024';
  group.userData.photoInformedLayout=true;
  group.userData.estimatedParkingPolygon=true;
  group.userData.sourceWayIds=planned.sourceIds;
  group.userData.needsVisualReview=true;
  group.userData.lodX=planned.frame.a.x+planned.frame.ux*31;
  group.userData.lodZ=planned.frame.a.z+planned.frame.uz*31;
  group.userData.lodDetail=true;
  const grout=[],stones=[],curb=[];
  for(const p of planned.cells){
   const y=terrainAt(p.x,p.z);
   grout.push({...p,y:y+.110,sx:p.length,sy:.036,sz:p.depth});
   stones.push({...p,y:y+.133,sx:p.length-.028,sy:.028,sz:p.depth-.028});
  }
  for(const p of planned.curbs)
   curb.push({...p,y:terrainAt(p.x,p.z)+.161,sx:.71,sy:.095,sz:.11});
  batch(group,material.grout,grout);
  batch(group,material.paver,stones,[0xcac9c0,0xd4d1c8,0xc4c3bb,0xbdbeb6]);
  batch(group,material.curb,curb);
  layer.add(group);roots.push(group);publish();return stats();
 }
 function reset(){
  for(const root of roots)root.parent?.remove(root);
  roots.length=0;planned=null;drawMeshes=instances=0;publish();
 }
 publish();
 return {create,reset,status:stats,plan:()=>planned};
}
