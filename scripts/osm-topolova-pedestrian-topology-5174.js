/** Milovice RP 5.174 — exact OSM-node pedestrian topology near Topolová.
 * No inferred bridge between close-but-disconnected GPS coordinates.
 * Topological identity alone cannot prove real curb access or usability.
 */
import {auditTopolovaStreet5173} from './osm-topolova-street-inventory-5173.js';
export const TOPOLOVA_PEDESTRIAN_TOPOLOGY_5174=Object.freeze({
 roadId:'8618275',roadHash:'c0fe69b0',
 knownLoopWays:Object.freeze(['1316882852','1316882854',
  '1314665579','1316882853']),
 spurWay:'1316882860'
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const walking=w=>['footway','path','pedestrian','steps'].includes(w.tags?.highway)&&
 !['private','no'].includes(w.tags?.access);
export function auditTopolovaPedestrianTopology5174({regionId,elements,rowPlan}={}){
 const census=auditTopolovaStreet5173({regionId,elements,rowPlan});
 if(!census)return null;
 const road=elements.filter(e=>String(e.id)===TOPOLOVA_PEDESTRIAN_TOPOLOGY_5174.roadId);
 if(road.length!==1||hash(road[0].geometry)!==
  TOPOLOVA_PEDESTRIAN_TOPOLOGY_5174.roadHash)return null;
 const ids=new Set(census.records.filter(r=>walking({tags:{highway:r.kind,
  access:r.access}})).map(r=>r.id));
 const ways=elements.filter(e=>ids.has(String(e.id))&&walking(e));
 if(ways.length!==ids.size||ways.some(w=>!Array.isArray(w.geometry)||
  w.geometry.length<2||w.geometry.some(p=>!Number.isFinite(p?.lat)||
  !Number.isFinite(p?.lon))))return null;
 // Index every original OSM vertex, including intermediate intersection nodes.
 const atNode=new Map();
 for(const w of ways)for(const p of w.geometry){
  const k=key(p),arr=atNode.get(k)||new Set();
  arr.add(String(w.id));atNode.set(k,arr);
 }
 const neighborIds=new Map(ways.map(w=>[String(w.id),new Set()]));
 const sharedNodes=new Map();
 for(const [node,group] of atNode){
  if(group.size<2)continue;
  const ordered=[...group].sort();
  for(let i=0;i<ordered.length;i++)
   for(let j=i+1;j<ordered.length;j++){
    const a=ordered[i],b=ordered[j],pair=a+'|'+b;
    neighborIds.get(a).add(b);neighborIds.get(b).add(a);
    const nodes=sharedNodes.get(pair)||[];nodes.push(node);
    sharedNodes.set(pair,nodes);
   }
 }
 const adjacency=[...neighborIds].map(([id,neighbors])=>({
  id,connectedWayIds:[...neighbors].sort(),
  exactSharedOSMNodeCount:[...sharedNodes].filter(([pair])=>
   pair.split('|').includes(id)).reduce((n,[,nodes])=>n+nodes.length,0)
 })).sort((a,b)=>a.id.localeCompare(b.id));
 const visited=new Set(),components=[];
 for(const a of adjacency){
  if(visited.has(a.id))continue;
  const stack=[a.id],component=[];
  while(stack.length){
   const id=stack.pop();
   if(visited.has(id))continue;
   visited.add(id);component.push(id);
   for(const n of neighborIds.get(id))if(!visited.has(n))stack.push(n);
  }
  components.push(component.sort());
 }
 const known=TOPOLOVA_PEDESTRIAN_TOPOLOGY_5174;
 const loopGroup=components.find(g=>known.knownLoopWays.every(id=>g.includes(id)));
 return {version:'5.174',sourceRoadId:known.roadId,
  roadGeometryHash:known.roadHash,
  pedestrianWayCount:ways.length,sharedVertexConnections:sharedNodes.size,
  adjacency,components,componentCount:components.length,
  knownLoopWaysPresent:known.knownLoopWays.every(id=>ids.has(id)),
  knownLoopTopologicallyConnected:Boolean(loopGroup),
  spurWayPresent:ids.has(known.spurWay),
  isolatedWayIds:adjacency.filter(a=>!a.connectedWayIds.length).map(a=>a.id),
  inferredMissingPaths:0,realWorldAccessibilityProven:false,
  newMeshes:0,newFootways:0,newCrossings:0,newColliders:0,
  caveat:'Exact coordinate equality in recorded OSM geometry; no inferred pedestrian link at near misses.'};
}
