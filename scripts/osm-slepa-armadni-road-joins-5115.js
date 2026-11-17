// Milovice RP 5.115 — small road-surface corner wedges from EXACT
// OSM centerline vertices, for already rendered Slepá and Armádní roads.
// No new road geometry outside the existing estimated ribbon width.
//
// This fills the triangular inside-bend gap left by TWO straight road strips.
// Road widths are those already resolved for driving, collision and renderer.
// No extrapolation across OSM ways, intersections, crossings or private land.
const STREETS=new Set(['Slepá','Armádní']);
const REGIONS=new Set(['mlada','vrutice']);
const X=p=>p?.x,Z=p=>p?.z??p?.y;
function finite(p){return Number.isFinite(X(p))&&Number.isFinite(Z(p))}
function point(a,b,u){return {x:X(a)+u*(X(b)-X(a)),z:Z(a)+u*(Z(b)-Z(a))}}
export function planSlepaArmRoadCornerWedges(ways,{
 regionId,widths,maxWedges=120
}={}){
 const out={version:'5.115',regionId,streetNames:['Slepá','Armádní'],
  sourceWayIds:[],sourceVertexCount:0,eligibleWays:0,
  wedges:[],ignoredStraight:0,ignoredSharp:0,
  ignoredShort:0,ignoredUnsupported:0,duplicates:0,
  existingRoadCenterlinesUntouched:true,
  sourceWidthsUnchanged:true,syntheticNewRoads:0,
  inventedSidewalks:0,inventedCrossings:0,
  modelBasedOnExistingRoadWidths:true};
 if(!REGIONS.has(regionId)||!Array.isArray(ways)||
  !(widths instanceof Map)||
  !Number.isInteger(maxWedges)||maxWedges<0||maxWedges>250)return out;
 const seen=new Set();
 for(const way of ways.slice().sort((a,b)=>
  String(a?.id).localeCompare(String(b?.id),'en',{numeric:true}))){
  const id=String(way?.id??''),tags=way?.tags||{},
   pts=way?.points,width=widths.get(id);
  if(!id||seen.has(id)){out.duplicates++;continue;}
  seen.add(id);
  if(!STREETS.has(tags.name)||tags.highway!=='residential'||
   ['private','no'].includes(tags.access)||
   !Array.isArray(pts)||pts.length<3||pts.length>160||
   !pts.every(finite)||!Number.isFinite(width)||width<3||
   width>10){out.ignoredUnsupported++;continue;}
  let onWay=0;
  // Endpoints are NOT capped: another OSM road may join there and must
  // never be bridged by a guessed quadrilateral or fake intersection.
  for(let i=1;i<pts.length-1&&out.wedges.length<maxWedges;i++){
   const a=pts[i-1],v=pts[i],b=pts[i+1],
    inX=X(v)-X(a),inZ=Z(v)-Z(a),
    outX=X(b)-X(v),outZ=Z(b)-Z(v),
    l1=Math.hypot(inX,inZ),l2=Math.hypot(outX,outZ);
   out.sourceVertexCount++;
   if(l1<2.4||l2<2.4||l1>800||l2>800){
    out.ignoredShort++;continue;
   }
   const ux=inX/l1,uz=inZ/l1,vx=outX/l2,vz=outZ/l2,
    cross=ux*vz-uz*vx,dot=ux*vx+uz*vz;
   if(Math.abs(cross)<.14||dot>.985){out.ignoredStraight++;continue;}
   if(dot<-.20){out.ignoredSharp++;continue;}
   const half=width*.5,side=cross>0?-1:1,
    center={x:X(v),z:Z(v)},
    prevOuter={x:center.x-side*uz*half,z:center.z+side*ux*half},
    nextOuter={x:center.x-side*vz*half,z:center.z+side*vx*half};
   const size=.5*half*half*Math.abs(cross);
   if(size<.08||size>13){out.ignoredSharp++;continue;}
   // Triangle exactly fills a missing inside corner between the two
   // existing width-matched road ribbons. Nothing extends along roads.
   out.wedges.push({sourceWayId:id,street:tags.name,highway:'residential',
    sourceSurface:tags.surface||null,width,sourceVertexIndex:i,
    areaSquareMeters:+size.toFixed(3),
    a:prevOuter,b:nextOuter,c:center,
    modeledWidth:true,fromExistingOSMVertex:true});
   onWay++;
  }
  if(onWay){out.eligibleWays++;out.sourceWayIds.push(id);}
  if(out.wedges.length>=maxWedges)break;
 }
 return out;
}
