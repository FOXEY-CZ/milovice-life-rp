// Milovice RP 5.133: exact shared full-height RUIAN residential walls.
// This pass only suppresses generic OUTSIDE facade decoration on a real
// mutually shared polygon edge. Solid walls, roofs, physics, addresses,
// street network, OSM source geometry, and photo-approved assets stay intact.
// Geometry is OSM/RUIAN sourced, not a photograph of the exterior finish.
const X=p=>p?.x, Z=p=>p?.z??p?.y;
const valid=p=>Number.isFinite(X(p))&&Number.isFinite(Z(p));
const dist=(a,b)=>Math.hypot(X(a)-X(b),Z(a)-Z(b));
const key=p=>Math.round(X(p)*100)+':'+Math.round(Z(p)*100);
const getVertices=points=>{
 if(!Array.isArray(points)||points.length<4||points.length>100||
  !points.every(valid))return null;
 const pts=points.slice();
 if(dist(pts[0],pts.at(-1))<.05)pts.pop();
 return pts.length>=3?pts:null;
};
const isCandidate=b=>{
 const t=b?.tags,levels=Number(t?.['building:levels']);
 return t?.building==='residential'&&t?.source==='cuzk:ruian'&&
  !!t?.['ref:ruian:building']&&
  Number.isInteger(levels)&&levels>=2&&levels<=16&&
  getVertices(b.points)!==null;
};
export function planRUIANResidentialSharedWalls({regionId,buildings=[]}={}){
 if(!['old','mlada','vrutice','westlink','centerlink','bozidar'].includes(regionId)||
  !Array.isArray(buildings))return null;
 const rows=buildings.filter(isCandidate);
 // The edge hash is O(E), and pairs must have BOTH identical exact
 // projected OSM endpoints. Nearby parallel walls are never merged.
 const byEdge=new Map();
 for(const building of rows){
  const pts=getVertices(building.points),id=String(building.id);
  for(let i=0;i<pts.length;i++){
   const a=pts[i],b=pts[(i+1)%pts.length],length=dist(a,b);
   if(length<6||length>21)continue;
   const hash=[key(a),key(b)].sort().join('|');
   if(!byEdge.has(hash))byEdge.set(hash,[]);
   byEdge.get(hash).push({id,edge:i,a,b,length,
    levels:Number(building.tags['building:levels'])});
  }
 }
 const byBuilding={},joins=[];
 for(const entries of byEdge.values()){
  // >2 matching faces could be overlapping structures: fail closed.
  if(entries.length!==2)continue;
  const [a,b]=entries;
  if(a.id===b.id||a.levels!==b.levels||
   Math.abs(a.length-b.length)>.05)continue;
  const opposite=dist(a.a,b.b)<.04&&dist(a.b,b.a)<.04;
  const same=dist(a.a,b.a)<.04&&dist(a.b,b.b)<.04;
  if(!opposite&&!same)continue;
  (byBuilding[a.id]??=[]).push(a.edge);
  (byBuilding[b.id]??=[]).push(b.edge);
  joins.push({buildingIds:[a.id,b.id].sort(),
   edges:[a.edge,b.edge],fullLengthMetres:+a.length.toFixed(3),
   exactSharedEndpoints:true,originalSolidWallsUntouched:true});
 }
 for(const list of Object.values(byBuilding))list.sort((a,b)=>a-b);
 joins.sort((a,b)=>a.buildingIds.join('|').localeCompare(b.buildingIds.join('|')));
 const ids=Object.keys(byBuilding).sort();
 return {
  version:'5.133',regionId,
  eligibility:'RUIAN residential, same 2-16 storeys, full common source edge 6-21m',
  candidateBuildingCount:rows.length,sourceBuildingIds:ids,
  sourceSharedWallCount:joins.length,
  internalFacadeEdgesToSkip:joins.length*2,
  affectedBuildingCount:ids.length,
  exactSourceEdgeMatch:true,photoValidatedAppearance:false,
  originalSolidWallExtrusionsPreserved:true,
  originalRoofsPreserved:true,originalBuildingGeometryPreserved:true,
  originalTrafficAndFootwaysPreserved:true,
  additionalMeshes:0,additionalColliders:0,
  edgeMap:byBuilding,joins
 };
}
