// Milovice RP 5.4.0 - deterministic street parking based on mapped OSM ways.
// Only mapped outdoor parking polygons and eligible public access/service streets.
// No fictitious "real" parking lots are asserted where OSM has no surface lots.
const sq=(x)=>x*x;
function rng(seed){let x=seed>>>0;return ()=>((x=(Math.imul(x,1664525)+1013904223)>>>0)/4294967296)}
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function contained(p,poly){
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if(((a.y>p.z)!==(b.y>p.z))&&p.x<(b.x-a.x)*(p.z-a.y)/(b.y-a.y)+a.x)inside=!inside;
 }
 return inside;
}
export function planMiloviceParking(segments,lots,{center,limit=12,seed=41,occupied=[]}={}){
 const random=rng((seed^Math.floor((center?.x||0)*171)^Math.floor((center?.z||0)*1337))>>>0);
 const out=[],blocked=[...occupied];
 const near=(x,z)=>!center||Math.hypot(x-center.x,z-center.z)<740;
 function available(spot){
  return near(spot.x,spot.z)&&blocked.every(p=>Math.hypot(p.x-spot.x,p.z-spot.z)>8.2);
 }
 function push(spot){
  if(!available(spot))return false;
  out.push(spot);blocked.push(spot);return true;
 }
 // On mapped SURFACE parking lots, place cars within boundaries, in parallel rows.
 // Exclude multi-storey parking buildings; they need indoor 3D parking physics.
 const surface=[...(lots||[])].filter(l=>l.points?.length>3&&l.type==='surface');
 for(const lot of surface){
  if(out.length>=limit)break;
  const cx=lot.points.reduce((s,p)=>s+p.x,0)/lot.points.length;
  const cz=lot.points.reduce((s,p)=>s+p.y,0)/lot.points.length;
  if(!near(cx,cz))continue;
  const edges=lot.points.map((p,i)=>{const q=lot.points[(i+1)%lot.points.length];return {dx:q.x-p.x,dz:q.y-p.y,len:Math.hypot(q.x-p.x,q.y-p.y)}})
   .filter(e=>e.len>=4).sort((a,b)=>b.len-a.len);
  if(!edges.length)continue;
  const edge=edges[0],ux=edge.dx/edge.len,uz=edge.dz/edge.len,nx=-uz,nz=ux;
  const yaw=Math.atan2(-ux,-uz);
  for(let row of [-1,0,1])for(let spot=-2;spot<=2;spot++){
   const x=cx+ux*spot*6.1+nx*row*4.2,z=cz+uz*spot*6.1+nz*row*4.2;
   if(!contained({x,z},lot.points))continue;
   if(push({x,z,yaw:yaw+(row===-1?Math.PI:0),type:'mapped-surface-parking',sourceId:lot.id})&&out.length>=limit)break;
  }
 }
 // Roadside and public service access slots. Keep 8+m separation, avoid
 // intersection ends, primary/secondary roads, and tagged private driveways.
 const eligible=segments.filter(s=>s.len>=19&&['residential','living_street','unclassified','service'].includes(s.kind)&&
   s.access!=='private'&&s.access!=='no'&&s.serviceTag!=='driveway'&&s.width>=4.4);
 const candidates=[];
 for(const segment of eligible){
  const midX=(segment.a.x+segment.b.x)*.5,midZ=(segment.a.y+segment.b.y)*.5;
  if(!near(midX,midZ))continue;
  // Cap slots per segment; use its exact OSM heading, no invented road coordinate.
  const amount=segment.len>56?3:segment.len>34?2:1;
  for(let j=0;j<amount;j++){
   const t=.26+(j+.5)/amount*.48,dx=(segment.b.x-segment.a.x)/segment.len,dz=(segment.b.y-segment.a.y)/segment.len;
   const side=(random()>.5?1:-1),nearCurb=segment.width*.5-.96;
   // Service accesses: the small parking area is beside the driveway, not on it.
   const lateral=segment.kind==='service'?segment.width*.5+1.65:Math.max(1.2,nearCurb);
   const x=segment.a.x+(segment.b.x-segment.a.x)*t-dz*lateral*side;
   const z=segment.a.y+(segment.b.y-segment.a.y)*t+dx*lateral*side;
   const yaw=Math.atan2(-dx*(side===1?1:-1),-dz*(side===1?1:-1));
   candidates.push({x,z,yaw,type:segment.kind==='service'?'service-access-bay':'roadside',sourceId:segment.osmId});
  }
 }
 for(let i=candidates.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]]}
 for(const c of candidates){if(out.length>=limit)break;push(c)}
 return out;
}
