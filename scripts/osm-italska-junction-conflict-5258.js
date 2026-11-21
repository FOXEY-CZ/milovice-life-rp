/** Milovice RP 5.258: two original OSM T-junctions — civilian NPC
 * model-traffic reservations, not official road priority or physical collisions.
 */
import {narrowItalskaRoad5253} from './osm-italska-narrow-npc-5253.js';
export const ITALSKA_JUNCTION_GUARD_5258=Object.freeze({
 narrowOSMId:'8590284',italOSMId:'8585601',kastanOSMId:'1107814416',
 approachMetres:18,occupancyExitMetres:9,occupancyEntryMetres:2.7,
 stopCenterMetres:5.8,nodeToleranceMetres:.05
});
const named=new Set(['8585601','1107814416']);
const point=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const distance=(p,q)=>Math.hypot(p.x-q.x,p.y-q.y);
function arm(s,node){
 if(!s||!point(s.a)||!point(s.b)||!(s.len>=2.5&&s.len<=175))return null;
 const start=distance(s.a,node)<ITALSKA_JUNCTION_GUARD_5258.nodeToleranceMetres;
 const end=distance(s.b,node)<ITALSKA_JUNCTION_GUARD_5258.nodeToleranceMetres;
 return start!==end?{segment:s,atStart:start,atEnd:end}:null;
}
function approach(car,zone){
 if(!car||car.driven===true||car.parked===true||
  car.trafficTerminal5241===true||!Number.isInteger(car.id)||
  !(car.speed>0)||!Number.isFinite(car.speed)||
  ![1,-1].includes(car.direction)||!Number.isFinite(car.progress)||
  car.progress<0||car.progress>1)return null;
 const a=zone.arms.find(x=>x.segment===car.seg);
 if(!a)return null;
 const toward=a.atEnd?car.direction===1:car.direction===-1;
 const d=(toward?(car.direction===1?1-car.progress:car.progress):
  (car.direction===1?car.progress:1-car.progress))*car.seg.len;
 const cfg=ITALSKA_JUNCTION_GUARD_5258;
 if(d>(toward?cfg.approachMetres:cfg.occupancyExitMetres))return null;
 return {car,id:car.id,segment:car.seg,direction:car.direction,
  toward,d,occupying:!toward||d<cfg.occupancyEntryMetres,
  eta:toward?Math.max(0,d-cfg.occupancyEntryMetres)/car.speed:0};
}
function priority(a,b){
 if(a.occupying!==b.occupying)return a.occupying?-1:1;
 // Buses remain controlled by their original motion logic. Ordinary NPCs
 // should yield to them when conflicting on the same original OSM node.
 if(Boolean(a.car.service)!==Boolean(b.car.service))
  return a.car.service?-1:1;
 if(Math.abs(a.eta-b.eta)>.15)return a.eta-b.eta;
 return a.id-b.id;
}
export function createItalskaJunctionGuard5258({roadPlan,segments}={}){
 if(!Array.isArray(segments))return null;
 const c=ITALSKA_JUNCTION_GUARD_5258;
 const narrow=segments.filter(s=>String(s?.osmId)===c.narrowOSMId);
 if(narrow.length!==8||!narrow.every(s=>
  narrowItalskaRoad5253(roadPlan,s)&&point(s.a)&&point(s.b)&&
  s.len>=2.5&&s.len<=175))return null;
 const nodes=[narrow[0].a,narrow[narrow.length-1].b],
  expected=[c.italOSMId,c.kastanOSMId];
 if(distance(nodes[0],nodes[1])<80)return null;
 const zones=[];
 for(let i=0;i<nodes.length;i++){
  const node=nodes[i],namedId=expected[i];
  const arms=segments.filter(s=>
   String(s?.osmId)===c.narrowOSMId||named.has(String(s?.osmId)))
   .map(s=>arm(s,node)).filter(Boolean);
  if(arms.length!==3||
   arms.filter(a=>String(a.segment.osmId)===c.narrowOSMId).length!==1||
   arms.filter(a=>String(a.segment.osmId)===namedId).length!==2||
   arms.some(a=>a.segment.kind!=='residential'||a.segment.width!==
    (String(a.segment.osmId)===c.narrowOSMId?5:7.8)))return null;
  zones.push({id:namedId,node,arms,ownerId:null});
 }
 const stats={evaluations:0,yieldFrames:0,fullStops:0,
  ownerChanges:0,lastYieldCarId:null};
 function evaluate(cars){
  const caps=new Map();
  if(!Array.isArray(cars))return caps;
  stats.evaluations++;
  // One snapshot for all participants before the 3D motion loop.
  for(const zone of zones){
   const active=cars.map(car=>approach(car,zone)).filter(Boolean);
   if(!active.length){zone.ownerId=null;continue;}
   const retained=active.find(a=>a.id===zone.ownerId);
   const owner=retained||active.slice().sort(priority)[0];
   if(zone.ownerId!==owner.id)stats.ownerChanges++;
   zone.ownerId=owner.id;
   for(const car of active){
    if(car.id===owner.id||!car.toward||car.occupying||
     (car.segment===owner.segment&&car.direction===owner.direction))
     continue;
    const cap=Math.max(0,car.d-c.stopCenterMetres);
    const prior=caps.get(car.id);
    caps.set(car.id,prior===undefined?cap:Math.min(cap,prior));
    stats.yieldFrames++;
    if(cap<.005)stats.fullStops++;
    stats.lastYieldCarId=car.id;
   }
  }
  return caps;
 }
 function audit(){
  return {version:'5.258',ready:true,
   sourceOSMIds:[c.narrowOSMId,c.italOSMId,c.kastanOSMId],
   connectedTJunctions:zones.length,
   mapArms:zones.map(z=>({namedOSMId:z.id,count:z.arms.length})),
   originalNarrowSegments:narrow.length,
   stopCenterDistanceMetres:c.stopCenterMetres,
   activeReservations:zones.filter(z=>z.ownerId!==null).length,
   ...stats,originalOSMGpsPreserved:true,
   physicalRoadAndSidewalkUntouched:true,
   officialPrioritySignsNotInferred:true,
   playerAndBusMotionUnchanged:true,
   lateralDynamicCollisionNotSimulated:true,
   genericVehicleBodyApproximation:true,globalTrafficRulesUnchanged:true};
 }
 return {ready:true,zones,evaluate,audit};
}
export function inspectItalskaJunctionGuard5258(model){
 return model?.audit()??{version:'5.258',ready:false,
  reason:'source-locked junction graph absent'};
}
