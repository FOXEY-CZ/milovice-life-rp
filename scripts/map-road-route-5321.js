// 5.321: route on existing public NPC road graph, respecting its directions.
// No new road links or access claims. Snap points are NOT entrances.
const key=p=>Math.round(p.x*3)+','+Math.round(p.y*3);
const valid=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
function snap(segments,p,max){
 let best=null;
 for(const s of segments){
  if(!valid(s.a)||!valid(s.b)||!Number.isFinite(s.len)||s.len<=0)continue;
  const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y,den=dx*dx+dy*dy;
  if(den<=0)continue;
  const t=Math.max(0,Math.min(1,((p.x-s.a.x)*dx+(p.y-s.a.y)*dy)/den));
  const point={x:s.a.x+dx*t,y:s.a.y+dy*t},distance=Math.hypot(p.x-point.x,p.y-point.y);
  if(distance<=max&&(!best||distance<best.distance))best={s,t,point,distance};
 }
 return best;
}
function push(heap,item){
 let i=heap.length;heap.push(item);
 while(i>0){const j=(i-1)>>1;if(heap[j].cost<=item.cost)break;heap[i]=heap[j];i=j;}heap[i]=item;
}
function pop(heap){
 const first=heap[0],last=heap.pop();if(heap.length){
  let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1].cost<heap[j].cost)j++;
   if(heap[j].cost>=last.cost)break;heap[i]=heap[j];i=j;}heap[i]=last;
 }return first;
}
const part=(s,a,b)=>({a:{x:a.x,y:a.y},b:{x:b.x,y:b.y},osmId:String(s.osmId)});
export function routePublicRoads5321(segments,graph,start,target,{startLimit=30,targetLimit=75}={}){
 if(!Array.isArray(segments)||!(graph instanceof Map)||!valid(start)||!valid(target)||
 !Number.isFinite(startLimit)||!Number.isFinite(targetLimit)||startLimit<0||targetLimit<0)return null;
 const from=snap(segments,start,startLimit),to=snap(segments,target,targetLimit);
 if(!from||!to)return {status:!from?'off-road':'destination-off-road',legs:[],newLinks:0};
 const starts=[],ends=[];
 if(from.s.oneway!==-1)starts.push({node:key(from.s.b),cost:(1-from.t)*from.s.len,leg:part(from.s,from.point,from.s.b)});
 if(from.s.oneway!==1)starts.push({node:key(from.s.a),cost:from.t*from.s.len,leg:part(from.s,from.point,from.s.a)});
 if(to.s.oneway!==-1)ends.push({node:key(to.s.a),cost:to.t*to.s.len,leg:part(to.s,to.s.a,to.point)});
 if(to.s.oneway!==1)ends.push({node:key(to.s.b),cost:(1-to.t)*to.s.len,leg:part(to.s,to.s.b,to.point)});
 // Exact endpoint may depart/arrive via any legal incident segment.
 for(const [snapPoint,options] of [[from,starts],[to,ends]]){
  if(snapPoint.t===0||snapPoint.t===1)options.push({node:key(snapPoint.t===0?snapPoint.s.a:snapPoint.s.b),cost:0,leg:null});
 }
 let best=Infinity,bestEnd=null,direct=null;
 if(from.s===to.s&&((to.t>=from.t&&from.s.oneway!==-1)||(to.t<=from.t&&from.s.oneway!==1))){
  best=Math.abs(to.t-from.t)*from.s.len;direct=[part(from.s,from.point,to.point)];
 }
 const dist=new Map(),prev=new Map(),heap=[];
 function relax(node,cost,record){
  if(cost>=(dist.get(node)??Infinity))return;
  dist.set(node,cost);prev.set(node,record);push(heap,{node,cost});
 }
 for(const e of starts)relax(e.node,e.cost,{previous:null,leg:e.leg});
 while(heap.length){
  const {node,cost}=pop(heap);if(cost!==dist.get(node))continue;if(cost>best)break;
  for(const e of ends)if(e.node===node&&cost+e.cost<best){best=cost+e.cost;bestEnd=e;direct=null;}
  for(const {segment:s,direction} of graph.get(node)||[]){
   if(!s||!valid(s.a)||!valid(s.b)||!Number.isFinite(s.len)||s.len<=0||![1,-1].includes(direction)||
    (direction===1&&s.oneway===-1)||(direction===-1&&s.oneway===1))continue;
   const a=direction===1?s.a:s.b,b=direction===1?s.b:s.a;
   if(key(a)!==node)continue;
   relax(key(b),cost+s.len,{previous:node,leg:part(s,a,b)});
  }
 }
 if(!Number.isFinite(best))return {status:'no-route',legs:[],newLinks:0};
 let legs=direct;
 if(!legs){
  legs=[];let node=bestEnd.node;
  while(node!==null){const p=prev.get(node);if(!p)return {status:'no-route',legs:[],newLinks:0};if(p.leg)legs.push(p.leg);node=p.previous;}
  legs.reverse();if(bestEnd.leg)legs.push(bestEnd.leg);
 }
 legs=legs.filter(l=>Math.hypot(l.b.x-l.a.x,l.b.y-l.a.y)>1e-6);
 return {status:'ready',legs,distanceMetres:best,startOffset:from.distance,targetOffset:to.distance,
  destinationRoadPoint:to.point,entranceVerified:false,newLinks:0};
}
