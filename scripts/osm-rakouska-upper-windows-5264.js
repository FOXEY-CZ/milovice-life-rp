/**
 * Milovice RP 5.264 — photo-backed upper-window rhythm and aged plaster.
 * References: Stanislav Doronenko, 20 Aug 2025, CC BY-SA 4.0:
 * Rakouská (Milovice) 15.jpg + Italská, Milovice 05.jpg (Commons).
 * Upper-front openings and damaged plaster visible in actual photo.
 * Exact bay counts, width, height and missing-plaster shapes NOT measured.
 * This is a dark *surface treatment*, not a hole in original RUIAN walls.
 */
import {UPPER_CORNER_5263} from './osm-rakouska-photo-upper-5263.js';

export const RAKOUSKA_UPPER_WINDOWS_5264=Object.freeze({
 regionId:'mlada',osmId:'53865882',ruianId:'40057411',
 originalHash:'7aec42bc',
 photo:UPPER_CORNER_5263.photo,secondPhoto:UPPER_CORNER_5263.photo2,
 author:'Stanislav Doronenko',photoDate:'2025-08-20',licence:'CC BY-SA 4.0',
 // Original mapped exterior wall edges, NOT the artificial polygon closure 8.
 frontRows:Object.freeze([
  Object.freeze({edge:0,windows:2,widthMetres:.70,sillMetres:.82,heightMetres:1.02}),
  Object.freeze({edge:2,windows:3,widthMetres:.67,sillMetres:.82,heightMetres:1.02})
 ]),
 sideReturn:Object.freeze({
  edge:7,windows:1,widthMetres:.76,sillMetres:.42,heightMetres:1.67
 }),
 wornPlasterPlacementMeasured:false,windowBayPlacementMeasured:false
});

