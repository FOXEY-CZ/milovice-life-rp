// Milovice RP 5.83 — reusable OSM-driven street BLOCK facade-priority planner.
// A prioritized "hero" shell is a visual quality upgrade, not photo approval.
// Never infer fences, private drives, rooflights, shop signs or property edges.
export const MASS_STREET_583=Object.freeze({
  roadId:'219273174',junctionRoadId:'118488006',landmarkId:'118487991',
  maxBuildings:24,maxAlongM:240,maxRoadDistanceM:70,
  photoSource:'User-supplied 9 May 2022 Mapy panorama, contextual ONLY',
  evidence:'OSM footprint + building type/levels, NOT a per-building facade survey',
  photoApprovedBuildings:0
});
const finite=n=>Number.isFinite(n);
const project=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const close=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const centroid=pts=>({x:pts.reduce((n,p)=>n+p.x,0)/pts.length,
 z:pts.reduce((n,p)=>n+p.z,0)/pts.length});
function footOnSegment(p,a,b){
 const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
 if(length<.01)return null;
 const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(length*length)));
 return {distance:Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t),offset:t*length};
}
function buildChurchwardAxis(way,junction,church,maxAlongM){
 const nodes=way.geometry.map(project),jNodes=junction.geometry.map(project);
 const churchCentre=centroid(church.geometry.map(project));
 let match=null;
 for(let i=0;i<nodes.length;i++)for(const p of jNodes){
  const d=close(nodes[i],p);
  if(!match||d<match.distance)match={index:i,distance:d};
 }
 if(!match||match.distance>.75)return null;
 const origin=nodes[match.index];
 const candidates=[-1,1].map(step=>{
  const p=nodes[match.index+step];
  return p?{step,distance:close(p,churchCentre)}:null;
 }).filter(Boolean).sort((a,b)=>a.distance-b.distance);
 if(!candidates.length||candidates[0].distance>=close(origin,churchCentre)-2)return null;
 const dir=candidates[0].step;
 const polyline=[origin];
 let total=0,prev=origin;
 for(let i=match.index+dir;i>=0&&i<nodes.length;i+=dir){
  const next=nodes[i],length=close(prev,next);
  if(length<.01){prev=next;continue}
  if(total+length>maxAlongM){
   const t=(maxAlongM-total)/length;
   polyline.push({x:prev.x+(next.x-prev.x)*t,z:prev.z+(next.z-prev.z)*t});
   total=maxAlongM;break;
  }
  total+=length;polyline.push(next);prev=next;
 }
 if(polyline.length<2)return null;
 return {polyline,total,churchwardDirection:dir,
  junctionIndex:match.index,churchDistanceFromJunction:close(origin,churchCentre)};
}
function nearestAlong(p,axis){
 let total=0,best=null;
 for(let i=1;i<axis.length;i++){
  const prev=axis[i-1],next=axis[i],seg=footOnSegment(p,prev,next);
  if(seg&&(!best||seg.distance<best.distance))
   best={distance:seg.distance,along:total+seg.offset};
  total+=close(prev,next);
 }
 return best;
}
function eligibleBuilding(el,roadDistance,config){
 const t=el.tags||{},type=t.building;
 // Already independently photographed, bespoke-built 2024 landmarks:
 // do not spend the 5.83 generic-house quota on or override them.
 if(['202367194','202367254'].includes(String(el.id)))return null;
 if(!['house','residential','yes','detached','semidetached_house','terrace'].includes(type)||
    roadDistance>config.maxRoadDistanceM)return null;
 const pts=el.geometry.map(project);
 if(pts.length>4&&close(pts[0],pts.at(-1))<.10)pts.pop();
 if(pts.length<3||pts.length>(config.maxFootprintPoints??10))return null;
 const xs=pts.map(p=>p.x),zs=pts.map(p=>p.z);
 const width=Math.max(...xs)-Math.min(...xs),depth=Math.max(...zs)-Math.min(...zs);
 const levelsRaw=Number(t['building:levels']);
 const levels=finite(levelsRaw)&&levelsRaw>0?levelsRaw:2;
 if(![width,depth,levels].every(finite)||width<4||depth<4||
  width>44||depth>44||width*depth>850||levels>3)return null;
 const explicitHeight=Number(t.height);
 if(finite(explicitHeight)&&explicitHeight>12.5)return null;
 const h=finite(explicitHeight)&&explicitHeight>2?explicitHeight:levels*3.05;
 if(h<2.7||h>12.5)return null;
 return {id:String(el.id),type,levels,footprintPoints:pts.length,
  approximateHeightM:h,photoVerified:false,facadeDetailIsGeneric:true};
}
/**
 * Takes the same imported OSM ways as the game; chooses a contiguous corridor
 * from Pionýrů toward the real church, then up to 24 nearby homes
 * including adjacent residential blocks, not just exact frontages.
 * No invented position, building or object is inserted.
 */
