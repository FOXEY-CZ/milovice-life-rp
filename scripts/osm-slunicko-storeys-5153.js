/** MŠ Sluníčko 5.153. Four storeys reported by the school and ČŠI.
 * Its mapped OSM way still says two. This is an UNMEASURED visual model:
 * do not rewrite source GPS, OSM tags, roofs, pathways or colliders. */
export const SLUNICKO_5153=Object.freeze({
 regionId:'mlada',osmId:'53865699',ruian:'26092069',
 name:'MŠ Sluníčko',originalOSMLevels:'2',
 sourceReportedStoreys:4,sourceNodes:9,sourceHash:'912f8e04',
 source:'https://www.ms-slunicko.com/predstavujeme-ms/',
 inspection:'https://portal.csicr.cz/Files/Get/578617D0-B976-456E-85CB-56E21E47B226?db=Archive',
 sourceReportedClassrooms:11,modelFloorHeightMeters:3.05
});
function fingerprint(geo){
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
}
export function planSlunickoStoreys5153({
 id,regionId,tags,geometry,baseFloors,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const s=SLUNICKO_5153;
 if(regionId!==s.regionId||String(id)!==s.osmId||
  photoReviewed||approvedArchitecture||
  tags?.building!=='public'||tags.name!==s.name||
  tags['building:levels']!==s.originalOSMLevels||
  tags['ref:ruian:building']!==s.ruian||
  tags.source!=='cuzk:ruian'||tags.height!==undefined||
  baseFloors!==Number(s.originalOSMLevels)||
  !Array.isArray(geometry)||geometry.length!==s.sourceNodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  fingerprint(geometry)!==s.sourceHash)return null;
 return {
  version:'5.153',sourceOSMId:s.osmId,sourceRUIANId:s.ruian,
  originalOSMHash:s.sourceHash,sourceOriginalNodes:s.sourceNodes,
  sourceOriginalOSMLevels:2,sourceReportedStoreys:4,
  sourceReportedClassrooms:11,sourceOfficialWebsite:s.source,
  sourceSchoolInspection:s.inspection,
  modelFloors:4,modelFloorHeightMeters:3.05,modelHeightMeters:12.2,
  sourceSpecifiesAboveGroundFloors:false,
  modelAssumesAboveGroundFloors:true,measuredHeight:false,
  photographicFacadeVerified:false,windowGridModelEstimated:true,
  roofProfileVerified:false,entryLocationVerified:false,
  OSMLevelsChanged:false,OSMFootprintChanged:false,
  addedBuildings:0,addedRoads:0,addedFootways:0,addedColliders:0,
  addedStreetFurniture:0,addedDoors:0,addedParking:0
 };
}
