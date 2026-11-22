/** 5.275 — one simulated resident follows ORIGINAL OSM sidewalk 1005977571
 * across an already existing, municipally backed MODEL zebra at Pod Lesem.
 * No map way, kerb, physical collider or traffic graph is introduced.
 */
export const SOURCE5275=Object.freeze({region:'mlada',walkId:'1005977571',
 walkHash:'263e12b3',roadId:'128087258',roadHash:'6e14ec02',
 shared:'50.2285685,14.8727322',leg:11,roadHalf:3,curbMargin:.45,
 vehicleRadius:6.2});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{let h=2166136261;for(const c of g.map(key).join(';')){
 h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')};
const exact=(t,e)=>t&&Object.keys(t).length===Object.keys(e).length&&
 Object.entries(e).every(([k,v])=>t[k]===v);
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const norm=(a,b)=>{const n=dist(a,b);return n>1e-6?
 {x:(b.x-a.x)/n,z:(b.z-a.z)/n,len:n}:null};
export function planPodLesemWalker5275({regionId,ways,crossing}={}){
 const S=SOURCE5275;
 if(regionId!==S.region||!Array.isArray(ways)||
  crossing?.version!=='5.274'||crossing?.sourceSidewalkOSMId!==S.walkId||
  crossing?.sideRoadId!==S.roadId||
  crossing?.alignedToExistingOSMSidewalkVertex!==true||
  crossing?.actualMarkingsFromMunicipalContract!==true||
  crossing?.mappedCrossingFound!==false)return null;
 const one=id=>{const w=ways.filter(x=>String(x?.id)===id);return w.length===1?w[0]:null};
 const walk=one(S.walkId),road=one(S.roadId);
 if(!walk||!road||walk.type!=='way'||road.type!=='way'||
  walk.geometry?.length!==7||road.geometry?.length!==4||
  !walk.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
  !road.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
  hash(walk.geometry)!==S.walkHash||hash(road.geometry)!==S.roadHash||
  !exact(walk.tags,{footway:'sidewalk',highway:'footway',
   lit:'yes',surface:'paving_stones'})||
  !exact(road.tags,{highway:'residential',lane_markings:'no',
   motor_vehicle:'no',name:'Pod Lesem',surface:'asphalt',width:'6'})||
  key(walk.geometry[3])!==S.shared||key(road.geometry[2])!==S.shared)return null;
 const c=world(walk.geometry[3]),p=world(walk.geometry[2]),
  n=world(walk.geometry[4]),u=norm(p,c),v=norm(c,n);
 if(!u||!v||u.len<30||v.len<30||
  u.x*v.x+u.z*v.z<.98||
  dist(c,{x:crossing.centerWorld?.x,z:crossing.centerWorld?.y})>.0001)return null;
 const [axisA,axisB]=crossing.modelFootwayAxis||[];
 if(!axisA||!axisB)return null;
 const crossAxis=norm({x:axisA.x,z:axisA.y},{x:axisB.x,z:axisB.y});
 if(!crossAxis||Math.abs(u.x*crossAxis.x+u.z*crossAxis.z)<.85)return null;
 const L=S.leg;
 return {version:'5.275',sourceFootwayId:S.walkId,sourceRoadId:S.roadId,
  sourceFootwayHash:S.walkHash,roadAccess:road.tags.motor_vehicle,
  a:{x:c.x-u.x*L,z:c.z-u.z*L},center:c,
  b:{x:c.x+v.x*L,z:c.z+v.z*L},
  sourceSharedGPS:{...walk.geometry[3]},crossingAt:L,totalMetres:2*L,
  crossingHalfWidth:S.roadHalf+S.curbMargin,
  vehicleRadius:S.vehicleRadius,originalFootwayLegs:2,
  modelOnly:true,paintSurveyed:false,originalGPSUnchanged:true,
  originalGraphUnchanged:true,newFootways:0,newRoads:0,newCrossings:0,
  newColliders:0,newPavementMeshes:0};
}
export function advancePodLesemWalker5275(route,at,heading,step,vehicles=[]){
 if(route?.version!=='5.275'||!Number.isFinite(at)||
  at<0||at>route.totalMetres||![1,-1].includes(heading)||
  !Number.isFinite(step)||step<0||step>3||!Array.isArray(vehicles))return null;
 let d=at+heading*step,dir=heading,waiting=false;
 const c=route.crossingAt,h=route.crossingHalfWidth;
 const blocker=vehicles.some(v=>Number.isFinite(v?.x)&&Number.isFinite(v?.z)&&
  Math.hypot(v.x-route.center.x,v.z-route.center.z)<route.vehicleRadius);
 const entry=heading===1?c-h:c+h;
 if(blocker&&((heading===1&&at<=entry&&d>=entry)||
  (heading===-1&&at>=entry&&d<=entry))){
  d=heading===1?Math.min(d,entry-.1):Math.max(d,entry+.1);
  waiting=true;
 }
 if(d<0){d=-d;dir=1}
 if(d>route.totalMetres){d=2*route.totalMetres-d;dir=-1}
 d=Math.max(0,Math.min(route.totalMetres,d));
 const first=d<=c,a=first?route.a:route.center,b=first?route.center:route.b;
 const tangent=norm(a,b);
 if(!tangent)return null;
 const t=first?d/c:(d-c)/(route.totalMetres-c);
 return {distance:d,direction:dir,x:a.x+(b.x-a.x)*t,
  z:a.z+(b.z-a.z)*t,tangentX:tangent.x*dir,tangentZ:tangent.z*dir,
  waitingForVehicle:waiting,onZebra:Math.abs(d-c)<h,
  walkedMetres:Math.abs(d-at)};
}