export function planMassStreetBlock583(elements,config=MASS_STREET_583){
 if(!Array.isArray(elements)||!config||!Number.isInteger(config.maxBuildings)||
   config.maxBuildings<1||config.maxBuildings>68||!finite(config.maxAlongM)||
   !finite(config.maxRoadDistanceM))return null;
 const way=elements.find(e=>String(e.id)===config.roadId&&e.tags?.highway),
  junction=elements.find(e=>String(e.id)===config.junctionRoadId&&e.tags?.highway),
  church=elements.find(e=>String(e.id)===config.landmarkId&&e.tags?.building==='church');
 if(!way?.geometry?.length||!junction?.geometry?.length||!church?.geometry?.length)return null;
 const axis=buildChurchwardAxis(way,junction,church,config.maxAlongM);
 if(!axis)return null;
 const candidates=[];
 for(const el of elements){
  if(!el?.tags?.building||!Array.isArray(el.geometry)||el.geometry.length<4)continue;
  const center=centroid(el.geometry.map(project)),near=nearestAlong(center,axis.polyline);
  if(!near)continue;
  const detail=eligibleBuilding(el,near.distance,config);
  if(!detail)continue;
  candidates.push({...detail,alongM:Math.round(near.along*10)/10,
   roadDistanceM:Math.round(near.distance*10)/10});
 }
 // Stable deterministic order along the corridor even if the OSM export shuffles.
 candidates.sort((a,b)=>a.alongM-b.alongM||a.roadDistanceM-b.roadDistanceM||
  a.id.localeCompare(b.id,'en'));
 const prioritized=candidates.slice(0,config.maxBuildings);
 return {version:'5.83.0',street:'5. května – kostelní blok',
  roadId:config.roadId,junctionRoadId:config.junctionRoadId,
  landmarkId:config.landmarkId,source:'OSM footprints, not a facade photo survey',
  contextualPhoto:config.photoSource,
  buildingsConsidered:candidates.length,prioritizedBuildings:prioritized.length,
  priorityIds:prioritized.map(b=>b.id),
  reviewQueue:candidates,
  corridorLengthM:Math.round(axis.total*10)/10,
  churchwardDirection:axis.churchwardDirection,
  photoApprovedBuildings:0,unknownFacadesStillUnverified:true,
  guessedPropertyFences:0,guessedDriveways:0,newBuildingFootprints:0,
  roadAndFootwayGeometryModified:false,
  facadesAreProvisional:true};
}


/**
 * Mírová street 5.86: SECOND contiguous block, chosen automatically from the
 * same OSM geometry. A pair of published 2024 Wikimedia photos establishes
 * the appearance of the STREET and one exact building (202367254).
 * It does NOT verify each neighboring house or a private fence.
 */
