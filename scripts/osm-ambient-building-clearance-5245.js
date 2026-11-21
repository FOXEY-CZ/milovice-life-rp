/** Milovice RP 5.245 — exact whole-segment clearance from mapped OSM
 * building footprints. Defensive geometry check for ambient NPC walkers.
 * Source polygons are used as-is; no synthetic buildings/footways are added.
 * Coordinates are world-space {x,y} (OSM 3D floor maps y to game z).
 */
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const boxOverlap=(a,b,m)=>!(a.maxX+m<b.minX||b.maxX+m<a.minX||
 a.maxY+m<b.minY||b.maxY+m<a.minY);
const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const dot=(a,b)=>a.x*b.x+a.y*b.y;
const between=(p,a,b,eps=1e-7)=>Math.min(a,b)-eps<=p&&p<=Math.max(a,b)+eps;
const onEdge=(p,a,b)=>Math.abs(cross(a,b,p))<=1e-6&&
 between(p.x,a.x,b.x)&&between(p.y,a.y,b.y);
function insidePolygon(p,pts){
 let inside=false;
 for(let i=0,j=pts.length-1;i<pts.length;j=i++){
  const a=pts[j],b=pts[i];
  if(onEdge(p,a,b))return true;
  if((a.y>p.y)!==(b.y>p.y)){
   const edgeX=a.x+(p.y-a.y)*(b.x-a.x)/(b.y-a.y);
   if(p.x<edgeX)inside=!inside;
  }
 }
 return inside;
}
function intersects(a,b,c,d){
 const ab1=cross(a,b,c),ab2=cross(a,b,d),
  cd1=cross(c,d,a),cd2=cross(c,d,b);
 if(((ab1>0&&ab2<0)||(ab1<0&&ab2>0))&&
  ((cd1>0&&cd2<0)||(cd1<0&&cd2>0)))return true;
 return (Math.abs(ab1)<1e-6&&onEdge(c,a,b))||
  (Math.abs(ab2)<1e-6&&onEdge(d,a,b))||
  (Math.abs(cd1)<1e-6&&onEdge(a,c,d))||
  (Math.abs(cd2)<1e-6&&onEdge(b,c,d));
}
function pointSegmentDistance(p,a,b){
 const d={x:b.x-a.x,y:b.y-a.y},lengthSq=dot(d,d);
 const t=lengthSq>1e-10?Math.max(0,Math.min(1,
  dot({x:p.x-a.x,y:p.y-a.y},d)/lengthSq)):0;
 return Math.hypot(p.x-a.x-d.x*t,p.y-a.y-d.y*t);
}
function segmentsDistance(a,b,c,d){
 if(intersects(a,b,c,d))return 0;
 return Math.min(pointSegmentDistance(a,c,d),
  pointSegmentDistance(b,c,d),
  pointSegmentDistance(c,a,b),
  pointSegmentDistance(d,a,b));
}
export function prepareMappedBuildingFootprints5245(buildings,toWorld){
 if(!Array.isArray(buildings)||typeof toWorld!=='function')return [];
 const out=[];
 for(const building of buildings){
  if(!building?.tags?.building||building.tags.building==='roof'||
   !Array.isArray(building.geometry)||building.geometry.length<4)continue;
  const pts=building.geometry.map(toWorld);
  if(pts.some(p=>!finite(p)))continue;
  if(Math.hypot(pts[0].x-pts.at(-1).x,pts[0].y-pts.at(-1).y)<.001)
   pts.pop();
  if(pts.length<3)continue;
  const bbox={
   minX:Math.min(...pts.map(p=>p.x)),
   maxX:Math.max(...pts.map(p=>p.x)),
   minY:Math.min(...pts.map(p=>p.y)),
   maxY:Math.max(...pts.map(p=>p.y))
  };
  // Ignore degenerate OSM outlines; the old planner also cannot interpret them.
  if((bbox.maxX-bbox.minX)*(bbox.maxY-bbox.minY)<.01)continue;
  out.push({id:String(building.id),pts,bbox});
 }
 return out;
}
export function mappedFootwayAvoidsBuildings5245(a,b,footprints,margin=.35){
 if(!finite(a)||!finite(b)||!Array.isArray(footprints)||
  !Number.isFinite(margin)||margin<.2||margin>1.2)return false;
 if(Math.hypot(b.x-a.x,b.y-a.y)<.25)return false;
 const segmentBox={minX:Math.min(a.x,b.x),maxX:Math.max(a.x,b.x),
  minY:Math.min(a.y,b.y),maxY:Math.max(a.y,b.y)};
 for(const f of footprints){
  if(!f?.bbox||!Array.isArray(f.pts)||f.pts.length<3)return false;
  if(!boxOverlap(segmentBox,f.bbox,margin))continue;
  if(insidePolygon(a,f.pts)||insidePolygon(b,f.pts))return false;
  for(let i=0,j=f.pts.length-1;i<f.pts.length;j=i++){
   if(segmentsDistance(a,b,f.pts[j],f.pts[i])<margin)return false;
  }
 }
 return true;
}
