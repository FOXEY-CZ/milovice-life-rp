/** Milovice RP 5.169 — conservative clean-up of TWO genuine end
 * gables on the five-house Topolova 614–618 cadastral block.
 *
 * Signed 2024 614/615 elevations document EAST/WEST long facades only;
 * 5.161 long faces 616–618 are explicitly estimated. There is NO
 * source photograph or measured entrance/window layout of north/south
 * end gables. Prevent RANDOM generic facade windows/doors on these
 * unverified short outer walls. Existing 3D wall, roof, DEM plinth,
 * cadastral footprint and ALL known facades remain physically unchanged.
 */
export const TOPOLOVA_END_GABLES_5169=Object.freeze({
 region:'mlada',rowIds:['61979151','61979152','61979144','61979139','61979145'],
 entries:[
  Object.freeze({address:614,id:'61979151',ruian:'22968067',hash:'c28a14a4',
   outerEndEdge:1,sharedEdge:3,sharedWith:'61979152'}),
  Object.freeze({address:618,id:'61979145',ruian:'22968105',hash:'b69a7ef6',
   outerEndEdge:2,sharedEdge:0,sharedWith:'61979139'})
 ],
 evidence:'Signed east/west elevations are not north/south gable photos',
 noUnverifiedEndWallWindows:true
});
const fingerprint=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const same=(a,b)=>Number.isFinite(a?.lat)&&Number.isFinite(a?.lon)&&
 Number.isFinite(b?.lat)&&Number.isFinite(b?.lon)&&
 a.lat.toFixed(7)===b.lat.toFixed(7)&&a.lon.toFixed(7)===b.lon.toFixed(7);
const length=(a,b)=>Math.hypot((a.lat-b.lat)*111320,
 (a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180));
const edge=(way,i)=>[way.geometry[i],way.geometry[i+1]];
const opposite=(a,i,b,j)=>{
 const [p,q]=edge(a,i),[r,s]=edge(b,j);
 return same(p,s)&&same(q,r)||same(p,r)&&same(q,s);
};
export function planTopolovaEndGables5169({
 regionId,rowPlan,hipPlan,inferredPlan,ways
}={}){
 const s=TOPOLOVA_END_GABLES_5169;
 if(regionId!==s.region||rowPlan?.version!=='5.155'||
  hipPlan?.version!=='5.160'||!hipPlan.fiveEntrySharedRoof||
  inferredPlan?.version!=='5.161'||
  rowPlan.contiguousExactSharedPartyWalls!==4||
  rowPlan.sourceOSMIds?.join(',')!==s.rowIds.join(',')||
  hipPlan.sourceOSMIds?.join(',')!==s.rowIds.join(',')||
  inferredPlan.sourceOSMIds?.join(',')!==s.rowIds.slice(2).join(',')||
  !Array.isArray(ways))return null;
 const get=id=>{const found=ways.filter(w=>String(w?.id)===id);
  return found.length===1?found[0]:null};
 const cleared=[];
 for(const spec of s.entries){
  const w=get(spec.id),neighbour=get(spec.sharedWith);
  if(!w||!neighbour)return null;
  const tags=w.tags||{},g=w.geometry;
  if(tags.building!=='residential'||
   tags['ref:ruian:building']!==spec.ruian||
   tags.source!=='cuzk:ruian'||
   g?.length!==5||g.some(p=>!Number.isFinite(p?.lat)||
    !Number.isFinite(p?.lon))||
   !same(g[0],g[4])||fingerprint(g)!==spec.hash||
   rowPlan.sourceOriginalGeometryHashes[
    rowPlan.sourceOSMIds.indexOf(spec.id)]!==spec.hash||
   !opposite(w,spec.sharedEdge,neighbour,
     spec.address===614?0:2))return null;
  const a=g[spec.outerEndEdge],b=g[spec.outerEndEdge+1],
   distance=length(a,b);
  const wrongLongFace=inferredPlan.facadeEdgesById?.[spec.id]
   ?.includes(spec.outerEndEdge)===true;
  if(wrongLongFace||distance<11.3||distance>11.9||
   g[spec.outerEndEdge]===undefined)return null;
  // Reject any accidental shared wall: only EXPOSED SHORT end is muted.
  for(const other of s.rowIds){
   if(other===spec.id)continue;
   const n=get(other);if(!n)return null;
   for(let i=0;i<n.geometry.length-1;i++)
    if(opposite(w,spec.outerEndEdge,n,i))return null;
  }
  cleared.push({address:spec.address,sourceOSMId:spec.id,
   originalEdge:spec.outerEndEdge,originalLengthMetres:+distance.toFixed(3),
   sourceHash:spec.hash});
 }
 if(cleared.length!==2||cleared[0].address!==614||
  cleared[1].address!==618)return null;
 return {
  version:'5.169',sourceRegion:'mlada',
  sourceOSMIds:s.rowIds.slice(),
  clearedGables:cleared,
  blockedGenericEdgesById:{
   '61979151':[1],'61979145':[2]
  },
  originalCadastralEndWallsPreserved:true,
  originalSharedRoofPreserved:true,
  longEastWestFacadesUnchanged:true,
  potentialRealGableWindowsUnverified:true,
  requiresPhotosToModelEndOpenings:true,
  exactEntrancePositionsUnknown:true,
  removedGenericRandomFacadeEdges:2,
  newWindows:0,newEntranceDoors:0,newCanopies:0,
  newWalkways:0,newRoads:0,newParking:0,newTrees:0,
  newLights:0,newColliders:0,newMeshes:0
 };
}
