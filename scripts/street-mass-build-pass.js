// Milovice RP 5.83 — reusable OSM-driven street BLOCK facade-priority planner.
// A prioritized "hero" shell is a visual quality upgrade, not photo approval.
// Never infer fences, private drives, rooflights, shop signs or property edges.
export const MASS_STREET_583=Object.freeze({
  roadId:'219273174',junctionRoadId:'118488006',landmarkId:'118487991',
  maxBuildings:24,maxAlongM:240,maxRoadDistanceM:70,
  photoSource:'User-supplied 9 May 2022 Mapy panorama, contextual ONLY',
  evidence:'OSM footprint + building type/levels, NOT a per-building facade survey',
  photoApprovedBuildings:0
});
const finite=n=>Number.isFinite(n);
const project=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const close=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const centroid=pts=>({x:pts.reduce((n,p)=>n+p.x,0)/pts.length,
 z:pts.reduce((n,p)=>n+p.z,0)/pts.length});
function footOnSegment(p,a,b){
 const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
 if(length<.01)return null;
 const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(length*length)));
 return {distance:Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t),offset:t*length};
}
function buildChurchwardAxis(way,junction,church,maxAlongM){
 const nodes=way.geometry.map(project),jNodes=junction.geometry.map(project);
 const churchCentre=centroid(church.geometry.map(project));
 let match=null;
 for(let i=0;i<nodes.length;i++)for(const p of jNodes){
  const d=close(nodes[i],p);
  if(!match||d<match.distance)match={index:i,distance:d};
 }
 if(!match||match.distance>.75)return null;
 const origin=nodes[match.index];
 const candidates=[-1,1].map(step=>{
  const p=nodes[match.index+step];
  return p?{step,distance:close(p,churchCentre)}:null;
 }).filter(Boolean).sort((a,b)=>a.distance-b.distance);
 if(!candidates.length||candidates[0].distance>=close(origin,churchCentre)-2)return null;
 const dir=candidates[0].step;
 const polyline=[origin];
 let total=0,prev=origin;
 for(let i=match.index+dir;i>=0&&i<nodes.length;i+=dir){
  const next=nodes[i],length=close(prev,next);
  if(length<.01){prev=next;continue}
  if(total+length>maxAlongM){
   const t=(maxAlongM-total)/length;
   polyline.push({x:prev.x+(next.x-prev.x)*t,z:prev.z+(next.z-prev.z)*t});
   total=maxAlongM;break;
  }
  total+=length;polyline.push(next);prev=next;
 }
 if(polyline.length<2)return null;
 return {polyline,total,churchwardDirection:dir,
  junctionIndex:match.index,churchDistanceFromJunction:close(origin,churchCentre)};
}
function nearestAlong(p,axis){
 let total=0,best=null;
 for(let i=1;i<axis.length;i++){
  const prev=axis[i-1],next=axis[i],seg=footOnSegment(p,prev,next);
  if(seg&&(!best||seg.distance<best.distance))
   best={distance:seg.distance,along:total+seg.offset};
  total+=close(prev,next);
 }
 return best;
}
function eligibleBuilding(el,roadDistance,config){
 const t=el.tags||{},type=t.building;
 // Already independently photographed, bespoke-built 2024 landmarks:
 // do not spend the 5.83 generic-house quota on or override them.
 if(['202367194','202367254'].includes(String(el.id)))return null;
 if(!['house','residential','yes','detached','semidetached_house','terrace'].includes(type)||
    roadDistance>config.maxRoadDistanceM)return null;
 const pts=el.geometry.map(project);
 if(pts.length>4&&close(pts[0],pts.at(-1))<.10)pts.pop();
 if(pts.length<3||pts.length>10)return null;
 const xs=pts.map(p=>p.x),zs=pts.map(p=>p.z);
 const width=Math.max(...xs)-Math.min(...xs),depth=Math.max(...zs)-Math.min(...zs);
 const levelsRaw=Number(t['building:levels']);
 const levels=finite(levelsRaw)&&levelsRaw>0?levelsRaw:2;
 if(![width,depth,levels].every(finite)||width<4||depth<4||
  width>44||depth>44||width*depth>850||levels>3)return null;
 const explicitHeight=Number(t.height);
 if(finite(explicitHeight)&&explicitHeight>12.5)return null;
 const h=finite(explicitHeight)&&explicitHeight>2?explicitHeight:levels*3.05;
 if(h<2.7||h>12.5)return null;
 return {id:String(el.id),type,levels,footprintPoints:pts.length,
  approximateHeightM:h,photoVerified:false,facadeDetailIsGeneric:true};
}
/**
 * Takes the same imported OSM ways as the game; chooses a contiguous corridor
 * from Pionýrů toward the real church, then up to 24 nearby homes
 * including adjacent residential blocks, not just exact frontages.
 * No invented position, building or object is inserted.
 */
export function planMassStreetBlock583(elements,config=MASS_STREET_583){
 if(!Array.isArray(elements)||!config||!Number.isInteger(config.maxBuildings)||
   config.maxBuildings<1||config.maxBuildings>68||!finite(config.maxAlongM)||
   !finite(config.maxRoadDistanceM))return null;
 const way=elements.find(e=>String(e.id)===config.roadId&&e.tags?.highway),
  junction=elements.find(e=>String(e.id)===config.junctionRoadId&&e.tags?.highway),
  church=elements.find(e=>String(e.id)===config.landmarkId&&e.tags?.building==='church');
 if(!way?.geometry?.length||!junction?.geometry?.length||!church?.geometry?.length)return null;
 const axis=buildChurchwardAxis(way,junction,church,config.maxAlongM);
 if(!axis)return null;
 const candidates=[];
 for(const el of elements){
  if(!el?.tags?.building||!Array.isArray(el.geometry)||el.geometry.length<4)continue;
  const center=centroid(el.geometry.map(project)),near=nearestAlong(center,axis.polyline);
  if(!near)continue;
  const detail=eligibleBuilding(el,near.distance,config);
  if(!detail)continue;
  candidates.push({...detail,alongM:Math.round(near.along*10)/10,
   roadDistanceM:Math.round(near.distance*10)/10});
 }
 // Stable deterministic order along the corridor even if the OSM export shuffles.
 candidates.sort((a,b)=>a.alongM-b.alongM||a.roadDistanceM-b.roadDistanceM||
  a.id.localeCompare(b.id,'en'));
 const prioritized=candidates.slice(0,config.maxBuildings);
 return {version:'5.83.0',street:'5. května – kostelní blok',
  roadId:config.roadId,junctionRoadId:config.junctionRoadId,
  landmarkId:config.landmarkId,source:'OSM footprints, not a facade photo survey',
  contextualPhoto:config.photoSource,
  buildingsConsidered:candidates.length,prioritizedBuildings:prioritized.length,
  priorityIds:prioritized.map(b=>b.id),
  reviewQueue:candidates,
  corridorLengthM:Math.round(axis.total*10)/10,
  churchwardDirection:axis.churchwardDirection,
  photoApprovedBuildings:0,unknownFacadesStillUnverified:true,
  guessedPropertyFences:0,guessedDriveways:0,newBuildingFootprints:0,
  roadAndFootwayGeometryModified:false,
  facadesAreProvisional:true};
}
