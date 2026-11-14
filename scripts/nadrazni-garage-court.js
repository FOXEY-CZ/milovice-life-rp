/**
 * Milovice RP 5.59 / REBUILD 2.0 — north Nádražní garage court.
 * OSM gives individual 3×6 m garage footprints, NOT their front-door directions.
 *
 * Never put a big garage shutter on the longest edge: those edges are mostly
 * adjoining party walls between garages. Select only short exterior edges
 * that face another, mapped garage row ACROSS a free central courtyard.
 *
 * The gate direction is still an inference, not a surveyed photo fact.
 * If the opposing courtyard row is not mapped, fail closed for this site.
 * No invented forecourt pavement, driveway, landscape or parking capacity.
 */
export const NADRAZNI_GARAGE_SITE={
  anchor:{lat:50.23040,lon:14.88345},radiusM:45,
  group:'Nádražní, northern paired garage court',
  proof:'opposite independently mapped building row, never wall length'
};
const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z);
function polygon(input){
  if(!Array.isArray(input)||input.length<4)return [];
  const p=input.map(q=>({x:Number(q.x),z:Number(q.z??q.y)}));
  if(p.some(v=>!finite(v)))return [];
  if(Math.hypot(p[0].x-p.at(-1).x,p[0].z-p.at(-1).z)<.12)p.pop();
  return p.length>=4?p:[];
}
function signedArea(p){
  return p.reduce((n,a,i)=>{
    const b=p[(i+1)%p.length];return n+a.x*b.z-b.x*a.z;
  },0)*.5;
}
function centroid(p){
  return {x:p.reduce((n,v)=>n+v.x,0)/p.length,
    z:p.reduce((n,v)=>n+v.z,0)/p.length};
}
function pointSegmentDistance(p,a,b){
  const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
  if(den<1e-6)return Math.hypot(p.x-a.x,p.z-a.z);
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/den));
  return Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);
}
function segmentsCollideWithGarageOutline(a,b,items,skipId,opposingId){
  // Valid garage gate face cannot sit on a shared party wall: the closest
  // adjoining building boundary must not coincide with the candidate edge.
  const sample=[.25,.5,.75];
  return items.some(q=>q.id!==skipId&&q.id!==opposingId&&
    sample.some(t=>{
      const p={x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t};
      let near=Infinity;
      for(let k=0;k<q.p.length;k++)
        near=Math.min(near,pointSegmentDistance(p,q.p[k],q.p[(k+1)%q.p.length]));
      return near<.17;
    }));
}
/**
 * @param {Array<{id,points,building?}>} garages: all mapped garages in one
 *    small already streamed scene. World coordinates x/z in meters.
 * @returns {Map<number,{edge,doorWidth,rowGap,opposingId,...}>}
 */
export function planNadrazniGarageCourt(garages=[]){
  const items=(Array.isArray(garages)?garages:[]).map(g=>({
    id:Number(g.id),p:polygon(g.points),
    building:g.building||'garage'
  })).filter(g=>Number.isSafeInteger(g.id)&&
    ['garage','garages'].includes(g.building)&&g.p.length===4&&
    Math.abs(signedArea(g.p))>9&&Math.abs(signedArea(g.p))<40)
    .map(g=>({...g,c:centroid(g.p),orientation:Math.sign(signedArea(g.p))}));
  const result=new Map();
  if(items.length<6)return result; // No confirmed paired large site.
  for(const g of items){
    let best=null;
    for(let i=0;i<g.p.length;i++){
      const a=g.p[i],b=g.p[(i+1)%g.p.length],dx=b.x-a.x,dz=b.z-a.z;
      const len=Math.hypot(dx,dz);
      // Door width is defined by a ~3m SHORT side, not an 6m party wall.
      if(len<2.35||len>4.1)continue;
      const nx=g.orientation*dz/len,nz=-g.orientation*dx/len;
      const mid={x:(a.x+b.x)*.5,z:(a.z+b.z)*.5};
      for(const h of items){
        if(h.id===g.id)continue;
        const vx=h.c.x-mid.x,vz=h.c.z-mid.z;
        const forward=vx*nx+vz*nz,lateral=Math.abs(vx*nz-vz*nx);
        // Two rows separated by a shared open court. Nearby units in the
        // same row (3m apart) are deliberately excluded by >=8m clearance.
        if(forward<8||forward>33||lateral>6.25)continue;
        if(segmentsCollideWithGarageOutline(a,b,items,g.id,h.id))continue;
        const score=lateral*1.4+Math.abs(forward-19.5)*.09;
        if(!best||score<best.score){
          best={id:g.id,edge:i,a,b,len,doorWidth:Math.min(2.72,len-.34),
            normal:{x:nx,z:nz},center:mid,opposingId:h.id,
            inferredRowGapM:forward,sideOffsetM:lateral,score,
            placement:'short-facade-facing-mapped-opposite-garage-row',
            precision:'approximate orientation from OSM courtyards'};
        }
      }
    }
    if(best)result.set(g.id,best);
  }
  // Require many pairings across TWO opposing rows. The nearest mapped
  // unit on the opposite side is not necessarily reciprocal when rows have
  // a staggered 3 m rhythm, so do NOT delete those legitimate garage bays.
  if(result.size<12)return new Map();
  const normals=[...result.values()].map(v=>v.normal);
  const main=normals[0];
  const forward=normals.filter(n=>n.x*main.x+n.z*main.z>.90).length;
  const backward=normals.filter(n=>n.x*main.x+n.z*main.z<-.90).length;
  if(forward<5||backward<5)return new Map();
  return result;
}
