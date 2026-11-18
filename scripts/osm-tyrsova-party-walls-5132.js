// Milovice RP 5.132: five adjoining RUIAN homes at Tyršova, Mladá.
// Each OSM building outline is legally a separate volume, but four pairs
// share two EXACT endpoints along common full-height party walls. Generic
// facade decals/balcony/door generators must NOT place exterior features on
// these shared walls. All ten source wall planes remain in solid extrusions.
// Source-only: no fictitious windows, roof types, internal passages or roads.
export const TYRSOVA_PARTY_WALL_SOURCE=Object.freeze({
 regionId:'mlada', parentStreetName:'Tyršova',
 buildingIds:Object.freeze(['61979140','61979141','61979149',
  '61979146','61979143']),
 expectedFloors:5,
 streetSouthId:'8618265',
 streetNorthId:'1331897627',
 officialGeometry:'RUIAN building ways in data/regions/mlada.json',
 physicalFacadePhotoVerified:false
});
const XY=p=>({x:p?.x,z:p?.z??p?.y});
const isFinitePos=p=>Number.isFinite(XY(p).x)&&Number.isFinite(XY(p).z);
const dist=(a,b)=>Math.hypot(XY(a).x-XY(b).x,XY(a).z-XY(b).z);
const equals=(a,b,tol=.09)=>dist(a,b)<tol;
const edge=(verts,i)=>[verts[i],verts[(i+1)%verts.length]];
const canonical=p=>{
 const a=p.map(XY);
 if(a.length>1&&equals(a[0],a.at(-1)))a.pop();
 return a;
};
export function planTyrsovaRUIANSharedWalls({
 regionId,buildings=[],southRoad=null,northRoad=null
}={}){
 const src=TYRSOVA_PARTY_WALL_SOURCE;
 if(regionId!==src.regionId||!Array.isArray(buildings)||
  buildings.length<src.buildingIds.length||!southRoad||!northRoad||
  String(southRoad.id)!==src.streetSouthId||
  String(northRoad.id)!==src.streetNorthId||
  southRoad.tags?.name!=='Tyršova'||
  northRoad.tags?.name!=='Tyršova'||
  !Array.isArray(southRoad.points)||southRoad.points.length!==3||
  !Array.isArray(northRoad.points)||northRoad.points.length!==2||
  !equals(southRoad.points.at(-1),northRoad.points[0],.20))
  return null;
 const rows=src.buildingIds.map(id=>buildings.find(b=>String(b?.id)===id));
 if(rows.some((b,i)=>!b||
  b.tags?.building!=='residential'||
  b.tags?.['building:levels']!=='5'||
  !['12','14'].includes(String(b.tags?.['building:flats']))||
  !Array.isArray(b.points)||b.points.length!==5||
  !b.points.every(isFinitePos)))return null;
 const verts=rows.map(b=>canonical(b.points));
 if(verts.some(v=>v.length!==4))return null;
 const edgeMap={};let joinPairs=[];
 for(const id of src.buildingIds)edgeMap[id]=[];
 for(let i=0;i<rows.length-1;i++){
  const current=verts[i],next=verts[i+1];
  const pairs=[];
  for(let j=0;j<current.length;j++){
   const [a,b]=edge(current,j);
   const length=dist(a,b);
   if(length<8||length>18)continue;
   for(let k=0;k<next.length;k++){
    const [c,d]=edge(next,k);
    const reversed=equals(a,d)&&equals(b,c),
     same=equals(a,c)&&equals(b,d);
    if((reversed||same)&&Math.abs(length-dist(c,d))<.09)
     pairs.push({firstId:src.buildingIds[i],
      secondId:src.buildingIds[i+1],
      firstEdge:j,secondEdge:k,fullSharedLength:+length.toFixed(3),
      allEndpointsMapped:true,noNewGeometry:true});
   }
  }
  if(pairs.length!==1)return null;
  const join=pairs[0];
  joinPairs.push(join);
  edgeMap[join.firstId].push(join.firstEdge);
  edgeMap[join.secondId].push(join.secondEdge);
 }
 if(joinPairs.length!==4||
  src.buildingIds.some((id,i)=>edgeMap[id].length!==(i===0||i===4?1:2)))
  return null;
 for(const id of src.buildingIds)edgeMap[id].sort((a,b)=>a-b);
 return {
  version:'5.132',sourceStreetName:'Tyršova',
  sourceStreetWays:[src.streetSouthId,src.streetNorthId],
  sourceBuildings:[...src.buildingIds],
  sourceFloors:[5,5,5,5,5],
  actualBuildingCount:5,
  abuttingPairCount:joinPairs.length,
  sharedUndirectedWalls:joinPairs.length,
  internalFacadeEdgesToSkip:8,
  originalFacadeEdges:20,
  exteriorFacadeEdgesRemaining:12,
  buildingGeometryAltered:false,
  originalSolidWallExtrusionsPreserved:true,
  noInventedWindowOrDoorOnPartyWalls:true,
  noExteriorDecorationOnPartyWalls:true,
  originalStreetRoadsUntouched:true,
  possiblePhotoVerifiedFacadeStyle:false,
  numberOfAdditionalRenderMeshes:0,
  expectedSkippedPerHouse:[1,2,2,2,1],
  edgeMap,joinPairs
 };
}
