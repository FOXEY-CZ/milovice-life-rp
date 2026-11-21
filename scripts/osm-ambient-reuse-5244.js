/** Milovice RP 5.244 — reuse existing ambient people instead of
 * accumulating invisible ones as OSM regions stream. Never move a visible
 * actor, any bespoke/special walker, or an actor to visible coordinates.
 * The destination must be an original road-clipped OSM footway from 5.243.
 */
const point=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.z);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function planOffscreenAmbientReuse5244({
 actors=[],segments=[],focus,observers=[focus],
 limit=4,oldMinDistance=310,newMinDistance=155,newMaxDistance=310
}={}){
 if(!point(focus)||!Array.isArray(observers)||!observers.length||
  !observers.every(point)||!Array.isArray(actors)||!Array.isArray(segments)||
  !Number.isInteger(limit)||limit<1||limit>16||
  !Number.isFinite(oldMinDistance)||oldMinDistance<280||
  !Number.isFinite(newMinDistance)||newMinDistance<140||
  !Number.isFinite(newMaxDistance)||newMaxDistance>400||
  newMaxDistance<=newMinDistance)return [];
 const ambient=actors.filter(a=>a?.mappedAmbient5243===true&&
  point(a.g?.position)&&a.g.visible===false&&
  a.seg?.kind==='mapped-footway'&&
  observers.every(o=>distance(o,a.g.position)>oldMinDistance))
  .sort((a,b)=>distance(b.g.position,focus)-
   distance(a.g.position,focus));
 if(!ambient.length)return [];
 const reserved=new Set(actors.filter(a=>a?.seg).map(a=>a.seg));
 const targets=[];
 for(const s of segments){
  if(!s||reserved.has(s)||s.kind!=='mapped-footway'||
   s.clippedFromOriginalRoadSafePiece!==true||
   s.noMappedBuildingOverlap!==true||
   s.roadShoulder!==false||
   !Number.isFinite(s.len)||s.len<9.5||
   !point({x:s.a?.x,z:s.a?.y})||
   !point({x:s.b?.x,z:s.b?.y})||
   !s.sourceOSMWayId)continue;
  for(const progress of [.24,.76]){
   const x=s.a.x+(s.b.x-s.a.x)*progress;
   const z=s.a.y+(s.b.y-s.a.y)*progress;
   const target={x,z};
   const away=observers.every(o=>distance(o,target)>newMinDistance);
   const near=distance(focus,target)<newMaxDistance;
   if(away&&near){targets.push({segment:s,progress,
    position:target,dist:distance(focus,target)});
    break;
   }
  }
 }
 targets.sort((a,b)=>a.dist-b.dist||
  String(a.segment.sourceOSMWayId).localeCompare(
   String(b.segment.sourceOSMWayId)));
 const selected=[];
 for(const actor of ambient){
  if(selected.length>=limit)break;
  const target=targets.find(t=>!reserved.has(t.segment));
  if(!target)break;
  reserved.add(target.segment);
  selected.push({actor,segment:target.segment,
   position:target.position,progress:target.progress,
   sourceOSMWayId:target.segment.sourceOSMWayId,
   direction:selected.length%2?1:-1,
   oldInvisible:true,newInvisible:true,
   sourceGeometryChanged:false});
 }
 return selected;
}
