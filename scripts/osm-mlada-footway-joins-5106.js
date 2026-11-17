// Milovice RP 5.106 — seal the *triangular gaps at corners* of
// EXISTING OSM residential-estate footways, without adding paths.
// Source way IDs and all original vertices remain unchanged.
// Each patch is the tiny missing wedge of two rectangular path segments;
// crossings over roads, private paths and photographed old town are skipped.
const X=p=>p?.x,Z=p=>p?.z??p?.y;
const ORIGIN={x:-2252.6848978163475,z:-508.2592900001275,
 sourceId:'1468803906'};
function finite(p){return Number.isFinite(X(p))&&Number.isFinite(Z(p))}
export function planMladaFootwayCorners(ways,{roads,buildings,
 maxDistance=140,maxTriangles=220}={}){
 const plan={version:'5.106',source:'OSM highway=footway/path',
  sourceAnchorId:ORIGIN.sourceId,
  mappedEligibleWays:0,sourceWayIds:[],sealedCorners:0,
  triangles:[],skippedNearCarriageway:0,
  skippedNearBuilding:0,skippedPhotoOrPrivate:0,
  skippedStraightOrSharp:0,skippedCrossings:0,
  originalWayNodesUnchanged:true,syntheticNewWalkways:0,
  inventedZebraStripes:0,estimatedPathWidths:true};
 if(!Array.isArray(ways)||!roads?.isClear||!buildings?.isClear||
  !Number.isFinite(maxDistance)||maxDistance<50||maxDistance>250||
  !Number.isInteger(maxTriangles)||maxTriangles<0||maxTriangles>600)return plan;
 const used=new Set();
 for(const way of ways.slice().sort((a,b)=>String(a.id).localeCompare(
  String(b.id),'en',{numeric:true}))){
  const id=String(way?.id??''),tags=way?.tags||{},
   kind=tags.highway;
  if(!id||used.has(id))continue;
  used.add(id);
  if(tags.footway==='crossing'){plan.skippedCrossings++;continue;}
  if(!['footway','path'].includes(kind)||!Array.isArray(way?.points)||
   way.points.length<3||way.points.length>170||
   !way.points.every(finite))continue;
  if(['private','customers','no'].includes(tags.access)){
   plan.skippedPhotoOrPrivate++;continue;
  }
  const width=kind==='footway'?1.8:1.65,half=width*.5,
   pts=way.points;
  const cornerTris=[];
  for(let i=1;i<pts.length-1;i++){
   const p=pts[i],before=pts[i-1],after=pts[i+1],
    px=X(p),pz=Z(p),ax=X(before),az=Z(before),
    bx=X(after),bz=Z(after);
   if(Math.hypot(px-ORIGIN.x,pz-ORIGIN.z)>maxDistance)continue;
   const la=Math.hypot(px-ax,pz-az),
    lb=Math.hypot(bx-px,bz-pz);
   if(la<2||lb<2||la>600||lb>600)continue;
   const ux=(px-ax)/la,uz=(pz-az)/la,
    vx=(bx-px)/lb,vz=(bz-pz)/lb,
    cross=ux*vz-uz*vx,dot=ux*vx+uz*vz;
   if(Math.abs(cross)<.13||dot<-.68){
    plan.skippedStraightOrSharp++;continue;
   }
   // At a left turn, incoming/outgoing rectangular butt caps leave
   // a wedge on the RIGHT. Reverse the side at a right turn.
   const side=cross>0?-1:1;
   const a={x:px+side*-uz*half,z:pz+side*ux*half},
    b={x:px+side*-vz*half,z:pz+side*vx*half},
    c={x:px,z:pz};
   const center={x:(a.x+b.x+c.x)/3,z:(a.z+b.z+c.z)/3};
   // The road detector is carriageway-only: NEVER reject a corner for
   // belonging to its own legitimate footway.
   if(![a,b,c,center].every(q=>roads.isClear(q.x,q.z,.07,.06))){
    plan.skippedNearCarriageway++;continue;
   }
   if(![a,b,c,center].every(q=>buildings.isClear(q.x,q.z,.10))){
    plan.skippedNearBuilding++;continue;
   }
   cornerTris.push({sourceWayId:id,atNode:i,
    a,b,c,width,area:.5*half*half*Math.abs(cross),
    materialSource:tags.surface||null,
    estimatedWidth:true,onlyFillsExistingPathBend:true});
  }
  if(cornerTris.length){
   plan.sourceWayIds.push(id);
   plan.mappedEligibleWays++;
   for(const tri of cornerTris){
    if(plan.triangles.length>=maxTriangles)break;
    plan.triangles.push(tri);
   }
  }
  if(plan.triangles.length>=maxTriangles)break;
 }
 plan.sealedCorners=plan.triangles.length;
 return plan;
}
