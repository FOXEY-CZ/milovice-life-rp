/** Milovice RP 5.243 — ambient NPC walkers on existing mapped OSM
 * pedestrian surfaces, not calculated road shoulders. The same road-clipped
 * pieces used by the pavement renderer are the only eligible walking routes.
 * No new footways, kerbs, crossings, building modifications or colliders.
 * Exact appearance/number of simulated people is not a photo survey.
 */
const walkKinds=new Set(['footway','path','pedestrian']);
const rejectAccess=new Set(['no','private','permit']);
const validPoint=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const value=v=>String(v??'').trim().toLowerCase();
export function canUseMappedAmbientWay5243(tags){
 if(!tags||!walkKinds.has(tags.highway))return false;
 if(tags.footway==='crossing'||tags.crossing!==undefined||
  value(tags.indoor)==='yes'||value(tags.tunnel)==='yes'||
  value(tags.bridge)==='yes'||value(tags.covered)==='yes'||
  rejectAccess.has(value(tags.access))||
  rejectAccess.has(value(tags.foot))||
  value(tags.foot)==='no'||value(tags.motor_vehicle)==='yes')return false;
 return true;
}
export function planMappedAmbientSegments5243({
 ways,regionId,widths,toWorld,clip,carriageway
}={}){
 if(!Array.isArray(ways)||!regionId||typeof widths?.get!=='function'||
  typeof toWorld!=='function'||typeof clip!=='function'||
  typeof carriageway?.isClear!=='function')return [];
 const out=[],dedup=new Set();
 for(const way of ways){
  if(!canUseMappedAmbientWay5243(way?.tags)||
   !Array.isArray(way.geometry)||way.geometry.length<2||
   !way.geometry.every(p=>Number.isFinite(p?.lat)&&
    Number.isFinite(p?.lon)))continue;
  const width=widths.get(String(way.id));
  if(!Number.isFinite(width)||width<.7||width>7)continue;
  const source=way.geometry.map(toWorld);
  if(source.some(p=>!validPoint(p)))continue;
  for(let i=1;i<source.length;i++){
   const a=source[i-1],b=source[i];
   const originalLength=Math.hypot(b.x-a.x,b.y-a.y);
   if(originalLength<12||originalLength>800)continue;
   for(const piece of clip(a,b,width,carriageway)||[]){
    const pa=piece?.a,pb=piece?.b;
    if(!Number.isFinite(pa?.x)||!Number.isFinite(pa?.z)||
     !Number.isFinite(pb?.x)||!Number.isFinite(pb?.z))continue;
    const len=Math.hypot(pb.x-pa.x,pb.z-pa.z);
    if(len<12)continue;
    // Original clipped pavement, with a small buffer at road junctions.
    const ux=(pb.x-pa.x)/len,uz=(pb.z-pa.z)/len;
    const start={x:pa.x+ux*1.1,y:pa.z+uz*1.1};
    const end={x:pb.x-ux*1.1,y:pb.z-uz*1.1};
    const walkLen=len-2.2;
    if(walkLen<9.5)continue;
    const safe=[0,.25,.5,.75,1].every(t=>
     carriageway.isClear(start.x+(end.x-start.x)*t,
      start.y+(end.y-start.y)*t,.25,.08));
    if(!safe)continue;
    const key=[String(way.id),i,
     Math.round(start.x*4),Math.round(start.y*4),
     Math.round(end.x*4),Math.round(end.y*4)].join(':');
    if(dedup.has(key))continue;
    dedup.add(key);
    out.push({a:start,b:end,len:walkLen,width:0,
     kind:'mapped-footway',sourceOSMWayId:String(way.id),
     sourceEdgeIndex:i-1,sourceHighway:way.tags.highway,
     regionId,clippedFromOriginalRoadSafePiece:true,
     roadShoulder:false,newPavement:0,newCrossings:0});
   }
  }
 }
 return out;
}
