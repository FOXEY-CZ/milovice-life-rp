/** Milovice RP 5.238 — existing RUIAN twelve-floor residential shell.
 * Original OSM outline/levels are source locked. Windows are model estimates,
 * not surveyed. Existing shell, roof, roads, walkways and collision unchanged.
 */
export const ITALSKA_TOWER_5238=Object.freeze({
 id:'53865925',ruian:'26650959',region:'mlada',source:'cuzk:ruian',
 levels:12,flats:22,ruianType:'6',startDate:'2007-10-22',
 nodes:5,hash:'aa907fb0',area:709.078,
 facades:Object.freeze([[0,13.622,3],[1,52.151,14],[2,13.596,3],[3,52.058,14]]),
 windows:408,photoVerified:false
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=points=>{
 let h=2166136261;
 for(const c of points.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
export function planItalskaTower5238({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=ITALSKA_TOWER_5238;
 if(String(id)!==c.id||regionId!==c.region||photoReviewed!==false||
  approvedArchitecture!==false||!tags||Object.keys(tags).length!==7||
  tags.building!=='residential'||tags['building:levels']!==String(c.levels)||
  tags['building:flats']!==String(c.flats)||
  tags['building:ruian:type']!==c.ruianType||
  tags['ref:ruian:building']!==c.ruian||
  tags.source!==c.source||tags.start_date!==c.startDate||
  modelFloors!==c.levels||!Number.isFinite(modelHeight)||
  Math.abs(modelHeight-c.levels*3.05)>.005||
  !Array.isArray(geometry)||geometry.length!==c.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  key(geometry[0])!==key(geometry.at(-1))||
  hash(geometry)!==c.hash)return null;
 const ps=geometry.map(p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
  z:-p.lat*111320}));
 let twice=0;
 for(let i=0;i<ps.length-1;i++)twice+=ps[i].x*ps[i+1].z-ps[i].z*ps[i+1].x;
 if(Math.abs(Math.abs(twice)/2-c.area)>.8)return null;
 const facades=[];
 for(const [edge,expected,bays] of c.facades){
  const a=ps[edge],b=ps[edge+1];
  if(!a||!b)return null;
  const len=Math.hypot(a.x-b.x,a.z-b.z);
  if(Math.abs(len-expected)>.13||len/bays<2.16)return null;
  facades.push({edgeIndex:edge,sourceLengthMetres:+len.toFixed(3),
   bays,windowWidthMetres:1.46});
 }
 const estimatedWindows=facades.reduce((n,f)=>n+f.bays*c.levels,0);
 if(estimatedWindows!==c.windows)return null;
 return {
  version:'5.192',sourceFacadeVersion:'5.238',
  sourceOSMId:c.id,sourceRUIANId:c.ruian,
  sourceName:'RÚIAN '+c.ruian+' · Italská vicinity',
  sourceGeometry:geometry,sourceHash:c.hash,sourceNodes:c.nodes,
  sourceReportedFloors:c.levels,sourceReportedFlats:c.flats,
  modelHeightMeters:modelHeight,facades,modelWindowWidthMetres:1.46,
  modelWindowHeightMetres:1.52,
  expectedLongFacadeCount:facades.length,estimatedWindows,
  suppressedGenericFacadeEdges:c.nodes-1,
  sourceGeometryUnchanged:true,exactWindowsPhotoVerified:false,
  materialsPhotoVerified:false,inventedEntrances:0,inventedBalconies:0,
  newRoofs:0,newBuildingVolumes:0,newColliders:0,newRoads:0,newFootways:0
 };
}
