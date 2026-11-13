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
 // The relative offsets were manually estimated from May 2024 forecourt photos,
 // NOT inferred as meter-accurate survey data from the camera GPS alone.
 const candidates=[
  {id:'broadleaf',type:'tree',dx:-14.6,dz:10.4,radius:.58,buffer:1.4},
  {id:'twin-lamp',type:'lamp',dx:7,dz:3.7,radius:.35,buffer:1.15},
  {id:'flowerbed',type:'garden',dx:-16.6,dz:5.4,radius:1.0,buffer:1.1},
  {id:'bus-A',type:'stop',dx:19,dz:18.7,radius:.28,buffer:1.20,letter:'A'},
  {id:'bus-B',type:'stop',dx:13,dz:-8.3,radius:.28,buffer:1.20,letter:'B'}
 ];
 const localBuildings=buildings.map(e=>({
  id:e.id,centre:wayCentre(e),points:e.geometry.map(stationGpsToWorld)
 })).filter(b=>b.centre&&Math.hypot(b.centre.x-stationCentre.x,b.centre.z-stationCentre.z)<55);
 const accepted=[],rejected=[];
 for(const c of candidates){
  const x=stationCentre.x+c.dx,z=stationCentre.z+c.dz;
  const near=roadClearance.nearest(x,z);
  const roadClearanceMeters=near?.clearance??Infinity;
  const bodyGap=Math.min(...localBuildings.map(b=>nearestBoundary(x,z,b.points)));
  const safe=roadClearance.isClear(x,z,c.radius,c.buffer) &&
   bodyGap>=c.radius+.75 &&
   Math.hypot(x-towerCentre.x,z-towerCentre.z)>5.3;
  const item={...c,x,z,roadClearance:roadClearanceMeters,buildingClearance:bodyGap};
  (safe?accepted:rejected).push(item);
 }
 return {stationCentre,towerCentre,accepted,rejected,reference:STATION_FORECOURT_SOURCE.id};
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
  signBlue:new THREE.MeshBasicMaterial({color:0x1261a1,side:THREE.DoubleSide})
 };
 const geo={
  trunk:new THREE.CylinderGeometry(.29,.39,4.6,8),
  crown:new THREE.IcosahedronGeometry(1,2),
  shrub:new THREE.IcosahedronGeometry(1,1),
  flower:new THREE.IcosahedronGeometry(.09,0),
  soil:new THREE.BoxGeometry(1,1,1),
  pole:new THREE.CylinderGeometry(.085,.13,6.4,8),
  stopPole:new THREE.CylinderGeometry(.043,.054,2.8,6),
  lightHead:new THREE.BoxGeometry(.62,.16,.32),
 };
 let drawMeshes=0,instances=0,features=0,sitePlan=null;
 function status(){return {photoSources:2,sceneCount:sites.size,drawMeshes,instances,features,
   ids:[...sites],placements:sitePlan?.accepted.map(s=>({
    id:s.id,roadClearance:+s.roadClearance.toFixed(2),buildingClearance:+s.buildingClearance.toFixed(2)
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
 function signTexture(letter){
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=340;
  const c=canvas.getContext('2d');
  c.fillStyle='#1261a1';c.fillRect(0,0,256,340);
  c.fillStyle='#ffffff';c.fillRect(14,12,228,92);
  c.fillStyle='#0b4772';c.font='bold 54px system-ui';c.textAlign='center';
  c.fillText('BUS',128,80);
  c.fillStyle='#ffffff';c.font='bold 115px system-ui';c.fillText(letter,128,225);
  c.font='bold 19px system-ui';c.fillText('Milovice',128,278);
  c.fillText('žel. st.',128,304);
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
    add(group,geo.stopPole,material.metal,p.x,y+1.4,p.z);
    const texture=signTexture(p.letter);
    const board=new THREE.Mesh(new THREE.PlaneGeometry(.72,.97),
     new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
    board.position.set(p.x,y+2.52,p.z);
    // Plane stays readable from Nádražní and the station approach.
    board.rotation.y=.55;
    group.add(board);drawMeshes++;features++;
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
