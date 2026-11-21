/** Milovice RP 5.216: REAL mapped Višňová / Armádní crossing
 * 1044078120 has crossing:markings=zebra and crossing:island=yes.
 * Its centre node is EXACTLY a source node of Armádní OSM 1331897686.
 * Model outline/height/paint spacing are NOT photographically verified.
 * Road, sidewalk, pedestrian geometry and collision network stay intact.
 */
export const VISNOVA_REFUGE_5216=Object.freeze({
 regionId:'mlada',crossingId:'1044078120',crossingHash:'097b2218',
 roadId:'1331897686',roadHash:'b19851ee',
 originalCrossingNodes:3,originalRoadNodes:3,centreNode:1,
 modelLengthMetres:2.4,modelWidthMetres:.8,
 modelKerbHeightMetres:.16,roadTopOffsetMetres:.17,
 paintBufferMetres:.08
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const valid=p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon);
const fingerprint=g=>{
 let h=2166136261;
 for(const c of g.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const norm=v=>{const d=Math.hypot(v.x,v.z);return d>1e-6?
 {x:v.x/d,z:v.z/d}:null;};
const vector=(a,b)=>({x:b.x-a.x,z:b.z-a.z});
const length=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);
export function planVisnovaRefuge5216({regionId,crossing,road}={}){
 const c=VISNOVA_REFUGE_5216;
 if(regionId!==c.regionId||String(crossing?.id)!==c.crossingId||
  String(road?.id)!==c.roadId||
  crossing.tags?.highway!=='footway'||
  crossing.tags?.footway!=='crossing'||
  crossing.tags?.crossing!=='uncontrolled'||
  crossing.tags?.['crossing:markings']!=='zebra'||
  crossing.tags?.['crossing:island']!=='yes'||
  crossing.tags?.lit!=='yes'||
  crossing.tags?.surface!==undefined||
  Object.keys(crossing.tags||{}).some(k=>!['crossing','crossing:island',
    'crossing:markings','footway','highway','lit'].includes(k))||
  road.tags?.highway!=='residential'||
  road.tags?.name!=='Armádní'||
  road.tags?.surface!=='asphalt'||road.tags?.lit!=='yes'||
  road.tags?.maxspeed!=='50'||
  !Array.isArray(crossing.geometry)||
  crossing.geometry.length!==c.originalCrossingNodes||
  !Array.isArray(road.geometry)||
  road.geometry.length!==c.originalRoadNodes||
  crossing.geometry.some(p=>!valid(p))||
  road.geometry.some(p=>!valid(p))||
  fingerprint(crossing.geometry)!==c.crossingHash||
  fingerprint(road.geometry)!==c.roadHash||
  key(crossing.geometry[c.centreNode])!==
    key(road.geometry[c.centreNode]))return null;
 const [start,middle,end]=crossing.geometry.map(xy);
 const r0=xy(road.geometry[0]),r2=xy(road.geometry[2]);
 const roadAxis=norm(vector(r0,r2)),
  pedestrianAxis=norm(vector(start,end));
 if(!roadAxis||!pedestrianAxis||
  Math.abs(roadAxis.x*pedestrianAxis.x+
   roadAxis.z*pedestrianAxis.z)>.21||
  length(start,middle)<4.8||length(start,middle)>5.3||
  length(middle,end)<6.5||length(middle,end)>7.1||
  length(r0,r2)<39||length(r0,r2)>44)return null;
 return {
  version:'5.216',crossingId:c.crossingId,roadId:c.roadId,
  crossingHash:c.crossingHash,roadHash:c.roadHash,
  sourceCrossingGPS:crossing.geometry.map(p=>({...p})),
  centreGPS:{...crossing.geometry[c.centreNode]},
  roadAxis,pedestrianAxis,
  modelLengthMeters:c.modelLengthMetres,
  modelWidthMeters:c.modelWidthMetres,
  baseRoadYOffset:c.roadTopOffsetMetres,
  topAboveRoadMeters:c.modelKerbHeightMetres,
  stripeBufferMeters:c.paintBufferMetres,
  sourceCrossingHasRefuge:true,sourceMiddleOnRoad:true,
  shapeEstimatedNotPhotographed:true,modelledSignposts:0,
  originalRoadUnchanged:true,originalCrossingUnchanged:true,
  newRoads:0,newFootways:0,newCrossings:0,
  newTrafficLights:0,newColliders:0
 };
}
export function planVisnovaRefugeZebra5216({
 plan,crossing,toWorld,carriageway,planZebraPieces
}={}){
 const c=VISNOVA_REFUGE_5216;
 if(plan?.version!=='5.216'||plan.crossingId!==c.crossingId||
  plan.roadId!==c.roadId||plan.crossingHash!==c.crossingHash||
  !plan.sourceCrossingHasRefuge||!plan.sourceMiddleOnRoad||
  String(crossing?.id)!==c.crossingId||
  !Array.isArray(crossing.geometry)||crossing.geometry.length!==3||
  crossing.geometry.some(p=>!valid(p))||
  fingerprint(crossing.geometry)!==c.crossingHash||
  key(crossing.geometry[1])!==key(plan.centreGPS)||
  !Number.isFinite(plan.modelWidthMeters)||
  plan.modelWidthMeters<.5||plan.modelWidthMeters>1.3||
  typeof toWorld!=='function'||
  typeof carriageway?.nearest!=='function'||
  typeof planZebraPieces!=='function')return null;
 const sourcePts=crossing.geometry.map(toWorld);
 if(sourcePts.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y??p?.z)))
  return null;
 const pts=sourcePts.map(p=>({x:p.x,z:p.z??p.y}));
 const m=pts[1],axis=plan.pedestrianAxis;
 const arms=[[pts[0],pts[1]],[pts[1],pts[2]]];
 const paint=[];
 const byArm=[];
 let rejected=0;
 let minEdge=Infinity;
 for(const pair of arms){
  const raw=planZebraPieces(pair,carriageway);
  if(!Array.isArray(raw))return null;
  let kept=0;
  for(const bar of raw){
   if(!Number.isFinite(bar?.width)||bar.width<=0||
    ![bar?.a?.x,bar?.a?.z,bar?.b?.x,bar?.b?.z].every(Number.isFinite))
    return null;
   const centre={x:(bar.a.x+bar.b.x)*.5,z:(bar.a.z+bar.b.z)*.5};
   const offset=Math.abs((centre.x-m.x)*axis.x+
     (centre.z-m.z)*axis.z);
   const edgeDistance=offset-bar.width*.5;
   if(edgeDistance>=plan.modelWidthMeters*.5+
       plan.stripeBufferMeters){
    paint.push(bar);kept++;minEdge=Math.min(minEdge,edgeDistance);
   }else rejected++;
  }
  byArm.push(kept);
 }
 if(byArm.some(n=>n<1)||byArm.some(n=>n>10)||
  paint.length>18||minEdge<plan.modelWidthMeters*.5+
   plan.stripeBufferMeters)return null;
 return {
  version:'5.216',pieces:paint,
  sourceCrossingId:c.crossingId,sourceRoadId:c.roadId,
  approachBars:byArm,paintedBars:paint.length,
  excludedCentreBars:rejected,
  minimumPaintEdgeClearanceMetres:+minEdge.toFixed(3),
  modelIslandHalfWidthMetres:plan.modelWidthMeters*.5,
  sourceCrossingSplitAtActualOSMNode:true,
  paintPatternEstimateNotPhotographed:true,
  originalCrossingUnchanged:true,newFootways:0,newRoads:0,
  newCrossings:0,newColliders:0
 };
}
export function renderVisnovaRefuge5216(T,{
 plan,toWorld,terrainAt,layer,material
}={}){
 if(plan?.version!=='5.216'||!T?.BufferGeometry||
  !T?.Float32BufferAttribute||!T?.Mesh||!layer?.add||
  typeof toWorld!=='function'||typeof terrainAt!=='function'||
  !material)return null;
 const p=toWorld(plan.centreGPS);
 if(!Number.isFinite(p?.x)||!Number.isFinite(p?.y))return null;
 const ux=plan.roadAxis.x,uz=plan.roadAxis.z,
  nx=-uz,nz=ux,len=plan.modelLengthMeters*.5,
  half=plan.modelWidthMeters*.5;
 const shape=[
  [-len,-half*.52],[-len+.28,-half],
  [len-.28,-half],[len,-half*.52],
  [len,half*.52],[len-.28,half],
  [-len+.28,half],[-len,half*.52]
 ];
 const get=(i,h)=>{
  const [along,across]=shape[i],
   x=p.x+ux*along+nx*across,
   z=p.y+uz*along+nz*across,
   ground=terrainAt(x,z);
  return Number.isFinite(ground)?{x,z,y:ground+h}:null;
 };
 const base=plan.baseRoadYOffset,top=base+plan.topAboveRoadMeters;
 const centerGround=terrainAt(p.x,p.y);
 if(!Number.isFinite(centerGround))return null;
 const center={x:p.x,z:p.y,y:centerGround+top};
 const tops=shape.map((_,i)=>get(i,top));
 const bases=shape.map((_,i)=>get(i,base));
 if([...tops,...bases].some(p=>!p))return null;
 const verts=[];
 const tri=(a,b,c)=>verts.push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);
 for(let i=0;i<8;i++){
  const j=(i+1)%8;
  tri(center,tops[i],tops[j]);
  tri(bases[i],bases[j],tops[j]);
  tri(bases[i],tops[j],tops[i]);
 }
 const geom=new T.BufferGeometry();
 geom.setAttribute('position',new T.Float32BufferAttribute(verts,3));
 geom.computeVertexNormals();
 geom.computeBoundingSphere();
 const mesh=new T.Mesh(geom,material);
 mesh.name='Milovice_Visnova_Armadni_OSM_Refuge5216';
 mesh.userData.sourceCrossingId=plan.crossingId;
 mesh.userData.sourceRoadId=plan.roadId;
 mesh.userData.photoVerifiedGeometry=false;
 mesh.userData.lodDetail=false;mesh.receiveShadow=true;
 layer.add(mesh);
 return {
  version:'5.216',sourceCrossingId:plan.crossingId,
  sourceRoadId:plan.roadId,sourceCentreGPS:plan.centreGPS,
  centerWorld:{x:p.x,z:p.y},mesh,
  renderedMeshes:1,triangles:verts.length/9,
  isAttached:()=>mesh.parent===layer,
  isVisible:()=>{for(let o=mesh;o;o=o.parent)
   if(!o.visible)return false;return true;},
  originalOSMUnchanged:true,modelDimensionsEstimated:true,
  addedColliders:0,newRoads:0,newCrossings:0
 };
}
