// Milovice RP 5.100. Streets tagged lit=yes in OSM: mapped evidence
// that the ROAD IS LIT, *not* evidence for any lamp-pole location, type,
// count, height or style. All individual posts below are MODEL ESTIMATES.
// No private ways, unknown-lit ways, paths or photo-reviewed core scenery.
const KINDS=new Set(['residential','tertiary','unclassified']);
const X=p=>p?.x,Z=p=>p?.z??p?.y;
const validPoint=p=>Number.isFinite(X(p))&&Number.isFinite(Z(p));
function centerlineAt(points,at){
 let remaining=at;
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],dx=X(b)-X(a),dz=Z(b)-Z(a);
  const len=Math.hypot(dx,dz);
  if(len<.1)continue;
  if(remaining<=len||i===points.length-1){
   const t=Math.max(0,Math.min(1,remaining/len));
   return {cx:X(a)+dx*t,cz:Z(a)+dz*t,
    tx:dx/len,tz:dz/len};
  }
  remaining-=len;
 }
 return null;
}
function sampledLength(points){
 let length=0;
 for(let i=1;i<points.length;i++){
  const dx=X(points[i])-X(points[i-1]),dz=Z(points[i])-Z(points[i-1]);
  const d=Math.hypot(dx,dz);
  if(!Number.isFinite(d)||d<.10||d>1600)return 0;
  length+=d;
 }
 return length;
}
export function isOSMLitStreet(tags={}){
 return KINDS.has(tags.highway)&&tags.lit==='yes'&&
  typeof tags.name==='string'&&tags.name.trim().length>0&&
  !['private','no'].includes(tags.access)&&
  tags.bridge!=='yes'&&tags.covered!=='yes'&&
  !(tags.tunnel&&tags.tunnel!=='no');
}
export function planMappedStreetLamps(ways,{roads,buildings,water,
 photoAllowed=()=>true,spacing=42,maxPerWay=18,maxCity=260}={}){
 const empty={version:'5.100',posts:[],placed:0,
  eligibleWays:0,sourceWayIds:[],eligibleMeters:0,
  sourceRoadsChanged:0,sourceFootwaysChanged:0,
  photoVerifiedPoles:0,estimatedIndividualLampPositions:true,
  exactPoleTypeVerified:false,roadIsLitTagEvidenced:true,
  skippedRoadCollision:0,skippedBuildingCollision:0,
  skippedWaterCollision:0,skippedPhotoReviewZone:0,
  skippedShortWays:0,ignoredNotLit:0,
  perRoad:{},maxCity,maxPerWay,spacing};
 if(!Array.isArray(ways)||!roads?.isClear||!buildings?.isClear||
  !water?.isClear||typeof photoAllowed!=='function'||
  !Number.isFinite(spacing)||spacing<26||spacing>70||
  !Number.isInteger(maxPerWay)||maxPerWay<1||maxPerWay>26||
  !Number.isInteger(maxCity)||maxCity<1||maxCity>360)return empty;
 const seen=new Set();
 const sorted=ways.slice().sort((a,b)=>
  String(a?.id??'').localeCompare(String(b?.id??''),'en',{numeric:true}));
 for(const way of sorted){
  const key=String(way?.id??'');
  if(!key||seen.has(key))continue;
  seen.add(key);
  if(!isOSMLitStreet(way?.tags)){
   empty.ignoredNotLit++;continue;
  }
  const points=way?.points;
  if(!Array.isArray(points)||points.length<2||points.length>200||
   points.some(p=>!validPoint(p))){
   empty.skippedShortWays++;continue;
  }
  const length=sampledLength(points);
  if(length<28){empty.skippedShortWays++;continue;}
  empty.eligibleWays++;
  empty.eligibleMeters+=length;
  empty.sourceWayIds.push(key);
  // Count is tied to the source way, not the order of district loads.
  // Centre-of-interval samples avoid double posts at adjacent end nodes.
  const count=Math.min(maxPerWay,Math.max(1,Math.floor(length/spacing)));
  let built=0;
  for(let i=0;i<count&&empty.posts.length<maxCity;i++){
   const here=centerlineAt(points,length*(i+.5)/count);
   if(!here)continue;
   // Follow the source OSM way orientation. Try either side and multiple
   // small public-road verge offsets; NEVER place over mapped roads/path.
   const parity=(Number(key.slice(-5))||key.length)+i;
   const first=parity%2?1:-1;
   let accepted=null;
   for(const side of [first,-first]){
    if(accepted)break;
    for(const vergeOffset of [1.35,2.05,2.80]){
     const vx=-here.tz*side,vz=here.tx*side;
     const d=3.9+vergeOffset; // 7.8m fallback residential road width.
     // If this specific source has an explicit width, prefer it.
     const sourceWidth=Number.parseFloat(way.tags.width);
     const offset=(Number.isFinite(sourceWidth)&&sourceWidth>=3&&sourceWidth<=14?
      sourceWidth*.5:3.9)+vergeOffset;
     const x=here.cx+vx*offset,z=here.cz+vz*offset;
     if(!photoAllowed(x,z,way)){
      empty.skippedPhotoReviewZone++;continue;
     }
     if(!roads.isClear(x,z,.42,.43)){
      empty.skippedRoadCollision++;continue;
     }
     if(!buildings.isClear(x,z,1.15)){
      empty.skippedBuildingCollision++;continue;
     }
     if(!water.isClear(x,z,.65,.40)){
      empty.skippedWaterCollision++;continue;
     }
     accepted={x,z,cx:here.cx,cz:here.cz,
      tx:here.tx,tz:here.tz,armX:-vx,armZ:-vz,
      side,offset,roadId:key,roadName:way.tags.name,
      regionId:way.regionId||null,
      sourceLitTag:'yes',poleHeightEstimated:5.8,
      estimated:true,photographedPole:false};
     break;
    }
   }
   if(accepted){empty.posts.push(accepted);built++;}
  }
  empty.perRoad[key]=built;
 }
 empty.placed=empty.posts.length;
 return empty;
}
