/** Milovice RP 5.200 — source-locked near-field turf in two REAL
 * OSM landuse=grass polygons by Višňová residences. Grass blade locations
 * are deterministic game estimates, NOT surveyed individual plants.
 * No new lawns, roads, sidewalks, trees or colliders are generated.
 */
export const VISNOVA_LAWNS_5200=Object.freeze({
 region:'mlada',polygons:Object.freeze([
  Object.freeze({id:'1460019807',nodes:12,hash:'91d498b2'}),
  Object.freeze({id:'1460019806',nodes:15,hash:'135fb3a4'})
 ]),maxTuftsPerPolygon:110,spacing:2.7,photoVerified:false
});
const geoHash=geometry=>{
 let h=2166136261;
 for(const c of geometry.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const inside=(x,z,polygon)=>{
 let crossing=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];
  if((a.z>z)!==(b.z>z) &&
   x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)crossing=!crossing;
 }
 return crossing;
};
const edgeDistance=(x,z,poly)=>{
 let d=Infinity;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length];
  const vx=b.x-a.x,vz=b.z-a.z;
  const t=Math.max(0,Math.min(1,((x-a.x)*vx+(z-a.z)*vz)/(vx*vx+vz*vz)));
  d=Math.min(d,Math.hypot(x-a.x-vx*t,z-a.z-vz*t));
 }
 return d;
};
export function planVisnovaLawnDetail5200(ways,{
 regionId,toWorld,roads,buildings,water,excludedLawnIds=[]
}={}){
 if(regionId!=='mlada'||!Array.isArray(ways)||typeof toWorld!=='function'||
  !roads?.isClear||!buildings?.isClear||!water?.isClear)return null;
 const excluded=new Set(excludedLawnIds.map(String));
 const tufts=[],sourceLawnIds=[],skippedSourceLawns=[];
 let rejectedRoad=0,rejectedBuilding=0,rejectedWater=0;
 for(const spec of VISNOVA_LAWNS_5200.polygons){
  const matches=ways.filter(w=>String(w.id)===spec.id);
  if(matches.length!==1)return null;
  const w=matches[0],g=w.geometry;
  if(w.tags?.landuse!=='grass'||Object.keys(w.tags).length!==1||
   !Array.isArray(g)||g.length!==spec.nodes||
   g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   geoHash(g)!==spec.hash)return null;
  if(excluded.has(spec.id)){skippedSourceLawns.push(spec.id);continue;}
  const poly=g.map(toWorld).map(p=>({x:p.x,z:p.y??p.z}));
  if(poly.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
  if(poly[0].x===poly.at(-1).x&&poly[0].z===poly.at(-1).z)poly.pop();
  const minX=Math.min(...poly.map(p=>p.x)),maxX=Math.max(...poly.map(p=>p.x));
  const minZ=Math.min(...poly.map(p=>p.z)),maxZ=Math.max(...poly.map(p=>p.z));
  const spacing=VISNOVA_LAWNS_5200.spacing;
  // grid origin derived solely from source polygon: repeatable after reload
  let accepted=0;
  for(let z=minZ+spacing*.6;z<maxZ-spacing*.4&&accepted<110;z+=spacing){
   for(let x=minX+spacing*.6;x<maxX-spacing*.4&&accepted<110;x+=spacing){
    const ix=Math.round((x-minX)/spacing),iz=Math.round((z-minZ)/spacing);
    const jitterX=(((ix*17+iz*31)%13)-6)*.07;
    const jitterZ=(((ix*29+iz*11)%11)-5)*.07;
    const px=x+jitterX,pz=z+jitterZ;
    if(!inside(px,pz,poly)||edgeDistance(px,pz,poly)<.75)continue;
    if(!roads.isClear(px,pz,.42,.4)){rejectedRoad++;continue;}
    if(!buildings.isClear(px,pz,.65)){rejectedBuilding++;continue;}
    if(!water.isClear(px,pz,.55,.35)){rejectedWater++;continue;}
    const scale=.20+((ix*3+iz*7)%6)*.027;
    tufts.push({x:px,z:pz,height:scale,spread:.12+scale*.24,
     yaw:(ix*2.399+iz*1.811)%6.283185,sourceOSMId:spec.id});
    accepted++;
   }
  }
  sourceLawnIds.push(spec.id);
 }
 return {version:'5.200',sourceLawnIds,skippedSourceLawns,
  tufts,sourcePolygons:VISNOVA_LAWNS_5200.polygons.map(p=>p.id),
  rejectedRoad,rejectedBuilding,rejectedWater,
  photoVerifiedIndividualPlants:false,sourcePolygonsUnchanged:true,
  originalWalkwaysUntouched:true,newGrassAreas:0,newRoads:0,
  newFootways:0,newColliders:0};
}
