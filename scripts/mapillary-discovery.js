// Milovice RP 5.12 — evidence candidates from the official Mapillary Graph API.
// Only metadata; not a claim that a particular photograph actually shows a wall.
// User-supplied API token lives in memory only and is sent in an OAuth header.
const EARTH=111320, RAD=Math.PI/180, MAX_TILES=24;
const angle=(a,b)=>Math.abs((((a-b)+540)%360)-180);
const validCoordinate=point=>Array.isArray(point)&&point.length>=2&&
 point.every(Number.isFinite)&&Math.abs(point[0])<=90&&Math.abs(point[1])<=180;
export function distanceMeters(a,b){
 if(!validCoordinate(a)||!validCoordinate(b))return Infinity;
 const latitude=(a[0]+b[0])*.5*RAD;
 return Math.hypot((a[1]-b[1])*EARTH*Math.cos(latitude),(a[0]-b[0])*EARTH);
}
export function bearingDegrees(from,to){
 const dNorth=(to[0]-from[0])*EARTH,dEast=(to[1]-from[1])*EARTH*
  Math.cos((to[0]+from[0])*.5*RAD);
 return (Math.atan2(dEast,dNorth)/RAD+360)%360;
}
export function normalizeMapillaryImage(raw){
 const point=raw?.computed_geometry?.coordinates||raw?.geometry?.coordinates;
 if(!raw||!(/^\d{5,22}$/.test(String(raw.id||'')))||!point||
  !Number.isFinite(Number(point[0]))||!Number.isFinite(Number(point[1])))return null;
 const loc=[Number(point[1]),Number(point[0])];
 if(!validCoordinate(loc))return null;
 const heading=Number(raw.computed_compass_angle??raw.compass_angle);
 const thumb=typeof raw.thumb_256_url==='string'&&/^https:\/\//.test(raw.thumb_256_url)?raw.thumb_256_url:null;
 const uploader=(raw.creator&&typeof raw.creator==='object'?raw.creator.username:raw.creator)||'Mapillary';
 const date=Number(raw.captured_at);
 return {id:String(raw.id),point:loc,
  heading:Number.isFinite(heading)&&heading>=0&&heading<360?heading:null,
  pano:['spherical','equirectangular'].includes(raw.camera_type),
  cameraType:raw.camera_type||null,
  capturedAt:Number.isFinite(date)&&date>1000000000?date:null,
  creator:String(uploader).slice(0,80),thumbnail:thumb,
  url:'https://www.mapillary.com/app/?pKey='+String(raw.id)};
}
// Compare the camera position and its claimed heading with the real street-side
// facade; never assert visual content from position alone.
export function rankImagesForFacade(face,images,{maxDistance=85,limit=4}={}){
 if(!face||!validCoordinate(face.middle)||!validCoordinate(face.buildingCenter))return [];
 const facing=(Number(face.cardinal)+360)%360;
 const results=[];
 for(const img of images||[]){
  if(!img||!validCoordinate(img.point))continue;
  const distance=distanceMeters(img.point,face.middle);
  if(distance>maxDistance||distance<1.5)continue;
  const fromWall=bearingDegrees(face.middle,img.point);
  const side=angle(fromWall,facing);
  if(side>94)continue; // camera is likely behind another wall
  const towards=bearingDegrees(img.point,face.middle);
  const headingDifference=img.heading===null?null:angle(img.heading,towards);
  if(!img.pano&&headingDifference!==null&&headingDifference>82)continue;
  const score=100-distance*.65-side*.2-
    (headingDifference===null?(img.pano?0:19):img.pano?0:headingDifference*.38);
  results.push({...img,distance:+distance.toFixed(1),
   headingDifference:headingDifference===null?null:+headingDifference.toFixed(1),
   score:+score.toFixed(1),directionConfidence:img.pano?'360°':'odhad směru'});
 }
 return results.sort((a,b)=>b.score-a.score||
  (b.capturedAt||0)-(a.capturedAt||0)||a.id.localeCompare(b.id)).slice(0,limit);
}
// Each bbox is deliberately tiny to comply with the Graph API's restricted
// bbox size (large city-wide API requests were curtailed in 2025).
export function planStreetQueryBoxes(buildings,{cellMeters=125,padMeters=55,maxTiles=MAX_TILES}={}){
 if(!Array.isArray(buildings)||!buildings.length)return [];
 if(!Number.isFinite(cellMeters)||cellMeters<45||cellMeters>180||
    !Number.isFinite(padMeters)||padMeters<15||padMeters>80)return [];
 const tiles=new Map();
 for(const b of buildings){
  if(!validCoordinate(b?.center))continue;
  const lat=b.center[0],lon=b.center[1],cos=Math.cos(lat*RAD);
  const cellLat=cellMeters/EARTH,cellLon=cellMeters/(EARTH*cos);
  const a=Math.floor(lat/cellLat),c=Math.floor(lon/cellLon),key=a+':'+c;
  if(!tiles.has(key)){
   const midLat=(a+.5)*cellLat,midLon=(c+.5)*cellLon;
   const dLat=(cellMeters*.5+padMeters)/EARTH;
   const dLon=(cellMeters*.5+padMeters)/(EARTH*Math.cos(midLat*RAD));
   tiles.set(key,{key,bbox:[midLon-dLon,midLat-dLat,midLon+dLon,midLat+dLat]
    .map(v=>+v.toFixed(7)),buildings:[]});
  }
  tiles.get(key).buildings.push(String(b.id));
 }
 if(tiles.size>maxTiles)return null; // honest refusal, not silent partial area
 return [...tiles.values()].sort((a,b)=>a.key.localeCompare(b.key));
}
export function buildMapillaryQuery(box,{limit=200}={}){
 if(!box?.bbox||box.bbox.length!==4)throw Error('Invalid bbox');
 const url=new URL('https://graph.mapillary.com/images');
 url.searchParams.set('bbox',box.bbox.join(','));
 url.searchParams.set('fields','id,computed_geometry,geometry,computed_compass_angle,compass_angle,camera_type,captured_at,thumb_256_url,creator');
 url.searchParams.set('limit',String(Math.max(25,Math.min(200,limit))));
 return url.toString();
}
export async function fetchMapillaryImages(box,token,{signal,fetcher=fetch}={}){
 if(typeof token!=='string'||!token.trim()||token.length>500)throw Error('Mapillary API klíč chybí nebo je neplatný');
 const response=await fetcher(buildMapillaryQuery(box),{
  headers:{Authorization:'OAuth '+token.trim(),Accept:'application/json'},signal,
  mode:'cors',cache:'no-store',referrerPolicy:'no-referrer'});
 if(!response.ok){
  const suffix=response.status===401||response.status===403?' — zkontroluj oprávnění API klíče':
   response.status===429?' — limit API, zkus později':'';
  throw Error('Mapillary HTTP '+response.status+suffix);
 }
 const json=await response.json();
 if(!Array.isArray(json?.data))throw Error('Mapillary nevrátilo očekávaná metadata snímků');
 const ids=new Set(),images=[];
 for(const item of json.data){
  const photo=normalizeMapillaryImage(item);
  if(photo&&!ids.has(photo.id)){ids.add(photo.id);images.push(photo)}
 }
 return {images,morePages:!!json.paging?.next,rawCount:json.data.length};
}
export function summarizeStreetCoverage(buildings,roads,images,planFacadeViews){
 const homes=[],byImage=new Set();
 for(const building of buildings){
  const facades=planFacadeViews(building,roads);
  const faceCounts=facades.map(face=>{
   const ranked=rankImagesForFacade(face,images,{limit:3});
   for(const item of ranked)byImage.add(item.id);
   return {side:face.id,candidates:ranked.length,images:ranked};
  });
  homes.push({id:String(building.id),street:building.street,
   facades:faceCounts.length,candidateFacades:faceCounts.filter(f=>f.candidates>0).length,
   faceCounts});
 }
 return {buildings:homes,withCandidates:homes.filter(h=>h.candidateFacades>0).length,
  candidateFacades:homes.reduce((a,b)=>a+b.candidateFacades,0),
  totalFacades:homes.reduce((a,b)=>a+b.facades,0),uniqueImages:byImage.size};
}
