// Milovice RP 5.95: source-tagged one-sided sidewalk infill.
// Source: highway=residential with explicit sidewalk=left|right|both.
// Offset/width are modeling estimates, never a survey of curb coordinates.
// Do not fabricate flanking sidewalks for sidewalk=separate/no/unknown ways.
import {safePedestrianPieces} from './reality-walkways.js';

const TAGGED_ROADS=new Set(['residential','unclassified','tertiary','living_street']);
const PRIVACY=new Set(['private','no']);
const X=p=>p.x,Z=p=>p.z??p.y;
const sq=n=>n*n;
const key=(x,z)=>x+','+z;
function closestDist2(x,z,a,b){
 const dx=b.x-a.x,dz=b.z-a.z;
 const t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz||1)));
 return sq(x-a.x-t*dx)+sq(z-a.z-t*dz);
}
function inside(x,z,pts){
 let yes=false;
 for(let i=0,j=pts.length-1;i<pts.length;j=i++){
  const p=pts[i],q=pts[j];
  if((p.z>z)!==(q.z>z)&&x<(q.x-p.x)*(z-p.z)/(q.z-p.z)+p.x)
   yes=!yes;
 }
 return yes;
}
export function makeSidewalkBuildingGuard({cellSize=64}={}){
 if(!Number.isFinite(cellSize)||cellSize<32||cellSize>200)
  throw Error('Sidewalk guard grid must stay bounded');
 const buckets=new Map(),known=new Set();
 const stats={buildings:0,geometryRejected:0,cells:0,proximityQueries:0};
 function add(osmId,geometry){
  const id=String(osmId??'');
  if(id&&known.has(id))return false;
  if(!Array.isArray(geometry)||geometry.length<3||geometry.length>200){
   stats.geometryRejected++;return false;
  }
  const pts=geometry.map(p=>({x:X(p),z:Z(p)}));
  if(pts.some(p=>![p.x,p.z].every(Number.isFinite))){
   stats.geometryRejected++;return false;
  }
  if(pts.length>3&&Math.hypot(pts[0].x-pts.at(-1).x,
   pts[0].z-pts.at(-1).z)<.01)pts.pop();
  if(pts.length<3)return false;
  const minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),
   minZ=Math.min(...pts.map(p=>p.z)),maxZ=Math.max(...pts.map(p=>p.z));
  const gx0=Math.floor((minX-3)/cellSize),gx1=Math.floor((maxX+3)/cellSize),
   gz0=Math.floor((minZ-3)/cellSize),gz1=Math.floor((maxZ+3)/cellSize);
  if((gx1-gx0+1)*(gz1-gz0+1)>100){
   stats.geometryRejected++;return false;
  }
  const poly={id,pts,minX,maxX,minZ,maxZ};
  for(let gx=gx0;gx<=gx1;gx++)for(let gz=gz0;gz<=gz1;gz++){
   const k=key(gx,gz);
   if(!buckets.has(k))buckets.set(k,[]);
   buckets.get(k).push(poly);
  }
  if(id)known.add(id);
  stats.buildings++;stats.cells=buckets.size;
  return true;
 }
 function isClear(x,z,radius=1){
  if(![x,z,radius].every(Number.isFinite)||radius<0||radius>3)return false;
  stats.proximityQueries++;
  const cell=buckets.get(key(Math.floor(x/cellSize),Math.floor(z/cellSize)))||[];
  const r2=radius*radius;
  for(const poly of cell){
   if(x<poly.minX-radius||x>poly.maxX+radius||
      z<poly.minZ-radius||z>poly.maxZ+radius)continue;
   if(inside(x,z,poly.pts))return false;
   for(let i=0;i<poly.pts.length;i++)
    if(closestDist2(x,z,poly.pts[i],poly.pts[(i+1)%poly.pts.length])<=r2)
     return false;
  }
  return true;
 }
 function reset(){
  buckets.clear();known.clear();
  for(const k of Object.keys(stats))stats[k]=0;
 }
 return {add,isClear,reset,summary:()=>({...stats})};
}
function unitEdge(a,b){
 const dx=X(b)-X(a),dz=Z(b)-Z(a),len=Math.hypot(dx,dz);
 if(!Number.isFinite(len)||len<.15||len>800)return null;
 return {ux:dx/len,uz:dz/len,len};
}
function offsetLine(points,offset,side){
 const edges=[];
 for(let i=1;i<points.length;i++){
  const e=unitEdge(points[i-1],points[i]);
  if(!e)return null;
  // Map world Z increases south. Left of a northbound OSM way is west.
  edges.push({nx:e.uz*side,nz:-e.ux*side});
 }
 return points.map((p,i)=>{
  const prev=edges[Math.max(0,i-1)],next=edges[Math.min(edges.length-1,i)];
  const vx=prev.nx+next.nx,vz=prev.nz+next.nz;
  const n=Math.hypot(vx,vz);
  const mx=n>.01?vx/n:next.nx,mz=n>.01?vz/n:next.nz;
  const dot=mx*next.nx+mz*next.nz;
  const distance=dot>.70?Math.min(offset/dot,offset*1.35):offset;
  return {x:X(p)+mx*distance,z:Z(p)+mz*distance};
 });
}
export function planOSMTaggedSidewalk({tags={},points,roadWidth,roads,buildings,
 sidewalkWidth=1.55,roadGap=.34,resolution=.62}={}){
 const empty={pieces:[],mappedRoadId:null,tag:tags.sidewalk||null,estimated:true};
 if(!TAGGED_ROADS.has(tags.highway)||PRIVACY.has(tags.access)||
   !['left','right','both'].includes(tags.sidewalk)||
   !Array.isArray(points)||points.length<2||points.length>120||
   !Number.isFinite(roadWidth)||roadWidth<3||roadWidth>18||
   !Number.isFinite(sidewalkWidth)||sidewalkWidth<1.2||sidewalkWidth>2.5||
   !Number.isFinite(roadGap)||roadGap<.23||roadGap>.7||
   !roads||typeof roads.isClear!=='function'||
   !buildings||typeof buildings.isClear!=='function')return empty;
 const distance=roadWidth*.5+roadGap+sidewalkWidth*.5;
 const sides=tags.sidewalk==='both'?[1,-1]:[tags.sidewalk==='left'?1:-1];
 const isClear={isClear:(x,z,radius,buffer)=>
  roads.isClear(x,z,radius,buffer)&&
  buildings.isClear(x,z,radius+Math.max(.18,buffer))};
 const pieces=[];
 for(const side of sides){
  const line=offsetLine(points,distance,side);
  if(!line)continue;
  for(let i=1;i<line.length;i++){
   const raw=safePedestrianPieces(line[i-1],line[i],sidewalkWidth,isClear,{
    resolution,buffer:.14
   });
   for(const p of raw){
    const len=Math.hypot(p.b.x-p.a.x,p.b.z-p.a.z);
    // Reject intersection fragments / driveway slivers: they look like
    // floating sidewalk tiles and provide no continuous pedestrian path.
    if(len<2.5)continue;
    pieces.push({...p,width:sidewalkWidth,side:side>0?'left':'right',
     meters:len});
   }
  }
 }
 return {pieces,tag:tags.sidewalk,estimated:true,source:'OSM sidewalk=*',
  actualFootwayVertices:false,roadCenterlineMoved:false,
  physicalSidewalkWidthSurveyed:false,syntheticRoads:0,
  meters:pieces.reduce((n,p)=>n+p.meters,0)};
}
