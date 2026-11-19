/** Milovice RP 5.170 — source-locked ground-floor survey for Topolova
 * 616–618. SIX technical camera viewpoints derived from real cadastral
 * east/west facade midpoints. Five terrain samples on each original wall.
 *
 * Does NOT infer door coordinates, pedestrian paths or photo viewpoints.
 * The 614/615 signed elevation PDFs do not survey doors at 616–618.
 */
export const TOPOLOVA_ENTRY_SURVEY_5170=Object.freeze({
 region:'mlada',buildingIds:Object.freeze(['61979144','61979139','61979145']),
 rows:Object.freeze([
  Object.freeze({address:616,id:'61979144',ruian:'22968083',hash:'ace63062'}),
  Object.freeze({address:617,id:'61979139',ruian:'22968091',hash:'43ca97b1'}),
  Object.freeze({address:618,id:'61979145',ruian:'22968105',hash:'b69a7ef6'})
 ]),
 sideEdges:Object.freeze({east:1,west:3}),
 cameraOffsetModelMetres:8,
 groundSamplesPerFace:5,
 fullHouseRowSource:'5.155',modelFacadesSource:'5.161'
});
const geoKey=p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)?
 p.lat.toFixed(7)+','+p.lon.toFixed(7):'invalid';
const geoHash=g=>{let h=2166136261;
 for(const c of g.map(geoKey).join(';')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return(h>>>0).toString(16).padStart(8,'0');
};
const distance=(a,b)=>Math.hypot((b.lat-a.lat)*111320,
 (b.lon-a.lon)*111320*Math.cos(50.226*Math.PI/180));
const round=v=>+v.toFixed(3);
const gpsRound=v=>+v.toFixed(7);
export function planTopolovaEntrySurvey5170({
 regionId,rowPlan,inferredPlan,ways
}={}){
 const S=TOPOLOVA_ENTRY_SURVEY_5170;
 if(regionId!==S.region||rowPlan?.version!==S.fullHouseRowSource||
  inferredPlan?.version!==S.modelFacadesSource||
  rowPlan.contiguousExactSharedPartyWalls!==4||
  rowPlan.visualAboveGroundLevels!==5||
  rowPlan.sourceOSMIds?.slice(2).join(',')!==S.buildingIds.join(',')||
  inferredPlan.sourceOSMIds?.join(',')!==S.buildingIds.join(',')||
  !Array.isArray(ways))return null;
 const views=[];
 for(const spec of S.rows){
  const matches=ways.filter(w=>String(w?.id)===spec.id);
  if(matches.length!==1)return null;
  const building=matches[0],g=building.geometry,t=building.tags||{};
  if(!Array.isArray(g)||g.length!==5||g.some(p=>geoKey(p)==='invalid')||
   geoKey(g[0])!==geoKey(g[4])||geoHash(g)!==spec.hash||
   t.building!=='residential'||
   t['ref:ruian:building']!==spec.ruian||
   t['building:flats']!=='10'||t.source!=='cuzk:ruian'||
   rowPlan.sourceOriginalGeometryHashes[
    rowPlan.sourceOSMIds.indexOf(spec.id)]!==spec.hash)return null;
  for(const side of ['east','west']){
   const edge=S.sideEdges[side];
   const f=inferredPlan.faces?.filter(f=>f.id===spec.id&&
    f.side===side&&f.edge===edge);
   if(f?.length!==1)return null;
   const a=g[edge],b=g[edge+1],len=distance(a,b);
   if(len<15.8||len>16.4||Math.abs(len-f[0].length)>.15)return null;
   const midpoint={lat:(a.lat+b.lat)/2,lon:(a.lon+b.lon)/2};
   const offsetLon=(side==='east'?1:-1)*S.cameraOffsetModelMetres/
    (111320*Math.cos(midpoint.lat*Math.PI/180));
   const cameraGPS={lat:gpsRound(midpoint.lat),
    lon:gpsRound(midpoint.lon+offsetLon)};
   const targetGPS={lat:gpsRound(midpoint.lat),
    lon:gpsRound(midpoint.lon)};
   views.push({address:spec.address,id:spec.id,ruian:spec.ruian,
    sourceGeometryHash:spec.hash,side,edge,length:round(len),
    cameraGPS,targetGPS,heading:side==='east'?270:90,
    cameraSource:'model-8m-offset-from-OSM-wall-midpoint',
    photoCameraVerified:false,realEntryLocationVerified:false,
    modelWindowRhythmNotPhotoVerified:true,
    sourceStart:{lat:a.lat,lon:a.lon},
    sourceEnd:{lat:b.lat,lon:b.lon}
   });
  }
 }
 if(views.length!==6)return null;
 return {version:'5.170',sourceRegionId:'mlada',
  sourceBuildingIds:S.buildingIds.slice(),
  sourceHouseNumbers:S.rows.map(r=>r.address),
  sourceRUIANIds:S.rows.map(r=>r.ruian),
  views,cameraCount:6,realSourceLongFacades:6,
  modelCameraOffsetMetres:S.cameraOffsetModelMetres,
  groundSamplesPerFace:S.groundSamplesPerFace,
  allTargetsOnOriginalOSMWalls:true,
  exactRealEntrancesUnverified:true,
  noInventedDoorOrEntrance:true,
  cadastralFootprintsUnchanged:true,
  newDoors:0,newCanopies:0,newWalkways:0,newParking:0,
  newRoads:0,newMeshes:0,newColliders:0,newLights:0,newTrees:0
 };
}
export function inspectTopolovaEntryGrade5170(plan,{toWorld,terrainAt,baseById}={}){
 if(plan?.version!=='5.170'||plan.views?.length!==6||
  typeof toWorld!=='function'||typeof terrainAt!=='function'||
  typeof baseById!=='function')return null;
 const result=[];
 for(const f of plan.views){
  const base=baseById(f.id);
  if(!Number.isFinite(base?.base)||!Number.isFinite(base?.height)||
   Math.abs(base.height-15.25)>.01)return null;
  const samples=[];
  for(let i=0;i<plan.groundSamplesPerFace;i++){
   const t=i/(plan.groundSamplesPerFace-1);
   const world=toWorld({
    lat:f.sourceStart.lat+(f.sourceEnd.lat-f.sourceStart.lat)*t,
    lon:f.sourceStart.lon+(f.sourceEnd.lon-f.sourceStart.lon)*t
   });
   if(!Number.isFinite(world?.x)||!Number.isFinite(world?.y))return null;
   const terrain=terrainAt(world.x,world.y);
   if(!Number.isFinite(terrain))return null;
   samples.push({fraction:t,ground:round(terrain),
    baseAboveGround:round(base.base-terrain)});
  }
  const vals=samples.map(s=>s.baseAboveGround);
  result.push({address:f.address,sourceOSMId:f.id,side:f.side,
   edge:f.edge,originalFaceLengthMetres:f.length,
   foundationBaseMetres:round(base.base),
   minFoundationAboveTerrainMetres:round(Math.min(...vals)),
   maxFoundationAboveTerrainMetres:round(Math.max(...vals)),
   samples,entryThresholdKnown:false,
   noPositionOfPhysicalDoorAssumed:true});
 }
 return {
  version:'5.170',sourceBuildings:3,realSampledFacades:6,
  terrainSamples:result.length*plan.groundSamplesPerFace,
  groundGradeProfiles:result,
  worstFoundationClearanceMetres:round(Math.max(
   ...result.map(f=>f.maxFoundationAboveTerrainMetres))),
  lowestFoundationClearanceMetres:round(Math.min(
   ...result.map(f=>f.minFoundationAboveTerrainMetres))),
  profileDerivedFromDEM:true,
  actualDoorHeightUnverified:true,
  actualDoorSideUnverified:true,
  proposedEntryPlatforms:0,
  modelCameraCount:6,newGeometry:0
 };
}
