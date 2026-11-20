/** Milovice RP 5.203 — parking map marker sourced from the exact RÚIAN
 * parking-house outline. A minimap icon only, never a fictional 3D sign,
 * garage entrance, driving route, parking bay or OSM amenity point.
 */
export const VISNOVA_PARKING_MAP_5203=Object.freeze({
 region:'mlada',sourceBuildingId:'1025752710',
 sourceRUIANId:'105243469',sourcePolygonHash:'20bb417f',
 nodes:15,mapSymbol:'P',photoVerifiedEntrance:false
});
const hash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const inside=(x,z,pts)=>{
 let yes=false;
 for(let i=0,j=pts.length-1;i<pts.length;j=i++){
  const a=pts[i],b=pts[j];
  if((a.z>z)!==(b.z>z)&&
   x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)yes=!yes;
 }
 return yes;
};
export function planVisnovaParkingMap5203({
 regionId,building,toWorld,approvedLocationOverride=false
}={}){
 const c=VISNOVA_PARKING_MAP_5203;
 const g=building?.geometry,t=building?.tags||{};
 if(regionId!==c.region||approvedLocationOverride||
  String(building?.id)!==c.sourceBuildingId||
  t.amenity!=='parking'||t.parking!=='multi-storey'||
  t.building!=='yes'||t['ref:ruian:building']!==c.sourceRUIANId||
  t['building:levels']!=='2'||t.source!=='cuzk:ruian'||
  !Array.isArray(g)||g.length!==c.nodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(g)!==c.sourcePolygonHash||
  typeof toWorld!=='function')return null;
 const pts=g.map(toWorld).map(p=>({x:p.x,z:p.y??p.z}));
 if(pts.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 pts.pop(); // original closed ring, source hash already locked
 // First compute the polygon area centroid; if outside an irregular
 // concavity, deterministically fall back to the midpoint of the
 // longest diagonal inside. A marker is not a parking entrance.
 let twice=0,cx=0,cz=0;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length];
  const cross=a.x*b.z-b.x*a.z;
  twice+=cross;cx+=(a.x+b.x)*cross;cz+=(a.z+b.z)*cross;
 }
 if(Math.abs(twice)<1)return null;
 cx/=3*twice;cz/=3*twice;
 let anchor={x:cx,z:cz};
 if(!inside(cx,cz,pts)){
  const minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x));
  const minZ=Math.min(...pts.map(p=>p.z)),maxZ=Math.max(...pts.map(p=>p.z));
  let found=false;
  for(let iz=0;iz<30&&!found;iz++)for(let ix=0;ix<30&&!found;ix++){
   const x=minX+(ix+.5)*(maxX-minX)/30;
   const z=minZ+(iz+.5)*(maxZ-minZ)/30;
   if(inside(x,z,pts)){anchor={x,z};found=true;}
  }
  if(!found)return null;
 }
 return {version:'5.203',sourceBuildingId:c.sourceBuildingId,
  sourceRUIANId:c.sourceRUIANId,
  markerSymbol:c.mapSymbol,point:anchor,
  derivedFromSourceFootprint:true,insideMappedBuilding:true,
  notAnEntrance:true,notAnExactParkingSpace:true,
  photoVerifiedEntrance:false,newThreeDObjects:0,newColliders:0,
  newParkingPlaces:0,newRoads:0,newFootways:0};
}
