/** Milovice RP 5.289 — original Armádní 886=C14 and 887=C13.
 * Official C13/C14 developer project confirms houses, gardens and upper
 * balconies as PROGRAMME only. Exact balcony/door coordinates, existing
 * facade RGB and ground band height are NOT photo verified.
 * This module adds two conservative PROVISIONAL visual surface layers to
 * each existing OSM/RÚIAN wall, not new shell, balcony or physical geometry.
 */
export const ARMADNI_WEST_PROJECT_5289=Object.freeze({
 projectUrl:'https://www.bydleni-milovice.cz/filosofie/',
 addressMappingUrl:'https://www.finmag.cz/obchodni-rejstrik/zivnostensky-rejstrik/47539801-ites-spol-s-r-o',
 houses:Object.freeze([
  Object.freeze({house:'886',project:'C14',osmId:'1164238465',
   ruian:'119003791',hash:'47591c72',nodes:15,windowSlots:88}),
  Object.freeze({house:'887',project:'C13',osmId:'1164238466',
   ruian:'119001071',hash:'e201d9e2',nodes:15,windowSlots:88})
 ]),
 modelHeight:12.2,modelBandTopMetres:2.9,
 // NOT a sampled paint color or verified photographed facade.
 estimatedColors:Object.freeze({ground:0x8b8479,upper:0xe9e6dd}),
 exactColorsVerified:false,exactBandVerified:false,
 exactBalconyLocationsVerified:false,
 gardensAndUpperBalconiesProjectDocumented:true
});
function sourceHash(g){
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
}
export function planArmadniWestProject5289(source){
 const c=ARMADNI_WEST_PROJECT_5289;
 const b=c.houses.find(x=>x.osmId===source?.sourceOSMId);
 const g=source?.sourceGeometry;
 if(!b||source.sourceFacadeVersion!=='5.282'||
  source.sourceRUIANId!==b.ruian||source.sourceHash!==b.hash||
  source.sourceName!=='Armádní '+b.house||
  source.sourceNodes!==b.nodes||source.sourceReportedFloors!==4||
  source.sourceReportedFlats!==25||source.estimatedWindows!==b.windowSlots||
  Math.abs(source.modelHeightMeters-c.modelHeight)>.005||
  source.existingSourceShellUnchanged!==true||
  source.exactWindowPositionsVerified!==false||
  source.newBuildings!==0||source.newBalconies!==0||
  source.newDoors!==0||source.newColliders!==0||
  !Array.isArray(source.facades)||source.facades.length!==7||
  !Array.isArray(g)||g.length!==b.nodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  g[0].lat!==g.at(-1).lat||g[0].lon!==g.at(-1).lon||
  sourceHash(g)!==b.hash)return null;
 return {version:'5.289',sourceOSMId:b.osmId,
  sourceRUIANId:b.ruian,house:b.house,project:b.project,
  sourceHash:b.hash,sourceGeometry:g,sourceNodes:b.nodes,
  upperFloorBalconiesProjectDocumented:true,balconyPositionsKnown:false,
  upperColorsExact:false,groundBandExact:false,
  originalBuildingShellRetained:true,
  modelBandTopMetres:c.modelBandTopMetres,modelHeight:c.modelHeight,
  palette:c.estimatedColors,
  newBuildings:0,newBalconies:0,newDoors:0,newTerraces:0,
  newFootways:0,newRoads:0,newColliders:0};
}
const materialsCache=new WeakMap();
export function renderArmadniWestProject5289(THREE,{
 plan,toWorld,baseHeight,layer
}={}){
 const c=ARMADNI_WEST_PROJECT_5289;
 const b=c.houses.find(x=>x.osmId===plan?.sourceOSMId);
 if(!b||plan?.version!=='5.289'||plan.sourceRUIANId!==b.ruian||
  plan.sourceHash!==b.hash||plan.project!==b.project||
  plan.sourceNodes!==b.nodes||plan.originalBuildingShellRetained!==true||
  plan.balconyPositionsKnown!==false||
  !THREE?.Mesh||!THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||
  !THREE?.MeshStandardMaterial||typeof toWorld!=='function'||
  !Number.isFinite(baseHeight)||!layer?.add)return null;
 const pts=plan.sourceGeometry.map(toWorld);
 if(pts.length!==b.nodes||pts.some(p=>
  !Number.isFinite(p?.x)||!Number.isFinite(p?.y)))return null;
 const signed=pts.slice(0,-1).reduce((v,p,i)=>{
  const q=pts[i+1];return v+p.x*q.y-p.y*q.x;
 },0);
 if(!Number.isFinite(signed)||Math.abs(signed)<.01)return null;
 const winding=Math.sign(signed),buffers=[[],[]];
 const quad=(type,a,z,nx,nz,y0,y1,offset)=>{
  const pos=(u,y)=>[a.x+(z.x-a.x)*u+nx*offset,baseHeight+y,
   a.y+(z.y-a.y)*u+nz*offset];
  const v0=pos(0,y0),v1=pos(1,y0),v2=pos(1,y1),v3=pos(0,y1);
  buffers[type].push(...v0,...v1,...v2,...v0,...v2,...v3);
 };
 for(let i=0;i<pts.length-1;i++){
  const a=pts[i],z=pts[i+1],dx=z.x-a.x,dz=z.y-a.y;
  const len=Math.hypot(dx,dz);
  if(!(len>.15))return null;
  const nx=winding*dz/len,nz=-winding*dx/len;
  // Hide false model plinth (+.036) but remain behind model
  // glazing (+.044) and window frames (+.068). No wall cuts.
  quad(0,a,z,nx,nz,.02,plan.modelBandTopMetres,.039);
  quad(1,a,z,nx,nz,plan.modelBandTopMetres,plan.modelHeight-.025,.018);
  quad(1,a,z,nx,nz,plan.modelBandTopMetres-.04,
   plan.modelBandTopMetres+.035,.041);
 }
 let mats=materialsCache.get(THREE);
 if(!mats){
  mats=[plan.palette.ground,plan.palette.upper].map(color=>
   new THREE.MeshStandardMaterial({
    color,roughness:.88,metalness:0,side:THREE.DoubleSide
   }));
  materialsCache.set(THREE,mats);
 }
 const meshes=buffers.map((vertices,i)=>{
  const geom=new THREE.BufferGeometry();
  geom.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geom.computeVertexNormals();geom.computeBoundingSphere();
  const mesh=new THREE.Mesh(geom,mats[i]);
  mesh.name='Milovice_Armadni_'+b.house+'_Estimated_'+
   (i?'Upper':'Ground')+'_5289';
  mesh.userData.sourceOSMId=b.osmId;
  mesh.userData.project=b.project;
  mesh.userData.photoVerified=false;
  mesh.userData.balconyPositionVerified=false;
  mesh.userData.lodDetail=false;mesh.receiveShadow=true;
  layer.add(mesh);
  return mesh;
 });
 const visible=m=>{for(let x=m;x;x=x.parent)if(x.visible===false)return false;return true;};
 return {version:'5.289',house:b.house,project:b.project,
  sourceOSMId:b.osmId,sourceRUIANId:b.ruian,
  projectDocumented:true,photoVerified:false,balconyPositionVerified:false,
  estimatedPalette:true,originalSourceFootprintRetained:true,
  originalWallEdges:b.nodes-1,meshCount:meshes.length,
  triangles:buffers.reduce((v,arr)=>v+arr.length/9,0),
  newBuildings:0,newBalconies:0,newDoors:0,newTerraces:0,
  newFootways:0,newRoads:0,newColliders:0,
  allInScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(visible).length};
}
