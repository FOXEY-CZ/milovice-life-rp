// 5.306: exact source exception to the ordinary 140m building-size guard.
// Restore the already mapped school shell; no surveyed facade/roof/height claim.
export function planJuventaSchoolShell5306({id,regionId,tags,geometry}={}){
 if(String(id)!=='53865836'||!['mlada','westlink'].includes(regionId)||
  tags?.building!=='civic'||tags.school!=='primary'||tags['ref:ruian:building']!=='62834916'||
  tags['building:levels']!=='5'||!Array.isArray(geometry)||geometry.length!==73||
  !geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)))return null;
 let h=2166136261;
 for(const c of geometry.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 if((h>>>0).toString(16).padStart(8,'0')!=='be655146')return null;
 const lats=geometry.map(p=>p.lat),lons=geometry.map(p=>p.lon);
 const width=(Math.max(...lons)-Math.min(...lons))*111320*Math.cos(50.226*Math.PI/180);
 const depth=(Math.max(...lats)-Math.min(...lats))*111320;
 if(width<2||width>160||depth<=140||depth>160)return null;
 return {sourceOSMId:'53865836',sourceRuianId:'62834916',sourceHash:'be655146',
  sourceRegion:regionId,sourceVertices:73,sourceLevels:5,width,depth,
  modelHeight:15.25,uniformHeightEstimated:true,flatCapEstimated:true,
  newEntrances:0,newRamps:0,sourceFootprintPreserved:true};
}
