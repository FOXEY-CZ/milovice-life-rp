// Local, label-controlled map from the exact checked-in OSM source ways.
// Never send coordinates to an external tile provider. No inferred road connections.
export const GAME_MAP_SOURCES=Object.freeze([
 "./data/milovice-osm.json",
 "./data/regions/mlada.json",
 "./data/regions/vrutice.json",
 "./data/regions/westlink.json",
 "./data/regions/centerlink.json",
 "./data/regions/bozidar.json"
]);
export const GAME_MAP_STYLES=Object.freeze({
 waterArea:Object.freeze({color:'#4a768e',weight:1,fillColor:'#4a768e',fillOpacity:1}),
 green:Object.freeze({color:'#294a40',weight:1,fillColor:'#294a40',fillOpacity:1}),
 building:Object.freeze({color:'#727b82',weight:.5,fillColor:'#6a747b',fillOpacity:.85}),
 waterLine:Object.freeze({color:'#4a768e',weight:2}),
 rail:Object.freeze({color:'#97958e',weight:2,dashArray:'5 4'}),
 foot:Object.freeze({color:'#667c70',weight:1,dashArray:'2 3'}),
 roadMinor:Object.freeze({color:'#a3adb1',weight:2}),
 roadMajor:Object.freeze({color:'#dfd4b8',weight:4})
});
const classes=Object.keys(GAME_MAP_STYLES);
const areaClasses=new Set(['waterArea','green','building']);
const roadClasses=new Set(['roadMinor','roadMajor']);
function classify(t){
 if(t.building&&t.building!=='no')return 'building';
 if(t.natural==='water'||t.water||t.landuse==='reservoir')return 'waterArea';
 if(t.waterway)return 'waterLine';
 if(['forest','grass','meadow','recreation_ground','village_green'].includes(t.landuse)||['wood','scrub','grassland'].includes(t.natural)||['park','garden','pitch'].includes(t.leisure))return 'green';
 if(t.railway&&['rail','light_rail','tram','narrow_gauge'].includes(t.railway))return 'rail';
 if(['footway','path','steps','cycleway','pedestrian','bridleway'].includes(t.highway))return 'foot';
 if(['motorway','trunk','primary','secondary','tertiary','motorway_link','trunk_link','primary_link','secondary_link','tertiary_link'].includes(t.highway))return 'roadMajor';
 if(['residential','living_street','unclassified','service','track','road'].includes(t.highway))return 'roadMinor';
 return null;
}
function coordinates(e){
 if(!Array.isArray(e.geometry)||e.geometry.length<2)return null;
 const pts=e.geometry.map(p=>[p?.lon,p?.lat]);
 if(pts.some(p=>!Number.isFinite(p[0])||!Number.isFinite(p[1])||Math.abs(p[0])>180||Math.abs(p[1])>90))return null;
 return pts;
}
function closed(p){return p.length>=4&&p[0][0]===p.at(-1)[0]&&p[0][1]===p.at(-1)[1]&&new Set(p.slice(0,-1).map(q=>q.join(','))).size>=3;}
function midpoint(p){
 const lengths=[];let total=0;const c=Math.cos(p[0][1]*Math.PI/180);
 for(let i=1;i<p.length;i++){const d=Math.hypot((p[i][0]-p[i-1][0])*c,p[i][1]-p[i-1][1]);lengths.push(d);total+=d;}
 if(!(total>0))return null;
 let left=total/2;
 for(let i=0;i<lengths.length;i++){const d=lengths[i];if(d>0&&left<=d){const f=left/d;return {length:total,lat:p[i][1]+(p[i+1][1]-p[i][1])*f,lon:p[i][0]+(p[i+1][0]-p[i][0])*f};}left-=d;}
 return null;
}
export function buildGameMap(snapshots,displayName){
 if(!Array.isArray(snapshots)||typeof displayName!=='function')throw new TypeError('Invalid game map inputs');
 const ways=new Map();let raw=0;
 for(const s of snapshots){
  if(!Array.isArray(s?.elements))throw new TypeError('Missing source ways');
  for(const e of s.elements){
   raw++;
   if(e?.type!=='way'||e.id==null)continue;
   const key=String(e.id),kind=classify(e.tags||{}),p=coordinates(e);
   if(!kind||!p||(areaClasses.has(kind)&&!closed(p)))continue;
   const existing=ways.get(key);
   if(!existing||p.length>existing.p.length)ways.set(key,{kind,p,name:e.tags?.name});
  }
 }
 const grouped=Object.fromEntries(classes.map(k=>[k,[]])),labelCandidates=new Map();
 for(const {kind,p,name} of ways.values()){
  grouped[kind].push(areaClasses.has(kind)?[p]:p);
  if(roadClasses.has(kind)&&typeof name==='string'){
   const label=displayName(name),m=midpoint(p);
   if(typeof label==='string'&&label&&label!==name&&m&&(!labelCandidates.has(label)||labelCandidates.get(label).length<m.length))labelCandidates.set(label,m);
  }
 }
 const features=classes.filter(k=>grouped[k].length).map(kind=>({type:'Feature',properties:{kind},geometry:{type:areaClasses.has(kind)?'MultiPolygon':'MultiLineString',coordinates:grouped[kind]}}));
 const labels=[...labelCandidates].map(([name,{lat,lon}])=>({name,lat,lon})).sort((a,b)=>a.name.localeCompare(b.name,'cs'));
 return {geojson:{type:'FeatureCollection',features},labels,stats:{raw,uniqueWays:ways.size,counts:Object.fromEntries(classes.map(k=>[k,grouped[k].length])),labels:labels.length,externalTiles:0}};
}
export async function loadGameMap(displayName,fetcher=fetch){
 const snapshots=await Promise.all(GAME_MAP_SOURCES.map(async url=>{
  const response=await fetcher(url);
  if(!response.ok)throw Error('Herní mapa: HTTP '+response.status);
  return response.json();
 }));
 return buildGameMap(snapshots,displayName);
}
