/** 5.288 — source-locked Armádní 890 (STAKO C15) visual facade pass.
 * Municipal minutes 29/2024 identify C15 as #890; STAKO confirms C15
 * and C16 are one construction stage. Finished #890 facade color/height
 * is NOT independently photographed/surveyed. Palette and two-tone band
 * are provisional continuity inferred from photographed sibling #891,
 * never a source-observed property of #890.
 * No external photos/assets, no invented balconies, terraces or doors.
 */
export const ARMADNI_890_PAIR_FACADE_5288=Object.freeze({
 osmId:'1047406191',ruian:'107124980',house:'890',
 sourceHash:'bc90ca65',sourceNodes:11,
 project:'STAKO C15 / C16',groundBandHeightMetres:2.90,
 modelRooflineMetres:12.2,
 modeledColors:Object.freeze({ground:0x74675c,upper:0xe9e5dc}),
 projectUrl:'https://www.stakohk.cz/MILOVICE-Bydleni-v-zeleniBD-C-15-a-C-16.html',
 cityRecordUrl:'https://milovice.hlasenirozhlasu.cz/files/milovice/attachments/249858/Anonymizovany-Zapis-z-jednani-29-2024-2547.pdf',
 siblingExteriorUrl:'https://jirisimon.cz/milovice/',
 photoOfThisHouseVerified:false,allFacesUnverified:true,
 groundColorInferred:true,groundBandHeightEstimated:true
});
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
export function planArmadni890PairFacade5288(source){
 const c=ARMADNI_890_PAIR_FACADE_5288,g=source?.sourceGeometry;
 if(source?.sourceFacadeVersion!=='5.282'||
  source.sourceOSMId!==c.osmId||source.sourceRUIANId!==c.ruian||
  source.sourceHash!==c.sourceHash||source.sourceNodes!==c.sourceNodes||
  source.sourceReportedFloors!==4||source.sourceReportedFlats!==25||
  source.sourceName!=='Armádní 890'||source.estimatedWindows!==92||
  source.existingSourceShellUnchanged!==true||
  source.exactWindowPositionsVerified!==false||
  source.newBuildings!==0||source.newBalconies!==0||
  source.newDoors!==0||source.newColliders!==0||
  !Array.isArray(g)||g.length!==c.sourceNodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  g[0].lat!==g.at(-1).lat||g[0].lon!==g.at(-1).lon||
  hash(g)!==c.sourceHash||
  Math.abs(source.modelHeightMeters-c.modelRooflineMetres)>.005||
  !Array.isArray(source.facades)||source.facades.length!==6)return null;
 return {version:'5.288',sourceOSMId:c.osmId,sourceRUIANId:c.ruian,
  sourceGeometry:g,sourceHash:c.sourceHash,sourceNodeCount:c.sourceNodes,
  colors:c.modeledColors,modelGroundBandTopMetres:c.groundBandHeightMetres,
  modelRooflineMetres:c.modelRooflineMetres,
  projectSourceUrl:c.projectUrl,citySourceUrl:c.cityRecordUrl,
  siblingPhotoUrl:c.siblingExteriorUrl,
  projectPairVerified:true,housePhotoVerified:false,
  colorsAndGroundBandEstimated:true,allSidesUnverified:true,
  retainedSourceGeometry:true,
  newBuildings:0,newDoors:0,newBalconies:0,newTerraces:0,
  newRoads:0,newFootways:0,newColliders:0};
}
const materialCache=new WeakMap();
export function renderArmadni890PairFacade5288(THREE,{plan,toWorld,baseHeight,layer}={}){
 const c=ARMADNI_890_PAIR_FACADE_5288;
 if(plan?.version!=='5.288'||plan.sourceOSMId!==c.osmId||
  plan.sourceRUIANId!==c.ruian||plan.sourceHash!==c.sourceHash||
  plan.housePhotoVerified!==false||plan.retainedSourceGeometry!==true||
  plan.sourceNodeCount!==c.sourceNodes||
  !THREE?.Mesh||!THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||
  !THREE?.MeshStandardMaterial||typeof toWorld!=='function'||
  !Number.isFinite(baseHeight)||!layer?.add)return null;
 const points=plan.sourceGeometry.map(toWorld);
 if(points.length!==c.sourceNodes||
  points.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))return null;
 const signed=points.slice(0,-1).reduce((a,p,i)=>{
  const q=points[i+1];return a+p.x*q.y-p.y*q.x;
 },0);
 if(!Number.isFinite(signed)||Math.abs(signed)<.01)return null;
 const side=Math.sign(signed),arrays=[[],[]];
 const rect=(kind,a,b,nx,nz,y0,y1,off)=>{
  const pos=(t,y)=>[a.x+(b.x-a.x)*t+nx*off,
   baseHeight+y,a.y+(b.y-a.y)*t+nz*off];
  const v0=pos(0,y0),v1=pos(1,y0),v2=pos(1,y1),v3=pos(0,y1);
  arrays[kind].push(...v0,...v1,...v2,...v0,...v2,...v3);
 };
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.y-a.y;
  const len=Math.hypot(dx,dz);
  if(!(len>.15))return null;
  const nx=side*dz/len,nz=-side*dx/len;
  // Reuse the established 891 layering: the existing 5.192 provisional
  // plinth is at +.036m, glass at +.044m, frames at +.068m.
  // New inferred color is in front of the old grey strip, behind windows.
  rect(0,a,b,nx,nz,.02,plan.modelGroundBandTopMetres,.039);
  rect(1,a,b,nx,nz,plan.modelGroundBandTopMetres,
   plan.modelRooflineMetres-.025,.018);
  rect(1,a,b,nx,nz,plan.modelGroundBandTopMetres-.04,
   plan.modelGroundBandTopMetres+.035,.041);
 }
 let mats=materialCache.get(THREE);
 if(!mats){
  mats=[plan.colors.ground,plan.colors.upper].map(color=>
   new THREE.MeshStandardMaterial({color,roughness:.88,
    metalness:0,side:THREE.DoubleSide}));
  materialCache.set(THREE,mats);
 }
 const meshes=arrays.map((verts,i)=>{
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  g.computeVertexNormals();g.computeBoundingSphere();
  const mesh=new THREE.Mesh(g,mats[i]);
  mesh.name='Milovice_Armadni_890_EstimatedProjectPair_'+
   (i?'Upper':'Ground')+'_5288';
  mesh.userData.sourceOSMId=c.osmId;
  mesh.userData.projectSourceUrl=c.projectUrl;
  mesh.userData.housePhotoVerified=false;
  mesh.userData.estimatedPalette=true;
  mesh.userData.lodDetail=false;
  mesh.receiveShadow=true;layer.add(mesh);
  return mesh;
 });
 const isVisible=m=>{
  for(let p=m;p;p=p.parent)if(p.visible===false)return false;
  return true;
 };
 return {version:'5.288',sourceOSMId:c.osmId,sourceRUIANId:c.ruian,
  photoApproved:false,projectPairVerified:true,colorsAndBandEstimated:true,
  originalSourceFootprintRetained:true,modelWallEdges:c.sourceNodes-1,
  meshCount:meshes.length,triangles:arrays.reduce((a,v)=>a+v.length/9,0),
  windowBaysAdded:0,newBuildings:0,newBalconies:0,newDoors:0,
  newTerraces:0,newRoads:0,newFootways:0,newColliders:0,
  allInScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(isVisible).length};
}
