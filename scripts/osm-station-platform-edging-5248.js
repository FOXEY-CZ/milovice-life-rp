/** Milovice RP 5.248 — render the existing platform curb/tactile artwork
 * ONLY along original OSM platform edges that are genuinely next to an
 * original OSM railway. A single edge may exceed 35m; its centre alone is
 * not proof that the WHOLE painted band is safe.
 *
 * Source geometry is read-only. The 0.32–0.82m tactile band is checked
 * strictly INSIDE the platform polygon, with exact segment-edge crossing
 * rejection for each <=0.7m cell. Track distance is 1-Lipschitz: a midpoint
 * distance + half-cell length proves the entire edge cell is rail-adjacent.
 * No new track, platform, crossing, traffic furniture or collision added.
 */
const xy=p=>({x:Number(p?.x),y:Number(p?.y??p?.z)});
const good=p=>Number.isFinite(p.x)&&Number.isFinite(p.y);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const between=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
const orient=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const on=(a,b,p)=>Math.min(a.x,b.x)-1e-8<=p.x&&
 p.x<=Math.max(a.x,b.x)+1e-8&&
 Math.min(a.y,b.y)-1e-8<=p.y&&p.y<=Math.max(a.y,b.y)+1e-8;
function touches(a,b,c,d){
 const o1=orient(a,b,c),o2=orient(a,b,d),
  o3=orient(c,d,a),o4=orient(c,d,b),eps=1e-8;
 if(Math.abs(o1)<eps&&on(a,b,c)||Math.abs(o2)<eps&&on(a,b,d)||
  Math.abs(o3)<eps&&on(c,d,a)||Math.abs(o4)<eps&&on(c,d,b))return true;
 return (o1>eps&&o2 < -eps||o1 < -eps&&o2>eps)&&
  (o3>eps&&o4 < -eps||o3 < -eps&&o4>eps);
}
function contains(p,poly){
 let result=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if(Math.abs(orient(a,b,p))<1e-8&&on(a,b,p))return false;
  if((a.y>p.y)!==(b.y>p.y)&&p.x<
   (b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)result=!result;
 }
 return result;
}
function insideBand(a,b,nx,ny,poly){
 const offset=(p,t)=>({x:p.x+nx*t,y:p.y+ny*t});
 // Existing artwork: width .49 around inward .57 = .325 to .815.
 // Slightly larger margin deliberately rejects any boundary touch.
 const points=[offset(a,.32),offset(b,.32),offset(b,.82),offset(a,.82)];
 if(!points.every(p=>contains(p,poly)))return false;
 for(let i=0;i<4;i++){
  const p=points[i],q=points[(i+1)%4];
  for(let j=0;j<poly.length;j++){
   if(touches(p,q,poly[j],poly[(j+1)%poly.length]))return false;
  }
 }
 return true;
}
function nearestRail(p,rails){
 let result=Infinity;
 for(const line of rails)for(let i=1;i<line.length;i++){
  const a=line[i-1],b=line[i],vx=b.x-a.x,vy=b.y-a.y,len=vx*vx+vy*vy;
  if(len<.01)continue;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*vx+(p.y-a.y)*vy)/len));
  result=Math.min(result,Math.hypot(p.x-a.x-t*vx,p.y-a.y-t*vy));
 }
 return result;
}
export function planMappedPlatformEdging5248({
 outline,tracks,maxRailDistance=5.8,resolution=.7
}={}){
 const reject=reason=>({strips:[],meters:0,sourceEdges:0,
  rejectedCells:0,reason});
 if(!Array.isArray(outline)||outline.length<4||
  !Array.isArray(tracks)||!Number.isFinite(maxRailDistance)||
  maxRailDistance<2||maxRailDistance>8||
  !Number.isFinite(resolution)||resolution<.2||resolution>.7)
  return reject('invalid-input');
 const ring=outline.map(xy);
 if(ring.some(p=>!good(p)))return reject('invalid-ring');
 if(distance(ring[0],ring.at(-1))<.1)ring.pop();
 if(ring.length<3)return reject('small-ring');
 const rails=tracks.map(line=>Array.isArray(line)?line.map(xy):[])
  .filter(line=>line.length>=2&&line.every(good));
 if(!rails.length)return reject('no-source-rails');
 let signed=0;
 for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length];
  signed+=a.x*b.y-b.x*a.y;
 }
 if(Math.abs(signed)<20)return reject('bad-area');
 const winding=Math.sign(signed),strips=[];
 let rejectedCells=0,examinedCells=0,sourceEdges=0;
 for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length],
   dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
  if(len<2||len>110)continue;
  sourceEdges++;
  const nx=winding*-dy/len,ny=winding*dx/len,
   count=Math.ceil(len/resolution),half=len/(2*count);
  let start=-1;
  const flush=end=>{
   if(start<0)return;
   const aa=between(a,b,start/count),bb=between(a,b,end/count);
   if(distance(aa,bb)>=.2)strips.push({a:aa,b:bb,
    nx,ny,sourceEdge:i,len:distance(aa,bb)});
   start=-1;
  };
  for(let k=0;k<count;k++){
   const u=between(a,b,k/count),v=between(a,b,(k+1)/count),
    mid=between(u,v,.5);
   examinedCells++;
   const safe=nearestRail(mid,rails)+half<=maxRailDistance&&
    insideBand(u,v,nx,ny,ring);
   if(safe){if(start<0)start=k;}
   else{rejectedCells++;flush(k);}
  }
  flush(count);
 }
 return {strips,meters:strips.reduce((v,s)=>v+s.len,0),
  sourceEdges,rejectedCells,examinedCells,
  originalPlatformGeometryPreserved:true,newColliders:0,
  originalRailwayGeometryPreserved:true,reason:'source-checked'};
}
