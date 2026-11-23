/** Milovice RP 5.192 — two large Višňová residential masses beside Armádní
 * and MŠ Sluníčko. Source RÚIAN/OSM proves footprint and floor counts only.
 * Model windows, glass, frame color, plinth and spacing are NOT photo survey.
 * All physical wall/roof volumes, terrain placement and collisions remain
 * the existing OSM renderer's; no guessed doors, balconies or entrances.
 */
export const VISNOVA_RESIDENTIAL_5192=Object.freeze({
 region:'mlada',
 buildings:Object.freeze([
  Object.freeze({
   id:'53865847',ruian:'25442970',name:'Višnová 572',
   originalHash:'750bac6c',nodes:24,originalLevels:'11',
   originalFlats:'69',modelLongEdges:[0,5,9,15],
   expectedLengths:[14.761,22.230,14.728,57.676],
   modelBaySpacing:3.60
  }),
  Object.freeze({
   id:'53865848',ruian:'25789759',name:'Višňová 573',
   originalHash:'ff594686',nodes:6,originalLevels:'5',
   originalFlats:'84',modelLongEdges:[2,4],
   expectedLengths:[65.243,72.570],
   modelBaySpacing:3.60
  })
 ]),
 windowWidthMeters:1.46,
 windowHeightMeters:1.52,
 nominalFloorMeters:3.05,
 originalFootprintsFrom:'cuzk:ruian'
});
const hash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const planXY=p=>({
 x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320
});
export function planVisnovaResidential5192({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=VISNOVA_RESIDENTIAL_5192;
 const source=c.buildings.find(w=>w.id===String(id));
 if(!source||regionId!==c.region||photoReviewed||
  approvedArchitecture||tags?.building!=='residential'||
  tags.name!==source.name||
  tags['ref:ruian:building']!==source.ruian||
  tags['building:flats']!==source.originalFlats||
  tags['building:levels']!==source.originalLevels||
  tags.source!==c.originalFootprintsFrom||
  tags.height!==undefined||
  modelFloors!==Number(source.originalLevels)||
  Math.abs(modelHeight-modelFloors*c.nominalFloorMeters)>.005||
  !Array.isArray(geometry)||geometry.length!==source.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(geometry)!==source.originalHash||
  geometry[0].lat!==geometry.at(-1).lat||
  geometry[0].lon!==geometry.at(-1).lon)return null;
 const coords=geometry.map(planXY);
 const area=coords.slice(0,-1).reduce((sum,p,i)=>{
  const q=coords[i+1];return sum+p.x*q.z-p.z*q.x;
 },0)/2;
 if(!(area>500))return null;
 const facades=[];
 for(let i=0;i<source.modelLongEdges.length;i++){
  const edge=source.modelLongEdges[i],a=coords[edge],b=coords[edge+1];
  const length=Math.hypot(b.x-a.x,b.z-a.z);
  if(Math.abs(length-source.expectedLengths[i])>.17)return null;
  const bays=Math.round(length/source.modelBaySpacing);
  if(bays<3||bays>22||length/bays<c.windowWidthMeters+.7)return null;
  facades.push({edgeIndex:edge,sourceLengthMetres:+length.toFixed(3),
   bays,windowWidthMetres:c.windowWidthMeters});
 }
 return {
  version:'5.192',sourceOSMId:source.id,sourceRUIANId:source.ruian,
  sourceName:source.name,sourceHash:source.originalHash,
  sourceNodes:source.nodes,sourceGeometry:geometry,
  sourceReportedFloors:modelFloors,modelHeightMeters:modelHeight,
  facades,modelWindowWidthMetres:c.windowWidthMeters,
  modelWindowHeightMetres:c.windowHeightMeters,
  expectedLongFacadeCount:facades.length,
  estimatedWindows:facades.reduce((n,f)=>n+f.bays*modelFloors,0),
  suppressedGenericFacadeEdges:source.nodes-1,
  exactWindowPositionsVerified:false,facadeColorsPhotoVerified:false,
  exactRoofShapePhotoVerified:false,sourceWallGeometryUntouched:true,
  modelUsesOriginalRUIANFootprint:true,
  inventedEntrances:0,inventedBalconies:0,
  newBuildingVolumes:0,newFootways:0,newRoads:0,newColliders:0
 };
}
// Shared across every source-locked house in the same THREE runtime.
// WeakMap keeps tests/independent renderers isolated and avoids duplicating
// four identical GPU materials for each newly streamed-in residential shell.
const facadeMaterialCache5192=new WeakMap();
export function renderVisnovaResidential5192(THREE,{
 plan,toWorld,baseHeight,layer,omitModelWindows=[]
}={}){
 if(plan?.version!=='5.192'||!THREE?.Mesh||
  !THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||
  !THREE?.MeshStandardMaterial||typeof toWorld!=='function'||
  !Number.isFinite(baseHeight)||!layer?.add)return null;
 // Optional source-locked suppression concerns ESTIMATED glazing only. Never
 // cut physical wall geometry, and reject stale/foreign facade slot IDs.
 if(!Array.isArray(omitModelWindows)||omitModelWindows.length>12)return null;
 const omittedSlots=new Set();
 for(const slot of omitModelWindows){
  const face=plan.facades.find(f=>f.edgeIndex===slot?.edgeIndex);
  if(slot?.sourceOSMId!==plan.sourceOSMId||!face||
   !Number.isInteger(slot.floor)||slot.floor<0||
   slot.floor>=plan.sourceReportedFloors||
   !Number.isInteger(slot.bay)||slot.bay<0||slot.bay>=face.bays)return null;
  const key=slot.edgeIndex+':'+slot.floor+':'+slot.bay;
  if(omittedSlots.has(key))return null;
  omittedSlots.add(key);
 }
 const coords=plan.sourceGeometry.map(toWorld);
 if(coords.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))return null;
 // Frames protrude beyond glazing; mullions sit just proud of the frames.
 // All depths are model approximations, not photo-measured.
 const signedArea2=coords.slice(0,-1).reduce((sum,p,i)=>{
  const q=coords[i+1];return sum+p.x*q.y-p.y*q.x;
 },0);
 // Winding can vary across imported outlines. Facade offsets must always
 // face the exterior, regardless of clockwise/counter-clockwise source order.
 if(!Number.isFinite(signedArea2)||Math.abs(signedArea2)<.01)return null;
 const exteriorSign=Math.sign(signedArea2);
 const positions=[[],[],[],[]]; // frame, glass, sill, low plinth
 const rectangle=(buffer,a,b,low,high,out,nx,nz)=>{
  const p=(t,y)=>({
   x:a.x+(b.x-a.x)*t+nx*out,
   y:baseHeight+y,
   z:a.y+(b.y-a.y)*t+nz*out
  });
  const [p0,p1,p2,p3]=[p(low[0],low[1]),p(high[0],low[1]),
   p(high[0],high[1]),p(low[0],high[1])];
  const tri=(a,b,c)=>positions[buffer].push(
   a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);
  tri(p0,p1,p2);tri(p0,p2,p3);
 };
 const geoRect=(buffer,a,b,start,stop,y0,y1,out,nx,nz)=>{
  rectangle(buffer,a,b,[start,y0],[stop,y1],out,nx,nz);
 };
 const facesByIndex=new Map(plan.facades.map(f=>[f.edgeIndex,f]));
 let windows=0,omitted=0,plinthEdges=0;
 for(let edge=0;edge<coords.length-1;edge++){
  const a=coords[edge],b=coords[edge+1],dx=b.x-a.x,dz=b.y-a.y;
  const len=Math.hypot(dx,dz);
  if(len<.08)continue;
  const nx=exteriorSign*dz/len,nz=-exteriorSign*dx/len;
  geoRect(3,a,b,0,1,.02,.69,.036,nx,nz);plinthEdges++;
  const face=facesByIndex.get(edge);
  if(!face)continue;
  if(Math.abs(len-face.sourceLengthMetres)>.22)return null;
  const floorGap=VISNOVA_RESIDENTIAL_5192.nominalFloorMeters;
  for(let floor=0;floor<plan.sourceReportedFloors;floor++){
   const y=floor*floorGap+1.83;
   const low=y-plan.modelWindowHeightMetres*.5,
    high=y+plan.modelWindowHeightMetres*.5;
   if(high>plan.modelHeightMeters-.12)return null;
   const pad=.064;
   for(let bay=0;bay<face.bays;bay++){
    if(omittedSlots.has(edge+':'+floor+':'+bay)){omitted++;continue;}
    const center=(bay+.5)/face.bays;
    const half=plan.modelWindowWidthMetres*.5/len;
    const left=center-half,right=center+half;
    if(left<=0||right>=1)return null;
    const rim=pad/len;
    geoRect(0,a,b,left,left+rim,low,high,.068,nx,nz);
    geoRect(0,a,b,right-rim,right,low,high,.068,nx,nz);
    geoRect(0,a,b,left+rim,right-rim,low,low+pad,.068,nx,nz);
    geoRect(0,a,b,left+rim,right-rim,high-pad,high,.068,nx,nz);
    geoRect(1,a,b,left+rim,right-rim,low+pad,high-pad,.044,nx,nz);
    geoRect(0,a,b,center-rim*.60,center+rim*.60,
     low+pad,high-pad,.076,nx,nz);
    geoRect(2,a,b,left-.08/len,right+.08/len,
     low-.105,low+.012,.128,nx,nz);
    windows++;
   }
  }
 }
 if(windows+omitted!==plan.estimatedWindows||omitted!==omittedSlots.size)return null;
 let materials=facadeMaterialCache5192.get(THREE);
 if(!materials){
  const palette=[0xd4d4d1,0x7996a5,0xbcb8b0,0x96958f];
  materials=palette.map((color,i)=>new THREE.MeshStandardMaterial({
   color,metalness:i===1?.08:0,roughness:i===1?.43:.87,
   side:THREE.DoubleSide
  }));
  facadeMaterialCache5192.set(THREE,materials);
 }
 const meshes=positions.map((vertices,i)=>{
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',
   new THREE.Float32BufferAttribute(vertices,3));
  geometry.computeVertexNormals();geometry.computeBoundingSphere();
  const mesh=new THREE.Mesh(geometry,materials[i]);
  mesh.name='Milovice_Visnova_'+plan.sourceOSMId+'_SourceFacade_'+
   ['Frames','Glass','Sills','Plinth'][i]+'_5192';
  mesh.userData.sourceOSMId=plan.sourceOSMId;
  mesh.userData.estimatedWindows=true;
  mesh.userData.lodDetail=false;
  mesh.receiveShadow=true;layer.add(mesh);return mesh;
 });
 const visible=m=>{
  for(let parent=m;parent;parent=parent.parent)if(!parent.visible)return false;
  return true;
 };
 return {
  version:'5.192',sourceOSMId:plan.sourceOSMId,
  sourceRUIANId:plan.sourceRUIANId,
  sourceReportedFloors:plan.sourceReportedFloors,
  longFacadesRendered:plan.facades.length,
  estimatedWindowsRendered:windows,plannedModelWindowBays:plan.estimatedWindows,
  omittedModelWindows:omitted,plinthEdgesRendered:plinthEdges,
  totalTriangles:positions.reduce((n,v)=>n+v.length/9,0),
  meshCount:meshes.length,
  genericFacadeEdgesSuppressed:plan.suppressedGenericFacadeEdges,
  estimatedWindowPositions:true,photoVerifiedColors:false,
  originalFootprintUnmodified:true,addedColliders:0,addedDoors:0,
  allInScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(visible).length
 };
}
