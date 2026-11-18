/** 5.157: two physical long facades and arched attic windows, Topolova 646.
 * Photos https://www.revitalizacebytovek.cz/realizace/topolova-646-milovice
 * 2025 pictures 1, 2, 3 show cream/salmon frontage and repeated half-round
 * attic glazing. Exact bay count / facade identity / metre heights unknown.
 * Keep RUIAN/OSM intact; all four materials batch to four DRAW meshes.
 */
import {TOPOLOVA_646_5156 as PREVIOUS} from './osm-topolova-photo-646-5156.js';
export const TOPOLOVA_BOTH_5157=Object.freeze({
 osmId:PREVIOUS.osmId,ruian:PREVIOUS.ruian,
 hash:PREVIOUS.hash,region:PREVIOUS.region,
 photo:PREVIOUS.photo,photo1:'https://realizace.revitalizacebytovek.cz/images/milovice-topolova-646/milovice--topolova-646-1.jpg?v=1782467203',
 photo2:'https://realizace.revitalizacebytovek.cz/images/milovice-topolova-646/milovice--topolova-646-2.jpg?v=1782467203',
 photo3:'https://realizace.revitalizacebytovek.cz/images/milovice-topolova-646/milovice--topolova-646-3.jpg?v=1782467203',
 exteriorEdges:[5,7],archArcSegments:10,
 bayCountPerFace:PREVIOUS.modelDormers,
 photographedHalfRoundAtticWindows:true,
 mirroredBaySpacingEstimated:true,photoCameraSideNotGeoreferenced:true
});
function sourceFingerprint(geo){
 let h=2166136261;
 const str=geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16).padStart(8,'0');
}
const meters=(a,b)=>Math.hypot(
 (a.lat-b.lat)*111320,
 (a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180));
export function planTopolova646BothFacades5157({oldPhotoPlan,geometry}={}){
 const s=TOPOLOVA_BOTH_5157;
 if(oldPhotoPlan?.version!=='5.156'||
  oldPhotoPlan.sourceOSMId!==s.osmId||
  oldPhotoPlan.sourceRUIANId!==s.ruian||
  oldPhotoPlan.sourceOSMHash!==s.hash||
  oldPhotoPlan.sourceOriginalLevels!==1||
  oldPhotoPlan.modelWallFloors!==3||
  oldPhotoPlan.modelWallHeightMeters!==9.15||
  oldPhotoPlan.modelDormers!==s.bayCountPerFace||
  oldPhotoPlan.eastPhotoEdgeIndex!==5||
  oldPhotoPlan.westEdgeIndex!==7||
  !Array.isArray(geometry)||geometry.length!==9||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  sourceFingerprint(geometry)!==s.hash)return null;
 const east=meters(geometry[5],geometry[6]);
 const west=meters(geometry[7],geometry[8]);
 if(Math.abs(east-oldPhotoPlan.eastLengthMeters)>.03||
  Math.abs(west-oldPhotoPlan.westLengthMeters)>.03)return null;
 return {
  version:'5.157',sourceOSMId:s.osmId,sourceRUIANId:s.ruian,
  sourceOSMHash:s.hash,sourcePhoto:s.photo,
  sourcePhotoDetail2:s.photo2,sourcePhotoDetail3:s.photo3,
  photoBackedHalfRoundAtticWindowShape:true,
  photoBackedCreamSalmonFacades:true,
  originalOSMLevels:'1',photoMainRegularRows:3,
  photoExteriorEdges:[5,7],sourceFacadeCount:2,
  eastFaceMeters:+east.toFixed(3),westFaceMeters:+west.toFixed(3),
  modelDormersPerFace:s.bayCountPerFace,
  modelDormersTotal:s.bayCountPerFace*2,
  modelMainWindowsTotal:s.bayCountPerFace*2*3*2,
  modelArchedAtticGlazing:s.bayCountPerFace*2*2,
  modelArchedSegments:s.archArcSegments,
  mainWallHeightMeters:9.15,originalOSMLevelsUnmodified:true,
  originalFootprintUnmodified:true,sideOrientationPhotoUnverified:true,
  oppositeFacadeWindowSpacingEstimated:true,
  modelDormerCountNotSurveyed:true,
  photoShowedEntranceButPositionUnverified:true,
  createdDoors:0,createdColliders:0,createdNewBuildings:0,
  createdRoads:0,createdPaths:0,createdParking:0,createdTrees:0,
  createdStreetLamps:0
 };
}
/** World outline is 8 distinct OSM points after osmBuilding removes
 * duplicate 9th closing GPS vertex; {x,y} uses y as world Z.
 */
