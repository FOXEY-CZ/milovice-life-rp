/** Milovice RP 5.219 — THREE original RÚIAN seven-storey apartment
 * blocks on the east Višňová/Armádní corridor. This module adds estimated
 * *visual* facade grids ON the existing original building walls, NOT three
 * new buildings or any new residential access, windows as architectural
 * facts, balconies, doors, roof changes or collisions.
 *
 * MAPPED / confirmed by stored OSM+RÚIAN: precise GPS footprints, 7 floors,
 * 48 apartments each, and three distinct official building references.
 * NOT VERIFIED: number, size, placement, colour or style of actual windows.
 * The renderer is the previously tested 5.192 four-mesh facade batch.
 */
export const VISNOVA_SEVEN_FLOOR_ROW_5219=Object.freeze({
 region:'mlada',levels:'7',flats:'48',
 floorHeightModel:3.05,windowWidthModel:1.46,windowHeightModel:1.52,
 bayPitchModel:3.60,modelBays:Object.freeze([3,9,3,9]),
 buildings:Object.freeze([
  Object.freeze({id:'53865704',ruian:'18198571',nodes:5,
   hash:'680a840e',area:[410,422],edgeLengths:[12.565,33.060,12.572,33.052]}),
  Object.freeze({id:'53865910',ruian:'18198562',nodes:5,
   hash:'469f34e2',area:[410,423],edgeLengths:[12.579,33.036,12.603,33.073]}),
  Object.freeze({id:'53865911',ruian:'18198554',nodes:5,
   hash:'e771e546',area:[406,419],edgeLengths:[12.332,32.981,12.595,33.082]})
 ])
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const char of g.map(key).join(';')){
  h^=char.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const project=p=>({
 x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320
});
export function planVisnovaSevenFloorRow5219({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=VISNOVA_SEVEN_FLOOR_ROW_5219;
 const spec=c.buildings.find(b=>b.id===String(id));
 if(!spec||regionId!==c.region||
  photoReviewed!==false||approvedArchitecture!==false||
  tags?.building!=='residential'||
  tags?.['building:flats']!==c.flats||
  tags?.['building:levels']!==c.levels||
  tags?.['ref:ruian:building']!==spec.ruian||
  tags?.source!=='cuzk:ruian'||
  Object.keys(tags).length!==5||
  modelFloors!==Number(c.levels)||
  !Number.isFinite(modelHeight)||
  Math.abs(modelHeight-modelFloors*c.floorHeightModel)>.005||
  !Array.isArray(geometry)||geometry.length!==spec.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  key(geometry[0])!==key(geometry.at(-1))||
  hash(geometry)!==spec.hash)return null;
 const xy=geometry.map(project);
 let doubleArea=0;
 const facades=[];
 for(let i=0;i<spec.nodes-1;i++){
  const a=xy[i],b=xy[i+1],
   length=Math.hypot(b.x-a.x,b.z-a.z);
  doubleArea+=a.x*b.z-b.x*a.z;
  if(Math.abs(length-spec.edgeLengths[i])>.14)return null;
  // 3 short + 9 long on each 7-floor source building. Using a
  // uniform round(length/3.6) is unstable on 12.60 m end walls and
  // adds one unverified extra axis on the second RÚIAN footprint.
  const bays=c.modelBays[i];
  if(bays<3||bays>10||
   length/bays<c.windowWidthModel+.70||
   length/bays>4.4)return null;
  facades.push({
   edgeIndex:i,sourceLengthMetres:+length.toFixed(3),
   bays,windowWidthMetres:c.windowWidthModel
  });
 }
 const area=doubleArea*.5;
 if(area<spec.area[0]||area>spec.area[1])return null;
 const windows=facades.reduce((sum,f)=>sum+f.bays*modelFloors,0);
 if(windows!==168)return null;
 const centroid={
  lat:+(geometry.slice(0,-1).reduce((sum,p)=>sum+p.lat,0)/4).toFixed(7),
  lon:+(geometry.slice(0,-1).reduce((sum,p)=>sum+p.lon,0)/4).toFixed(7)
 };
 return {
  // 5.192 four-material renderer is deliberately reused WITHOUT change.
  version:'5.192',facadeCompletionVersion:'5.219',
  sourceOSMId:spec.id,sourceRUIANId:spec.ruian,
  sourceName:'Višňová eastern apartment row, original RÚIAN building',
  sourceHash:spec.hash,sourceNodes:spec.nodes,
  sourceGeometry:geometry,
  sourceReportedFloors:modelFloors,modelHeightMeters:modelHeight,
  footprintSquareMetres:+area.toFixed(3),centreGPS:centroid,
  facades,modelWindowWidthMetres:c.windowWidthModel,
  modelWindowHeightMetres:c.windowHeightModel,
  estimatedWindows:windows,expectedLongFacadeCount:4,
  suppressedGenericFacadeEdges:4,
  sourceOSMGeometryUntouched:true,sourceOSMBuildingType:'residential',
  exactWindowPositionsVerified:false,windowCountsPhotoVerified:false,
  facadeColorsPhotoVerified:false,facadeShapesPhotoVerified:false,
  balconiesModelled:0,entrancesModelled:0,
  newBuildingVolumes:0,newRoads:0,newFootways:0,newColliders:0,
  changedRoofForm:0,changedFloorCounts:0,changedOriginalOSMWays:0
 };
}
