// Milovice RP 5.121 — finished Poliklinika frontage on the real OSM wall.
// Public photos establish a glazed ground-floor entrance with a teal
// canopy. Exact doorway bay, dimensions, railing and survey coordinates
// are NOT established and are recorded as model estimates.
export const CLINIC_FRONT_SOURCES=Object.freeze({
  clinicWayId:'1057548624',roadWayId:'246652750',
  photo:'https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice',
  secondPhoto:'https://www.remax-czech.cz/reality/detail/423323/pronajem-komercniho-prostoru-41-m2-milovice',
  observed:'white columns, full glazed commercial bays, teal-covered ground-floor portal'
});
const vec=p=>({x:p?.x,z:p?.z??p?.y});
const ok=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.z);
function closestSegmentDistance(p,path){
 let best=Infinity;
 for(let i=1;i<path.length;i++){
  const a=vec(path[i-1]),b=vec(path[i]);
  if(!ok(a)||!ok(b))return Infinity;
  const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
  if(den<.01)continue;
  const t=Math.min(1,Math.max(0,
   ((p.x-a.x)*dx+(p.z-a.z)*dz)/den));
  best=Math.min(best,Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz));
 }
 return best;
}
function polygonArea(ring){
 let twice=0;
 for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length];
  twice+=a.x*b.z-b.x*a.z;
 }
 return Math.abs(twice)/2;
}
export function planClinicPhotoEntry({
 id,regionId,tags={},polygon=[],front,
 sourceRoad=null,floors=0,modelHeight=0,
 photoReviewed=false,approvedArchitecture=false
}={}){
 if(String(id)!==CLINIC_FRONT_SOURCES.clinicWayId||
  regionId!=='mlada'||photoReviewed||approvedArchitecture||
  tags.name!=='Poliklinika Milovice'||tags.building!=='yes'||
  tags.amenity!=='clinic'||tags.healthcare!=='clinic'||
  tags.height!==undefined||tags['building:levels']!==undefined||
  ['private','no'].includes(tags.access)||floors!==4||
  modelHeight<12.6||modelHeight>13.2||
  !Array.isArray(polygon)||polygon.length!==4||
  polygon.some(p=>!ok(vec(p)))||!front||
  front.index!==2||!Number.isFinite(front.len)||
  front.len<44.4||front.len>45.3||
  ![front.mx,front.mz,front.ux,front.uz,front.nx,front.nz]
   .every(Number.isFinite)||
  Math.hypot(front.ux,front.uz)<.99||
  Math.hypot(front.nx,front.nz)<.99||
  Math.abs(front.ux*front.nx+front.uz*front.nz)>.01||
  front.nx<.95||Math.abs(front.nz)>.2||
  !sourceRoad||String(sourceRoad.osmId)!==
   CLINIC_FRONT_SOURCES.roadWayId||
  sourceRoad.kind!=='residential'||sourceRoad.name!=='Spojovací'||
  !Array.isArray(sourceRoad.points)||sourceRoad.points.length<2)return null;
 const poly=polygon.map(vec);
 const area=polygonArea(poly);
 if(area<805||area>850)return null;
 const roadDistance=closestSegmentDistance(
  {x:front.mx,z:front.mz},sourceRoad.points);
 if(!(roadDistance>10&&roadDistance<30))return null;
 // Current 5.118 facade grid uses ~5.5m bays, giving 8 bays.
 // Visible teal canopy exists, but its exact bay is not surveyed.
 const bays=Math.max(5,Math.min(10,Math.round(front.len/5.5)));
 const bayIndex=Math.floor(bays/2);
 const pitch=front.len/bays;
 const along=(bayIndex+.5-bays/2)*pitch;
 const entryWidth=Math.min(2.65,pitch*.66);
 if(Math.abs(along)+entryWidth*.5>front.len/2-.6)return null;
 const x=front.mx+front.ux*along,z=front.mz+front.uz*along;
 return {
  sourceWayId:String(id),streetWayId:String(sourceRoad.osmId),
  photoSource:CLINIC_FRONT_SOURCES.photo,
  photoSecondarySource:CLINIC_FRONT_SOURCES.secondPhoto,
  faceIndex:front.index,bays,bayIndex,along,
  center:{x,z},photoEntranceSurveyed:false,
  modelHeightMetres:modelHeight,observedFourRows:true,
  canopy:{width:Math.min(3.5,pitch*.82),projection:1.12,
   heightAboveFoundation:2.78,colour:'teal'},
  entrance:{width:entryWidth,topAboveFoundation:2.61,
   photographicStyle:'glass with white frame',
   usableWalkingPortal:false},
  facadeAdjacentRoadDistanceMetres:+roadDistance.toFixed(2),
  originalGeometryUntouched:true,
  roadGeometryChanged:false,parkingPolygonsCreated:0,
  inferredOutdoorSteps:0,newFootpaths:0,
  exactBayUnknown:true,estimatedCanopyDimensions:true
 };
}
