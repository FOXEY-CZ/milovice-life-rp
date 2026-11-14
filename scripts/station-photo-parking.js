// Milovice RP 5.66 — photo-grounded parking strips, NOT an invented OSM parking polygon.
// Two ŠJů photographs (2024-05-30) show grass-grid slabs on both sides of the
// real station service access. The exact number and extent of bays is estimated;
// physical positions are derived from one specific OSM service way and
// photograph camera coordinates. No stationary 2024 cars are baked into 3D.
import {isRoadFreeRect} from './road-clearance.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';

export const STATION_PARKING_REFERENCE=Object.freeze({
 osmWayId:675778842,
 kind:'photo-informed-parking-surface',
 photos:Object.freeze([
  {url:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B.jpg',
   lat:50.2297692,lon:14.8823936,heading:200,date:'2024-05-30'},
  {url:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B_(01).jpg',
   lat:50.2296525,lon:14.8823131,heading:200,date:'2024-05-30'}
 ]),
 author:'ŠJů',license:'CC BY 4.0',
 observed:['asphalt service aisle','two-sided grass-grid parking bays',
  'low grey concrete curb along parking','rail-side ballast'],
 excluded:['unlocated tree island','unlocated tall lamp','imaginary stalls on train platform',
  'photographed parked cars reproduced as fixed objects'],
 accuracy:'Approximate bay count and individual outlines; camera GPS and service road are georeferenced, not a surveyed parking polygon.'
});
const d2=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function segmentDistance(p,a,b){
 const dx=b.x-a.x,dz=b.z-a.z,len2=dx*dx+dz*dz;
 const t=len2?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/len2)):0;
 return {distance:Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz),t};
}
function signedPolygonGap(p,polygon){
 let inside=false,min=Infinity;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[j],b=polygon[i];
  min=Math.min(min,segmentDistance(p,a,b).distance);
  if((a.z>p.z)!==(b.z>p.z)&&p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)
   inside=!inside;
 }
 return inside?-min:min;
}
function nearestRailGap(p,railLines){
 let best=Infinity;
 for(const line of railLines)
  for(let i=1;i<line.length;i++)
   best=Math.min(best,segmentDistance(p,line[i-1],line[i]).distance);
 return best;
}
function roadFrame(a,b){
 const length=d2(a,b);
 if(length<.01)return null;
 const ux=(b.x-a.x)/length,uz=(b.z-a.z)/length;
 return {a,b,length,ux,uz,nx:-uz,nz:ux,yaw:Math.atan2(-uz,ux)};
}
function at(frame,along,offset){
 return {x:frame.a.x+frame.ux*along+frame.nx*offset,
  z:frame.a.z+frame.uz*along+frame.nz*offset};
}
export function planStationPhotoParking(elements,roadClearance){
 if(!Array.isArray(elements)||!roadClearance?.isClear)return null;
 const way=elements.find(e=>e.id===STATION_PARKING_REFERENCE.osmWayId);
 if(way?.tags?.highway!=='service'||way.tags.oneway!=='yes'||way.geometry?.length<2)
  return null;
 const f=roadFrame(stationGpsToWorld(way.geometry[0]),stationGpsToWorld(way.geometry[1]));
 if(!f||f.length<55||f.length>95)return null;
 // Both camera locations actually project onto this very OSM access aisle.
 // Fail safely rather than attaching the photograph to an unrelated driveway.
 const cameras=STATION_PARKING_REFERENCE.photos.map(photo=>{
  const p=stationGpsToWorld(photo),q=segmentDistance(p,f.a,f.b);
  return {...q,along:q.t*f.length};
 });
 if(cameras.some(c=>c.distance>3||c.t<.3||c.t>.9))return null;
 const maxAlong=Math.min(f.length*.70,Math.max(...cameras.map(p=>p.along))+4);
 const localBuildings=elements.filter(e=>e.tags?.building&&e.geometry?.length>=4)
  .map(e=>e.geometry.map(stationGpsToWorld))
  .filter(poly=>poly.some(p=>d2(p,f.a)<100));
 const railLines=elements.filter(e=>e.tags?.railway==='rail'&&e.geometry?.length>=2)
  .map(e=>e.geometry.map(stationGpsToWorld))
  .filter(line=>line.some(p=>d2(p,f.a)<130));
 const bays=[],rejected=[];
 const bayAlong=2.52,bayDepth=3.67,offset=4.85;
 for(let along=12;along+bayAlong*.5<=maxAlong;along+=2.85){
  for(const side of [-1,1]){
   const center=at(f,along,side*offset),issues=[];
   // Full rectangle, not just the centre; no OSM road or mapped sidewalk
   // can be hidden by grass-grid pavement.
   if(!isRoadFreeRect(roadClearance,{
    ...center,length:bayAlong,depth:bayDepth,yaw:f.yaw,buffer:.08,step:.52
   }))issues.push('mapped-road-or-footway');
   // Also protect true rails and building footprints (not in road index).
   for(let i=-3;i<=3&&!issues.length;i++)for(let j=-4;j<=4;j++){
    const p=at(f,along+i*bayAlong/6,side*offset+j*bayDepth/8);
    if(nearestRailGap(p,railLines)<1.8){
     issues.push('railway-clearance');break;
    }
    if(localBuildings.some(poly=>signedPolygonGap(p,poly)<.38)){
     issues.push('building-footprint');break;
    }
   }
   if(issues.length)rejected.push({along,side,reason:issues[0]});
   else bays.push({id:'parking-'+Math.round(along*100)+'-'+side,
    x:center.x,z:center.z,along,side,yaw:f.yaw,
    length:bayAlong,depth:bayDepth,osmWayId:way.id});
  }
 }
 return {bays,rejected,cameras,frame:f,sourceId:way.id,
  sourcePhotos:STATION_PARKING_REFERENCE.photos.length,
  exactParkingOutlineMeasured:false,photoInformed:true,
  protectedRoadsAndPaths:true,protectedBuildings:true,protectedRailways:true};
}
export function makeStationPhotoParkingScene(THREE,{layer,terrainAt=()=>0,roadClearance}={}){
 const roots=[];
 const geo=new THREE.BoxGeometry(1,1,1);
 const mat={
  turf:new THREE.MeshLambertMaterial({color:0x65744d}),
  pavers:new THREE.MeshLambertMaterial({color:0xc5c3b5}),
  curb:new THREE.MeshLambertMaterial({color:0x999c95})
 };
 let planned=null,drawMeshes=0,instances=0;
 const stats=()=>({
  active:roots.length>0,osmWayId:STATION_PARKING_REFERENCE.osmWayId,
  photos:STATION_PARKING_REFERENCE.photos.length,
  parkingBays:planned?.bays.length||0,
  parkingSides:planned?.bays.length?
   [...new Set(planned.bays.map(b=>b.side))].sort((a,b)=>a-b):[],
  rejectedBays:planned?.rejected.length||0,
  grassGridTiles:planned?.bays.length*28||0,
  drawMeshes,instances,collisionSafe:true,estimatedLayout:true,
  noSyntheticCars:true,sourceAnchored:true
 });
 const publish=()=>{if(typeof window!=='undefined')window.__miloviceStationParking=stats()};
 function instanced(group,material,items,colors=null){
  if(!items.length)return;
  const mesh=new THREE.InstancedMesh(geo,material,items.length);
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
  if(!planned?.bays.length){publish();return stats();}
  const group=new THREE.Group();group.name='PhotoStationParking_2024';
  group.userData.photoSourceId='milovice-station-parking-2024';
  group.userData.photoInformedLayout=true;
  group.userData.estimatedParkingPolygon=true;
  group.userData.lodX=planned.frame.a.x+planned.frame.ux*32;
  group.userData.lodZ=planned.frame.a.z+planned.frame.uz*32;
  group.userData.lodDetail=true;
  const grass=[],stones=[],curbs=[];
  for(const bay of planned.bays){
   const f=planned.frame,centre=bay;
   const point=(al,dep)=>at(f,al,dep);
   // Only emit original material/mesh geometry. Never paste photo textures.
   grass.push({x:centre.x,y:terrainAt(centre.x,centre.z)+.018,z:centre.z,
    yaw:centre.yaw,sx:bay.length,sy:.032,sz:bay.depth});
   for(let i=0;i<4;i++)for(let j=0;j<7;j++){
    const p=point(bay.along+(i-1.5)*.60,bay.side*4.85+(j-3)*.50);
    stones.push({x:p.x,y:terrainAt(p.x,p.z)+.052,z:p.z,yaw:centre.yaw,
     sx:.49,sy:.035,sz:.37});
   }
   const curbPoint=point(bay.along,bay.side*2.69);
   curbs.push({x:curbPoint.x,y:terrainAt(curbPoint.x,curbPoint.z)+.095,z:curbPoint.z,
    yaw:centre.yaw,sx:bay.length-.06,sy:.17,sz:.14});
  }
  instanced(group,mat.turf,grass);
  instanced(group,mat.pavers,stones,[0xbfc0b4,0xc8c8bf,0xaeb2a9,0xd3d1c6]);
  instanced(group,mat.curb,curbs);
  layer.add(group);roots.push(group);publish();return stats();
 }
 function reset(){
  for(const group of roots)group.parent?.remove(group);
  roots.length=0;planned=null;drawMeshes=instances=0;publish();
 }
 publish();
 return {create,reset,status:stats,plan:()=>planned};
}