export const MIROVA_PUBLIC_PHOTO_586=Object.freeze({
 roadId:'1331897651',maxBuildings:12,maxDistanceM:65,
 streetPhoto:'https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_(01).jpg',
 buildingPhoto:'https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_36.jpg',
 photoDate:'2024-05-30',photoAuthor:'ŠJů',license:'CC BY 4.0',
 cameraStreet:[50.2286667,14.8847222,30],
 cameraHouse:[50.2280572,14.8840981,65]
});
export function planPublicPhotoMirovaBlock586(elements,excludeIds=[],config=MIROVA_PUBLIC_PHOTO_586){
 if(!Array.isArray(elements)||(!Array.isArray(excludeIds)&&!(excludeIds instanceof Set))||
    !config||!Number.isInteger(config.maxBuildings)||
    config.maxBuildings<1||config.maxBuildings>25||
    !finite(config.maxDistanceM)||config.maxDistanceM<15||config.maxDistanceM>100)return null;
 const road=elements.find(el=>String(el.id)===config.roadId&&
  el.tags?.name==='Mírová'&&Array.isArray(el.geometry)&&el.geometry.length>=2);
 if(!road)return null;
 // Normalize from the north end, so reverse digitizing the OSM way
 // will NOT reorder the houses or cause a different next batch.
 const nodes=road.geometry[0].lat>=road.geometry.at(-1).lat?
  road.geometry:road.geometry.slice().reverse();
 const path=nodes.map(project),excluded=new Set([...excludeIds].map(String));
 const candidates=[];
 for(const el of elements){
  if(!el?.tags?.building||!Array.isArray(el.geometry)||el.geometry.length<4)continue;
  const center=centroid(el.geometry.map(project)),near=nearestAlong(center,path);
  if(!near||near.distance>config.maxDistanceM)continue;
  const result=eligibleBuilding(el,near.distance,{
   maxRoadDistanceM:config.maxDistanceM,
   // Photo-corridor buildings may have real 12- to 16-corner OSM outlines.
   // Retain those real perimeter corners instead of silently skipping them.
   maxFootprintPoints:18
  });
  if(!result||excluded.has(result.id))continue;
  candidates.push({...result,
   distanceFromRoadM:Math.round(near.distance*10)/10,
   alongM:Math.round(near.along*10)/10});
 }
 candidates.sort((a,b)=>a.alongM-b.alongM||
  a.distanceFromRoadM-b.distanceFromRoadM||a.id.localeCompare(b.id,'en'));
 const priority=candidates.slice(0,config.maxBuildings);
 return {
  version:'5.86.0',street:'Mírová – úsek k 5. května',
  roadId:config.roadId,sourceDate:config.photoDate,sourceAuthor:config.photoAuthor,
  publishedStreetSource:config.streetPhoto,
  publishedBuildingSource:config.buildingPhoto,
  cameraStreet:config.cameraStreet,cameraHouse:config.cameraHouse,
  prioritizedBuildings:priority.length,buildingsConsidered:candidates.length,
  priorityIds:priority.map(x=>x.id),reviewQueue:candidates,
  roadPolylineLengthM:Math.round(path.slice(1).reduce((sum,p,i)=>sum+close(p,path[i]),0)*10)/10,
  // Observed at street level is not the same as surveyed per-building geometry.
  photoApprovedBuildings:0,unknownFacadesStillUnverified:true,
  generatedDetailTier:'OSM-plus-neighborhood-estimate',
  allExistingOSMFootprints:true,guessedRoadSegments:0,guessedDriveways:0,
  guessedParcelBoundaries:0,streetGeometryModified:false
 };
}


/**
 * 5.87: Školská school/eastward neighborhood, third photographed street.
 * Public 2024 Commons photos prove the recognizable SCHOOL and its frontage;
 * house layouts outside those views are plausible OSM-grounded estimates.
 */
