/** Milovice RP 5.217 — an already mapped building along the eastern
 * Višňová corridor has rare EXPLICIT OSM color tags. Honor those exact
 * source colors rather than the random regional facade/roof palette.
 *
 * Source: original stored OSM way/1456361921, not a photo or survey.
 * Building type 'yes' and levels=3 do NOT establish windows, roof pitch,
 * entrances, decorations or architectural style. Preserve existing
 * building mesh, original GPS, 3D height, roof topology and collision.
 */
export const VISNOVA_TAGGED_COLORS_5217=Object.freeze({
 region:'mlada',buildingId:'1456361921',sourceHash:'28e92fa9',
 nodes:5,levels:3,buildingType:'yes',
 facadeHex:'#fec700',roofHex:'#583400',
 areaMinSquareMetres:180,areaMaxSquareMetres:183
});
const valid=p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon);
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const fingerprint=g=>{
 let h=2166136261;
 for(const ch of g.map(key).join(';')){
  h^=ch.charCodeAt(0);
  h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const project=p=>({x:(p.lon-14.889)*111320*
 Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
export function planVisnovaTaggedColors5217({
 regionId,building,photoReviewed=false,approvedArchitecture=false
}={}){
 const c=VISNOVA_TAGGED_COLORS_5217;
 if(regionId!==c.region||
  String(building?.id)!==c.buildingId||
  photoReviewed!==false||approvedArchitecture!==false)return null;
 const t=building?.tags||{},g=building?.geometry;
 if(t.building!==c.buildingType||
  t['building:levels']!==String(c.levels)||
  t['building:colour']!==c.facadeHex||
  t['roof:colour']!==c.roofHex||
  Object.keys(t).length!==4||
  !Array.isArray(g)||g.length!==c.nodes||
  g.some(p=>!valid(p))||
  key(g[0])!==key(g.at(-1))||
  fingerprint(g)!==c.sourceHash)return null;
 const corners=g.slice(0,-1).map(project);
 let doubleArea=0;
 const edges=[];
 for(let i=0;i<corners.length;i++){
  const a=corners[i],b=corners[(i+1)%corners.length];
  doubleArea+=a.x*b.z-b.x*a.z;
  edges.push(Math.hypot(a.x-b.x,a.z-b.z));
 }
 const area=Math.abs(doubleArea)*.5;
 if(area<c.areaMinSquareMetres||area>c.areaMaxSquareMetres||
  edges.some(v=>v<12||v>15))return null;
 return {
  version:'5.217',sourceBuildingId:c.buildingId,
  sourceGeometryHash:c.sourceHash,originalNodes:c.nodes,
  originalOSMBuildingType:c.buildingType,
  originalMappedLevels:c.levels,
  sourceFacadeHex:c.facadeHex,sourceRoofHex:c.roofHex,
  footprintSquareMetres:+area.toFixed(3),
  sourceGPS:g.map(p=>({...p})),
  cameraTargetGPS:{
   lat:+(g.slice(0,-1).reduce((s,p)=>s+p.lat,0)/4).toFixed(7),
   lon:+(g.slice(0,-1).reduce((s,p)=>s+p.lon,0)/4).toFixed(7)
  },
  originalGPSUnchanged:true,roofShapeNotSpecifiedByOSM:true,
  architecturalAppearanceNotPhotographed:true,
  sourceColourTagsNotAColourSurvey:true,
  noNewWindows:true,noNewEntrances:true,
  newBuildings:0,newRoofGeometry:0,newColliders:0,
  newFacades:0,newRoads:0,newFootways:0,newLandscape:0
 };
}
