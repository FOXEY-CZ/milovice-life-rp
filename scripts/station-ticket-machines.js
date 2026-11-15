// Milovice RP 5.77 — TWO ACTUAL PID TICKET MACHINES on station entrance wall.
// Source: ŠJů, 2024-05-30, CC BY 4.0:
// https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_automaty_na_j%C3%ADzdenky.jpg
// The photograph identifies an orange machine LEFT of a yellow one, between
// a white doorway and a white window. Its GPS marks the CAMERA, not machine
// positions. The station's real OSM polygon fixes the wall; the 2 positions
// along the wall are approximate and must be photo-checked in-game.
// No copied photograph, publisher artwork, inventively placed extra machine,
// train timetable, tracking or API; machine panels are original drawings.
import {stationGpsToWorld} from './station-forecourt-pass.js';

export const STATION_TICKET_MACHINE_PHOTO=Object.freeze({
 source:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_automaty_na_j%C3%ADzdenky.jpg',
 author:'ŠJů',license:'CC BY 4.0',photoDate:'2024-05-30',
 stationWayId:53865956,wallSegmentIndex:5,
 camera:{lat:50.2291625,lon:14.8819250,heading:110},
 observed:['one orange PID ticket machine','one yellow PID ticket machine',
  'white doorway on one side and white station window on the other'],
 surveyedMachinePositions:false,machines:2
});

function nearestPointOnSegment(p,a,b){
 const dx=b.x-a.x,dz=b.z-a.z,ls=dx*dx+dz*dz;
 if(ls<.00001)return null;
 const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/ls));
 const x=a.x+dx*t,z=a.z+dz*t;
 return {t,x,z,distance:Math.hypot(p.x-x,p.z-z)};
}
function nearestDrivingRoadDistance(point,roads){
 let min=Infinity;
 for(const r of roads){
  if(!r?.tags?.highway||!r.geometry||!r.geometry.length)continue;
  const k=r.tags.highway;
  if(['footway','path','pedestrian','steps','cycleway','track'].includes(k))continue;
  const pts=r.geometry.map(stationGpsToWorld);
  let dist=Infinity;
  for(let i=1;i<pts.length;i++){
   const n=nearestPointOnSegment(point,pts[i-1],pts[i]);
   if(n)dist=Math.min(dist,n.distance);
  }
  const width=k==='primary'?11:k==='secondary'?9:
   k==='tertiary'?8:k==='service'?4.5:7.8;
  min=Math.min(min,dist-width/2);
 }
 return min;
}
export function planStationTicketMachines(elements){
 const station=elements?.find(e=>Number(e.id)===
  STATION_TICKET_MACHINE_PHOTO.stationWayId);
 if(station?.tags?.building!=='train_station'||
    station?.tags?.name!=='Milovice'||
    !Array.isArray(station.geometry)||station.geometry.length<12)
  return null;
 const i=STATION_TICKET_MACHINE_PHOTO.wallSegmentIndex;
 const a=stationGpsToWorld(station.geometry[i-1]);
 const b=stationGpsToWorld(station.geometry[i]);
 const camera=stationGpsToWorld(STATION_TICKET_MACHINE_PHOTO.camera);
 const wall=nearestPointOnSegment(camera,a,b);
 if(!wall)return null;
 const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
 const towardsWall={x:wall.x-camera.x,z:wall.z-camera.z};
 const theta=STATION_TICKET_MACHINE_PHOTO.camera.heading*Math.PI/180;
 const photographicHeading={x:Math.sin(theta),z:-Math.cos(theta)};
 const bearingAgreement=(towardsWall.x*photographicHeading.x+
  towardsWall.z*photographicHeading.z)/wall.distance;
 // Reject an unrelated rear facade or a photo whose viewpoint could no
 // longer correspond to the actual OSM wall.
 if(length<6.2||length>7||wall.distance<.8||wall.distance>3.6||
    wall.t<.15||wall.t>.70||bearingAgreement<.84)return null;
 const outside={x:(camera.x-wall.x)/wall.distance,
  z:(camera.z-wall.z)/wall.distance};
 const yaw=Math.atan2(outside.x,outside.z);
 // PHOTO left-to-right: orange, yellow; from the camera the observed
 // doorway and window constrain this to station wall edge 4->5.
 const machines=[
  {id:'orange',t:.49,kind:'orange',bodyWidth:.68,bodyHeight:1.83},
  {id:'yellow',t:.34,kind:'yellow',bodyWidth:.68,bodyHeight:1.88}
 ].map(m=>{
  const x=a.x+dx*m.t+outside.x*.205;
  const z=a.z+dz*m.t+outside.z*.205;
  return {...m,x,z,yaw,bodyDepth:.30,
   outwardClearance:.055,sourceId:STATION_TICKET_MACHINE_PHOTO.stationWayId,
   nearestRoadEdge:nearestDrivingRoadDistance({x,z},elements)};
 });
 if(machines.some(m=>!Number.isFinite(m.nearestRoadEdge)||
     m.nearestRoadEdge<.55))return null;
 if(Math.hypot(machines[0].x-machines[1].x,
    machines[0].z-machines[1].z)<.90)return null;
 return {source:STATION_TICKET_MACHINE_PHOTO,machines,wallSegmentIndex:i,
  wallLength:length,cameraWallDistance:wall.distance,
  cameraBearingAgreement:bearingAgreement,cameraHeading:110,
  anchoredToStationWall:true,facadeEstimated:true,photosCopied:false,
  noNewRoadsideObjects:true,entranceMovementPreserved:true,
  stationWayId:station.id};
}

