/** Milovice RP 5.241 — civilian NPC routing without visible teleportation.
 * Only traffic actors are affected; map geometry, collisions and player
 * steering remain untouched. All selected lanes come from the 5.240
 * permission-filtered drive graph.
 */
const finitePoint=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const roadDirectionValid=(s,d)=>d===1||d===-1?
 (s?.oneway===0||s?.oneway===undefined||s?.oneway===d):false;
export function planNpcJunction5241({
 segment,direction,turns=0,outgoing=[]
}={}){
 if(!segment||!finitePoint(segment.a)||!finitePoint(segment.b)||
  !Number.isFinite(segment.len)||segment.len<.05||
  !roadDirectionValid(segment,direction)||!Array.isArray(outgoing))
  return null;
 const endpoint=direction===1?segment.b:segment.a;
 const options=outgoing.filter(o=>{
  const next=o?.segment,dir=o?.direction;
  if(!next||next===segment||!roadDirectionValid(next,dir)||
   !finitePoint(next.a)||!finitePoint(next.b)||
   !Number.isFinite(next.len)||next.len<.05)return false;
  const start=dir===1?next.a:next.b;
  return Math.hypot(endpoint.x-start.x,endpoint.y-start.y)<.65;
 });
 if(!options.length){
  if(!segment.oneway)return {
   mode:'turn-back',segment,direction:-direction,
   progress:direction===1?1:0,turnIncrement:0,teleported:false
  };
  return {mode:'terminal',segment,direction,
   progress:direction===1?1:0,turnIncrement:0,teleported:false};
 }
 const ux=(segment.b.x-segment.a.x)*direction/segment.len;
 const uy=(segment.b.y-segment.a.y)*direction/segment.len;
 let chosen=options[0],best=-Infinity;
 for(const option of options){
  const next=option.segment,dir=option.direction;
  const vx=(next.b.x-next.a.x)*dir/next.len;
  const vy=(next.b.y-next.a.y)*dir/next.len;
  // Favor a road continuation while allowing deterministic variation.
  const score=ux*vx+uy*vy+
   Math.sin(turns*29+next.a.x*.1+next.a.y*.13)*.16;
  if(score>best){best=score;chosen=option;}
 }
 return {mode:'connected',segment:chosen.segment,
  direction:chosen.direction,progress:chosen.direction===1?0:1,
  turnIncrement:1,teleported:false};
}
export function planOffscreenNpcRecycle5241({
 segments,observers,seed=0,currentSegment=null,minDistance=360
}={}){
 if(!Array.isArray(segments)||!segments.length||
  !Array.isArray(observers)||!observers.length||
  observers.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.z))||
  !Number.isFinite(minDistance)||minDistance<280)return null;
 const count=segments.length;
 const start=((Math.floor(seed)*19+7)%count+count)%count;
 for(let i=0;i<count;i++){
  const s=segments[(start+i)%count];
  // Sequential wraparound visits every eligible graph segment exactly once.
  // Reusing the same filtered graph guarantees no permission regression.
  if(!s||s===currentSegment||!finitePoint(s.a)||!finitePoint(s.b)||
   !Number.isFinite(s.len)||s.len<12||!(s.width>=6)||
   ![0,1,-1].includes(s.oneway??0))continue;
  const direction=s.oneway||1;
  const progress=.23+(((Math.floor(seed)%17)+17)%17)/100;
  const x=s.a.x+(s.b.x-s.a.x)*progress;
  const z=s.a.y+(s.b.y-s.a.y)*progress;
  if(observers.every(p=>Math.hypot(x-p.x,z-p.z)>minDistance))
   return {segment:s,direction,progress,offscreenOnly:true};
 }
 return null;
}
