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
  value(tags.foot)==='no'||
  (value(tags.motor_vehicle)!==''&&value(tags.motor_vehicle)!=='no')||
  (value(tags.vehicle)!==''&&value(tags.vehicle)!=='no'))return false;
 return true;
}
export function planMappedAmbientSegments5243({
 ways,buildings=[],regionId,widths,toWorld,clip,carriageway
}={}){
 if(!Array.isArray(ways)||!regionId||typeof widths?.get!=='function'||
  typeof toWorld!=='function'||typeof clip!=='function'||
  typeof carriageway?.isClear!=='function')return [];
 // Reject any candidate that enters an EXISTING mapped building polygon.
 // Bounding boxes keep the check cheap for regional streaming on phones.
 const originalBuildings=Array.isArray(buildings)?buildings.filter(b=>
  b?.tags?.building&&b.tags.building!=='roof'&&
  Array.isArray(b.geometry)&&b.geometry.length>=4).map(b=>{
   const pts=b.geometry.map(toWorld);
   if(pts.some(p=>!validPoint(p)))return null;
   return {pts,minX:Math.min(...pts.map(p=>p.x)),
    maxX:Math.max(...pts.map(p=>p.x)),
    minY:Math.min(...pts.map(p=>p.y)),
    maxY:Math.max(...pts.map(p=>p.y))};
  }).filter(Boolean):[];
 const insideExistingBuilding=(x,y)=>{
  for(const area of originalBuildings){
   if(x<area.minX||x>area.maxX||
    y<area.minY||y>area.maxY)continue;
   let inside=false;
   for(let i=0,j=area.pts.length-1;i<area.pts.length;j=i++){
    const a=area.pts[i],b=area.pts[j];
    if((a.y>y)!==(b.y>y)){
     const hitX=(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x;
     if(x<hitX)inside=!inside;
    }
   }
   if(inside)return true;
  }
  return false;
 };
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
    const safe=[0,.25,.5,.75,1].every(t=>{
     const x=start.x+(end.x-start.x)*t,
      y=start.y+(end.y-start.y)*t;
     return carriageway.isClear(x,y,.25,.08)&&
      !insideExistingBuilding(x,y);
    });
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
     roadShoulder:false,noMappedBuildingOverlap:true,
     newPavement:0,newCrossings:0});
   }
  }
 }
 return out;
}
