/** Milovice RP 5.240 — OSM vehicle-access contract for ambient NPC traffic.
 * The source road geometry is never changed. This filters the NPC routing
 * graph only; it does not make claims about photos or player permissions.
 */
export const ITALSKA_EMERGENCY_ACCESS_5240=Object.freeze({
 id:'1272081401',region:'mlada',nodes:9,hash:'01f91763',
 lengthMetres:86.464,checkDate:'2024-04-12',
 description:'Požární přístupová komunikace',
 sourceOSM:'https://www.openstreetmap.org/way/1272081401'
});
const restricted=new Set([
 'no','private','permit','destination','delivery','customers',
 'agricultural','forestry','emergency','official'
]);
const normalize=v=>String(v??'').trim().toLowerCase();
const tag=(road,key,property)=>normalize(road?.[property]??road?.tags?.[key]);
const pointKey=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const fingerprint=points=>{
 let h=2166136261;
 for(const ch of points.map(pointKey).join(';')){
  h^=ch.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
export function inspectItalskaEmergencyAccess5240(way){
 const c=ITALSKA_EMERGENCY_ACCESS_5240,t=way?.tags,g=way?.geometry;
 if(String(way?.id)!==c.id||!t||Object.keys(t).length!==7||
  t.highway!=='service'||t.service!=='emergency_access'||
  t.motor_vehicle!=='permit'||t.emergency!=='designated'||
  t.surface!=='asphalt'||t.check_date!==c.checkDate||
  t.description!==c.description||!Array.isArray(g)||g.length!==c.nodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  fingerprint(g)!==c.hash)return null;
 let length=0;
 for(let i=1;i<g.length;i++){
  const a=g[i-1],b=g[i];
  length+=Math.hypot((b.lon-a.lon)*111320*Math.cos(50.226*Math.PI/180),
   (b.lat-a.lat)*111320);
 }
 if(!Number.isFinite(length)||Math.abs(length-c.lengthMetres)>.12)
  return null;
 return {sourceOSMId:c.id,sourceNodes:g.length,sourceHash:c.hash,
  sourceLengthMetres:+length.toFixed(3),sourceVerified:true,
  restrictedToPermittedVehicles:true,geometryChanged:false,
  newRoads:0,newColliders:0};
}
export function classifyPublicNpcRoad5240(road){
 const id=String(road?.osmId??road?.id??'');
 if(id===ITALSKA_EMERGENCY_ACCESS_5240.id)
  return {allowed:false,reason:'source-locked-emergency-access'};
 const service=tag(road,'service','serviceTag');
 if(service==='emergency_access')
  return {allowed:false,reason:'service:emergency_access'};
 for(const [key,prop] of [
  ['motor_vehicle','motorVehicle'],['vehicle','vehicleAccess'],
  ['access','access']
 ]){
  const value=tag(road,key,prop);
  if(restricted.has(value))return {allowed:false,reason:key+':'+value};
 }
 return {allowed:true,reason:'no-explicit-motor-restriction'};
}
