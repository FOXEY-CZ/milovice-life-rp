/** 5.177 — OSM-locked visual material for already rendered
 * Topolova paving_stones ways. Tint is game art, NOT photo-surveyed.
 * Does not create / offset / widen / duplicate any surface.
 */
export const TOPOLOVA_PAVING_5177=Object.freeze({
 regionId:'mlada',
 sourceWays:Object.freeze({
  '1316882852':'a50c0251',
  '1314665579':'476fa89b',
  '1316882860':'35c50c19'
 }),
 material:'topolova-paving-stones'
});
const sourceHash=geometry=>{
 let h=2166136261;
 for(const c of geometry.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
export function planTopolovaPaving5177(regionId,way){
 const cfg=TOPOLOVA_PAVING_5177,id=String(way?.id),
  expected=cfg.sourceWays[id];
 if(regionId!==cfg.regionId||!expected||
  way?.tags?.highway!=='footway'||
  way?.tags?.surface!=='paving_stones'||
  !Array.isArray(way.geometry)||way.geometry.length<2||
  way.geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  sourceHash(way.geometry)!==expected||
  ['private','no','customers'].includes(way.tags.access))return null;
 return {version:'5.177',sourceWayId:id,sourceHash:expected,
  sourceSurface:'paving_stones',material:cfg.material,
  colorPhotoVerified:false,sourceWayGeometryChanged:false,
  newFootways:0,newColliders:0,newRoads:0,newGeometry:0};
}