export function renderTopolova646BothFacades5157(THREE,{
 plan,outline,baseY,layer
}={}){
 if(!THREE||plan?.version!=='5.157'||!Array.isArray(outline)||
  outline.length!==8||!Number.isFinite(baseY)||!layer?.add)return null;
 const s=TOPOLOVA_BOTH_5157;
 const groups=[[],[],[],[]];
 const triangles=(k,A,B,C)=>groups[k].push(
  A.x,A.y,A.z,B.x,B.y,B.z,C.x,C.y,C.z);
 const four=(k,A,B,C,D)=>{triangles(k,A,B,C);triangles(k,A,C,D)};
 let regular=0,arched=0,dormers=0;
 const faceCentres=[];
 for(const edge of plan.photoExteriorEdges){
  const a=outline[edge],b=outline[(edge+1)%outline.length];
  const len=Math.hypot(b.x-a.x,b.y-a.y);
  const expected=edge===5?plan.eastFaceMeters:plan.westFaceMeters;
  if(Math.abs(len-expected)>.18)return null;
  const ux=(b.x-a.x)/len,uz=(b.y-a.y)/len;
  const nx=uz,nz=-ux;
  if(edge===5?nx<.97:nx>-.97)return null;
  faceCentres.push({x:(a.x+b.x)/2,z:(a.y+b.y)/2});
  const P=(t,y,out=.056)=>({
   x:a.x+ux*t+nx*out,y:baseY+y,z:a.y+uz*t+nz*out
  });
  const quad=(k,t0,t1,y0,y1,out=.056)=>four(
   k,P(t0,y0,out),P(t1,y0,out),P(t1,y1,out),P(t0,y1,out)
  );
  const dome=(k,t,y0,w,straight,out)=>{
   const points=[P(t-w,y0,out),P(t+w,y0,out),
    P(t+w,y0+straight,out)];
   for(let i=1;i<=s.archArcSegments;i++){
    const angle=Math.PI*i/s.archArcSegments;
    points.push(P(t+Math.cos(angle)*w,
     y0+straight+Math.sin(angle)*w,out));
   }
   // Triangulate the filled, non-self-intersecting arch.
   const centre=P(t,y0+straight*.67,out);
   for(let i=0;i<points.length;i++){
    triangles(k,centre,points[i],points[(i+1)%points.length]);
   }
  };
  const n=plan.modelDormersPerFace,step=len/n,h=plan.mainWallHeightMeters;
  for(let i=0;i<=n;i++){
   const t=Math.max(.1,Math.min(len-.1,i*step));
   quad(0,Math.max(.1,t-.21),Math.min(len-.1,t+.21),
    .13,h-.14,.062);
  }
  quad(0,.10,len-.10,h-.23,h-.09,.064);
  for(let i=0;i<n;i++){
   const t=(i+.5)*step;
   // Photograph documents three ordinary rows, 2 window columns per
   // model bay. Actual spacing/count is not a surveyed record.
   for(const y of [1.65,4.70,7.75]){
    for(const dx of [-1.02,1.02]){
     quad(1,t+dx-.66,t+dx+.66,y-.82,y+.82,.080);
     quad(2,t+dx-.54,t+dx+.54,y-.69,y+.69,.084);
     regular++;
    }
   }
   const w=step*.38,lower=h+.13,peak=h+1.85;
   const L=P(t-w,lower,.15),R=P(t+w,lower,.15),
    apex=P(t,peak,.15);
   triangles(0,L,R,apex); // salmon pediment behind two curved panes
   for(const dx of [-.61,.61]){
    dome(1,t+dx,h+.31,.45,.33,.17);
    dome(2,t+dx,h+.37,.355,.275,.181);
    // A slim white mid-pane bar follows the documented window mullion.
    quad(1,t+dx-.027,t+dx+.027,h+.39,h+.91,.191);
    arched++;
   }
   const BL=P(t-w,lower+.10,-1.23);
   const BR=P(t+w,lower+.10,-1.23);
   const BA=P(t,peak-.37,-1.23);
   four(3,L,apex,BA,BL);
   four(3,apex,R,BR,BA);
   dormers++;
  }
 }
 if(regular!==plan.modelMainWindowsTotal||
  arched!==plan.modelArchedAtticGlazing||
  dormers!==plan.modelDormersTotal)return null;
 const colors=[0xd78d71,0xf1eee7,0x7e9aa9,0x773337];
 const names=['SalmonTrim','ArchedFrames','Glass','GableRoofs'];
 const meshes=[];
 const cx=faceCentres.reduce((n,p)=>n+p.x,0)/faceCentres.length;
 const cz=faceCentres.reduce((n,p)=>n+p.z,0)/faceCentres.length;
 for(let i=0;i<groups.length;i++){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',
   new THREE.Float32BufferAttribute(groups[i],3));
  g.computeVertexNormals();g.computeBoundingSphere();
  const mat=new THREE.MeshStandardMaterial({
   color:colors[i],roughness:i===2?.33:.82,
   metalness:i===2?.07:0,side:THREE.DoubleSide
  });
  const m=new THREE.Mesh(g,mat);
  m.name='Milovice_Topolova646_BothFacades_'+names[i]+'_5157';
  m.userData.lodX=cx;m.userData.lodZ=cz;
  m.userData.lodDetail=false;m.userData.photoProvenExterior=true;
  m.receiveShadow=true;layer.add(m);meshes.push(m);
 }
 const visible=mesh=>{
  for(let p=mesh;p;p=p.parent)if(!p.visible)return false;
  return true;
 };
 return {
  version:'5.157',renderedMeshes:meshes.length,
  renderedTriangleCount:groups.reduce((n,a)=>n+a.length/9,0),
  modelMainWindows:regular,modelAtticWindows:arched,modelGables:dormers,
  modeledArches:arched,renderedFacadeEdges:[...plan.photoExteriorEdges],
  modelPhotoFacadeMeters:plan.eastFaceMeters,
  visibleAfterLOD:()=>meshes.filter(visible).length,
  allInScene:()=>meshes.every(m=>m.parent===layer)
 };
}
