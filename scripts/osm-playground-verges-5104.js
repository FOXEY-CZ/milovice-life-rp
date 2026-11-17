// Milovice RP 5.104 — visible low grass details inside REAL OSM
// landuse=grass polygons near ordinary mapped Mladá playgrounds.
// Tufts are MODEL ESTIMATES, not documented botanical observations.
// OSM source IDs identify the four ordinary playgrounds of the Mladá
// residential estate. Unlike a streaming region label, an ID is stable
// when overlapping regional files load in either order.
const MLADA_PLAY_IDS=new Set(['1107814421','1136825314','1231190399','1468803906']);
const X=p=>p?.x, Z=p=>p?.z??p?.y;
function inside(x,z,points){
 let ok=false;
 for(let i=0,j=points.length-1;i<points.length;j=i++){
  const a=points[i],b=points[j],az=Z(a),bz=Z(b);
  if((az>z)!==(bz>z)&&x<(X(b)-X(a))*(z-az)/(bz-az)+X(a))ok=!ok;
 }
 return ok;
}
function boundaryDist(x,z,points){
 let d=Infinity;
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length],
   dx=X(b)-X(a),dz=Z(b)-Z(a),l=dx*dx+dz*dz;
  if(l<.0001)continue;
  const t=Math.max(0,Math.min(1,((x-X(a))*dx+(z-Z(a))*dz)/l));
  d=Math.min(d,Math.hypot(x-X(a)-t*dx,z-Z(a)-t*dz));
 }
 return d;
}
function seed(str){
 let x=2166136261;
 for(const c of String(str))x=Math.imul(x^c.charCodeAt(0),16777619)>>>0;
 return x||1;
}
function generator(id){
 let x=seed(id);
 return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296};
}
function nearBox(x,z,x1,z1,x2,z2,rad){
 return Math.hypot(Math.max(x1-x,0,x-x2),Math.max(z1-z,0,z-z2))<=rad;
}
export function planOSMPlaygroundLawns(lawns,playgrounds,{
 roads,buildings,water,photoAllowed=()=>true,
 maxCity=420,maxPerLawn=38,nearMeters=145
}={}){
 const result={version:'5.104',tufts:[],mappedLawns:0,
  sourceLawnIds:[],eligiblePlayAreas:0,coveredLawns:0,
  rejectedRoad:0,rejectedBuilding:0,rejectedWater:0,
  rejectedBoundary:0,rejectedPlayEquipment:0,rejectedPhoto:0,
  skippedPrivate:0,skippedUnmapped:0,source:'OSM landuse=grass',
  sourcePolygonsUntouched:true,footwaysUntouched:true,
  shrubsOrTreesInvented:0,tuftPositionsEstimated:true,
  // We display only the Mladá residential neighbourhood, not customer
  // attraction areas near Mirakulum where ground access is uncertain.
  scope:'mapped lawns near ordinary Mladá playgrounds'};
 if(!Array.isArray(lawns)||!Array.isArray(playgrounds)||
  !roads?.isClear||!buildings?.isClear||!water?.isClear||
  typeof photoAllowed!=='function'||
  !Number.isInteger(maxCity)||maxCity<0||maxCity>600||
  !Number.isInteger(maxPerLawn)||maxPerLawn<0||maxPerLawn>60||
  !Number.isFinite(nearMeters)||nearMeters<35||nearMeters>230)return result;
 const suitable=playgrounds.filter(p=>p?.tags?.leisure==='playground'&&
  MLADA_PLAY_IDS.has(String(p?.id))&&!['private','no','customers'].includes(p.tags.access)&&
  !p.tags.building&&!p.tags.playground&&Array.isArray(p.points)&&
  p.points.length>=3&&p.points.every(q=>Number.isFinite(X(q))&&Number.isFinite(Z(q))))
  .map(p=>{
   const xs=p.points.map(X),zs=p.points.map(Z);
   return {id:String(p.id),x:(Math.min(...xs)+Math.max(...xs))*.5,
    z:(Math.min(...zs)+Math.max(...zs))*.5,
    minX:Math.min(...xs),maxX:Math.max(...xs),
    minZ:Math.min(...zs),maxZ:Math.max(...zs)};
  });
 result.eligiblePlayAreas=suitable.length;
 const sorted=lawns.slice().sort((a,b)=>
  String(a?.id).localeCompare(String(b?.id),'en',{numeric:true}));
 const seen=new Set();
 for(const lawn of sorted){
  const id=String(lawn?.id??'');
  if(!id||seen.has(id))continue;
  seen.add(id);
  if(lawn?.tags?.landuse!=='grass'||
   !Array.isArray(lawn?.points)||lawn.points.length<4||
   lawn.points.length>250||lawn.points.some(p=>!Number.isFinite(X(p))||
    !Number.isFinite(Z(p)))){result.skippedUnmapped++;continue;}
  if(['private','no','customers'].includes(lawn.tags.access)){
   result.skippedPrivate++;continue;
  }
  const pts=lawn.points.slice();
  if(Math.hypot(X(pts[0])-X(pts.at(-1)),Z(pts[0])-Z(pts.at(-1)))<.05)
   pts.pop();
  if(pts.length<3)continue;
  const xs=pts.map(X),zs=pts.map(Z),x1=Math.min(...xs),
   x2=Math.max(...xs),z1=Math.min(...zs),z2=Math.max(...zs);
  let area=0;
  for(let i=0;i<pts.length;i++){
   const p=pts[i],q=pts[(i+1)%pts.length];
   area+=X(p)*Z(q)-X(q)*Z(p);
  }
  area=Math.abs(area)*.5;
  if(area<12||area>50000||x2-x1>350||z2-z1>350)continue;
  if(!suitable.some(p=>nearBox(p.x,p.z,x1,z1,x2,z2,nearMeters)))
   continue;
  result.mappedLawns++;result.sourceLawnIds.push(id);
  const target=Math.min(maxPerLawn,maxCity-result.tufts.length,
   Math.max(2,Math.floor(area/22)));
  if(target<=0)break;
  const rnd=generator('milovice-lawn-5104:'+id);
  const accepted=[];
  for(let tries=0;tries<Math.min(900,target*35)&&accepted.length<target;tries++){
   const x=x1+rnd()*(x2-x1),z=z1+rnd()*(z2-z1);
   if(!inside(x,z,pts)||boundaryDist(x,z,pts)<.70){
    result.rejectedBoundary++;continue;
   }
   // Avoid crossing an existing path, building, stream, or play surface.
   if(suitable.some(p=>nearBox(x,z,p.minX-3.5,p.minZ-3.5,
    p.maxX+3.5,p.maxZ+3.5,0))){
    result.rejectedPlayEquipment++;continue;
   }
   if(!photoAllowed(x,z,lawn)){result.rejectedPhoto++;continue;}
   if(!roads.isClear(x,z,.45,.38)){result.rejectedRoad++;continue;}
   if(!buildings.isClear(x,z,.65)){result.rejectedBuilding++;continue;}
   if(!water.isClear(x,z,.65,.35)){result.rejectedWater++;continue;}
   if(accepted.some(p=>Math.hypot(p.x-x,p.z-z)<1.1))continue;
   const height=.16+rnd()*.25;
   const spread=.13+rnd()*.16;
   accepted.push({x,z,height,spread,yaw:rnd()*Math.PI*2,
    sourceLawnId:id,positionEstimated:true});
  }
  if(accepted.length){result.coveredLawns++;result.tufts.push(...accepted);}
  if(result.tufts.length>=maxCity)break;
 }
 return result;
}