export const SKOLSKA_PUBLIC_PHOTO_587=Object.freeze({
 roadIds:['1331897640','1331897641','1331897642'],
 maxBuildings:12,minAlongM:55,maxRoadDistanceM:80,maxFootprintPoints:18,
 schoolId:'118487979',
 schoolPhoto:'https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg',
 schoolDetailPhoto:'https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka,_Masaryk%C5%AFv_cit%C3%A1t.jpg',
 photoDate:'2024-05-30',photoAuthor:'ŠJů',license:'CC BY 4.0',
 cameraSchool:[50.2286983,14.8859519,85],
 cameraDetail:[50.2283594,14.8866253,50]
});
export function planPublicPhotoSkolskaBlock587(elements,excludeIds=[],config=SKOLSKA_PUBLIC_PHOTO_587){
 if(!Array.isArray(elements)||(!Array.isArray(excludeIds)&&!(excludeIds instanceof Set))||
   !config||!Array.isArray(config.roadIds)||config.roadIds.length<2||
   !Number.isInteger(config.maxBuildings)||config.maxBuildings<1||
   config.maxBuildings>20||!finite(config.minAlongM)||config.minAlongM<0||
   !finite(config.maxRoadDistanceM)||config.maxRoadDistanceM<20||
   config.maxRoadDistanceM>100)return null;
 const paths=[];
 for(const id of config.roadIds){
  const road=elements.find(e=>String(e.id)===id&&e.tags?.highway&&
    e.tags?.name==='Školská'&&Array.isArray(e.geometry)&&e.geometry.length>=2);
  if(!road)return null;
  // Latitude decreases along this observed 2024 school corridor;
  // reversing OSM digitization cannot reverse our photo-batch ordering.
  const vertices=road.geometry[0].lat>=road.geometry.at(-1).lat?
   road.geometry:road.geometry.slice().reverse();
  const projected=vertices.map(project);
  if(paths.length&&close(paths.at(-1),projected[0])>1.0)return null;
  paths.push(...projected.slice(paths.length?1:0));
 }
 if(paths.length<4)return null;
 const excluded=new Set([...excludeIds].map(String));
 const candidates=[];
 for(const e of elements){
  // OSM building=yes could be a shed or utility structure, not a home.
  // Use specific house/residential tags rather than false-promoting these.
  if(!e?.tags?.building||!['house','residential','detached','semidetached_house','terrace'].includes(e.tags.building)||
     !Array.isArray(e.geometry)||e.geometry.length<4)continue;
  const center=centroid(e.geometry.map(project)),near=nearestAlong(center,paths);
  if(!near||near.along<config.minAlongM||near.distance>config.maxRoadDistanceM)continue;
  const house=eligibleBuilding(e,near.distance,{
   maxRoadDistanceM:config.maxRoadDistanceM,
   maxFootprintPoints:config.maxFootprintPoints
  });
  if(!house||excluded.has(house.id))continue;
  candidates.push({...house,
   alongM:Math.round(near.along*10)/10,
   roadDistanceM:Math.round(near.distance*10)/10});
 }
 candidates.sort((a,b)=>a.alongM-b.alongM||
  a.roadDistanceM-b.roadDistanceM||a.id.localeCompare(b.id,'en'));
 const selected=candidates.slice(0,config.maxBuildings);
 return {
  version:'5.87.0',street:'Školská – okolí ZŠ T. G. Masaryka',
  roadIds:[...config.roadIds],photographedSchoolOSMId:config.schoolId,
  publishedSchoolSource:config.schoolPhoto,publishedDetailSource:config.schoolDetailPhoto,
  photoDate:config.photoDate,photoAuthor:config.photoAuthor,photoLicense:config.license,
  documentedCameras:[config.cameraSchool,config.cameraDetail],
  buildingsConsidered:candidates.length,prioritizedBuildings:selected.length,
  priorityIds:selected.map(x=>x.id),reviewQueue:candidates,
  corridorLengthM:Math.round(paths.slice(1).reduce((a,p,i)=>a+close(paths[i],p),0)*10)/10,
  photoApprovedNeighborBuildings:0,
  allExistingOSMFootprints:true,schoolLandmarkPreserved:true,
  inferredHousesAreNotPhotoVerified:true,newBuildingFootprints:0,
  newRoads:0,newCrossings:0,newDriveways:0,roadOrFootwayGeometryChanged:false
 };
}


