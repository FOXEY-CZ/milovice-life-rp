/** Milovice RP 5.165 — OSM-locked crossing loop along both sides of Topolova.
 * The actor is SIMULATED; passing cars do not yet yield to it.
 * East pavement [22]->[21], south zebra [2]->[0], west pavement
 * [12]->[13], north zebra [0]->[2]. All points are ORIGINAL OSM.
 */
export const TOPOLOVA_LOOP_5165=Object.freeze({
 region:'mlada',
 east:Object.freeze({id:'1316882852',hash:'a50c0251',nodes:28,
  highway:'footway',footway:'sidewalk',surface:'paving_stones'}),
 west:Object.freeze({id:'1314665579',hash:'476fa89b',nodes:18,
  highway:'footway',footway:'sidewalk',surface:'paving_stones'}),
 south:Object.freeze({id:'1316882854',hash:'0e127baa',nodes:3,
  highway:'footway',footway:'crossing',crossing:'zebra',surface:'asphalt'}),
 north:Object.freeze({id:'1316882853',hash:'dcb5d34e',nodes:3,
  highway:'footway',footway:'crossing',crossing:'zebra',surface:'asphalt'}),
 road:Object.freeze({id:'8618275',hash:'c0fe69b0',nodes:4,
  highway:'residential',name:'Topolová'})
});
const same=(a,b)=>Number.isFinite(a?.lat)&&Number.isFinite(a?.lon)&&
 Number.isFinite(b?.lat)&&Number.isFinite(b?.lon)&&
 a.lat.toFixed(7)===b.lat.toFixed(7)&&a.lon.toFixed(7)===b.lon.toFixed(7);
const length=(a,b)=>Math.hypot((a.lat-b.lat)*111320,
 (a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180));
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const matches=(w,s)=>w?.tags?.highway===s.highway&&
 Array.isArray(w.geometry)&&w.geometry.length===s.nodes&&
 w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))&&
 hash(w.geometry)===s.hash&&
 Object.entries(s).every(([k,v])=>
  ['id','hash','nodes'].includes(k)||w.tags[k]===v)&&
 !['private','no','customers'].includes(w.tags.access);
export function planTopolovaZebraLoop5165({
 regionId,connectedPlan,promenadePlan,ways
}={}){
 const s=TOPOLOVA_LOOP_5165;
 if(regionId!==s.region||connectedPlan?.version!=='5.164'||
  promenadePlan?.version!=='5.163'||
  connectedPlan.sourceWayIds?.join(',')!==['1316882860',s.east.id].join(',')||
  promenadePlan.sourceCrossingIDs?.join(',')!==[s.south.id,s.north.id].join(',')||
  !Array.isArray(ways))return null;
 const get=spec=>{
  const a=ways.filter(w=>String(w?.id)===spec.id);
  return a.length===1&&matches(a[0],spec)?a[0]:null;
 };
 const e=get(s.east),w=get(s.west),so=get(s.south),
  no=get(s.north),road=get(s.road);
 if(!e||!w||!so||!no||!road||
  !same(e.geometry[21],so.geometry[2])||
  !same(e.geometry[22],no.geometry[2])||
  !same(w.geometry[12],so.geometry[0])||
  !same(w.geometry[13],no.geometry[0])||
  !same(so.geometry[1],road.geometry[1])||
  !same(no.geometry[1],road.geometry[2])||
  !same(connectedPlan.originalGPSNodes?.at(-2),e.geometry[21])||
  !same(connectedPlan.originalGPSNodes?.at(-1),e.geometry[22]))return null;
 const nodes=[e.geometry[22],e.geometry[21],so.geometry[1],
  so.geometry[0],w.geometry[13],no.geometry[1],no.geometry[2]];
 if(!same(nodes[0],nodes.at(-1)))return null;
 const lengths=nodes.slice(1).map((p,i)=>length(nodes[i],p));
 const total=lengths.reduce((a,b)=>a+b,0);
 if(total<222||total>224||lengths[0]<102||lengths[0]>103||
  lengths[3]<102||lengths[3]>103||
  lengths.some(x=>x<3||x>104))return null;
 return {
  version:'5.165',regionId,
  sourceWayIds:[s.east.id,s.south.id,s.west.id,s.north.id],
  originalGPSNodes:nodes.map(p=>({lat:p.lat,lon:p.lon})),
  actualOSMNodeCount:7,originalSegmentCount:6,
  originalLoopMetres:+total.toFixed(3),
  actualMarkedCrossings:2,originalCrossingSegments:4,
  originalSidewalkSegments:2,simulatedPedestrians:1,
  sourceGPSImmutable:true,carsDoNotYieldToNewWalkerYet:true,
  createdCrossings:0,createdFootways:0,createdRoads:0,
  createdEntrances:0,createdColliders:0,createdProps:0
 };
}
export function makeTopolovaZebraLoop5165(plan,toWorld){
 if(plan?.version!=='5.165'||typeof toWorld!=='function')return null;
 const pts=plan.originalGPSNodes?.map(toWorld).map(p=>({x:p?.x,z:p?.y}));
 if(pts?.length!==7||pts.some(p=>!Number.isFinite(p.x)||
  !Number.isFinite(p.z)))return null;
 if(Math.hypot(pts[0].x-pts.at(-1).x,pts[0].z-pts.at(-1).z)>.01)return null;
 const wayIndex=[0,1,1,2,3,3];
 let total=0;
 const segments=[];
 for(let i=0;i<6;i++){
  const a=pts[i],b=pts[i+1],len=Math.hypot(b.x-a.x,b.z-a.z);
  if(!Number.isFinite(len)||len<3||len>104)return null;
  const from=total;total+=len;
  segments.push({
   a,b,len,startMetres:from,endMetres:total,
   ux:(b.x-a.x)/len,uz:(b.z-a.z)/len,
   sourceWayId:plan.sourceWayIds[wayIndex[i]],
   isCrossing:[1,2,4,5].includes(i)
  });
 }
 if(Math.abs(total-plan.originalLoopMetres)>.15)return null;
 return {version:'5.165',length:total,segments,
  newGeometry:0,sourceWayIds:[...plan.sourceWayIds]};
}
export function sampleTopolovaZebraLoop5165(route,distance){
 if(route?.version!=='5.165'||!Number.isFinite(distance)||
  distance<0||!Number.isFinite(route.length)||route.length<=0)return null;
 const d=distance%route.length;
 const i=route.segments.findIndex(s=>d<s.endMetres);
 if(i<0)return null;
 const s=route.segments[i],t=(d-s.startMetres)/s.len;
 return {
  x:s.a.x+(s.b.x-s.a.x)*t,z:s.a.z+(s.b.z-s.a.z)*t,
  tangentX:s.ux,tangentZ:s.uz,segmentIndex:i,
  sourceWayId:s.sourceWayId,isCrossing:s.isCrossing,distance:d
 };
}
export function advanceTopolovaZebraLoop5165(route,distance,metres){
 if(!Number.isFinite(metres)||metres<0||
  !Number.isFinite(distance)||distance<0||
  route?.version!=='5.165')return null;
 const next=distance+metres;
 const sampled=sampleTopolovaZebraLoop5165(route,next);
 return sampled?{...sampled,
  laps:Math.floor(next/route.length)-Math.floor(distance/route.length)}:null;
}