const length=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);
const area2=p=>p.reduce((sum,a,i)=>{
 const b=p[(i+1)%p.length];return sum+a.x*b.z-b.x*a.z;
},0);
const xyValid=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.z);
export function planRakouskaUpperWindows5264({upperPlan}={}){
 const src=RAKOUSKA_UPPER_WINDOWS_5264,p=upperPlan;
 if(p?.version!=='5.263'||p?.sourceOsmId!==src.osmId||
  p?.sourceRuianId!==src.ruianId||p?.sourceHash!==src.originalHash||
  p?.modelExtraHeight!==2.4||p?.sourcePhoto!==src.photo||
  p?.secondPhoto!==src.secondPhoto||
  !Array.isArray(p.perimeter)||p.perimeter.length!==9||
  !p.perimeter.every(xyValid)||
  !Array.isArray(p.vertices)||p.vertices.join(',')!=='0,1,2,3,4,5,6,7,8'||
  !Array.isArray(p.roof)||p.roof.length!==7||
  !Number.isFinite(p.areaSquareMetres)||p.areaSquareMetres<55||
  p.areaSquareMetres>58||p.sourceFootprintPreserved!==true)return null;
 const sign=Math.sign(area2(p.perimeter));
 if(sign!==1)return null;
 const faces=[];
 for(const profile of [...src.frontRows,src.sideReturn]){
  const i=profile.edge,a=p.perimeter[i],b=p.perimeter[i+1];
  if(!a||!b)return null;
  const len=length(a,b),nx=sign*(b.z-a.z)/len,
   nz=-sign*(b.x-a.x)/len;
  if(!Number.isFinite(len)||len<4.65||len>5.75||
   !Number.isFinite(nx)||!Number.isFinite(nz))return null;
  if(profile.heightMetres+profile.sillMetres>p.modelExtraHeight-.20)
   return null;
  const locations=[];
  for(let j=0;j<profile.windows;j++){
   const mid=(j+1)/(profile.windows+1);
   const half=profile.widthMetres/(2*len),lo=mid-half,hi=mid+half;
   if(lo*len<.45||(1-hi)*len<.45)return null;
   locations.push({lo,hi,y0:profile.sillMetres,
    y1:profile.sillMetres+profile.heightMetres});
  }
  faces.push({edge:i,a,b,len,nx,nz,windows:locations,
   photographedWindowPresence:true,measuredExactBaySpacing:false});
 }
 if(faces.length!==3||faces.reduce((s,f)=>s+f.windows.length,0)!==6)
  return null;
 return {version:'5.264',sourceOsmId:src.osmId,sourceRuianId:src.ruianId,
  sourceHash:src.originalHash,photo:src.photo,
  sourcePhoto2:src.secondPhoto,author:src.author,licence:src.licence,
  originalUpperSourceEdges:faces.map(f=>f.edge),faces,
  windowVisualCount:6,modelDimensionsNotMeasured:true,
  sourceUpperPolygonUnmodified:true,originalRoofUnmodified:true,
  newPhysicalOpenings:0,newEntrances:0,newBuildings:0,
  newColliders:0,newRoads:0,newFootways:0,newFences:0};
}
export function renderRakouskaUpperWindows5264(THREE,{plan,layer,
 baseHeight,roofHeight
}={}){
 if(plan?.version!=='5.264'||plan?.windowVisualCount!==6||
  plan?.faces?.length!==3||!THREE||!layer||
  !Number.isFinite(baseHeight)||!Number.isFinite(roofHeight)||
  roofHeight<4||roofHeight>16)return null;
 const base=baseHeight+roofHeight,pane=[],frame=[],weather=[],brick=[];
 const quad=(dest,a,b,c,d)=>{
  for(const p of [a,b,c,a,c,d])dest.push(p.x,p.y,p.z);
 };
 const triangle=(dst,a,b,c)=>{
  for(const p of [a,b,c])dst.push(p.x,p.y,p.z);
 };
 let openings=0,wearCount=0;
 for(const f of plan.faces){
  const {a,b,len,nx,nz}=f;
  const at=(t,y,off)=>({
   x:a.x+(b.x-a.x)*t+nx*off,
   y:base+y,
   z:a.z+(b.z-a.z)*t+nz*off
  });
  const rect=(out,lo,hi,y0,y1,off)=>{
   quad(out,at(lo,y0,off),at(hi,y0,off),
    at(hi,y1,off),at(lo,y1,off));
  };
  for(const win of f.windows){
   const {lo,hi,y0,y1}=win,width=.048/len;
   rect(pane,lo,hi,y0,y1,.067);
   // Quiet chipped stone/metal jambs, not transparent actual wall cuts.
   rect(frame,lo-width,lo+width,y0-.045,y1+.045,.078);
   rect(frame,hi-width,hi+width,y0-.045,y1+.045,.078);
   rect(frame,lo-width,hi+width,y0-.047,y0+.037,.078);
   rect(frame,lo-width,hi+width,y1-.037,y1+.047,.078);
   // Partial vertical mullion reads as a ruined window, not a solid panel.
   const middle=(lo+hi)*.5;
   rect(frame,middle-width*.43,middle+width*.43,
    y0+.05,y1-.05,.080);
   openings++;
  }
  // Deterministic approximate weathering near parapet and at lower edge.
  // Keep all patches OUTSIDE the modeled upper-window heights.
  const count=f.edge===7?2:3;
  for(let j=0;j<count;j++){
   const t=(j+1)/(count+1)+(f.edge%2?-.012:.009);
   const half=Math.min(.55,len*.105)/len;
   const top=2.27+((j+f.edge)%2)*.05;
   const low=(f.edge===7?2.16:1.925)+((j+f.edge)%3)*.025;
   const dest=(j+f.edge)%2?brick:weather;
   triangle(dest,at(t-half,low,.082),
    at(t+half,low+.038,.082),
    at(t+half*.75,top,.082));
   triangle(dest,at(t-half,low,.082),
    at(t+half*.75,top,.082),
    at(t-half*.62,top-.033,.082));
   // Additional weathering below window sills; no overlap with dark panes.
   if(j===0){
    const bottom=f.edge===7?.09:.39;
    rect(weather,t-half*.64,t+half*.48,bottom,bottom+.13,.083);
   }
   wearCount++;
  }
 }
 if(openings!==6||wearCount!==8)return null;
 const meshes=[];
 for(const [kind,coords,color] of [
  ['photographed-dark-upper-windows',pane,'#263035'],
  ['estimated-aged-window-frames',frame,'#9e9992'],
  ['approximate-plaster-loss',weather,'#85796e'],
  ['approximate-exposed-red-brick',brick,'#9c6960']
 ]){
  if(!coords.length)continue;
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',
   new THREE.Float32BufferAttribute(coords,3));
  geometry.computeVertexNormals();geometry.computeBoundingSphere();
  const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({
   color,roughness:1,side:THREE.DoubleSide,
   polygonOffset:true,polygonOffsetFactor:-1
  }));
  mesh.name='Milovice_Rakouska_5264_'+kind;
  mesh.userData.lodDetail=true;mesh.receiveShadow=true;
  layer.add(mesh);meshes.push(mesh);
 }
 return {version:'5.264',photoWindowVisualCount:openings,
  originalUpperSourceEdges:plan.originalUpperSourceEdges,
  renderDrawCalls:meshes.length,weatherPatches:wearCount,
  paneTriangles:pane.length/9,frameTriangles:frame.length/9,
  plasterTriangles:(weather.length+brick.length)/9,
  modelHeightMeasurements:false,polygonUntouched:true,
  newPhysicalOpenings:0,newEntrances:0,newColliders:0,
  inScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(m=>m.parent===layer&&m.visible).length};
}