/**
 * Milovice RP 5.88 — Školská WEST, joining the station and 5. května.
 * Two 2024 public street photos of Školská × 5. května and a geotagged
 * image of Školská 220/1 document the area, but NOT every private home.
 * Buildings come only from existing OSM footprints; their unphotographed
 * facades are explicitly "inferred" and can later be corrected in bulk.
 */
export const SKOLSKA_WEST_588=Object.freeze({
 roadIds:['22880480','1331897639'],maxBuildings:8,
 maxDistanceM:56,fromM:0,toM:112,maxFootprintPoints:18,
 protectedHouseIds:['202298939'], // dedicated photographed fork gable
 photoHouseId:'118487980',
 photoHouse:'https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg',
 streetPhotos:[
  'https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_a_5._kv%C4%9Btna.jpg',
  'https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_a_5._kv%C4%9Btna_(01).jpg'
 ],
 photoDate:'2024-05-30',author:'ŠJů',license:'CC BY 4.0',
 knownPhotoCamera:[50.2290672,14.8822619]
});
export function planSkolskaWestBlock588(elements,excludeIds=[],config=SKOLSKA_WEST_588){
 if(!Array.isArray(elements)||!(Array.isArray(excludeIds)||excludeIds instanceof Set)||
   !config||!Array.isArray(config.roadIds)||config.roadIds.length<1||
   !Number.isInteger(config.maxBuildings)||config.maxBuildings<1||config.maxBuildings>20||
   !finite(config.fromM)||!finite(config.toM)||config.fromM<0||
   config.toM<=config.fromM||!finite(config.maxDistanceM)||
   config.maxDistanceM<15||config.maxDistanceM>100)return null;
 const path=[];
 for(const id of config.roadIds){
  const road=elements.find(e=>String(e.id)===id&&e.tags?.name==='Školská'&&
   e.tags?.highway&&Array.isArray(e.geometry)&&e.geometry.length>=2);
  if(!road)return null;
  const vertices=road.geometry[0].lon<=road.geometry.at(-1).lon?
   road.geometry:road.geometry.slice().reverse();
  const pts=vertices.map(project);
  if(path.length&&close(path.at(-1),pts[0])>1.0)return null;
  path.push(...pts.slice(path.length?1:0));
 }
 const excluded=new Set([...excludeIds,...config.protectedHouseIds].map(String));
 const entries=[];
 for(const e of elements){
  if(!['house','residential','detached','semidetached_house','terrace']
    .includes(e?.tags?.building)||!Array.isArray(e.geometry)||e.geometry.length<4)continue;
  const center=centroid(e.geometry.map(project)),near=nearestAlong(center,path);
  if(!near||near.along<config.fromM||near.along>config.toM||
   near.distance>config.maxDistanceM)continue;
  const candidate=eligibleBuilding(e,near.distance,{
   maxRoadDistanceM:config.maxDistanceM,
   maxFootprintPoints:config.maxFootprintPoints
  });
  if(!candidate||excluded.has(candidate.id))continue;
  entries.push({...candidate,alongM:Math.round(near.along*10)/10,
   distanceFromRoadM:Math.round(near.distance*10)/10});
 }
 entries.sort((a,b)=>a.alongM-b.alongM||
  a.distanceFromRoadM-b.distanceFromRoadM||a.id.localeCompare(b.id,'en'));
 const selected=entries.slice(0,config.maxBuildings);
 return {
  version:'5.88.0',street:'Školská — západní spojka k nádraží',
  roadIds:[...config.roadIds],prioritizedBuildings:selected.length,
  priorityIds:selected.map(e=>e.id),buildingsConsidered:entries.length,
  reviewQueue:entries,documentedHouseId:config.photoHouseId,
  sourceHouse:config.photoHouse,sourceStreetViews:[...config.streetPhotos],
  dated:config.photoDate,author:config.author,license:config.license,
  publicCameraGPS:[...config.knownPhotoCamera],
  photographedHouseAppearsInBatch:selected.some(e=>e.id===config.photoHouseId),
  protectedExistingPhotographedGable:'202298939',
  actualFootprintsOnly:true,publicPhotoDoesNotCertifyAllNeighbors:true,
  newFootprints:0,roadsChanged:false,pavementsChanged:false,
  privateDrivewaysInvented:0,crossingsInvented:0,exactTreeLocationsInvented:0
 };
}


