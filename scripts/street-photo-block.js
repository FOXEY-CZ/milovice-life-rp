// Milovice RP 5.14 — first visually referenced *street block*.
// Each entry has an OSM way ID and a dated, attributed CC BY 4.0 photograph.
// Exterior dimensions that cannot be measured from the photos remain approximate.
// Models are ORIGINAL geometry: source photograph pixels are never copied to game.
// BufferGeometryUtils is injected from the main Three.js browser entrypoint,
 // keeping this module importable in standalone Node geometry tests.
import {planSkolskaDormerRoof} from './skolska-roof.js';
import {roofHeightAtPoint} from './roof-opening-geometry.js';
import {exteriorFacadeFrame} from './facade-anchors.js';

export const PHOTO_STREET_BLOCK=[
 {id:'202367194',name:'Mírová 134/11 · Modrá hvězda',street:'Mírová / 5. května',
  source:'https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_11,_hotel_Modr%C3%A1_hv%C4%9Bzda.jpg',
  author:'ŠJů',license:'CC BY 4.0',photoDate:'2024-05-30',
  details:['orange two-level corner shell','shallow dark roof and pale cornice','corner balcony']},
 {id:'202367254',name:'Mírová 243/36',street:'Mírová / 5. května',
  source:'https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_36.jpg',
  author:'ŠJů',license:'CC BY 4.0',photoDate:'2024-05-30',
  details:['deep red hipped roof','central projecting gable dormer','three rooflights','street-side clipped hedge']},
 {id:'118487980',name:'Školská 220/1',street:'Školská / 5. května',
  source:'https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg',
  author:'ŠJů',license:'CC BY 4.0',photoDate:'2024-05-30',
  details:['cream-painted corner house','dark pitched roof','two arched attic gables','white window frames']}
];
const targetIds=new Set(PHOTO_STREET_BLOCK.map(x=>x.id));
// Evidence decides which building has which unique architectural detail.
// The SHARED topology engine, not this registry, decides how to join parts.
// For other photo-anchored sites, add a documented profile rather than
// writing another special-case roof clipping algorithm.
export const PHOTO_ROOF_PROFILES={
 '118487980':{
  evidence:'https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg',
  dated:'2024-05-30',type:'cross-gable-pair',
  specs:[
   {width:3.20,depth:1.90,rise:1.55,arched:true},
   {width:2.75,depth:1.72,rise:1.32,arched:true}
  ],measurements:'approximate photograph proportions; not surveyed'
 }
};
export function planPhotoRoofFeatures(id,pts){
 const profile=PHOTO_ROOF_PROFILES[String(id)];
 if(!profile||!Array.isArray(pts)||pts.length<3)return [];
 const camera=pointFromGps(50.2290672,14.8822619);
 const fronts=photoFacingEdges(pts,camera,{minLength:5,limit:3})
  .filter(e=>e.len>=5.5).slice(0,profile.specs.length);
 if(fronts.length!==profile.specs.length)return [];
 return fronts.map((edge,i)=>{
  const spec=profile.specs[i];
  return {id:String(id)+'-gable-'+i,edge,profile:spec,
   // These 3D specs are ORIGINAL wall-relative coordinates, not a second
   // separately guessed coordinate frame for the roof hole.
   cx:edge.mx,cz:edge.mz,nx:edge.nx,nz:edge.nz,
   // Cut ONLY the interior footprint, not the entire external facade.
   // Previously width exceeded the dormer wall by 36 cm and the depth
   // was longer than its wall, leaving actual SKY slits beside both gables.
   // The eave must slightly OVERLAP opaque dormer masonry at both cheeks
   // and behind it. The front clip still clears the real window face.
   width:spec.width-.14,depth:spec.depth-.20,
   front:.08,padding:0,rearPadding:0,
   source:profile.evidence
  };
 });
}
const cos=Math.cos(50.226*Math.PI/180);
export function pointFromGps(lat,lon){
 return {x:(lon-14.889)*111320*cos,z:-(lat-50.226)*111320};
}
export function photoFacingEdges(points,camera,{minLength=4,limit=2}={}){
 if(!Array.isArray(points)||points.length<3||!camera||
  !Number.isFinite(camera.x)||!Number.isFinite(camera.z))return [];
 const pts=points.map(p=>({x:p.x,z:p.z??p.y}));
 if(Math.hypot(pts[0].x-pts.at(-1).x,pts[0].z-pts.at(-1).z)<.15)pts.pop();
 const edges=[];
 for(let i=0;i<pts.length;i++){
  // Facade direction MUST match the ordinary building/window generator.
  // Centroid-to-wall flips normals at reflex L-/U-shaped courtyard edges.
  const frame=exteriorFacadeFrame(pts,i);
  if(!frame||frame.len<minLength)continue;
  const {a,b,mx,mz,nx,nz,ux,uz,len,yaw}=frame;
  const d=Math.hypot(mx-camera.x,mz-camera.z);
  const visibility=((camera.x-mx)*nx+(camera.z-mz)*nz)/Math.max(1,d);
  if(visibility<-.12)continue;
  edges.push({index:i,a,b,mx,mz,nx,nz,ux,uz,len,
   yaw,distance:d,visibility,score:d-(visibility*6)-Math.min(len,25)*.11});
 }
 return edges.sort((a,b)=>a.score-b.score).slice(0,limit);
}
// v5.28.4: Pure geometric contract for BOTH sloping dormer roof planes.
// Former "sign*.63" was inverted: its left roof descended toward the
// ridge and its right roof ascended away, making giant black flying flaps.
export function planDormerRoofSlopes(width,roofRise=.94){
 if(!Number.isFinite(width)||width<=.7||!Number.isFinite(roofRise)||roofRise<=0)return null;
 const run=width*.5,angle=Math.atan2(roofRise,run);
 return [-1,1].map(side=>({
  side,x:side*width*.25,
  y:1.43+roofRise*.5,
  rotationZ:-side*angle,
  panelLength:Math.hypot(run,roofRise)+.11,
  eaveY:1.43,
  ridgeY:1.43+roofRise
 }));
}
// Exact, continuous semi-circular head instead of a rectangle with a
// floating sphere. Sizes remain modelled estimates; the photograph supports
// the ARCHED silhouette, not millimetre window survey.
export function planArchedDormerWindow({width=1.05,bottom=.35,shoulder=1.16,
 border=.085,segments=16}={}){
 if(![width,bottom,shoulder,border].every(Number.isFinite)||
   width<.55||width>2.2||bottom<0||shoulder<bottom+.45||
   border<.035||border>.16||width<=border*4||
   !Number.isInteger(segments)||segments<8||segments>32)return null;
 function path(radius,y0,yShoulder){
  const result=[{x:-radius,y:y0},{x:radius,y:y0},{x:radius,y:yShoulder}];
  for(let i=1;i<=segments;i++){
   const angle=Math.PI*i/segments;
   result.push({x:radius*Math.cos(angle),
    y:yShoulder+radius*Math.sin(angle)});
  }
  return result;
 }
 const outer=path(width*.5,bottom,shoulder),inner=path(width*.5-border,
  bottom+border,shoulder-.025);
 return {outer,inner,width,bottom,shoulder,border,
  archTop:shoulder+width*.5,
  glassTop:shoulder-.025+width*.5-border};
}
// World-space roof-safe position planner. A flush rooflight is an inset
// following the ACTUAL rendered roof triangles, never a free-floating box
// rotated by a guessed constant 0.43 radians.
// The same edge coordinates work on ANY rotated/concave OSM building.
export function planPhotographedRooflight(roof,edge,offset,{
 halfWidth=.52,near=1.16,far=2.58,frameLift=.028
}={}){
 if(!roof||!edge||![offset,halfWidth,near,far,frameLift,edge.mx,
  edge.mz,edge.ux,edge.uz,edge.nx,edge.nz].every(Number.isFinite)||
  !Number.isFinite(edge.len)||far<=near||near<.2||
  halfWidth<=.15||halfWidth>.8||Math.abs(offset)+halfWidth+.12>edge.len/2)
  return null;
 const vertex=(u,depth,lift)=>{
  const x=edge.mx+edge.ux*u-edge.nx*depth;
  const z=edge.mz+edge.uz*u-edge.nz*depth;
  const height=roofHeightAtPoint(roof,{x,z});
  if(!Number.isFinite(height))return null;
  return {x,z,y:height+lift,u:x*.23,v:z*.23};
 };
 const layer=(w,d1,d2,lift)=>{
  const v=[
   vertex(offset-w,d1,lift),vertex(offset+w,d1,lift),
   vertex(offset+w,d2,lift),vertex(offset-w,d2,lift)
  ];
  if(v.some(p=>!p))return null;
  return [[v[0],v[1],v[2]],[v[0],v[2],v[3]]];
 };
 const frame=layer(halfWidth,near,far,frameLift);
 const glass=layer(halfWidth-.085,near+.11,far-.11,frameLift+.009);
 const mullion=layer(.026,near+.12,far-.12,frameLift+.017);
 if(!frame||!glass||!mullion)return null;
 return {frame,glass,mullion,sourceFootprint:true,flushToHostRoof:true,
  interpolation:'actual triangulated host',triangles:6};
}
// Unified wall-relative setback of ALL photographed gable dormers.
// The front masonry face must overlap the real OSM exterior facade by only
// a few centimetres, never be floated 40+ cm out by a guessed hardcode.
export function dormerFacadeCenter(depth,projection=.04){
 if(!Number.isFinite(depth)||depth<.6||depth>4||
  !Number.isFinite(projection)||projection<0||projection>.2)return null;
 return projection-depth*.5;
}
export function makePhotoStreetBlock(THREE,{layer,osmPoint,mergeGeometries}={}){
 const roofMaterial=new THREE.MeshStandardMaterial({color:0x583b38,roughness:.88});
 const darkRoof=new THREE.MeshStandardMaterial({color:0x404348,roughness:.90});
 const creamWall=new THREE.MeshStandardMaterial({color:0xe5d5bb,roughness:.92});
 const warmWall=new THREE.MeshStandardMaterial({color:0xe1ceb0,roughness:.90});
 const paleTrim=new THREE.MeshStandardMaterial({color:0xf4ead5,roughness:.72});
 const glazing=new THREE.MeshStandardMaterial({color:0x345566,metalness:.13,roughness:.25});
 const rooflightFrame=new THREE.MeshStandardMaterial({color:0x454a4d,metalness:.25,roughness:.5});
 const hedge=new THREE.MeshStandardMaterial({color:0x385732,roughness:1});
 let buildings=0,dormers=0,rooflights=0,hedgeGroups=0,detailMeshes=0;
 let actualArchedWindowMeshes=0,rectangularFakeArchRemoved=0;
 let anchoredDormerRoofs=0,removedDetachedRoofBoxPanels=0,joinedOrdinaryDormerRoofs=0;
 let detailDrawMeshes=0,meshesSavedByBatching=0,flushRooflights=0;
 let suppressedDuplicatePerimeterBands=0;
 let rooflightHostPlan=null,rooflightRejected=0;
 const rooflightFailures=[];
 const ids=new Set(),ownedGroups=new Set();
 // Each photo-referenced facade is statically batched by material. A dozen
 // window bars no longer turn into a dozen GPU draw calls at 27 FPS.
 function batchStaticGroup(root){
  root.updateMatrixWorld(true);
  const inv=root.matrixWorld.clone().invert(),groups=new Map();
  root.traverse(mesh=>{
   if(!mesh.isMesh||mesh.isInstancedMesh||!mesh.geometry||Array.isArray(mesh.material))return;
   if(!groups.has(mesh.material))groups.set(mesh.material,[]);
   groups.get(mesh.material).push(mesh);
  });
  for(const [material,meshes] of groups){
   if(meshes.length<2)continue;
   const geos=meshes.map(mesh=>{
    const clone=mesh.geometry.clone();
    const flat=clone.index?clone.toNonIndexed():clone;
    if(flat!==clone)clone.dispose();
    const relative=inv.clone().multiply(mesh.matrixWorld);
    flat.applyMatrix4(relative);
    return flat;
   });
   const merged=mergeGeometries(geos,false);
   geos.forEach(g=>g.dispose());
   if(!merged)continue; // leave the original meshes untouched
   const staticMesh=new THREE.Mesh(merged,material);
   staticMesh.receiveShadow=true;
   for(const mesh of meshes){mesh.parent.remove(mesh);mesh.geometry.dispose();}
   root.add(staticMesh);
   meshesSavedByBatching+=meshes.length-1;
  }
 }
 function optimizeOwnedGroups(start){
  for(const group of [...ownedGroups].slice(start))batchStaticGroup(group);
  detailDrawMeshes=0;
  for(const group of ownedGroups)
   group.traverse(o=>{if(o.isMesh||o.isInstancedMesh)detailDrawMeshes++});
 }
 function addMesh(parent,geometry,material,x,y,z,rx=0,ry=0,rz=0){
  const mesh=new THREE.Mesh(geometry,material);
  mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,rz);
  mesh.receiveShadow=true;parent.add(mesh);detailMeshes++;return mesh;
 }
 function part(parent,w,h,d,material,x,y,z,rx=0,ry=0,rz=0){
  return addMesh(parent,new THREE.BoxGeometry(w,h,d),material,x,y,z,rx,ry,rz);
 }
 function joinedRoofFaces(group,faces,material){
  const coords=[],uv=[];
  for(const f of faces)for(const p of f){
   coords.push(p.x,p.y,p.z);uv.push(p.u,p.v);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  geometry.computeVertexNormals();
  return addMesh(group,geometry,material,0,0,0);
 }
 function exteriorGroup(edge,base){
  const g=new THREE.Group();g.position.set(edge.mx,base,edge.mz);g.rotation.y=edge.yaw;
  // Parent group is now a 160m chunk-managed detail object. No new geometry
  // is created at a distance; the same original model reappears up close.
  g.userData.lodX=edge.mx;g.userData.lodZ=edge.mz;g.userData.lodDetail=true;
  layer.add(g);ownedGroups.add(g);return g;
 }
 function addGableDormer(edge,base,h,{x=0,w=2.35,depth=1.2,light=true,arched=false,
   roofRise=.94,wall=creamWall,roof=roofMaterial,trim=paleTrim}={}){
  // Local +Z points outside. This small structure straddles the eave/roof;
  // actual surveyed ridge/eaves heights are still unknown.
  const g=exteriorGroup(edge,base+h-.28);
  const p=new THREE.Group();p.position.x=x;
  // The photographed gable stands on the outside masonry face,
  // while its rear intersects the main hip. No facade floating past a
  // narrow ground-floor edge when the roof-bay depth changes.
  p.position.z=dormerFacadeCenter(depth);g.add(p);
  part(p,w,1.48,depth,wall,0,.74,.0);
  part(p,w+.14,.14,.16,trim,0,.12,depth*.5+.09);
  const front=depth*.5+.12;
  const winW=w*(arched?.43:.72),winH=.93;
  if(arched){
   const profile=planArchedDormerWindow({width:winW});
   const makePath=(points)=>{
    const pth=new THREE.Path();
    pth.moveTo(points[0].x,points[0].y);
    for(let i=1;i<points.length;i++)pth.lineTo(points[i].x,points[i].y);
    pth.closePath();return pth;
   };
   // The glass is a genuine arched profile, topped by a shaped plaster
   // frame. There is no rectangular dark window behind the semicircle.
   const panePath=new THREE.Shape();
   panePath.moveTo(profile.inner[0].x,profile.inner[0].y);
   for(let i=1;i<profile.inner.length;i++)
    panePath.lineTo(profile.inner[i].x,profile.inner[i].y);
   panePath.closePath();
   addMesh(p,new THREE.ShapeGeometry(panePath),glazing,0,0,front+.112);
   const frameShape=new THREE.Shape();
   frameShape.moveTo(profile.outer[0].x,profile.outer[0].y);
   for(let i=1;i<profile.outer.length;i++)
    frameShape.lineTo(profile.outer[i].x,profile.outer[i].y);
   frameShape.closePath();
   frameShape.holes.push(makePath(profile.inner));
   addMesh(p,new THREE.ShapeGeometry(frameShape),trim,0,0,front+.152);
   // A slim true mullion and transom, fitted below the semicircular head.
   part(p,.058,profile.shoulder-profile.bottom-.09,.065,trim,
    0,(profile.bottom+profile.shoulder)*.5,front+.182);
   part(p,winW-profile.border*2,.048,.062,trim,
    0,profile.shoulder-.13,front+.184);
   part(p,winW+.17,.105,.15,trim,0,profile.bottom-.06,front+.14);
   actualArchedWindowMeshes+=2;rectangularFakeArchRemoved++;
  }else{
   // Mírová 36 photo: a broad white three-lite attic casement,
   // not a single opaque stripe or an oversized unverified attic floor.
   part(p,winW+.17,winH+.17,.095,trim,0,.87,front);
   part(p,winW,winH,.10,glazing,0,.87,front+.066);
   for(const x of [-winW/6,winW/6])
    part(p,.062,winH,.12,trim,x,.87,front+.138);
   part(p,winW+.25,.10,.19,trim,0,.35,front+.14);
  }
  // A real triangular gable plus two inclined roof planes; no flat-topped box.
  const shape=new THREE.Shape();
  shape.moveTo(-w*.5,1.43);shape.lineTo(w*.5,1.43);
  shape.lineTo(0,1.43+roofRise);shape.closePath();
  const geom=new THREE.ShapeGeometry(shape);
  addMesh(p,geom,wall,0,0,front+.01);
  // Both arched and ordinary cross-gables share ONE geometry constructor.
  // Old ordinary gable used two independent rotated black boxes with
  // hardcoded 0.94m rise, even when the house requested 1.65m, creating
  // a giant inverted triangle through the host roof.
  const joined=planSkolskaDormerRoof({
   width:w,depth,rise:roofRise,wallEaveY:1.43
  });
  if(!joined?.closed)throw Error('Documented dormer roof did not close');
  joinedRoofFaces(p,joined.roofFaces,roof);
  joinedRoofFaces(p,joined.soffitFaces,roof);
  joinedRoofFaces(p,joined.fasciaFaces,roof);
  if(arched){
   anchoredDormerRoofs++;removedDetachedRoofBoxPanels+=2;
  }else joinedOrdinaryDormerRoofs++;
  dormers++;
  return g;
 }
 function addRooflights(edge,base,h,offsets,roofPlan){
  // A sampled surface built in world space can be directly submitted to
  // the material batch. No detached rooflight boxes or guessed rotations.
  if(!roofPlan)return;
  // The rooflight vertices are already in absolute world coordinates.
  // Never parent them below a rotated facade group (double translation).
  const g=new THREE.Group();
  g.userData.lodX=edge.mx;g.userData.lodZ=edge.mz;
  g.userData.lodDetail=true;
  layer.add(g);ownedGroups.add(g);
  for(const offset of offsets){
   const plan=planPhotographedRooflight(roofPlan,edge,offset);
   if(!plan){
    rooflightRejected++;
    const px=edge.mx+edge.ux*offset-edge.nx*1.16;
    const pz=edge.mz+edge.uz*offset-edge.nz*1.16;
    rooflightFailures.push({
     edge:edge.index,len:edge.len,offset,
     centerHeight:roofHeightAtPoint(roofPlan,{x:px,z:pz})
    });
    continue;
   }
   joinedRoofFaces(g,plan.frame,rooflightFrame);
   joinedRoofFaces(g,plan.glass,glazing);
   joinedRoofFaces(g,plan.mullion,paleTrim);
   rooflights++;
   flushRooflights++;
  }
 }
 function addHedge(edge,base,sections=6){
  // Clipped, continuous, low green hedge visible on Mírová 36 streetfront.
  // It is decoration only: leaves the crossing/entrance area open.
  if(edge.len<4.3)return; // allow documented 4–6m street-side hedge returns
  const g=exteriorGroup(edge,base);
  const pieces=Math.min(sections,Math.max(2,Math.floor(edge.len/2.0)));
  const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),hedge,pieces);
  const dummy=new THREE.Object3D();
  for(let i=0;i<pieces;i++){
   const t=(i+.5)/pieces,along=(t-.5)*edge.len;
   // Street photo shows a LOW trimmed hedge, not a 1.12m solid green
   // wall obscuring the first-floor and ground-floor windows.
   dummy.position.set(along,.38,1.38);
   dummy.scale.set(edge.len/pieces*.84,.76,.60);
   dummy.rotation.set(0,0,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate=true;mesh.receiveShadow=true;
  g.add(mesh);detailMeshes++;hedgeGroups++;
 }
 function add({id,points,base,height,roofPlan=null}){
  const key=String(id);
  if(!targetIds.has(key)||ids.has(key)||!points?.length||!Number.isFinite(base))return false;
  const pts=points.map(p=>({x:p.x,z:p.y??p.z}));
  const batchStart=ownedGroups.size;
  const camera=key==='118487980'?pointFromGps(50.2290672,14.8822619):
   pointFromGps(50.2280572,14.8840981);
  const edges=photoFacingEdges(pts,camera,{
   minLength:key==='202367254'?3.3:5,limit:6});
  if(!edges.length)return false;
  if(key==='202367254'){
   rooflightHostPlan={
    supplied:!!roofPlan,
    model:roofPlan?.roofModel||roofPlan?.kind||'missing',
    faceCount:roofPlan?.faces?.length||0,
    y:roofPlan?.eaveY
   };
   // Mírová 36: use the actual camera-facing OSM frontage, not its
   // bounding rectangle. Photo shows a three-lite raised central gable,
   // three skylights across two visible roof slopes and clipped hedges.
   const face=edges.find(e=>e.len>5.5)||edges[0];
   addGableDormer(face,base,height,{w:2.85,depth:2.25,
    roofRise:1.65,arched:false,wall:warmWall,roof:roofMaterial});
   addRooflights(face,base,height,[-.82],roofPlan);
   const returnWall=edges.find(e=>e.index!==face.index&&e.len>=4.3);
   if(returnWall)addRooflights(returnWall,base,height,[-.78,.78],roofPlan);
   addHedge(face,base,5);
   if(returnWall)addHedge(returnWall,base,3);
  }else if(key==='118487980'){
   // The same document-backed profile drives BOTH the dormer meshes
   // and the cutouts from the main roof. No independently positioned
   // roof skins, and no building-specific geometry branching here.
   const features=planPhotoRoofFeatures(key,pts);
   for(const {edge,profile} of features)addGableDormer(edge,base,height,{
    w:profile.width,depth:profile.depth,roofRise:profile.rise,
    arched:profile.arched,wall:creamWall,roof:darkRoof});
   // Shared OSM/hero facade already draws its own continuous cornice.
   // Avoid adding two extra full-length white beams on the same wall.
   // The photo pass still owns the documented dormers above this facade.
   suppressedDuplicatePerimeterBands+=features.length*2;
  }else if(key==='202367194'){
   // Corner hotel's shallow brown/red roof and pale overhanging eaves.
   // Existing game already supplies its corner balcony, orange walls and
   // red window reveals; only enhance its photographed low roof silhouette.
   for(const edge of edges.filter(e=>e.len>8)){
    const g=exteriorGroup(edge,base);
    // Keep the shallow roof lip, not duplicate long white cornices
    // already produced by the OSM facade renderer beneath it.
    part(g,edge.len+.35,.23,.48,roofMaterial,0,height-.015,.12);
    suppressedDuplicatePerimeterBands+=2;
   }
  }
  optimizeOwnedGroups(batchStart);
  ids.add(key);buildings++;publish();return true;
 }
 function getStatus(){return {buildings,dormers,rooflights,hedgeGroups,detailMeshes,
  detailDrawMeshes,meshesSavedByBatching,
  actualArchedWindowMeshes,rectangularFakeArchRemoved,
  anchoredDormerRoofs,removedDetachedRoofBoxPanels,joinedOrdinaryDormerRoofs,
  flushRooflights,rooflightHostPlan,rooflightRejected,
  rooflightFailures:rooflightFailures.slice(0,5),
  landmarkIds:[...ids],suppressedDuplicatePerimeterBands,
  facadeStripOwner:'osm-facade-renderer-only',
  photoReferenceCount:PHOTO_STREET_BLOCK.length,
  scope:'Mírová–5. května–Školská; photographed geometry approximation'};}
 function publish(){if(typeof window!=='undefined')window.__milovicePhotoStreetPass=getStatus()}
 function reset(){
  for(const root of ownedGroups){
   layer.remove(root);
   root.traverse(o=>{if(o.isMesh||o.isInstancedMesh)o.geometry?.dispose()});
  }
  ownedGroups.clear();buildings=dormers=rooflights=hedgeGroups=detailMeshes=0;
  detailDrawMeshes=meshesSavedByBatching=flushRooflights=rooflightRejected=0;
  rooflightHostPlan=null;rooflightFailures.length=0;
  actualArchedWindowMeshes=rectangularFakeArchRemoved=0;
  anchoredDormerRoofs=removedDetachedRoofBoxPanels=joinedOrdinaryDormerRoofs=0;
  suppressedDuplicatePerimeterBands=0;
  ids.clear();publish()
 }
 publish();
 return {add,reset,getStatus};
}
