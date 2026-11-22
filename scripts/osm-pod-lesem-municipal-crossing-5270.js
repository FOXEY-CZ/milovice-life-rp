/** Milovice RP 5.271 safety patch — municipal 2025 crossing on Pod Lesem at Armadni.
 * Source: https://zakazky.mesto-milovice.cz/contract_display_85.html
 * Public contract: four new crossings on Rakouska, Kastanova, Pod Lesem,
 * unnamed street at Armadni. Contract performed/closed 2026-01-07.
 * https://nymbursky.denik.cz/zpravy_region/milovice-rok-2025-pumptrack-psi-park-opravy-investice.html
 * confirms new Armadni crossings during 2025.
 * The Pod Lesem crossing is not a separate footway=crossing in the CHECKED-IN
 * OSM; position 10.5m from the original junction is an honest MODEL ESTIMATE.
 * Render ONLY markings on existing 6m wide OSM road, not a new OSM way,
 * kerb, collision or invented pedestrian route. Refuse if source changes.
 */
export const POD_LESEM_CROSS_5270=Object.freeze({
 region:'mlada',sideId:'128087258',sideHash:'6e14ec02',sideNodes:4,
 mainId:'1331897690',mainHash:'197dbea8',mainNodes:4,
 joinKey:'50.2286371,14.8727931',
 proposedMetresFromJunction:10.5,sourceWidthMetres:6,
 stripeLengthMetres:3.4,
 source:'https://zakazky.mesto-milovice.cz/contract_display_85.html',
 councilStatus:'contract performance ended 2026-01-07',
 modelPlacementNotSurveyed:true
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const exact=(tags,expected)=>tags&&
 Object.keys(tags).length===Object.keys(expected).length&&
 Object.entries(expected).every(([k,v])=>tags[k]===v);
export function planPodLesemCross5270({regionId,ways}={}){
 const S=POD_LESEM_CROSS_5270;
 if(regionId!==S.region||!Array.isArray(ways))return null;
 const one=id=>{const list=ways.filter(x=>String(x?.id)===id);return list.length===1?list[0]:null};
 const side=one(S.sideId),main=one(S.mainId);
 if(!side||!main||side.type!=='way'||main.type!=='way'||
  side.geometry?.length!==S.sideNodes||main.geometry?.length!==S.mainNodes||
  !side.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
  !main.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
  hash(side.geometry)!==S.sideHash||hash(main.geometry)!==S.mainHash||
  !exact(side.tags,{highway:'residential',lane_markings:'no',
   motor_vehicle:'no',name:'Pod Lesem',surface:'asphalt',width:'6'})||
  !exact(main.tags,{highway:'residential',lanes:'2',lit:'yes',
   maxspeed:'50',name:'Armádní',surface:'asphalt'})||
  key(side.geometry.at(-1))!==S.joinKey||
  key(main.geometry[1])!==S.joinKey)return null;
 const coords=side.geometry.map(toWorld);
 let remaining=S.proposedMetresFromJunction,segment=-1;
 let a,b,axisLength=0;
 for(let i=coords.length-1;i>0;i--){
  const cur=coords[i],prev=coords[i-1],len=length(cur,prev);
  if(remaining>len){remaining-=len;continue;}
  a=prev;b=cur;axisLength=len;segment=i;break;
 }
 if(segment<0||axisLength<4||remaining<1||remaining>axisLength-1)return null;
 const ux=(b.x-a.x)/axisLength,uy=(b.y-a.y)/axisLength;
 const center={x:b.x-ux*remaining,y:b.y-uy*remaining};
 const extent=S.sourceWidthMetres*.5;
 const begin={x:center.x+uy*extent,y:center.y-ux*extent};
 const end={x:center.x-uy*extent,y:center.y+ux*extent};
 if(Math.abs(length(begin,end)-S.sourceWidthMetres)>.005)return null;
 // If this source export later acquires a real mapped crossing nearby,
 // refuse the inferred site, instead of drawing TWO sets of paint.
 // A mapped crossing can run through this spot without ANY vertex in
 // the 22m guard radius (for example one long two-node way). Check the
 // entire OSM polyline, not just vertices. Invalid points cannot veto it.
 const mappedCrossingNearby=ways.some(w=>{
  if(w?.tags?.footway!=='crossing'||!Array.isArray(w.geometry)||
   !w.geometry.length||
   !w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)))
   return false;
  const line=w.geometry.map(toWorld);
  if(line.some(point=>length(point,center)<22))return true;
  return line.slice(1).some((end,i)=>{
   const start=line[i],dx=end.x-start.x,dy=end.y-start.y;
   const squared=dx*dx+dy*dy;
   if(squared<=1e-9)return false;
   const t=Math.max(0,Math.min(1,
    ((center.x-start.x)*dx+(center.y-start.y)*dy)/squared));
   return Math.hypot(center.x-start.x-t*dx,
    center.y-start.y-t*dy)<22;
  });
 });
 if(mappedCrossingNearby)return null;
 return {version:'5.271',sideRoadId:S.sideId,mainRoadId:S.mainId,
  sideHash:S.sideHash,mainHash:S.mainHash,junctionGPS:{...side.geometry.at(-1)},
  centerWorld:center,modelFootwayAxis:[begin,end],roadWidthMetres:S.sourceWidthMetres,
  stripeLengthMetres:S.stripeLengthMetres,
  modelDistanceFromJunctionMetres:S.proposedMetresFromJunction,
  sourceSegmentEndIndex:segment,source:S.source,
  mappedCrossingFound:false,
  actualMarkingsFromMunicipalContract:true,
  photoMeasuredPlacement:false,geometryPlacementEstimated:true,
  originalGPSUnchanged:true,originalRoadGraphUnchanged:true,
  originalOSMSurfaceUnchanged:true,
  noNewFootwayGeometry:true,noNewPhysicalAccess:true,
  newMappedCrossingWays:0,newSidewalks:0,newKerbs:0,newColliders:0,
  newRoads:0,newTrafficRoutes:0,newMaterials:0,newLights:0};
}
