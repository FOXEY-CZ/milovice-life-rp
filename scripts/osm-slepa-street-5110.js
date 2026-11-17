// Milovice RP 5.110: source-limited street details for the mapped Slepá
// neighbourhood. Lawn polygons are REAL OSM landuse=grass; blade positions
// are modest model estimates. There are NO mapped parking lot polygons here.
// Narrow driveways remain approximations, never surveyed kerb widths.
const STREET='202375817',DRIVEWAYS=new Set(['1019598855','1019598856']);
const AREAS=new Set(['mlada','vrutice']);
const X=p=>p?.x,Z=p=>p?.z??p?.y;
const finite=p=>Number.isFinite(X(p))&&Number.isFinite(Z(p));
function pointDistance(p,a,b){
 const dx=X(b)-X(a),dz=Z(b)-Z(a),v=dx*dx+dz*dz;
 if(v<.04)return Infinity;
 const t=Math.max(0,Math.min(1,
  ((X(p)-X(a))*dx+(Z(p)-Z(a))*dz)/v));
 return Math.hypot(X(p)-X(a)-dx*t,Z(p)-Z(a)-dz*t);
}
function inside(p,ring){
 let hit=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const a=ring[i],b=ring[j],az=Z(a),bz=Z(b);
  if((az>p.z)!==(bz>p.z)&&
   p.x<(X(b)-X(a))*(p.z-az)/(bz-az)+X(a))hit=!hit;
 }
 return hit;
}
function boundaryDistance(p,ring){
 let best=Infinity;
 for(let i=0;i<ring.length;i++)
  best=Math.min(best,pointDistance(p,ring[i],ring[(i+1)%ring.length]));
 return best;
}
function randomFrom(id){
 let seed=2166136261;
 for(const c of String(id))seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 return ()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
}
export function planSlepaDrivewayWidth({id,tags={},regionId,baseWidth}={}){
 const unchanged={width:baseWidth,applied:false,source:'original-road-width'};
 if(!AREAS.has(regionId)||!DRIVEWAYS.has(String(id))||
  tags?.highway!=='service'||tags?.service!=='driveway'||
  tags?.access==='private'||tags?.access==='no'||
  tags?.width!==undefined||baseWidth!==4.5)return unchanged;
 return {width:3.2,applied:true,source:'model-estimated-driveway-width',
  sourceOsmId:String(id),exactKerbWidthKnown:false};
}
export function planSlepaStreetLawns(lawns,{
 streetWayId,streetPoints,roads,buildings,water,
 excludedLawnIds=[],photoAllowed=()=>true,maxTufts=110,
 maxPerLawn=14,maxDistance=85
}={}){
 const out={version:'5.110',sourceStreetId:STREET,
  mappedLawns:0,sourceLawnIds:[],tufts:[],
  detailedLawns:0,excludedExistingDetail:0,
  rejectedBoundary:0,rejectedRoad:0,rejectedBuilding:0,
  rejectedWater:0,rejectedPhoto:0,skippedPrivate:0,
  inventedLawns:0,inventedShrubs:0,inventedParkingLots:0,
  sourcePolygonsUntouched:true,bladePositionsEstimated:true};
 if(String(streetWayId)!==STREET||!Array.isArray(streetPoints)||
  streetPoints.length!==2||!streetPoints.every(finite)||
  !Array.isArray(lawns)||!roads?.isClear||!buildings?.isClear||
  !water?.isClear||typeof photoAllowed!=='function'||
  !Number.isInteger(maxTufts)||maxTufts<0||maxTufts>250||
  !Number.isInteger(maxPerLawn)||maxPerLawn<1||maxPerLawn>25||
  !Number.isFinite(maxDistance)||maxDistance<35||maxDistance>110)
  return out;
 const already=new Set([...excludedLawnIds].map(String)),seen=new Set();
 const sorted=lawns.slice().sort((a,b)=>
  String(a?.id).localeCompare(String(b?.id),'en',{numeric:true}));
 for(const lawn of sorted){
  const id=String(lawn?.id??'');
  if(!id||seen.has(id))continue;seen.add(id);
  if(lawn?.tags?.landuse!=='grass'||lawn?.tags?.building||
   !Array.isArray(lawn?.points)||lawn.points.length<4||
   lawn.points.length>150||!lawn.points.every(finite))continue;
  if(['private','no','customers'].includes(lawn.tags.access)){
   out.skippedPrivate++;continue;
  }
  if(already.has(id)){out.excludedExistingDetail++;continue;}
  const ring=lawn.points.slice();
  if(Math.hypot(X(ring[0])-X(ring.at(-1)),
    Z(ring[0])-Z(ring.at(-1)))<.05)ring.pop();
  if(ring.length<3)continue;
  const nearest=Math.min(...ring.map(p=>
   pointDistance(p,streetPoints[0],streetPoints[1])));
  if(nearest>maxDistance)continue;
  const xs=ring.map(X),zs=ring.map(Z),
   minX=Math.min(...xs),maxX=Math.max(...xs),
   minZ=Math.min(...zs),maxZ=Math.max(...zs);
  if(maxX-minX>180||maxZ-minZ>180)continue;
  let signed=0;
  for(let i=0;i<ring.length;i++){
   const a=ring[i],b=ring[(i+1)%ring.length];
   signed+=X(a)*Z(b)-X(b)*Z(a);
  }
  const area=Math.abs(signed)*.5;
  if(area<8||area>2200)continue;
  out.mappedLawns++;out.sourceLawnIds.push(id);
  const count=Math.min(maxPerLawn,maxTufts-out.tufts.length,
   Math.max(1,Math.round(area/15)));
  if(count<=0)break;
  const rand=randomFrom('Slepa-5110:'+id),accepted=[];
  for(let tries=0;tries<count*75&&accepted.length<count;tries++){
   const p={x:minX+rand()*(maxX-minX),
    z:minZ+rand()*(maxZ-minZ)};
   // Include the whole blade's footprint inside the mapped lawn.
   if(!inside(p,ring)||boundaryDistance(p,ring)<.31){
    out.rejectedBoundary++;continue;
   }
   // If there's a footway, driveway, building or stream, leave it clear.
   if(!roads.isClear(p.x,p.z,.16,.10)){
    out.rejectedRoad++;continue;
   }
   if(!buildings.isClear(p.x,p.z,.42)){
    out.rejectedBuilding++;continue;
   }
   if(!water.isClear(p.x,p.z,.42,.18)){
    out.rejectedWater++;continue;
   }
   if(!photoAllowed(p.x,p.z,lawn)){
    out.rejectedPhoto++;continue;
   }
   if(accepted.some(q=>Math.hypot(q.x-p.x,q.z-p.z)<.55))continue;
   accepted.push({...p,sourceLawnId:id,
    height:.12+rand()*.20,spread:.095+rand()*.085,
    yaw:rand()*Math.PI*2,positionEstimated:true});
  }
  if(accepted.length){out.detailedLawns++;out.tufts.push(...accepted);}
  if(out.tufts.length>=maxTufts)break;
 }
 return out;
}
// A parked car occupies an estimated 4.7 x 1.92m rectangle.
// Sample corners AND intermediate points, not only the car centre.
export function slepaParkingSamples(spot){
 if(!spot||![spot.x,spot.z,spot.yaw].every(Number.isFinite))return [];
 const c=Math.cos(spot.yaw),s=Math.sin(spot.yaw),samples=[];
 for(const dx of [-2.35,-1.175,0,1.175,2.35])
  for(const dz of [-.96,0,.96])
   samples.push({x:spot.x+c*dx+s*dz,z:spot.z-s*dx+c*dz});
 return samples;
}
// Protect the full procedural car footprint from mapped lawn polygons.
export function slepaParkingClearsGrass(spot,lawns){
 if(!Array.isArray(lawns))return false;
 const test=slepaParkingSamples(spot);
 if(!test.length)return false;
 const c=Math.cos(spot.yaw),s=Math.sin(spot.yaw);
 for(const lawn of lawns){
  if(lawn?.tags?.landuse!=='grass'||!Array.isArray(lawn.points)||
   lawn.points.length<4)continue;
  const ring=lawn.points;
  // Conservative: polygon vertices inside car footprint also count.
  const near=test.some(p=>inside(p,ring)||
   boundaryDistance(p,ring)<.18);
  if(near)return false;
  const verts=ring.some(p=>{
   const dx=X(p)-spot.x,dz=Z(p)-spot.z;
   const u=c*dx-s*dz,v=s*dx+c*dz;
   return Math.abs(u)<=2.55&&Math.abs(v)<=1.16;
  });
  if(verts)return false;
 }
 return true;
}

export function slepaParkingClearsPeople(spot,{pedestrian,buildings}={}){
 const samples=slepaParkingSamples(spot);
 if(!samples.length||!pedestrian?.isClear||!buildings?.isClear)
  return {clear:false,reason:'invalid-guard'};
 for(const p of samples){
  if(!pedestrian.isClear(p.x,p.z,.12,.16))
   return {clear:false,reason:'mapped-footway'};
  if(!buildings.isClear(p.x,p.z,.24))
   return {clear:false,reason:'mapped-building'};
 }
 return {clear:true,reason:'source-clear'};
}
