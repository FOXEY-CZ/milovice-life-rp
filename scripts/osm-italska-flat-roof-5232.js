/** Milovice RP 5.232 — One actual OSM/RUIAN house at Italská has
 * roof:shape=flat. Prior procedural roof inference could build a sloped roof.
 * Respect the original tag on the EXISTING shell and flat roof cap only.
 * No new roof geometry, footprints, walls, windows, doors or colliders.
 * Flat shape is mapped; actual height/colour/facade are NOT photo surveyed.
 */
export const ITALSKA_FLAT_ROOF_5232=Object.freeze({
 region:'mlada',buildingId:'1112779894',geometryHash:'e0c358f5',
 nodes:5,sourceAreaM2:169.226,levels:2,flats:1,
 tags:Object.freeze({
  building:'house','building:flats':'1','building:levels':'2',
  'building:ruian:type':'7','ref:ruian:building':'108055060',
  'roof:shape':'flat',source:'cuzk:ruian',start_date:'2022-05-09'
 })
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const fingerprint=g=>{
 let h=2166136261;
 for(const c of g.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const point=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
});
export function planItalskaFlatRoof5232({
 regionId,building,photoReviewed=false,approvedArchitecture=false
}={}){
 const c=ITALSKA_FLAT_ROOF_5232;
 if(regionId!==c.region||String(building?.id)!==c.buildingId||
  photoReviewed!==false||approvedArchitecture!==false)return null;
 const tags=building?.tags,g=building?.geometry;
 if(!tags||Object.keys(tags).length!==Object.keys(c.tags).length||
  Object.entries(c.tags).some(([k,v])=>tags[k]!==v)||
  !Array.isArray(g)||g.length!==c.nodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  key(g[0])!==key(g.at(-1))||fingerprint(g)!==c.geometryHash)return null;
 const poly=g.slice(0,-1).map(point);
 const area=Math.abs(poly.reduce((sum,a,i)=>{
  const b=poly[(i+1)%poly.length];
  return sum+a.x*b.z-b.x*a.z;
 },0)/2);
 if(Math.abs(area-c.sourceAreaM2)>.12)return null;
 return {
  version:'5.232',sourceBuildingId:c.buildingId,
  sourceGeometryHash:c.geometryHash,sourceAreaM2:+area.toFixed(3),
  originalOSMNodes:g.length,originalMappedLevels:c.levels,
  originalMappedFlats:c.flats,sourceRUAINId:c.tags['ref:ruian:building'],
  mappedRoofShape:'flat',roofShapeTagSource:'OSM roof:shape',
  originalSourceGPS:g.map(p=>({...p})),
  sourceGPSUnchanged:true,originalBuildingShellReused:true,
  estimatedHeightNotSurveyed:true,facadeAndRoofColorsNotPhotoVerified:true,
  noNewWindows:true,noNewDoors:true,
  newBuildings:0,newRoads:0,newFootways:0,newRoofGeometry:0,
  newColliders:0,newFacades:0,newLandscaping:0
 };
}