export function makeStationTicketMachineScene(THREE,{layer,terrainAt=()=>0}={}){
 const roots=[];let plan=null,drawMeshes=0,textures=[];
 const status=()=>({active:roots.length>0,
  stationWayId:plan?.stationWayId||null,
  machineCount:plan?.machines.length||0,
  colors:plan?.machines.map(m=>m.kind)||[],
  wallSegmentIndex:plan?.wallSegmentIndex??null,
  cameraWallDistance:plan?.cameraWallDistance??null,
  photoDate:STATION_TICKET_MACHINE_PHOTO.photoDate,
  photoSource:STATION_TICKET_MACHINE_PHOTO.source,
  facadeEstimated:true,photosCopied:false,
  roadClearanceMin:plan?.machines.length?
   Math.min(...plan.machines.map(m=>m.nearestRoadEdge)):null,
  drawMeshes,textureCount:textures.length,
  ticketMachinesOnly:true});
 function publish(){
  if(typeof window!=='undefined')
   window.__miloviceStationTicketMachines=status();
 }
 function panelTexture(kind){
  const c=document.createElement('canvas');c.width=256;c.height=512;
  const g=c.getContext('2d');
  const orange=kind==='orange';
  // Original vector approximation, with only text visible in the photograph.
  g.fillStyle=orange?'#f0a019':'#ead51b';g.fillRect(0,0,256,512);
  g.fillStyle=orange?'#cc8615':'#f0df43';
  g.fillRect(22,22,212,258);
  g.fillStyle=orange?'#161b1e':'#e2e2d9';g.fillRect(33,46,190,207);
  if(orange){
   g.fillStyle='#f5f0df';g.fillRect(52,65,138,35);
   g.fillStyle='#23282b';g.fillRect(45,126,165,80);
   g.fillStyle='#dcb329';g.fillRect(74,149,100,12);
   g.fillStyle='#bdc8c8';g.fillRect(96,278,64,34);
  }else{
   g.fillStyle='#b83231';g.fillRect(9,0,238,36);
   g.fillStyle='#ffffff';g.font='bold 19px Arial';
   g.textAlign='center';g.fillText('JÍZDENKY/TICKETS',128,25);
   g.fillStyle='#101617';g.fillRect(75,58,115,30);
   g.fillStyle='#9fb4a8';g.fillRect(87,66,89,13);
   g.fillStyle='#414746';
   for(let i=0;i<28;i++){
    const x=57+(i%4)*31,y=106+Math.floor(i/4)*17;
    g.beginPath();g.arc(x,y,6,0,Math.PI*2);g.fill();
   }
  }
  g.fillStyle=orange?'#282e31':'#707879';g.fillRect(82,326,93,25);
  g.fillStyle='#d8d8d2';g.fillRect(87,333,75,5);
  g.strokeStyle=orange?'#ba7a13':'#c5b124';
  g.lineWidth=3;g.strokeRect(30,370,196,122);
  const texture=new THREE.CanvasTexture(c);
  texture.colorSpace=THREE.SRGBColorSpace;
  textures.push(texture);return texture;
 }
 function create(elements){
  if(roots.length)return status();
  plan=planStationTicketMachines(elements);
  if(!plan){publish();return status();}
  const group=new THREE.Group();
  group.name='Milovice_2024_Photo_Station_Two_Ticket_Machines';
  group.userData.photoSource=STATION_TICKET_MACHINE_PHOTO.source;
  group.userData.sourceStationWay=plan.stationWayId;
  const geo=new THREE.BoxGeometry(.68,1,.30);
  for(const m of plan.machines){
   const base=terrainAt(m.x,m.z);
   const root=new THREE.Group();root.name='PID_TicketMachine_'+m.kind;
   root.position.set(m.x,base+.035,m.z);root.rotation.y=m.yaw;
   const body=new THREE.Mesh(geo,
    new THREE.MeshLambertMaterial({color:m.kind==='orange'?0xe59a0b:0xe1d00b}));
   body.scale.set(m.bodyWidth/.68,m.bodyHeight,1);
   body.position.y=m.bodyHeight/2;
   root.add(body);drawMeshes++;
   const face=new THREE.Mesh(new THREE.PlaneGeometry(m.bodyWidth-.045,m.bodyHeight-.035),
    new THREE.MeshBasicMaterial({map:panelTexture(m.kind),side:THREE.FrontSide}));
   face.position.set(0,m.bodyHeight/2,.158);
   root.add(face);drawMeshes++;
   group.add(root);
  }
  group.userData.photoVerifiedPair=true;
  group.userData.positionsEstimated=true;
  layer.add(group);roots.push(group);publish();return status();
 }
 function reset(){
  for(const root of roots){root.parent?.remove(root);
   root.traverse(obj=>{if(obj.geometry&&obj.name.startsWith('PID_TicketMachine')===false&&
     obj.geometry.type==='PlaneGeometry')obj.geometry.dispose();});
  }
  roots.length=0;
  for(const t of textures)t.dispose();
  textures=[];drawMeshes=0;plan=null;publish();
 }
 return {create,reset,status};
}
