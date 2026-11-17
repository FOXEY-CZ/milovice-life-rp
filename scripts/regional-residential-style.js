// Milovice RP 5.92 — generic street-by-street residential infill.
// All styling is PROVISIONAL unless backed by a separately reviewed photo.
// Actual buildings, OSM footprints, roads and DEM elevations are immutable.
const TARGET_REGIONS=new Set(['mlada','vrutice']);
const HOUSE_TYPES=new Set(['house','detached','semidetached_house','terrace']);
const GENERIC_TYPES=new Set(['yes','residential']);
const ROOF_TAGS={flat:'flat',gabled:'gable',hipped:'hip'};
export function stableOsmBuildingHash(id){
 const name=String(id??'');
 let h=2166136261;
 for(let i=0;i<name.length;i++){
  h=Math.imul(h^name.charCodeAt(i),16777619)>>>0;
 }
 return h>>>0;
}
export function planRegionalBuildingStyle({
 regionId,id,tags={},width,depth,floors,
 photoReviewed=false,approvedArchitecture=false
}={}){
 if(!TARGET_REGIONS.has(regionId)||id===null||id===undefined||
    photoReviewed||approvedArchitecture||!Number.isFinite(width)||
    !Number.isFinite(depth)||width<2||depth<2||
    !Number.isFinite(floors)||floors<1||floors>16)return null;
 const type=tags.building;
 if(!HOUSE_TYPES.has(type)&&!GENERIC_TYPES.has(type))return null;
 // Never classify ambiguous building=yes as a verified family house.
 const profile=HOUSE_TYPES.has(type)?'house':
  type==='residential'&&floors>=4?'panel':'generic';
 const hash=stableOsmBuildingHash(id);
 const facadeIndex=hash%8;
 const panelIndex=(hash>>>5)%7;
 const roofIndex=(hash>>>11)%5;
 // Density is stable for each cadastral building. No randomized windows
 // that shift between streams, refreshes or reversed OSM way geometries.
 const baySpacing=profile==='panel'?
  [3.05,3.2,3.35][(hash>>>16)%3]:
  profile==='house'?[3.8,4.05,4.3][(hash>>>16)%3]:
  [3.55,3.75,3.95][(hash>>>16)%3];
 const declaredRoof=ROOF_TAGS[tags['roof:shape']]||null;
 return {
  regionId,id:String(id),profile,facadeIndex,panelIndex,roofIndex,
  baySpacing,mappedRoofKind:declaredRoof,
  // A thin masonry base strip uses the existing batched material/instancing.
  // Never crosses the inferred entrance opening.
  addPlinth:profile==='house'&&floors<=3&&width*depth<950,
  plinthHeight:.48,plinthThickness:.10,
  source:'OSM building footprint and level tags',
  inferred:true,photographicallyVerified:false,
  footprintChanged:false,roofGeometryChanged:false,
  roadGeometryChanged:false,extraMaterialKinds:0
 };
}
