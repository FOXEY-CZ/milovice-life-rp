// Milovice RP — safe, opt-in Panoramax PHOTO METADATA pilot.
// Metadata-only from Panoramax's documented STAC read API. No credentials,
// photo downloads, hotlinking, Mapy.com scraping, exports, or automatic 3D edits.
const API='https://api.panoramax.xyz/api/search';
const VIEWER='https://api.panoramax.xyz/';
const METERS=111320;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const nearMilovice=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&
 lat>=50.215&&lat<=50.243&&lon>=14.866&&lon<=14.900;
export const PILOT_LOCATION=Object.freeze({
 name:'Milovice — Nádražní a nádraží',lat:50.22949,lon:14.88242,radius:190,
 maxRadius:250,source:'panoramax-stac-metadata-only'
});
export function searchBox({lat=PILOT_LOCATION.lat,lon=PILOT_LOCATION.lon,radius=PILOT_LOCATION.radius}={}){
 if(!nearMilovice(lat,lon)||!Number.isFinite(radius)||radius<50||radius>PILOT_LOCATION.maxRadius)
  throw new Error('Průzkum je omezený na malou oblast Milovic (50–250 m).');
 const dLat=radius/METERS,dLon=radius/(METERS*Math.cos(lat*Math.PI/180));
 return [lon-dLon,lat-dLat,lon+dLon,lat+dLat];
}
export function buildPanoramaxSearchUrl(location=PILOT_LOCATION){
 const bbox=searchBox(location);
 const url=new URL(API);
 url.searchParams.set('bbox',bbox.map(v=>v.toFixed(7)).join(','));
 url.searchParams.set('limit','30');
 return url.toString();
}
const within=(p,b)=>p[0]>=b[0]&&p[0]<=b[2]&&p[1]>=b[1]&&p[1]<=b[3];
export function normalizedPanoramaxFeature(raw,bbox=searchBox()){
 if(!raw||raw.type!=='Feature'||typeof raw.id!=='string'||!UUID.test(raw.id))return null;
 const p=raw.geometry?.type==='Point'?raw.geometry.coordinates:null;
 if(!Array.isArray(p)||p.length<2||!p.slice(0,2).every(Number.isFinite)||!within(p,bbox))
  return null;
 const pr=raw.properties||{};
 const dt=pr.datetime||pr.datetimetz||null;
 const timestamp=typeof dt==='string'&&/^\d{4}-\d\d-\d\d/.test(dt)&&Number.isFinite(Date.parse(dt))?dt:null;
 const angle=Number(pr['view:azimuth']);
 const heading=pr['view:azimuth']!=null&&Number.isFinite(angle)?((angle%360)+360)%360:null;
 const url=new URL(VIEWER);
 url.searchParams.set('focus','pic');
 url.searchParams.set('pic',raw.id);
 const author=typeof pr['geovisio:producer']==='string'?
  pr['geovisio:producer'].slice(0,120):null;
 return {id:raw.id,lon:p[0],lat:p[1],date:timestamp,heading,
  author,viewerUrl:url.toString(),
  sequenceId:typeof raw.collection==='string'?raw.collection.slice(0,80):null,
  source:'Panoramax STAC',reviewStatus:'candidate-unreviewed'};
}
export function parsePanoramaxResponse(json,location=PILOT_LOCATION){
 // Federated api.panoramax.xyz meta-catalogue uses {features,links} with
 // no top-level "type"; individual Panoramax STAC instances return full
 // {type:"FeatureCollection",features,links}. Both are valid read responses.
 // Reject mismatched/unknown non-empty types, and never infer photos from
 // an absent "features" array.
 if(!json||!Array.isArray(json.features)||
    (json.type!==undefined&&json.type!=='FeatureCollection'))
  throw new Error('Panoramax vrátil neočekávaný formát metadat.');
 const bbox=searchBox(location),uniq=new Map();
 for(const raw of json.features.slice(0,30)){
  const item=normalizedPanoramaxFeature(raw,bbox);
  if(item)uniq.set(item.id,item);
 }
 const more=Array.isArray(json.links)&&json.links.some(l=>l.rel==='next');
 return {photos:[...uniq.values()],morePages:more,rawCount:json.features.length,
  catalogueFormat:json.type==='FeatureCollection'?'stac-feature-collection':'federated-feature-list',
  source:'https://api.panoramax.xyz/api/search',
  warning:'Kandidátní fotografie nebyly vizuálně ověřeny. GPS neprokazuje viditelnost objektu.'};
}
export async function fetchPanoramaxPilot(location=PILOT_LOCATION,{signal,fetcher=fetch}={}){
 const url=buildPanoramaxSearchUrl(location);
 const response=await fetcher(url,{method:'GET',headers:{Accept:'application/geo+json, application/json'},
  mode:'cors',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal});
 if(!response.ok)throw new Error('Panoramax HTTP '+response.status);
 return parsePanoramaxResponse(await response.json(),location);
}
