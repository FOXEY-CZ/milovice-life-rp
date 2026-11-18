// Milovice RP 5.131 — the REAL northbound continuation after Spojovací:
// Armádní junction -> Tyršova, not an invented extension of Spojovací.
// Mark two zebra crossings explicitly mapped as crossing:markings=zebra
// at the Armádní junction, with their OSM refuge islands left UNPAINTED.
// A nearby crossing marked "yes" but not "zebra", and a crossing tagged
// "unmarked", are deliberately NOT painted as zebra crossings.
// Existing five five-storey RUIAN homes north of Armádní remain untouched.
// The original OSM road and pedestrian geometry always takes precedence.
export const TYRSOVA_JUNCTION_SOURCES = Object.freeze({
 southRoad:'246652750',
 armadniWest:'1331897681', armadniEast:'1331897683',
 northTyrsova:'8618265', continuationTyrsova:'1331897627',
 westernSidewalk:'1046197807', easternSidewalk:'1316882852',
 westZebra:'1318462995', eastZebra:'1316882855',
 nearMarkedUnknown:'1044078125', northUnmarked:'1278749453',
 eastTerrace:Object.freeze(['61979140','61979141','61979149','61979146','61979143'])
});
const num = Number.isFinite;
const X = p => p?.x;
const Z = p => p?.z ?? p?.y;
const distance = (a,b) => Math.hypot(X(a)-X(b),Z(a)-Z(b));
const good = p => num(X(p))&&num(Z(p));
function toLine(point,points){
 let min=Infinity;
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],dx=X(b)-X(a),dz=Z(b)-Z(a);
  const ll=dx*dx+dz*dz;
  if(ll<.01)continue;
  const t=Math.max(0,Math.min(1,
   ((X(point)-X(a))*dx+(Z(point)-Z(a))*dz)/ll));
  min=Math.min(min,Math.hypot(X(point)-X(a)-t*dx,
                             Z(point)-Z(a)-t*dz));
 }
 return min;
}
function pathOK(path,min=2){
 return path&&Array.isArray(path.points)&&
  path.points.length>=min&&path.points.length<=36&&
  path.points.every(good);
}
function pavementOK(path){
 return pathOK(path)&&path.tags?.highway==='footway'&&
  path.tags?.footway==='sidewalk'&&
  path.tags?.surface==='paving_stones';
}
function zebraOK(path,id){
 return String(path?.id)===id&&pathOK(path,3)&&
  path.points.length===3&&path.tags?.highway==='footway'&&
  path.tags?.footway==='crossing'&&
  path.tags?.['crossing:markings']==='zebra'&&
  path.tags?.['crossing:island']==='yes'&&
  path.tags?.surface==='asphalt';
}
function commercialFloorPlan(ways){
 const source=TYRSOVA_JUNCTION_SOURCES.eastTerrace;
 if(!Array.isArray(ways)||ways.length<5)return null;
 const found=source.map(id=>ways.find(w=>String(w?.id)===id));
 if(found.some(w=>!w||w.tags?.building!=='residential'||
  w.tags?.['building:levels']!=='5'||
  !pathOK(w,4)||w.points.length!==5))return null;
 // Exactly mapped, abutting wall points from RUIAN — not 5 approximated
 // rectangular boxes dropped beside one another.
 for(let i=0;i<found.length-1;i++){
  const a=found[i].points,b=found[i+1].points;
  const vertices=a.some(x=>b.some(y=>distance(x,y)<.1));
  const twoShared=a.filter(x=>b.some(y=>distance(x,y)<.1)).length;
  if(!vertices||twoShared<2)return null;
 }
 return found.map(w=>({
  osmId:String(w.id),floors:5,flats:Number(w.tags['building:flats']),
  polygonVertexCount:w.points.length-1,
  source:'RUIAN-via-OSM',correctlyAbutting:true
 }));
}
function crossingBars(cross,road){
 const mid=cross.points[1];
 // The crossing's centre point is an ACTUAL Armádní OSM road node.
 if(toLine(mid,road.points)>.25)return null;
 const direction=[0,2].map(i=>{
  const point=cross.points[i],len=distance(point,mid);
  if(len<5.5||len>17)return null;
  return {ux:(X(point)-X(mid))/len,uz:(Z(point)-Z(mid))/len};
 });
 if(direction.some(d=>!d))return null;
 const opposite=direction[0].ux*direction[1].ux+
  direction[0].uz*direction[1].uz;
 if(opposite>-.92)return null;
 const roadWidths=road.width*.5;
 // The OSM crossing:island=yes proves a physical island exists, but NOT
 // its diameter. This conservative 1.8m UNPAINTED gap is a model estimate;
 // no new island mesh or traffic collision is created.
 const gap=.9,finish=roadWidths-.38;
 if(finish-gap<2.5||finish-gap>5.0)return null;
 // Five longitudinal white bars on each carriageway half; widths are
 // approximations, stripe existence from crossing:markings=zebra is not.
 const bars=[],barCount=5,barWidth=.44,barGap=.245;
 const start=-((barCount*barWidth+(barCount-1)*barGap)/2)+barWidth/2;
 let minRoadRoom=Infinity;
 for(let side=0;side<2;side++){
  const d=direction[side],normal={x:-d.uz,z:d.ux};
  for(let j=0;j<barCount;j++){
   const shift=start+j*(barWidth+barGap);
   const make=(t,l)=>({
    x:X(mid)+d.ux*t+normal.x*l,
    z:Z(mid)+d.uz*t+normal.z*l
   });
   const c=[
    make(gap,shift-barWidth*.5),make(finish,shift-barWidth*.5),
    make(finish,shift+barWidth*.5),make(gap,shift+barWidth*.5)
   ];
   // Each quad must sit on the mapped road surface; no stripes on
   // sidewalks, driveways or neighboring unrelated asphalt.
   const clearance=Math.min(...c.map(p=>roadWidths-toLine(p,road.points)));
   if(clearance<.16)return null;
   minRoadRoom=Math.min(minRoadRoom,clearance);
   bars.push({corners:c,sourceId:String(cross.id),side,
    islandGapApproximate:true,geometryEstimated:true,
    whiteStripeFromOSMZebraTag:true});
  }
 }
 return {bars,roadClearance:+minRoadRoom.toFixed(3),
  roadId:String(road.id),crossingId:String(cross.id),
  paintedBars:bars.length,unpaintedIslandGap:gap*2,
  crossingMappedZebra:true};
}
export function planTyrsovaArmJunctionZebras({
 regionId,spojovaci,tyrsovaSouth,tyrsovaNorth,
 armadniWest,armadniEast,
 westSidewalk,eastSidewalk,
 westZebra,eastZebra,markedUnknown,unmarked,
 eastTerraceBuildings
}={}){
 const ids=TYRSOVA_JUNCTION_SOURCES;
 const empty=null;
 if(regionId!=='mlada'||String(spojovaci?.id)!==ids.southRoad||
  !pathOK(spojovaci,5)||
  spojovaci.tags?.name!=='Spojovací'||
  spojovaci.tags?.highway!=='residential'||
  String(tyrsovaSouth?.id)!==ids.northTyrsova||
  !pathOK(tyrsovaSouth,3)||
  tyrsovaSouth.tags?.name!=='Tyršova'||
  tyrsovaSouth.tags?.highway!=='residential'||
  String(tyrsovaNorth?.id)!==ids.continuationTyrsova||
  !pathOK(tyrsovaNorth,2)||
  tyrsovaNorth.tags?.name!=='Tyršova'||
  tyrsovaNorth.tags?.highway!=='residential'||
  String(armadniWest?.id)!==ids.armadniWest||
  String(armadniEast?.id)!==ids.armadniEast||
  !pathOK(armadniWest,3)||!pathOK(armadniEast,3)||
  ![armadniWest,armadniEast].every(w=>
   w.tags?.name==='Armádní'&&w.tags?.surface==='asphalt'&&
   w.tags?.lanes==='2'&&w.tags?.lit==='yes'&&
   num(w.width)&&w.width>=7.5&&w.width<=8.5)||
  String(westSidewalk?.id)!==ids.westernSidewalk||
  String(eastSidewalk?.id)!==ids.easternSidewalk||
  !pavementOK(westSidewalk)||!pavementOK(eastSidewalk)||
  !zebraOK(westZebra,ids.westZebra)||
  !zebraOK(eastZebra,ids.eastZebra)||
  String(markedUnknown?.id)!==ids.nearMarkedUnknown||
  markedUnknown.tags?.['crossing:markings']!=='yes'||
  String(unmarked?.id)!==ids.northUnmarked||
  unmarked.tags?.['crossing:markings']!=='no'||
  unmarked.tags?.crossing!=='unmarked')
  return empty;
 // This is the correct network continuity. Spojovací ends in Armádní;
 // Tyršova begins at the SAME north-arm node and continues to Sportovní.
 const p=tyrsovaSouth.points,n=tyrsovaNorth.points;
 const atArm=p[0],atNext=p.at(-1);
 if(distance(atArm,armadniWest.points.at(-1))>.25||
  distance(atNext,n[0])>.25||
  distance(spojovaci.points.at(-1),armadniEast.points.at(-1))>.25||
  distance(atArm,spojovaci.points.at(-1))>35)
  return empty;
 const row=commercialFloorPlan(eastTerraceBuildings);
 if(!row)return empty;
 const west=crossingBars(westZebra,armadniWest),
  east=crossingBars(eastZebra,armadniEast);
 if(!west||!east)return empty;
 const crossings=[west,east];
 return {
  version:'5.131',
  sourceRoadToNorth:'Tyršova',
  spojoContinuingPastArmadni:false,
  streetNetworkFromOSM:true,
  originalSpojovaciId:ids.southRoad,
  namedTyrsovaWayIds:[ids.northTyrsova,ids.continuationTyrsova],
  sourceArmadniWayIds:[ids.armadniWest,ids.armadniEast],
  sourceCrossingWayIds:[ids.westZebra,ids.eastZebra],
  sourceSidewalkWayIds:[ids.westernSidewalk,ids.easternSidewalk],
  sourceEastBuildingWayIds:[...ids.eastTerrace],
  mappedFiveFloorBuildings:row,
  mappedBuildingCount:row.length,
  sourceConsecutiveTerrace:true,
  sourceSidewalkMaterials:['paving_stones','paving_stones'],
  sourceZebraMarkingTypes:['zebra','zebra'],
  sourceIslandCount:2,
  modeledIslandCount:0,
  paintedBarCount:west.paintedBars+east.paintedBars,
  paintedTriangleCount:(west.paintedBars+east.paintedBars)*2,
  drawMeshCount:2,
  paintedWhiteBarsObservedByOSMTags:true,
  exactPaintBarCountMeasured:false,
  physicalIslandDimensionsMeasured:false,
  whitePaintSurfaceHeightOffsetMeters:.185,
  markingsOnlyOnOriginalArmadniCarriageway:true,
  crossingMarkedButStyleUnspecifiedNotPainted:ids.nearMarkedUnknown,
  crossingExplicitUnmarkedNotPainted:ids.northUnmarked,
  paintedNewMarkedCrossings:0,
  inventedStreetSegments:0, inventedSidewalks:0,
  addedRoads:0,addedFootways:0,addedRoadColliders:0,
  addedBuildings:0,changedExistingBuildingFloors:0,
  newStreetLighting:0,newRandomTrees:0,
  crossingParts:crossings,
  eastBuildingRow:row
 };
}
