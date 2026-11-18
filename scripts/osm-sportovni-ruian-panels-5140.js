/**
 * Milovice RP 5.140 — nine existing, source-locked RÚIAN apartment
 * footprints beside Sportovní / Průběžná, with 8 or 9 mapped floors.
 *
 * Adds ONLY procedural horizontal floor courses and vertical panel seams
 * through the shared instanced-facade renderer. Window locations, façade
 * paint, balconies, roof profiles, doors and each ground footprint are
 * still MODEL estimates or inherited geometry, NOT photo verification.
 */
export const SPORTOVNI_RUIAN_5140=Object.freeze({
 regionId:'mlada',
 buildings:Object.freeze([
  ['53865979','8','32',5,'bdbe9189','18198643'],
  ['53865980','9','48',9,'7912488c','24969001'],
  ['53865981','8','32',5,'354aa23a','18198651'],
  ['53865990','9','48',9,'c66c722d','24913634'],
  ['53865991','9','48',5,'8066b2e5','24969010'],
  ['53865992','8','48',5,'47c4809e','18198627'],
  ['53865993','8','48',9,'1c879d8e','18198619'],
  ['53865994','8','48',5,'b401a4db','18198635'],
  ['53865995','8','48',5,'f843b340','18198660']
 ].map(([id,levels,flats,vertices,hash,ruian])=>
  Object.freeze({id,levels,flats,vertices,hash,ruian})))
});
function hashNodes(geometry){
 let h=2166136261;
 const s=geometry.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 for(const char of s){h^=char.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16).padStart(8,'0');
}
export function planSportovniRUIANPanel({
 id,regionId,tags={},geometry,height,photoReviewed=false,
 approvedArchitecture=false
}={}){
 if(regionId!=='mlada'||photoReviewed||approvedArchitecture||
  !Number.isFinite(height))return null;
 const source=SPORTOVNI_RUIAN_5140.buildings.find(x=>x.id===String(id));
 if(!source||tags.building!=='residential'||
  tags['building:levels']!==source.levels||
  tags['building:flats']!==source.flats||
  tags['ref:ruian:building']!==source.ruian||
  tags.source!=='cuzk:ruian'||!Array.isArray(geometry)||
  geometry.length!==source.vertices||geometry.some(p=>
  !Number.isFinite(p?.lat)||!Number.isFinite(p?.lon)))return null;
 if(hashNodes(geometry)!==source.hash)return null;
 const floors=Number(source.levels),flats=Number(source.flats);
 if(Math.abs(height-floors*3.05)>.15)return null;
 return {
  version:'5.140',id:source.id,regionId,
  floors,flats,height,floorHeight:height/floors,
  sourceOSMVertices:source.vertices,sourceOSMHash:source.hash,
  sourceRUIANId:source.ruian,sourceActualLevelTags:true,
  sourceActualFlatsTag:true,sourceType:'RÚIAN cadastral residential',
  sourceGeometryExactlyMatched:true,
  inferredWindowSpacing:true,inferredPanelJoints:true,
  photographedFacade:false,photographicallyMeasuredHeight:false,
  unchangedOriginalDoors:true,unchangedRoofs:true,
  roofShapeChanged:false,footprintChanged:false,
  roadGeometryChanged:false,newBuildings:0,newWindows:0,
  newBalconies:0,newEntrances:0,newRoofs:0,newColliders:0,
  sourceStreetArea:'Sportovní / Průběžná'
 };
}
