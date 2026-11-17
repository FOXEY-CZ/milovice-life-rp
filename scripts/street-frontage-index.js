// Milovice RP 5.91 / Part 20 — road-facing entrances for ordinary OSM shells.
// An entrance inferred from a mapped public road is NOT photo-verified.
// No new roads, paths, door coordinates, fences or parcel boundaries are created.
import {exteriorFacadeFrame} from './facade-anchors.js';

const ROAD_KINDS=new Set([
 'primary','secondary','tertiary','residential','unclassified',
 'living_street','service'
]);
const PRIVATE_ACCESS=new Set(['private','no']);
const UNRELIABLE_SERVICE=new Set(['parking_aisle','driveway','drive-through']);
const point=p=>({x:p?.x,z:p?.z??p?.y});
const cellKey=(x,z)=>x+','+z;

export function makeStreetFrontageIndex({cellSize=96,maxDistance=38}={}){
 if(!Number.isFinite(cellSize)||cellSize<40||cellSize>250||
    !Number.isFinite(maxDistance)||maxDistance<10||maxDistance>80)
  throw Error('Invalid city frontage index dimensions');
 const buckets=new Map();
 const metrics={mappedSegments:0,consideredBuildings:0,
  publicRoadFronts:0,unresolvedBuildings:0,privateRoadsSkipped:0,
  serviceRoadsSkipped:0,invalidRoadSegments:0,spatialCandidates:0};
 function addRoad(road){
  if(!road||!ROAD_KINDS.has(road.kind)||!Array.isArray(road.points))return 0;
  if(PRIVATE_ACCESS.has(road.access)){metrics.privateRoadsSkipped++;return 0;}
  if(road.kind==='service'&&UNRELIABLE_SERVICE.has(road.serviceTag)){
   metrics.serviceRoadsSkipped++;return 0;
  }
  let added=0;
  for(let i=1;i<road.points.length;i++){
   const a=point(road.points[i-1]),b=point(road.points[i]);
   const len=Math.hypot(b.x-a.x,b.z-a.z);
   if(!Number.isFinite(len)||len<.20||len>1500){
    metrics.invalidRoadSegments++;continue;
   }
   const gx0=Math.floor(Math.min(a.x,b.x)/cellSize),
    gx1=Math.floor(Math.max(a.x,b.x)/cellSize);
   const gz0=Math.floor(Math.min(a.z,b.z)/cellSize),
    gz1=Math.floor(Math.max(a.z,b.z)/cellSize);
   // Malformed giant OSM bounding boxes must not flood mobile memory.
   if((gx1-gx0+1)*(gz1-gz0+1)>250){
    metrics.invalidRoadSegments++;continue;
   }
   const segment={ax:a.x,az:a.z,dx:b.x-a.x,dz:b.z-a.z,
    len,len2:len*len,width:road.width||0,
    osmId:String(road.osmId??''),kind:road.kind};
   for(let gx=gx0;gx<=gx1;gx++)for(let gz=gz0;gz<=gz1;gz++){
    const key=cellKey(gx,gz);
    if(!buckets.has(key))buckets.set(key,[]);
    buckets.get(key).push(segment);
   }
   metrics.mappedSegments++;added++;
  }
  return added;
 }
 function nearbySegments(x,z){
  const seen=new Set();
  const fromX=Math.floor((x-maxDistance)/cellSize),
   toX=Math.floor((x+maxDistance)/cellSize);
  const fromZ=Math.floor((z-maxDistance)/cellSize),
   toZ=Math.floor((z+maxDistance)/cellSize);
  const found=[];
  for(let gx=fromX;gx<=toX;gx++)for(let gz=fromZ;gz<=toZ;gz++){
   for(const segment of buckets.get(cellKey(gx,gz))||[]){
    if(seen.has(segment))continue;
    seen.add(segment);found.push(segment);
   }
  }
  return found;
 }
 function select(outline,{minFacadeLength=5}={}){
  metrics.consideredBuildings++;
  if(!Array.isArray(outline)||outline.length<3){
   metrics.unresolvedBuildings++;return null;
  }
  let best=null;
  for(let i=0;i<outline.length;i++){
   const face=exteriorFacadeFrame(outline,i);
   if(!face||face.len<minFacadeLength||face.len>90)continue;
   for(const road of nearbySegments(face.mx,face.mz)){
    metrics.spatialCandidates++;
    const t=Math.max(0,Math.min(1,
     ((face.mx-road.ax)*road.dx+(face.mz-road.az)*road.dz)/road.len2));
    const nearX=road.ax+t*road.dx,nearZ=road.az+t*road.dz;
    const vx=nearX-face.mx,vz=nearZ-face.mz;
    const distance=Math.hypot(vx,vz);
    if(distance<2||distance>maxDistance)continue;
    const facing=(vx*face.nx+vz*face.nz)/distance;
    const parallel=Math.abs((face.ux*road.dx+face.uz*road.dz)/road.len);
    // A side street on the short return is not evidence of an entrance.
    if(facing<.45||parallel<.38)continue;
    if(vx*face.nx+vz*face.nz<Math.max(2,road.width*.20))continue;
    const score=distance+12*(1-facing)+8*(1-parallel)+
     (road.kind==='service'?5:0)-Math.min(face.len,20)*.025;
    const tie=road.osmId+':'+
     [face.mx,face.mz,nearX,nearZ].map(v=>v.toFixed(3)).join(':');
    if(!best||score<best.score-1e-8||
       (Math.abs(score-best.score)<=1e-8&&tie<best.tie)){
     best={...face,roadId:road.osmId,roadKind:road.kind,
      roadDistance:+distance.toFixed(2),facing:+facing.toFixed(3),
      alignment:+parallel.toFixed(3),score,tie,
      inferred:true,photographicallyVerified:false};
    }
   }
  }
  if(!best){metrics.unresolvedBuildings++;return null;}
  metrics.publicRoadFronts++;
  return best;
 }
 function summary(){return {...metrics,spatialCells:buckets.size,
  source:'actual OSM highway geometry',
  entranceEvidence:'road-facing geometry estimate, NOT a photographed door',
  syntheticRoads:0,syntheticDriveways:0,privateEntrancesInferred:0};}
 return {addRoad,select,summary};
}
