/** RP 5.282 — 4 existing OSM/RUIAN Armadni 886,887,890,891 apartment
 * shells (four floors and 25 flats each). Only estimated window/sill/plinth
 * surfaces are added with the existing source-wall renderer 5.192.
 * Original walls, roofs, positions, collisions, doors and streets unchanged.
 */
export const ARMADNI_HOUSES_5282=Object.freeze({
 regionIds:['mlada','vrutice','westlink'],floors:4,flats:25,
 buildings:[
  {id:'1164238465',house:'886',ruian:'119003791',date:'2023-02-08',
   nodes:15,hash:'47591c72',area:355.217,
   edges:[[0,8.729,3],[2,5.474,2],[3,16.782,5],[4,6.110,2],
    [8,9.621,3],[11,14.626,5],[12,7.414,2]]},
  {id:'1164238466',house:'887',ruian:'119001071',date:'2023-02-08',
   nodes:15,hash:'e201d9e2',area:355.443,
   edges:[[0,7.424,2],[2,8.707,3],[4,5.507,2],[5,16.767,5],
    [6,6.087,2],[10,9.687,3],[13,14.633,5]]},
  {id:'1047406190',house:'891',ruian:'107125749',date:'2022-02-18',
   nodes:11,hash:'e8e44d23',area:356.286,
   edges:[[0,16.703,5],[1,5.519,2],[3,8.583,3],[5,7.425,2],
    [6,14.442,5],[9,18.214,6]]},
  {id:'1047406191',house:'890',ruian:'107124980',date:'2022-02-18',
   nodes:11,hash:'bc90ca65',area:355.806,
   edges:[[0,16.702,5],[1,5.529,2],[3,8.585,3],[5,7.424,2],
    [6,14.449,5],[9,18.191,6]]}
 ]});
const hash=g=>{
 const source=g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 let h=2166136261;for(const c of source){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),z:-p.lat*111320});
export function planArmadniHouses5282({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=ARMADNI_HOUSES_5282,s=c.buildings.find(b=>b.id===String(id));
 if(!s||!c.regionIds.includes(regionId)||photoReviewed||approvedArchitecture||
  !tags||Object.keys(tags).length!==7||
  tags.building!=='residential'||tags['building:flats']!=='25'||
  tags['building:levels']!=='4'||tags['building:ruian:type']!=='6'||
  tags['ref:ruian:building']!==s.ruian||tags.source!=='cuzk:ruian'||
  tags.start_date!==s.date||modelFloors!==4||
  !Number.isFinite(modelHeight)||Math.abs(modelHeight-12.2)>.005||
  !Array.isArray(geometry)||geometry.length!==s.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  geometry[0].lat!==geometry.at(-1).lat||
  geometry[0].lon!==geometry.at(-1).lon||hash(geometry)!==s.hash)return null;
 const p=geometry.map(xy),a=p[0];
 const area=Math.abs(p.slice(0,-1).reduce((v,q,i)=>{
  const b=p[i+1];return v+(q.x-a.x)*(b.z-a.z)-(q.z-a.z)*(b.x-a.x);
 },0)/2);
 if(!Number.isFinite(area)||Math.abs(area-s.area)>.85)return null;
 const facades=[];
 for(const [i,length,bays] of s.edges){
  const u=p[i],v=p[i+1],actual=Math.hypot(u.x-v.x,u.z-v.z);
  if(Math.abs(actual-length)>.18||bays<2||bays>7||
   actual/bays<2.15)return null;
  facades.push({edgeIndex:i,sourceLengthMetres:+actual.toFixed(3),
   bays,windowWidthMetres:1.46});
 }
 const windows=facades.reduce((a,b)=>a+b.bays*4,0);
 if(windows!==(s.nodes===15?88:92))return null;
 return {version:'5.192',sourceFacadeVersion:'5.282',
  sourceOSMId:s.id,sourceRUIANId:s.ruian,
  sourceName:'Armádní '+s.house,sourceHash:s.hash,
  sourceGeometry:geometry,sourceNodes:s.nodes,sourceReportedFloors:4,
  sourceReportedFlats:25,originalAreaSquareMetres:+area.toFixed(3),
  modelHeightMeters:modelHeight,facades,
  modelWindowWidthMetres:1.46,modelWindowHeightMetres:1.52,
  estimatedWindows:windows,suppressedGenericFacadeEdges:s.nodes-1,
  exactWindowPositionsVerified:false,facadeColorsPhotoVerified:false,
  windowCountsPhotoVerified:false,balconiesPhotoVerified:false,
  existingSourceShellUnchanged:true,
  newBuildings:0,newDoors:0,newBalconies:0,newRoofs:0,
  newFootways:0,newRoads:0,newColliders:0};
}
