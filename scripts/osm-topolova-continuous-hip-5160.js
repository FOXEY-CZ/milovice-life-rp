/** Milovice RP 5.160 — continuous HIP roof on the five-house Topolova 614–618 row.
 * Source: City of Celakovice Council resolutions 14/2023 and 27/2023:
 * https://www.celakovice.cz/filemanager/files/2973758.pdf
 * https://www.celakovice.cz/filemanager/files/3310832.pdf
 * Their listings for 617 and 618 explicitly say "pětivchodového,
 * pětipodlažního ... domu s valbovou střechou". The cadastral five-footprint
 * row is from 5.155; the source does NOT survey roof rise, color or overhang.
 * Do not mutate OSM, build five separate disconnected hip roofs, invent
 * dormers, or reinterpret the city description of "zdený" as proof that
 * the official RUIAN panel wall classification should change.
 */
export const TOPOLOVA_HIP_5160=Object.freeze({
 version:'5.160',region:'mlada',
 source:'https://www.celakovice.cz/filemanager/files/2973758.pdf',
 corroboration:'https://www.celakovice.cz/filemanager/files/3310832.pdf',
 modelRiseMeters:2.25,
 osmIds:['61979151','61979152','61979144','61979139','61979145'],
 addresses:[614,615,616,617,618],
 // Real exterior OSM edges, index in the 4-corner open polygon.
 westEdges:[0,3,3,3,3],eastEdges:[2,1,1,1,1]
});
const pointKey=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const gpsMeters=(a,b)=>Math.hypot((a.lat-b.lat)*111320,
 (a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180));
export function planTopolovaContinuousHip5160({regionId,rowPlan,ways}={}){
 const s=TOPOLOVA_HIP_5160;
 if(regionId!==s.region||rowPlan?.version!=='5.155'||
  rowPlan.allFiveCSUVerifiedAboveGround!==true||
  rowPlan.visualHeightMeters!==15.25||
  rowPlan.contiguousExactSharedPartyWalls!==4||
  JSON.stringify(rowPlan.sourceOSMIds)!==JSON.stringify(s.osmIds)||
  JSON.stringify(rowPlan.houseNumbers)!==JSON.stringify(s.addresses)||
  !Array.isArray(ways))return null;
 const buildings=s.osmIds.map((id,i)=>{
  const found=ways.filter(w=>String(w?.id)===id);
  return found.length===1?found[0]:null;
 });
 if(buildings.some(x=>!x))return null;
 const e=[],w=[],edgeLengths=[];
 for(let i=0;i<buildings.length;i++){
  const b=buildings[i],g=b.geometry,ei=s.eastEdges[i],wi=s.westEdges[i];
  if(!Array.isArray(g)||g.length!==5||
   g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   pointKey(g[0])!==pointKey(g[4])||
   String(b.tags?.['ref:ruian:building'])!==rowPlan.sourceRUIANIds[i])
   return null;
  if(i===0){
   e.push(g[ei]);w.push(g[wi+1]);
  }else if(pointKey(e[i])!==pointKey(g[ei])||
    pointKey(w[i])!==pointKey(g[wi+1]))return null;
  e.push(g[ei+1]);w.push(g[wi]);
  const eL=gpsMeters(g[ei],g[ei+1]),wL=gpsMeters(g[wi],g[wi+1]);
  if(eL<15.8||eL>16.4||wL<15.8||wL>16.4)return null;
  edgeLengths.push([+eL.toFixed(3),+wL.toFixed(3)]);
 }
 const widthNorth=gpsMeters(w[0],e[0]),widthSouth=gpsMeters(w[5],e[5]);
 if(widthNorth<11||widthNorth>12.5||
  widthSouth<11||widthSouth>12.5)return null;
 const fullLength=(gpsMeters(e[0],e[5])+gpsMeters(w[0],w[5]))/2;
 if(fullLength<79||fullLength>82.5)return null;
 return {
  version:s.version,sourceOSMIds:[...s.osmIds],addresses:[...s.addresses],
  sourceRUIANIds:[...rowPlan.sourceRUIANIds],
  sourceOSMHashes:[...rowPlan.sourceOriginalGeometryHashes],
  sourcePDFs:[s.source,s.corroboration],
  eastGPS:e,westGPS:w,edgeLengths,
  widthNorth:+widthNorth.toFixed(3),widthSouth:+widthSouth.toFixed(3),
  totalLength:+fullLength.toFixed(3),
  visualWallHeightMeters:15.25,roofRiseMeters:s.modelRiseMeters,
  geometryRealEstatePolygon:true,sourceHipRoofDocumented:true,
  fiveEntrySharedRoof:true,exactRoofRiseNotMeasured:true,
  roofColourUnverified:true,actualRidgeAzimuthModelEstimated:true,
  originalFootprintsUntouched:true,originalRUIANWallTypesUntouched:true,
  addedRoads:0,addedPaths:0,addedTrees:0,
  addedParking:0,addedColliders:0,addedWindowFixtures:0
 };
}
/** Create ONE physical WebGL mesh. Each long side is tessellated over the
 * original five RUIAN edges, joined by two real-end hip triangles.
 * Vertex elevations use the five already-rendered DEM foundation anchors.
 */
