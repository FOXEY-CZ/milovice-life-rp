/** Milovice RP 5.284 — source-anchored two-tone facade for original Armádní 891.
 * Real exterior photos in the address-specific listing show a dark ground
 * floor and light upper walls. Unpictured faces, RGB and 2.90m band height
 * remain modeled approximations, NOT a surveyed facade reconstruction.
 * 5.287: cover the generic grey lower plinth visually with the already
 * source-backed dark ground-storey layer (color/height still estimates).
 * No third-party photo pixels/assets, balconies, entrances, roofs or collisions.
 */
export const ARMADNI_891_PHOTO_5284=Object.freeze({
 osmId:'1047406190',ruian:'107125749',house:'891',
 sourceHash:'e8e44d23',sourceNodes:11,
 url:'https://jirisimon.cz/milovice/',
 evidence:'Address-specific real exterior photography, not project render',
 confidence:'tone observed on photographed sides; other sides and band height estimated',
 groundTopMetres:2.90,rooflineMetres:12.2,
 modelColors:Object.freeze({ground:0x74675c,upper:0xe9e5dc}),
 observedBalconiesButUnlocated:true
});
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
export function planArmadni891Photo5284(sourcePlan){
 const c=ARMADNI_891_PHOTO_5284,g=sourcePlan?.sourceGeometry;
 if(sourcePlan?.sourceFacadeVersion!=='5.282'||
  sourcePlan.sourceOSMId!==c.osmId||sourcePlan.sourceRUIANId!==c.ruian||
  sourcePlan.sourceHash!==c.sourceHash||
  sourcePlan.sourceNodes!==c.sourceNodes||
  sourcePlan.sourceReportedFloors!==4||
  Math.abs(sourcePlan.modelHeightMeters-c.rooflineMetres)>.005||
  sourcePlan.existingSourceShellUnchanged!==true||
  !Array.isArray(g)||g.length!==c.sourceNodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  g[0].lat!==g.at(-1).lat||g[0].lon!==g.at(-1).lon||
  hash(g)!==c.sourceHash)return null;
 return {version:'5.284',sourceOSMId:c.osmId,sourceRUIANId:c.ruian,
  sourceHash:c.sourceHash,sourceGeometry:g,sourceUrl:c.url,
  modelGroundTopMetres:c.groundTopMetres,
  modelRooflineMetres:c.rooflineMetres,
  colors:c.modelColors,sourceObservedTwoTone:true,
  allWallSidesPhotoVerified:false,exactBandHeightPhotoVerified:false,
  exactColorsPhotoVerified:false,sourceObservedBalconiesUnlocated:true,
  newBalconies:0,newBuildings:0,newDoors:0,newRoofs:0,
  newFootways:0,newRoads:0,newColliders:0};
}
const materialCache=new WeakMap();
export function renderArmadni891Photo5284(THREE,{
 plan,toWorld,baseHeight,layer
}={}){
 if(plan?.version!=='5.284'||plan.sourceOSMId!==ARMADNI_891_PHOTO_5284.osmId||
  !THREE?.Mesh||!THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||
  !THREE?.MeshStandardMaterial||typeof toWorld!=='function'||
  !Number.isFinite(baseHeight)||!layer?.add)return null;
 const points=plan.sourceGeometry.map(toWorld);
 if(points.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))return null;
 const signed2=points.slice(0,-1).reduce((n,p,i)=>{
  const q=points[i+1];return n+p.x*q.y-p.y*q.x;
 },0);
 if(!Number.isFinite(signed2)||Math.abs(signed2)<.01)return null;
 const exterior=Math.sign(signed2),buffer=[[],[]];
 const rect=(kind,a,b,nx,nz,y0,y1,offset)=>{
  const at=(t,y)=>[a.x+(b.x-a.x)*t+nx*offset,
   baseHeight+y,a.y+(b.y-a.y)*t+nz*offset];
  const p=at(0,y0),q=at(1,y0),r=at(1,y1),s=at(0,y1);
  buffer[kind].push(...p,...q,...r,...p,...r,...s);
 };
 let edgeCount=0;
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.y-a.y;
  const len=Math.hypot(dx,dz);
  if(!(len>.15))return null;
  const nx=exterior*dz/len,nz=-exterior*dx/len;
  // 5.287: the OLD generic 5.192 plinth occupies y=.02..69 at +.036m;
  // photo-backed 891 has a dark ground-storey finish all the way down.
  // Extend its two-tone ground layer to y=.02, and position it at +.039m
  // just IN FRONT of the old provisional grey plinth, yet strictly BEHIND
  // glass (+.044m) and frames (+.068m) on the original wall. No removal
  // of physical shell or new polygon edges/colliders.
  rect(0,a,b,nx,nz,.02,plan.modelGroundTopMetres,.039);
  rect(1,a,b,nx,nz,plan.modelGroundTopMetres,
   plan.modelRooflineMetres-.025,.018);
  // Thin light horizontal separation visible in exterior reference.
  // Thin light seam must remain forward of the ground layer (+.039m).
  rect(1,a,b,nx,nz,plan.modelGroundTopMetres-.04,
   plan.modelGroundTopMetres+.035,.041);
  edgeCount++;
 }
 if(edgeCount!==ARMADNI_891_PHOTO_5284.sourceNodes-1)return null;
 let mats=materialCache.get(THREE);
 if(!mats){
  mats=[plan.colors.ground,plan.colors.upper].map(color=>
   new THREE.MeshStandardMaterial({color,roughness:.88,
    metalness:0,side:THREE.DoubleSide}));
  materialCache.set(THREE,mats);
 }
 const meshes=buffer.map((vertices,i)=>{
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geo.computeVertexNormals();geo.computeBoundingSphere();
  const mesh=new THREE.Mesh(geo,mats[i]);
  mesh.name='Milovice_Armadni_891_RealPhotoTwoTone_'+(i?'Upper':'Ground')+'_5284';
  mesh.userData.sourceOSMId=plan.sourceOSMId;
  mesh.userData.sourcePhotoUrl=plan.sourceUrl;
  mesh.userData.estimatedColorAndUnseenWalls=true;
  mesh.userData.lodDetail=false;
  mesh.receiveShadow=true;layer.add(mesh);return mesh;
 });
 const visible=m=>{
  for(let p=m;p;p=p.parent)if(!p.visible)return false;
  return true;
 };
 return {version:'5.284',sourceOSMId:plan.sourceOSMId,
  photographedAddress:true,photoObservedTwoTone:true,
  allSidesVerified:false,exactColorsVerified:false,
  groundBandToGrade:true,provisionalPlinthVisuallyCovered:true,
  groundLayerOffsetMetres:.039,seamLayerOffsetMetres:.041,
  physicalPlinthRemoved:false,
  wallEdges:edgeCount,meshCount:meshes.length,
  triangles:buffer.reduce((sum,arr)=>sum+arr.length/9,0),
  addedBalconies:0,addedColliders:0,addedBuildings:0,
  allInScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(visible).length};
}
