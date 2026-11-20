/** Milovice RP 5.190 — a source-confirmed crossing:island=yes refuge
 * at the ORIGINAL shared crossing/road OSM node on Armádní near Topolová.
 * The existence and centre point are mapped. Footprint size, bevel,
 * finish and curb elevation are GAME MODEL ESTIMATES, NOT photo evidence.
 * Do not change OSM geometry or route centerlines.
 */
export const ARMADNI_REFUGE_5190=Object.freeze({
 region:'mlada',crossingId:'1316882855',crossingHash:'c236e738',
 roadId:'1331897683',roadHash:'05fd404c',
 crossingNodes:3,roadNodes:3,centerNode:1,
 modelLengthMeters:2.4,modelWidthMeters:.8,
 topAboveRoadMeters:.16,baseRoadYOffset:.17,
 renderedGeometryPhotoVerified:false
});
const valid=p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon);
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
function fingerprint(g){
 let h=2166136261;
 for(const c of g.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
}
function xy(p){
 return {x:p.lon*111320*Math.cos(50.226*Math.PI/180),
  z:-p.lat*111320};
}
export function planArmadniRefuge5190({regionId,crossing,road}={}){
 const c=ARMADNI_REFUGE_5190;
 if(regionId!==c.region||
  String(crossing?.id)!==c.crossingId||
  String(road?.id)!==c.roadId||
  crossing?.tags?.highway!=='footway'||
  crossing.tags.footway!=='crossing'||
  crossing.tags.crossing!=='marked'||
  crossing.tags['crossing:markings']!=='zebra'||
  crossing.tags['crossing:island']!=='yes'||
  crossing.tags.surface!=='asphalt'||
  road?.tags?.highway!=='residential'||
  road.tags.name!=='Armádní'||road.tags.lanes!=='2'||
  road.tags.surface!=='asphalt'||
  !Array.isArray(crossing.geometry)||
  crossing.geometry.length!==c.crossingNodes||
  !Array.isArray(road.geometry)||road.geometry.length!==c.roadNodes||
  crossing.geometry.some(p=>!valid(p))||
  road.geometry.some(p=>!valid(p))||
  fingerprint(crossing.geometry)!==c.crossingHash||
  fingerprint(road.geometry)!==c.roadHash||
  key(crossing.geometry[1])!==key(road.geometry[1]))return null;
 const a=xy(road.geometry[0]),b=xy(road.geometry[1]),
  from=xy(crossing.geometry[0]),to=xy(crossing.geometry[2]);
 const rd={x:b.x-a.x,z:b.z-a.z},rw={x:to.x-from.x,z:to.z-from.z};
 const rlen=Math.hypot(rd.x,rd.z),wlen=Math.hypot(rw.x,rw.z);
 if(rlen<50||rlen>115||wlen<7||wlen>16||
  Math.abs((rd.x*rw.x+rd.z*rw.z)/(rlen*wlen))>.20)return null;
 return {
  version:'5.190',crossingId:c.crossingId,roadId:c.roadId,
  sourceCrossingHash:c.crossingHash,sourceRoadHash:c.roadHash,
  centerGPS:{...crossing.geometry[1]},
  roadAxis:{x:rd.x/rlen,z:rd.z/rlen},
  pedestrianAxis:{x:rw.x/wlen,z:rw.z/wlen},
  modelLengthMeters:c.modelLengthMeters,
  modelWidthMeters:c.modelWidthMeters,
  baseRoadYOffset:c.baseRoadYOffset,
  topAboveRoadMeters:c.topAboveRoadMeters,
  sourceCrossingHasIsland:true,
  centerPointSourceVerified:true,
  shapeDimensionsEstimated:true,currentPhysicalAppearanceUnverified:true,
  sourceOSMModified:false,roadWidthChanged:false,
  newCrossingWays:0,newRoads:0,newFootways:0,newTrafficLights:0,
  addedColliders:0,walkabilityNotBlocked:true
 };
}
export function renderArmadniRefuge5190(T,{
 plan,toWorld,terrainAt,layer,material
}={}){
 if(plan?.version!=='5.190'||!T?.BufferGeometry||
  !T?.Float32BufferAttribute||!T?.Mesh||!layer?.add||
  typeof toWorld!=='function'||typeof terrainAt!=='function'||
  !material)return null;
 const p=toWorld(plan.centerGPS);
 if(!Number.isFinite(p?.x)||!Number.isFinite(p?.y))return null;
 const ux=plan.roadAxis.x,uz=plan.roadAxis.z,
  nx=-uz,nz=ux,len=plan.modelLengthMeters*.5,
  wid=plan.modelWidthMeters*.5;
 // A single conservative chamfered model island, its LONG axis follows
 // the existing Armádní centreline; the shared crossing node is central.
 const perimeter=[
  [-len,-wid*.52],[-len+.28,-wid],
  [len-.28,-wid],[len,-wid*.52],
  [len,wid*.52],[len-.28,wid],
  [-len+.28,wid],[-len,wid*.52]
 ];
 const t=[];
 const point=(index,height)=>{
  const [along,across]=perimeter[index],
   x=p.x+ux*along+nx*across,
   z=p.y+uz*along+nz*across,
   ground=terrainAt(x,z);
  if(!Number.isFinite(ground))return null;
  return {x,z,y:ground+height};
 };
 const top=plan.baseRoadYOffset+plan.topAboveRoadMeters,
  bottom=plan.baseRoadYOffset;
 const centerGround=terrainAt(p.x,p.y);
 if(!Number.isFinite(centerGround))return null;
 const center={x:p.x,z:p.y,y:centerGround+top};
 const topPts=perimeter.map((_,i)=>point(i,top)),
  basePts=perimeter.map((_,i)=>point(i,bottom));
 if([...topPts,...basePts].some(x=>!x))return null;
 const tri=(a,b,c)=>t.push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);
 for(let i=0;i<8;i++){
  const j=(i+1)%8;
  tri(center,topPts[i],topPts[j]);
  tri(basePts[i],basePts[j],topPts[j]);
  tri(basePts[i],topPts[j],topPts[i]);
 }
 const geo=new T.BufferGeometry();
 geo.setAttribute('position',new T.Float32BufferAttribute(t,3));
 geo.computeVertexNormals();geo.computeBoundingSphere();
 const mesh=new T.Mesh(geo,material);
 mesh.name='Milovice_Armadni_OSM_RefugeIsland_Model_5190';
 mesh.userData.sourceCrossingId=plan.crossingId;
 mesh.userData.sourceRoadId=plan.roadId;
 mesh.userData.photoVerifiedGeometry=false;
 mesh.userData.lodDetail=false;
 mesh.receiveShadow=true;layer.add(mesh);
 return {
  version:'5.190',sourceCrossingId:plan.crossingId,
  sourceRoadId:plan.roadId,sourceCenterGPS:plan.centerGPS,
  centerWorld:{x:p.x,z:p.y},renderedMeshes:1,
  drawnTriangles:t.length/9,
  inScene:()=>mesh.parent===layer,
  visibleAfterLOD:()=>{for(let o=mesh;o;o=o.parent)if(!o.visible)return false;return true;},
  dimensionsEstimated:true,newColliders:0,newRoads:0,
  walkingCrossingUnobstructed:true
 };
}
