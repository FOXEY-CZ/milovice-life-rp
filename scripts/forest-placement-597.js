// Milovice RP 5.97 — stable, OSM-source-limited forest and park tree layout.
// The polygon is mapped; individual trees, crowns, ages and spacing are NOT
// surveyed. Instanced placement never alters map ways, terrain or colliders.
const X=p=>p.x, Z=p=>p.z??p.y;
function insidePolygon(x,z,points){
 let inside=false;
 for(let i=0,j=points.length-1;i<points.length;j=i++){
  const a=points[i],b=points[j],az=Z(a),bz=Z(b);
  if((az>z)!==(bz>z)&&x<(b.x-a.x)*(z-az)/(bz-az)+a.x)inside=!inside;
 }
 return inside;
}
function seedFor(text){
 let seed=2166136261;
 for(const ch of String(text)){
  seed=Math.imul(seed^ch.charCodeAt(0),16777619)>>>0;
 }
 return seed||1;
}
function seededRandom(id){
 let state=seedFor(id);
 return ()=>{
  state=(Math.imul(state,1664525)+1013904223)>>>0;
  return state/4294967296;
 };
}
function validZone(z){
 return z&&['forest','park'].includes(z.kind)&&
  z.allowPlants!==false&&Array.isArray(z.points)&&
  z.points.length>=3&&z.points.length<=400&&
  z.points.every(p=>Number.isFinite(X(p))&&Number.isFinite(Z(p)))&&
  Number.isFinite(z.area)&&z.area>=75;
}
function sourceId(z){
 if(z.id!==undefined&&z.id!==null)return String(z.id);
 const p=z.points[0];
 return 'unlabelled:'+Math.round(p.x*10)+':'+Math.round(Z(p)*10)+':'+Math.round(z.area);
}
export function planOSMForestTreeInstances(zones,allow=()=>true,{
 maxCity=620,maxPerZone=34,minSpacing=5.4
}={}){
 const empty={version:'5.97',trees:[],byOsmId:{},sourcePolygonIds:[],
  sourcePolygonCount:0,planted:0,rejectedBySafety:0,
  rejectedBySpacing:0,rejectedOutsidePolygon:0,skippedPrivate:0,
  budget:maxCity,maxPerZone,syntheticPolygons:0,
  inferredIndividualTreePositions:true,source:'mapped OSM forest/park polygons'};
 if(!Array.isArray(zones)||typeof allow!=='function'||
  !Number.isInteger(maxCity)||maxCity<0||maxCity>620||
  !Number.isInteger(maxPerZone)||maxPerZone<0||maxPerZone>70||
  !Number.isFinite(minSpacing)||minSpacing<3||minSpacing>12)return empty;
 const mapped=new Map();
 for(const zone of zones||[]){
  if(zone?.allowPlants===false){empty.skippedPrivate++;continue}
  if(!validZone(zone))continue;
  const id=sourceId(zone);
  // Regional extracts overlap; the same mapped OSM polygon is one source.
  if(!mapped.has(id))mapped.set(id,{...zone,id});
 }
 const sorted=[...mapped.values()].sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}));
 const trees=[],spatial=new Map(),cell=minSpacing;
 const cellKey=(x,z)=>Math.floor(x/cell)+','+Math.floor(z/cell);
 const spacingOK=(x,z)=>{
  const cx=Math.floor(x/cell),cz=Math.floor(z/cell);
  for(let ix=cx-1;ix<=cx+1;ix++)for(let iz=cz-1;iz<=cz+1;iz++){
   for(const p of spatial.get(ix+','+iz)||[])
    if((x-p.x)**2+(z-p.z)**2<minSpacing**2)return false;
  }
  return true;
 };
 for(const zone of sorted){
  if(trees.length>=maxCity)break;
  const xs=zone.points.map(X),zs=zone.points.map(Z);
  const minX=Math.min(...xs),maxX=Math.max(...xs),
   minZ=Math.min(...zs),maxZ=Math.max(...zs);
  if(maxX-minX<.8||maxZ-minZ<.8)continue;
  const density=zone.kind==='forest'?700:1500;
  const target=Math.min(maxPerZone,maxCity-trees.length,
   Math.max(1,Math.floor(zone.area/density)));
  const rnd=seededRandom(zone.id+':'+zone.kind);
  let placed=0;
  // Exact OSM polygon test; no coordinate sampling beyond source geometry.
  const attempts=Math.min(1000,Math.max(32,target*24));
  for(let i=0;i<attempts&&placed<target;i++){
   const x=minX+rnd()*(maxX-minX),z=minZ+rnd()*(maxZ-minZ);
   if(!insidePolygon(x,z,zone.points)){empty.rejectedOutsidePolygon++;continue}
   if(!spacingOK(x,z)){empty.rejectedBySpacing++;continue}
   if(!allow(x,z,zone)){empty.rejectedBySafety++;continue}
   const height=3.2+rnd()*2.6,spread=2+rnd()*1.4,yaw=rnd()*Math.PI*2;
   trees.push({x,z,height,spread,yaw,osmId:zone.id,kind:zone.kind,
    positionEstimated:true});
   const key=cellKey(x,z);
   if(!spatial.has(key))spatial.set(key,[]);
   spatial.get(key).push({x,z});
   placed++;
  }
  empty.byOsmId[zone.id]=placed;
  empty.sourcePolygonIds.push(zone.id);
 }
 return {...empty,trees,planted:trees.length,
  sourcePolygonCount:empty.sourcePolygonIds.length};
}
