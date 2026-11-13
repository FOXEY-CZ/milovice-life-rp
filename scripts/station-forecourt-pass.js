// Milovice RP 5.23 — photo-informed station FORECOURT street environment.
// The rail station and bike tower are anchored to official OSM building ways.
// Street furniture positions are visual approximations against photographs,
// and every footprint must clear the mapped road/footpath/building geometry.
export const STATION_FORECOURT_SOURCE={
 id:'station-forecourt-2024',
 stationId:'53865956',bikeTowerId:'1011197691',
 camera:{lat:50.2289419,lon:14.8823244,heading:335},
 photo:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_autobusov%C3%A1_zast%C3%A1vka_a_cyklov%C4%9B%C5%BE.jpg',
 additionalSources:[
  'https://commons.wikimedia.org/wiki/Category:Milovice,_%C5%BEel._st._(bus_stop)',
  'https://pid.cz/wp-content/uploads/mapy/uzly-region/Milovice.pdf'
 ],
 author:'ŠJů',license:'CC BY 4.0',date:'2024-05-30',
 observed:['mature broadleaf tree','curved two-arm roadside luminaire',
  'planted entrance flowers and shrubs','station and bike tower forecourt',
  'A/B public-transport stops and station signage'],
 precision:'Station and tower footprints are OSM ways; positions of props are approximate, not surveyed',
};
// 5.24 Reality Pass: the STOP POLE photos, not the panorama camera, now
// anchor bus stop positions. The GPS points are photographers' locations,
// so an unobstructed pole location within 6m is still an estimate.
export const STATION_STOP_PHOTOS=[
 {id:'bus-A',letter:'A',type:'stop',lat:50.2290750,lon:14.8822053,
  street:'Nádražní',heading:250,photoDate:'2024-05-30',
  photo:'https://commons.wikimedia.org/wiki/File:Milovice,_%C5%BEel._st._A,_zast%C3%A1vkov%C3%BD_sloupek.jpg',
  routes:['430','432','434'],radius:.28,buffer:.72},
 {id:'bus-B',letter:'B',type:'stop',lat:50.2288290,lon:14.8825740,
  street:'5. května',heading:175,photoDate:'2024-05-30',
  photo:'https://commons.wikimedia.org/wiki/File:Milovice,_%C5%BEel._st._B,_zast%C3%A1vkov%C3%BD_sloupek.jpg',
  routes:['430','432','434','497'],radius:.28,buffer:.72}
];
const LAT_COS=Math.cos(50.226*Math.PI/180);
export function stationGpsToWorld(p){
 return {x:(p.lon-14.889)*111320*LAT_COS,z:-(p.lat-50.226)*111320};
}
export function wayCentre(way){
 const points=way?.geometry||[];
 if(points.length<3)return null;
 let n=points.length;
 if(points.length>3 && Math.abs(points[0].lat-points.at(-1).lat)<1e-7&&
   Math.abs(points[0].lon-points.at(-1).lon)<1e-7)n--;
 const coords=points.slice(0,n).map(stationGpsToWorld);
 return {x:coords.reduce((v,p)=>v+p.x,0)/coords.length,
  z:coords.reduce((v,p)=>v+p.z,0)/coords.length};
}
function nearestBoundary(x,z,points){
 let smallest=Infinity,inside=false;
 for(let i=0,j=points.length-1;i<points.length;j=i++){
  const a=points[i],b=points[j],dx=b.x-a.x,dz=b.z-a.z,dd=dx*dx+dz*dz;
  const t=dd>0?Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/dd)):0;
  smallest=Math.min(smallest,Math.hypot(x-a.x-t*dx,z-a.z-t*dz));
  if((a.z>z)!==(b.z>z)&&x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)
   inside=!inside;
 }
 return inside?-smallest:smallest;
}
export function planStationForecourt(elements,roadClearance){
 const buildings=(elements||[]).filter(e=>e.tags?.building&&e.geometry?.length>=4);
 const station=buildings.find(e=>String(e.id)===STATION_FORECOURT_SOURCE.stationId);
 const tower=buildings.find(e=>String(e.id)===STATION_FORECOURT_SOURCE.bikeTowerId);
 if(!station||!tower||!roadClearance)return null;
 const stationCentre=wayCentre(station),towerCentre=wayCentre(tower);
 if(!stationCentre||!towerCentre)return null;
 // An observed tree, lamp or flowerbed without a measured location
 // must not silently become a "real-world" object at guessed coordinates.
 const deferred=['broadleaf','twin-lamp','flowerbed'];
 const candidates=STATION_STOP_PHOTOS.map(stop=>({
  ...stop,photoPoint:stationGpsToWorld({lat:stop.lat,lon:stop.lon})
 }));
 const localBuildings=buildings.map(e=>({
  id:e.id,centre:wayCentre(e),points:e.geometry.map(stationGpsToWorld)
 })).filter(b=>b.centre&&Math.hypot(b.centre.x-stationCentre.x,b.centre.z-stationCentre.z)<55);
 const accepted=[],rejected=[];
 for(const c of candidates){
  // Start from the 2024 geotagged camera, not from invented station offsets.
  // Find the least displaced point that is outside ALL mapped carriageways,
  // mapped pedestrian paths and station/tower building footprints.
  let best=null;
  for(const radius of [0,.75,1.5,2.25,3,3.75,4.5,5.25,6]){
   for(let j=0;j<(radius===0?1:24);j++){
    const angle=j*Math.PI/12;
    const x=c.photoPoint.x+Math.cos(angle)*radius;
    const z=c.photoPoint.z+Math.sin(angle)*radius;
    const near=roadClearance.nearest(x,z);
    const roadClearanceMeters=near?.clearance??Infinity;
    const bodyGap=Math.min(...localBuildings.map(b=>nearestBoundary(x,z,b.points)));
    if(!roadClearance.isClear(x,z,c.radius,c.buffer) ||
       bodyGap<c.radius+.75 ||
       Math.hypot(x-towerCentre.x,z-towerCentre.z)<=5.3)continue;
    const item={...c,x,z,roadClearance:roadClearanceMeters,
     buildingClearance:bodyGap,cameraDisplacement:radius,
     placementMethod:'photo-GPS-nearest-safe-mapped-sidewalk'};
    if(!best||item.cameraDisplacement<best.cameraDisplacement)best=item;
   }
   if(best)break;
  }
  if(best)accepted.push(best);
  else rejected.push({id:c.id,reason:'No unblocked position within 6m of geotagged photo'});
 }
 return {stationCentre,towerCentre,accepted,rejected,deferred,
  reference:STATION_FORECOURT_SOURCE.id,strictReality:true};
}
export function makeStationForecourtScene(THREE,{layer,terrainAt=()=>0,roadClearance}={}){
 const roots=[],sites=new Set();
 const material={
  bark:new THREE.MeshLambertMaterial({color:0x5e5343}),
  foliage:new THREE.MeshLambertMaterial({color:0x4b7144,flatShading:true}),
  foliage2:new THREE.MeshLambertMaterial({color:0x608147,flatShading:true}),
  metal:new THREE.MeshLambertMaterial({color:0x7c8587}),
  steel:new THREE.MeshLambertMaterial({color:0x39464c}),
  lamp:new THREE.MeshBasicMaterial({color:0xfff4cf}),
  soil:new THREE.MeshLambertMaterial({color:0x6b614b}),
  shrub:new THREE.MeshLambertMaterial({color:0x3b683b}),
  flower:new THREE.MeshLambertMaterial({color:0xffffff}),
  signBlue:new THREE.MeshBasicMaterial({color:0x1261a1,side:THREE.DoubleSide}),
  stopRed:new THREE.MeshLambertMaterial({color:0xb32b35})
 };
 const geo={
  trunk:new THREE.CylinderGeometry(.29,.39,4.6,8),
  crown:new THREE.IcosahedronGeometry(1,2),
  shrub:new THREE.IcosahedronGeometry(1,1),
  flower:new THREE.IcosahedronGeometry(.09,0),
  soil:new THREE.BoxGeometry(1,1,1),
  pole:new THREE.CylinderGeometry(.085,.13,6.4,8),
  stopPole:new THREE.CylinderGeometry(.043,.054,3.44,6),
  lightHead:new THREE.BoxGeometry(.62,.16,.32),
 };
 let drawMeshes=0,instances=0,features=0,sitePlan=null;
 function status(){return {photoSources:2,sceneCount:sites.size,drawMeshes,instances,features,
   strictReality:true,deferredWithoutSurvey:sitePlan?.deferred||[],
   photoAnchoredStopCount:sitePlan?.accepted.filter(s=>s.type==='stop').length||0,
   ids:[...sites],placements:sitePlan?.accepted.map(s=>({
    id:s.id,roadClearance:+s.roadClearance.toFixed(2),buildingClearance:+s.buildingClearance.toFixed(2),
    cameraDisplacement:+s.cameraDisplacement.toFixed(2),street:s.street
   }))||[],rejected:sitePlan?.rejected.map(s=>s.id)||[],modelledNotSurveyed:true,
   stationWayId:STATION_FORECOURT_SOURCE.stationId,
   bikeTowerWayId:STATION_FORECOURT_SOURCE.bikeTowerId};}
 function publish(){if(typeof window!=='undefined')window.__miloviceStationForecourt=status();}
 function add(parent,geometry,mat,x,y,z){
  const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);parent.add(m);drawMeshes++;return m;
 }
 function batch(parent,geometry,mat,poses,{palette=null}={}){
  if(!poses.length)return;
  const mesh=new THREE.InstancedMesh(geometry,mat,poses.length),dummy=new THREE.Object3D(),color=new THREE.Color();
  for(let i=0;i<poses.length;i++){
   const p=poses[i];
   dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(p.rx||0,p.ry||0,p.rz||0);
   dummy.scale.set(p.sx??1,p.sy??1,p.sz??1);dummy.updateMatrix();
   mesh.setMatrixAt(i,dummy.matrix);
   if(palette)mesh.setColorAt(i,color.setHex(palette[i%palette.length]));
  }
  mesh.instanceMatrix.needsUpdate=true;if(palette)mesh.instanceColor.needsUpdate=true;
  mesh.computeBoundingSphere();parent.add(mesh);drawMeshes++;instances+=poses.length;
 }
 // Original vector signs, never the photograph's own texture pixels.
 // Photo ŠJů 2024-05-30: narrow red pole, yellow/blue bus pictogram above
 // a white line timetable with a red surround — not an invented blue BUS board.
 function headerTexture(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const c=canvas.getContext('2d');
  c.fillStyle='#e6d66e';c.fillRect(0,0,256,256);
  c.fillStyle='#164d99';c.fillRect(10,10,236,236);
  c.fillStyle='#fffdf4';c.fillRect(35,30,186,196);
  c.strokeStyle='#182532';c.lineWidth=10;c.lineJoin='round';
  c.strokeRect(68,97,119,80);
  c.fillStyle='#202c37';c.fillRect(78,111,98,45);
  c.fillStyle='#ffffff';c.fillRect(90,114,28,24);c.fillRect(130,114,29,24);
  c.fillStyle='#1a2934';
  c.beginPath();c.arc(94,179,12,0,Math.PI*2);c.arc(162,179,12,0,Math.PI*2);c.fill();
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;
  return t;
 }
 function signTexture(letter,routes){
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=430;
  const c=canvas.getContext('2d');
  c.fillStyle='#c23543';c.fillRect(0,0,256,430);
  c.fillStyle='#f9f9f4';c.fillRect(12,12,232,406);
  c.textAlign='center';c.fillStyle='#1a2832';
  c.font='bold 23px sans-serif';c.fillText('MILOVICE',128,48);
  c.font='bold 23px sans-serif';c.fillText('ŽEL. STANICE',128,78);
  c.fillStyle='#c23543';c.fillRect(22,99,212,3);
  routes.forEach((route,i)=>{
   const y=146+i*53;
   c.fillStyle='#222d36';c.font='bold 39px sans-serif';
   c.textAlign='left';c.fillText(route,31,y);
   c.fillStyle='#a4adb1';c.fillRect(31,y+9,193,2);
  });
  c.fillStyle='#1e6399';c.fillRect(174,339,55,61);
  c.fillStyle='#ffffff';c.font='bold 44px sans-serif';
  c.textAlign='center';c.fillText(letter,201,385);
  c.fillStyle='#1c3543';c.font='bold 24px sans-serif';
  c.fillText('PID',66,389);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;
  return t;
 }
 function create(elements){
  if(sites.size)return status();
  sitePlan=planStationForecourt(elements,roadClearance);
  if(!sitePlan)return status();
  const group=new THREE.Group();group.name='PhotoStationForecourt_2024';
  group.userData.lodX=sitePlan.stationCentre.x;group.userData.lodZ=sitePlan.stationCentre.z;
  group.userData.lodDetail=true;group.userData.photoEnvironment=true;
  group.userData.sourceId=STATION_FORECOURT_SOURCE.id;
  for(const p of sitePlan.accepted){
   const y=terrainAt(p.x,p.z);
   if(p.type==='tree'){
    add(group,geo.trunk,material.bark,p.x,y+2.30,p.z);
    batch(group,geo.crown,material.foliage,[
     {x:p.x,y:y+5.65,z:p.z,sx:3.1,sy:2.8,sz:2.9},
     {x:p.x-1.4,y:y+5.05,z:p.z+.50,sx:2.20,sy:2.05,sz:2.0}
    ]);
    batch(group,geo.crown,material.foliage2,[
     {x:p.x+1.10,y:y+6.05,z:p.z-.75,sx:2.6,sy:2.25,sz:2.2}
    ]);
    features++;
   } else if(p.type==='lamp'){
    add(group,geo.pole,material.metal,p.x,y+3.2,p.z);
    // Real photo: a tall Y-shaped double-curved pole, NOT a plain sphere lamp.
    // The curved arms are original tube meshes with no heavy per-frame shadows.
    const heads=[];
    for(const side of [-1,1]){
     const curve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(p.x,y+6.15,p.z),
      new THREE.Vector3(p.x+side*.58,y+7.17,p.z),
      new THREE.Vector3(p.x+side*1.75,y+7.74,p.z),
      new THREE.Vector3(p.x+side*2.72,y+7.68,p.z)
     ]);
     add(group,new THREE.TubeGeometry(curve,9,.064,5,false),material.metal,0,0,0);
     heads.push({x:p.x+side*2.72,y:y+7.61,z:p.z,sx:1,sy:1,sz:1});
    }
    batch(group,geo.lightHead,material.lamp,heads);features++;
   } else if(p.type==='garden'){
    batch(group,geo.soil,material.soil,[
     {x:p.x-.55,y:y+.07,z:p.z,sx:2.0,sy:.13,sz:1.45},
     {x:p.x+1.5,y:y+.07,z:p.z-.3,sx:1.4,sy:.13,sz:1.0}
    ]);
    const foliage=[],petals=[];
    for(let i=0;i<11;i++){
     const a=i*2.4,dx=Math.sin(a)*(i<7?.74:1.0);
     const dz=Math.cos(a)*(i<7?.42:.65);
     foliage.push({x:p.x+dx,y:y+.28,z:p.z+dz,sx:.28,sy:.26,sz:.3});
    }
    for(let i=0;i<20;i++){
     const angle=i*2.39996,r=.15+(i%6)*.13;
     petals.push({x:p.x+Math.cos(angle)*r,y:y+.45,z:p.z+Math.sin(angle)*r,sx:1,sy:1,sz:1});
    }
    batch(group,geo.shrub,material.shrub,foliage);
    batch(group,geo.flower,material.flower,petals,
     {palette:[0xdb4234,0xe7d074,0xf7f3dc,0xd65d8e,0xcdb6e5]});
    features++;
   } else if(p.type==='stop'){
    add(group,geo.stopPole,material.stopRed,p.x,y+1.72,p.z);
    const yaw=Math.PI-p.heading*Math.PI/180;
    const board=new THREE.Mesh(new THREE.PlaneGeometry(.62,1.06),
     new THREE.MeshBasicMaterial({map:signTexture(p.letter,p.routes),side:THREE.DoubleSide}));
    board.position.set(p.x,y+2.59,p.z);
    board.rotation.y=yaw;
    group.add(board);drawMeshes++;
    const icon=new THREE.Mesh(new THREE.PlaneGeometry(.65,.65),
     new THREE.MeshBasicMaterial({map:headerTexture(),side:THREE.DoubleSide}));
    icon.position.set(p.x,y+3.77,p.z);
    icon.rotation.y=yaw;
    group.add(icon);drawMeshes++;features++;
   }
  }
  if(!features)return status();
  layer.add(group);roots.push(group);sites.add(STATION_FORECOURT_SOURCE.id);
  publish();return status();
 }
 function reset(){
  for(const root of roots){
   root.parent?.remove(root);
   root.traverse(m=>{
    if(m.isMesh){
     if(m.geometry&&!Object.values(geo).includes(m.geometry))m.geometry.dispose();
     if(m.material?.map?.isCanvasTexture)m.material.map.dispose();
    }
   });
  }
  roots.length=0;sites.clear();drawMeshes=instances=features=0;sitePlan=null;publish();
 }
 publish();
 return {create,reset,status,plan:()=>sitePlan};
}