export function renderTopolovaContinuousHip5160(THREE,{plan,toWorld,baseById,layer}={}){
 if(!THREE||plan?.version!=='5.160'||typeof toWorld!=='function'||
  typeof baseById!=='function'||!layer?.add)return null;
 const east=plan.eastGPS.map(toWorld),west=plan.westGPS.map(toWorld);
 if([...east,...west].some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))return null;
 const basis=plan.sourceOSMIds.map(id=>baseById(id));
 if(basis.some(a=>!Number.isFinite(a?.base)||Math.abs(a.height-15.25)>.01))return null;
 const roofTop=basis.map(b=>b.base+15.25);
 // Adjacent source houses may use slightly different terrain DEM anchors.
 // Interpolate the tiny model differences instead of making 5 roof cracks.
 const yEave=Array.from({length:6},(_,i)=>i===0?roofTop[0]:
  i===5?roofTop[4]:(roofTop[i-1]+roofTop[i])/2);
 const north={x:(east[0].x+west[0].x)/2,y:(east[0].y+west[0].y)/2};
 const south={x:(east[5].x+west[5].x)/2,y:(east[5].y+west[5].y)/2};
 const dx=south.x-north.x,dz=south.y-north.y,long=Math.hypot(dx,dz);
 if(long<79||long>83)return null;
 const ux=dx/long,uz=dz/long;
 const inset=Math.min(plan.widthNorth,plan.widthSouth)*.5;
 const ridge=east.map((p,i)=>{
  const cx=(p.x+west[i].x)/2,cz=(p.y+west[i].y)/2;
  if(i===0)return {x:north.x+ux*inset,z:north.y+uz*inset};
  if(i===5)return {x:south.x-ux*inset,z:south.y-uz*inset};
  return {x:cx,z:cz};
 });
 const maxEave=Math.max(...yEave);
 const ridgeY=maxEave+plan.roofRiseMeters;
 const xyz=(p,y)=>({x:p.x,y,z:p.y??p.z});
 const triangles=[];
 const tri=(a,b,c)=>triangles.push(
  a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);
 for(let i=0;i<5;i++){
  const r0=xyz(ridge[i],ridgeY),r1=xyz(ridge[i+1],ridgeY);
  const E0=xyz(east[i],yEave[i]),E1=xyz(east[i+1],yEave[i+1]);
  const W0=xyz(west[i],yEave[i]),W1=xyz(west[i+1],yEave[i+1]);
  tri(E0,E1,r1);tri(E0,r1,r0);
  tri(W1,W0,r0);tri(W1,r0,r1);
 }
 tri(xyz(west[0],yEave[0]),xyz(east[0],yEave[0]),
  xyz(ridge[0],ridgeY));
 tri(xyz(east[5],yEave[5]),xyz(west[5],yEave[5]),
  xyz(ridge[5],ridgeY));
 const g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.Float32BufferAttribute(triangles,3));
 g.computeVertexNormals();g.computeBoundingSphere();
 const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({
  color:0x755c54,roughness:.8,metalness:0,side:THREE.DoubleSide
 }));
 m.name='Milovice_Topolova_614_618_ContinuousHip_5160';
 m.userData.lodX=(north.x+south.x)/2;
 m.userData.lodZ=(north.y+south.y)/2;
 m.userData.lodDetail=false;
 m.userData.continuousRowHipRoof=true;
 m.castShadow=true;m.receiveShadow=true;layer.add(m);
 const visible=()=>{
  for(let n=m;n;n=n.parent)if(!n.visible)return false;
  return true;
 };
 return {
  version:'5.160',drawMeshes:1,triangles:triangles.length/9,
  joinedSideEdges:10,hipEndFaces:2,hipRiseMeters:plan.roofRiseMeters,
  modelRoofHighY:ridgeY,modelEaveMinY:Math.min(...yEave),
  renderVertices:triangles.length/3,
  sourceFiveOSMIds:[...plan.sourceOSMIds],
  visibleAfterLOD:()=>visible()?1:0,
  allInScene:()=>m.parent===layer,
  sourceFootprintsModified:false
 };
}
