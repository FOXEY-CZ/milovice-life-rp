// 5.327: geometric guidance on already audited road legs, not junction/legal advice.
// Coordinates: x east, y south. Positive cross product means a right turn.
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
// Centimetre-rounded bend position and source road IDs survive clipping the route start.
const pointKey=p=>`${Math.round(p.x*100)},${Math.round(p.y*100)}`;
export function nextRouteInstruction5327(route,audit,player){
 if(route?.status!=='ready'||audit?.valid!==true||!Array.isArray(route.legs)||
    !route.legs.length||audit.legCount!==route.legs.length||!finite(player)||
    !Number.isFinite(route.distanceMetres)||!Number.isFinite(route.startOffset)||route.startOffset<0)return null;
 const legs=[];let total=0,prev=null;
 for(const l of route.legs){
  if(!finite(l?.a)||!finite(l?.b)||l.osmId==null)return null;
  const length=dist(l.a,l.b);
  if(!Number.isFinite(length)||length<=1e-6||prev&&dist(prev,l.a)>.5)return null;
  legs.push({...l,length,start:total});total+=length;prev=l.b;
 }
 if(Math.abs(total-route.distanceMetres)>.001)return null;
 // Cache is periodically rebuilt from player position; do not jump forward to a
 // later crossing or parallel road on a looping route.
 let nearest=null;const candidates=[];
 for(const l of legs){
  if(l.start>60)break;
  const dx=l.b.x-l.a.x,dy=l.b.y-l.a.y;
  const t=Math.max(0,Math.min(1,(60-l.start)/l.length,
   ((player.x-l.a.x)*dx+(player.y-l.a.y)*dy)/(l.length*l.length)));
  const along=l.start+t*l.length,offset=dist(player,{x:l.a.x+dx*t,y:l.a.y+dy*t});
  const candidate={along,offset};candidates.push(candidate);
  if(!nearest||offset<nearest.offset)nearest=candidate;
 }
 if(!nearest||nearest.offset>Math.min(30,Math.max(12,route.startOffset+5)))return null;
 if(candidates.some(c=>Math.abs(c.along-nearest.along)>15&&c.offset<=nearest.offset+2))return null;
 for(let i=0;i<legs.length-1;i++){
  const a=legs[i],b=legs[i+1],at=b.start;
  if(at<nearest.along-.01||a.length<3||b.length<3||String(a.osmId)===String(b.osmId))continue;
  const ax=a.b.x-a.a.x,ay=a.b.y-a.a.y,bx=b.b.x-b.a.x,by=b.b.y-b.a.y;
  const angle=Math.atan2(ax*by-ay*bx,ax*bx+ay*by)*180/Math.PI;
  if(Math.abs(angle)<35)continue;
  const direction=Math.abs(angle)>=150?'reverse':angle>0?'right':'left';
  return {direction,maneuverKey:`turn:${a.osmId}:${b.osmId}:${pointKey(b.a)}`,distanceMetres:Math.max(0,at-nearest.along),angleDegrees:angle,geometricOnly:true,junctionVerified:false,entranceVerified:false};
 }
 return {direction:'road-end',maneuverKey:`end:${legs.at(-1).osmId}:${pointKey(legs.at(-1).b)}`,distanceMetres:Math.max(0,total-nearest.along),angleDegrees:null,geometricOnly:true,junctionVerified:false,entranceVerified:false};
}
