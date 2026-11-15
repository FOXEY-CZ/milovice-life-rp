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

// One shared source of approximate machine widths and facade positions.
// The photographed door/window planner uses exactly these intervals too.
export const STATION_TICKET_MACHINE_LAYOUT=Object.freeze([
 Object.freeze({id:'orange',t:.49,kind:'orange',bodyWidth:.68,bodyHeight:1.83}),
 Object.freeze({id:'yellow',t:.34,kind:'yellow',bodyWidth:.68,bodyHeight:1.88})
]);

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
 const machines=STATION_TICKET_MACHINE_LAYOUT.map(m=>{
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
  panelDetailRevision:580,panelCanvasSize:[320,768],
  shellMaterial:'MeshStandardMaterial',groundOffsetMeters:.008,
  ticketMachinesOnly:true});
 function publish(){
  if(typeof window!=='undefined')
   window.__miloviceStationTicketMachines=status();
 }
 function panelTexture(kind){
  // V5.80: original vector interpretation of the two distinct control panels.
  // Source verifies two colors, dark versus light control consoles, numeric
  // keys and ticket outlets; exact key legends and branding are NOT legible.
  // No imported photo pixels, logos, schedules or invented written notices.
  const c=document.createElement('canvas');c.width=320;c.height=768;
  const g=c.getContext('2d',{alpha:false}),orange=kind==='orange';
  function rect(x,y,w,h,color){
   g.fillStyle=color;g.fillRect(x,y,w,h);
  }
  function panel(x,y,w,h,r,color,outline=null){
   g.beginPath();g.roundRect(x,y,w,h,r);
   g.fillStyle=color;g.fill();
   if(outline){g.lineWidth=2;g.strokeStyle=outline;g.stroke();}
  }
  // Painted metal shell with a very subtle brighter centre / darker edges.
  rect(0,0,320,768,orange?'#b8720b':'#c7b409');
  const shell=g.createLinearGradient(0,0,320,0);
  if(orange){
   shell.addColorStop(0,'#cb7f0b');shell.addColorStop(.22,'#efa61d');
   shell.addColorStop(.76,'#efa81c');shell.addColorStop(1,'#bc7412');
  }else{
   shell.addColorStop(0,'#cbb80b');shell.addColorStop(.22,'#f5e435');
   shell.addColorStop(.78,'#efdc1b');shell.addColorStop(1,'#c4ac0d');
  }
  g.fillStyle=shell;g.fillRect(9,8,302,751);
  // Edge seams / rounded service access doors belong to the original
  // drawing, not extra meshes: keep TWO draw calls per machine on mobile.
  rect(9,8,5,748,'#ffffff20');
  rect(305,8,6,748,'#4a350b40');
  panel(22,496,276,240,10,orange?'#d98a12':'#e6d127',
   orange?'#ae6b0d':'#baa717');
  g.lineWidth=2;g.strokeStyle=orange?'#a86912':'#ab9813';
  g.strokeRect(27,496,266,240);
  if(orange){
   // Large dark operator panel: screen, dark surround, payment and outlet.
   panel(25,89,270,380,9,'#242b2c','#696e62');
   panel(51,118,219,118,6,'#111c23','#454c4b');
   panel(65,133,187,89,3,'#c8d7d7','#f4e8c4');
   rect(75,147,167,7,'#eaf2e8');rect(75,165,135,5,'#a0b8bd');
   rect(75,179,147,5,'#9fb1b5');
   panel(70,256,176,51,6,'#303839','#7c8479');
   rect(86,268,144,8,'#a6ac9f');rect(86,286,111,5,'#505b5e');
   panel(70,335,182,27,4,'#151b1d','#858582');
   rect(88,345,148,6,'#eab82c');
   panel(88,388,144,45,4,'#596364','#adb8ad');
   rect(101,404,117,6,'#becac1');
   // Lower paper-return slot and removable service hatch.
   panel(91,541,139,56,5,'#b9c4c2','#666d65');
   panel(113,558,95,18,3,'#222a2d','#d7e0d6');
   rect(126,566,68,4,'#abbeb7');
   panel(55,633,210,81,5,'#cf8616','#a76c10');
   rect(69,646,180,3,'#e6a62d');
  }else{
   rect(11,12,298,51,'#b92c29');
   g.font='bold 21px system-ui,Arial';g.textAlign='center';
   g.fillStyle='#ffffff';g.fillText('JÍZDENKY/TICKETS',160,46,280);
   panel(34,95,252,376,8,'#e8ebe5','#8d9893');
   panel(76,130,168,79,5,'#232b2b','#7e8b86');
   rect(90,144,140,12,'#b5c5ba');
   rect(90,164,106,8,'#8aaba1');
   rect(90,183,119,7,'#a3b2ab');
   panel(61,229,198,202,5,'#c8d0c9','#87908a');
   g.fillStyle='#606966';
   for(let i=0;i<28;i++){
    const x=81+(i%4)*53,y=248+Math.floor(i/4)*26;
    panel(x,y,31,17,3,(i%7===0)?'#323b39':'#626b68','#e7eae5');
   }
   // A separate payment / ticket outlet underneath the keypad.
   panel(101,445,118,19,3,'#545d5c','#a4aaa3');
   rect(116,451,88,5,'#d7ded7');
   panel(86,533,148,65,5,'#c7cfca','#858f8a');
   panel(110,554,100,18,3,'#444e4e','#e6ede4');
   rect(123,561,75,4,'#d8d7c5');
   panel(49,626,222,86,5,'#e5d528','#ad9f18');
   rect(63,640,194,3,'#f4e858');
  }
  // The original 2024 source doesn't prove exact legends/coin denominations.
  // Avoid tiny pseudo-text that would falsely suggest an accurate timetable.
  rect(0,749,320,19,orange?'#a4670e':'#ab980d');
  rect(13,754,294,3,orange?'#e5a21b':'#eee039');
  const texture=new THREE.CanvasTexture(c);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=2;
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
   root.position.set(m.x,base+.008,m.z);root.rotation.y=m.yaw;
   const body=new THREE.Mesh(geo,
    new THREE.MeshStandardMaterial({
     color:m.kind==='orange'?0xe59a0b:0xe1d00b,
     metalness:.16,roughness:.72
    }));
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
  // Everything is owned by this small photo scene. Unlike old station
  // props, both shared body geometry and the four mesh materials get freed
  // after every city reset: no cumulative mobile GPU or CanvasTexture leak.
  const geometries=new Set(),materials=new Set();
  for(const root of roots){
   root.traverse(obj=>{
    if(!obj.isMesh)return;
    if(obj.geometry)geometries.add(obj.geometry);
    if(Array.isArray(obj.material)){
     for(const mat of obj.material)materials.add(mat);
    }else if(obj.material)materials.add(obj.material);
   });
   root.parent?.remove(root);
  }
  for(const geometry of geometries)geometry.dispose();
  for(const mat of materials)mat.dispose();
  roots.length=0;
  for(const t of textures)t.dispose();
  textures=[];drawMeshes=0;plan=null;publish();
 }
 return {create,reset,status};
}