/**
 * 5.89 — fifth contiguous neighborhood: Školská east of Pionýrů.
 * Physical building outlines/road alignments are always imported OSM.
 * A public photo of the school anchors AREA context only; it does not
 * certify these private house colours, doors, fences or plant locations.
 */
export const SKOLSKA_EAST_589=Object.freeze({
 roadIds:['1331897643','1331897644'],maxBuildings:8,
 fromM:24,toM:190,maxDistanceM:58,maxFootprintPoints:18,
 source:'https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg',
 schoolPhotoDate:'2024-05-30',photoAuthor:'ŠJů',license:'CC BY 4.0',
 technicalCamera:{lat:50.2280951,lon:14.8875431,estimatedHeading:119},
 verifiedIndividualHouseFacades:0
});
export function planSkolskaEastBlock589(elements,excludeIds=[],config=SKOLSKA_EAST_589){
 if(!Array.isArray(elements)||
    !(Array.isArray(excludeIds)||excludeIds instanceof Set)||
    !Array.isArray(config?.roadIds)||config.roadIds.length<1||
    !Number.isInteger(config.maxBuildings)||config.maxBuildings<1||config.maxBuildings>20||
    !finite(config.fromM)||!finite(config.toM)||config.fromM<0||
    config.toM<=config.fromM||!finite(config.maxDistanceM)||
    config.maxDistanceM<15||config.maxDistanceM>100)return null;
 const path=[];
 for(const id of config.roadIds){
  const road=elements.find(e=>String(e.id)===id&&e.tags?.name==='Školská'&&
   e.tags?.highway&&Array.isArray(e.geometry)&&e.geometry.length>=2);
  if(!road)return null;
  const vertices=road.geometry[0].lon<=road.geometry.at(-1).lon?
   road.geometry:road.geometry.slice().reverse();
  const pts=vertices.map(project);
  if(path.length&&close(path.at(-1),pts[0])>1)return null;
  path.push(...pts.slice(path.length?1:0));
 }
 const excluded=new Set([...excludeIds].map(String));
 const candidates=[];
 for(const e of elements){
  if(!['house','residential','detached','semidetached_house','terrace']
    .includes(e?.tags?.building)||!Array.isArray(e.geometry)||e.geometry.length<4)continue;
  const near=nearestAlong(centroid(e.geometry.map(project)),path);
  if(!near||near.along<config.fromM||near.along>config.toM||
   near.distance>config.maxDistanceM)continue;
  const detail=eligibleBuilding(e,near.distance,{
   maxRoadDistanceM:config.maxDistanceM,maxFootprintPoints:config.maxFootprintPoints
  });
  if(!detail||excluded.has(detail.id))continue;
  candidates.push({...detail,alongM:Math.round(near.along*10)/10,
   roadDistanceM:Math.round(near.distance*10)/10});
 }
 candidates.sort((a,b)=>a.alongM-b.alongM||
  a.roadDistanceM-b.roadDistanceM||a.id.localeCompare(b.id,'en'));
 const chosen=candidates.slice(0,config.maxBuildings);
 return {
  version:'5.89.0',street:'Školská — pokračování od Pionýrů na východ',
  roadIds:[...config.roadIds],priorityIds:chosen.map(x=>x.id),
  prioritizedBuildings:chosen.length,buildingsConsidered:candidates.length,
  reviewQueue:candidates,contextualPublicPhoto:config.source,
  contextualPhotoDate:config.schoolPhotoDate,photoAuthor:config.photoAuthor,
  photoLicense:config.license,photoVerifiedHouseFacades:0,
  technicalCamera:{...config.technicalCamera},technicalCameraIsPhotoAngle:false,
  existingOSMFootprintsOnly:true,streetObjectsAreEstimates:true,
  newBuildingsInvented:0,roadsChanged:false,sidewalksChanged:false,
  inventedCrossings:0,inventedPrivateDriveways:0,inventedPlotFences:0
 };
}


