/** Milovice RP 5.235 — TWO source-locked multi-flat houses near Italská.
 * Source: unchanged RÚIAN cadastral outlines / OSM levels and flats.
 * Only MODEL facade glass / frames / window sills / plinths use existing
 * 5.192 four-batch renderer. Actual windows, entrances, elevations,
 * cladding tones and roof shape have NOT been photographed here.
 * Existing 3D wall volumes, roofs, coordinates and collisions are reused.
 */
export const ITALSKA_APARTMENTS_5235=Object.freeze({
 region:'mlada',source:'cuzk:ruian',nominalFloorMeters:3.05,
 windowWidth:1.46,windowHeight:1.52,photoVerified:false,
 buildings:Object.freeze([
  Object.freeze({
   id:'61979295',ruian:'27222098',levels:6,flats:56,
   ruianType:'6',startDate:'2009-02-20',nodes:25,
   hash:'ed941342',area:1178.715,
   facades:Object.freeze([[2,32.288,9],[6,19.814,5],
    [12,15.721,4],[16,23.999,6],[20,15.642,4],[22,19.919,5]])
  }),
  Object.freeze({
   id:'53865838',ruian:'26207796',levels:3,flats:33,
   ruianType:'6',startDate:'2007-04-19',nodes:19,
   hash:'91432581',area:1171.235,
   facades:Object.freeze([[1,10.706,2],[4,13.674,3],
    [13,12.892,3],[14,76.795,19],[15,13.025,3]])
  })
 ])
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const fingerprint=g=>{
 let h=2166136261;
 for(const ch of g.map(key).join(';')){
  h^=ch.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const project=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320});
export function planItalskaApartments5235({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=ITALSKA_APARTMENTS_5235;
 const spec=c.buildings.find(x=>x.id===String(id));
 if(!spec||regionId!==c.region||photoReviewed!==false||
  approvedArchitecture!==false||
  !tags||Object.keys(tags).length!==7||
  tags.building!=='residential'||
  tags['building:flats']!==String(spec.flats)||
  tags['building:levels']!==String(spec.levels)||
  tags['building:ruian:type']!==spec.ruianType||
  tags['ref:ruian:building']!==spec.ruian||
  tags.source!==c.source||tags.start_date!==spec.startDate||
  modelFloors!==spec.levels||!Number.isFinite(modelHeight)||
  Math.abs(modelHeight-spec.levels*c.nominalFloorMeters)>.005||
  !Array.isArray(geometry)||geometry.length!==spec.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  key(geometry[0])!==key(geometry.at(-1))||
  fingerprint(geometry)!==spec.hash)return null;
 const points=geometry.map(project);
 const area=Math.abs(points.slice(0,-1).reduce((sum,a,i)=>{
  const b=points[i+1];return sum+a.x*b.z-a.z*b.x;
 },0)/2);
 if(!Number.isFinite(area)||Math.abs(area-spec.area)>.8)return null;
 const facades=[];
 for(const [edgeIndex,expected,bays] of spec.facades){
  const a=points[edgeIndex],b=points[edgeIndex+1];
  if(!a||!b)return null;
  const len=Math.hypot(a.x-b.x,a.z-b.z);
  if(Math.abs(len-expected)>.13||bays<2||bays>22||
   len/bays<c.windowWidth+.7)return null;
  facades.push({edgeIndex,bays,sourceLengthMetres:+len.toFixed(3),
   windowWidthMetres:c.windowWidth});
 }
 const count=facades.reduce((sum,f)=>sum+f.bays*modelFloors,0);
 if(count!==(spec.id==='61979295'?198:90))return null;
 return {
  // 5.192 renderer accepts this schema. Version below describes its geometry.
  version:'5.192',sourceFacadeVersion:'5.235',
  sourceOSMId:spec.id,sourceRUIANId:spec.ruian,
  sourceName:'Italská / RÚIAN '+spec.ruian,
  sourceHash:spec.hash,sourceNodes:spec.nodes,
  sourceGeometry:geometry,originalAreaSquareMetres:+area.toFixed(3),
  sourceReportedFloors:modelFloors,sourceReportedFlats:spec.flats,
  modelHeightMeters:modelHeight,facades,
  modelWindowWidthMetres:c.windowWidth,
  modelWindowHeightMetres:c.windowHeight,
  expectedLongFacadeCount:facades.length,estimatedWindows:count,
  suppressedGenericFacadeEdges:spec.nodes-1,
  existingBuildingShellPreserved:true,sourceGeometryUnchanged:true,
  exactWindowLocationsVerified:false,exactWindowCountVerified:false,
  actualMaterialsPhotoVerified:false,entrancesPhotographed:false,
  inventedEntrances:0,inventedBalconies:0,newBuildingVolumes:0,
  newRoofs:0,newColliders:0,newRoads:0,newFootways:0
 };
}