/**
 * 5.90 — Školská residential southeast continuation.
 * Every selected home retains its existing mapped OSM footprint.
 * Nearby public 2024 school photographs are neighborhood context ONLY.
 * The seven newly prioritized detailed shells consume the LAST seven
 * previously generic slots, retaining the 68-house mobile draw budget.
 */
export const SKOLSKA_TAIL_590=Object.freeze({
 roadIds:['1331897645'],maxBuildings:7,fromM:6,toM:110,
 maxRoadDistanceM:48,maxFootprintPoints:18,
 publicContext:'https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg',
 contextDate:'2024-05-30',photoAuthor:'ŠJů',license:'CC BY 4.0',
 technicalCamera:{lat:50.2271629,lon:14.8899405,heading:126},
 perHousePhotographicApproval:0
});
export function planSkolskaTailBlock590(elements,excludeIds=[],config=SKOLSKA_TAIL_590){
 if(!Array.isArray(elements)||!(Array.isArray(excludeIds)||excludeIds instanceof Set)||
   !Array.isArray(config?.roadIds)||config.roadIds.length!==1||
   !Number.isInteger(config.maxBuildings)||config.maxBuildings<1||config.maxBuildings>7||
   !finite(config.fromM)||!finite(config.toM)||config.fromM<0||
   config.toM<=config.fromM||!finite(config.maxRoadDistanceM)||
   config.maxRoadDistanceM<15||config.maxRoadDistanceM>80)return null;
 const road=elements.find(e=>String(e.id)===config.roadIds[0]&&
   e.tags?.name==='Školská'&&e.tags?.highway&&
   Array.isArray(e.geometry)&&e.geometry.length>=2);
 if(!road)return null;
 const direction=road.geometry[0].lon<=road.geometry.at(-1).lon?
   road.geometry:road.geometry.slice().reverse();
 const path=direction.map(project),excluded=new Set([...excludeIds].map(String));
 const candidates=[];
 for(const e of elements){
  if(!['house','residential','detached','semidetached_house','terrace']
    .includes(e?.tags?.building)||!Array.isArray(e.geometry)||e.geometry.length<4)continue;
  const near=nearestAlong(centroid(e.geometry.map(project)),path);
  if(!near||near.along<config.fromM||near.along>config.toM||
    near.distance>config.maxRoadDistanceM)continue;
  const detail=eligibleBuilding(e,near.distance,{
   maxRoadDistanceM:config.maxRoadDistanceM,
   maxFootprintPoints:config.maxFootprintPoints
  });
  if(!detail||excluded.has(detail.id))continue;
  candidates.push({...detail,
   alongM:Math.round(near.along*10)/10,
   roadDistanceM:Math.round(near.distance*10)/10});
 }
 candidates.sort((a,b)=>a.alongM-b.alongM||
  a.roadDistanceM-b.roadDistanceM||a.id.localeCompare(b.id,'en'));
 const priority=candidates.slice(0,config.maxBuildings);
 return {
  version:'5.90.0',street:'Školská — jihovýchodní pokračování',
  roadIds:[...config.roadIds],prioritizedBuildings:priority.length,
  priorityIds:priority.map(p=>p.id),buildingsConsidered:candidates.length,
  reviewQueue:candidates,
  source:config.publicContext,sourceIsNeighborhoodContextOnly:true,
  sourcePhotoDate:config.contextDate,photoAuthor:config.photoAuthor,
  photoLicense:config.license,perHousePhotographicApproval:0,
  technicalCamera:{...config.technicalCamera},
  cameraIsTechnicalOSMNotActualPhoto:true,
  allFootprintsFromOSM:true,facadesAreApproximate:true,
  roadsModified:0,walkwaysModified:0,artificialBuildings:0,
  inventedDriveways:0,inventedFences:0,inventedCrossings:0
 };
}
