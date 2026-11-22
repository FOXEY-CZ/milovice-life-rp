/** Milovice RP 5.268 — opt-in visual inspector of an ORIGINAL walking
 * connection from Rakouska via OSM residential spur 8590286 to the
 * original Italska 5.233 sidewalk/crossing chain. This inspector draws
 * guides ONLY when explicitly requested. Guides are NOT physical kerbs,
 * zebra paint, pavement, collisions or inferred pedestrian access.
 */
export const RAKOUSKA_WALK_LINK_5268=Object.freeze({
 region:'mlada',main:'8590288',mainHash:'7486fd8b',
 side:'8590286',sideHash:'916afa20',
 crossing:'1484073944',crossingHash:'9c3463dd',
 chainIds:Object.freeze(['1484073943','1484073944','1484073945',
  '1484073946','1484073947']),
 originalChainLengthMetres:534.368,
 categories:Object.freeze(['sidewalk','crossing','sidewalk','crossing','sidewalk']),
 technicalOnly:true
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const ch of g.map(key).join(';')){
  h^=ch.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const len=g=>g.slice(1).reduce((v,p,i)=>{
 const a=world(g[i]),b=world(p);
 return v+Math.hypot(a.x-b.x,a.z-b.z);
},0);
const tagsExact=(source,expect)=>source&&
 Object.keys(source).length===Object.keys(expect).length&&
 Object.entries(expect).every(([k,v])=>source[k]===v);
export function planRakouskaWalkLink5268({regionId,ways,chainPlan}={}){
 const S=RAKOUSKA_WALK_LINK_5268;
 if(regionId!==S.region||!Array.isArray(ways)||
  chainPlan?.version!=='5.233'||!chainPlan.originalGPSUnchanged||
  Math.abs(chainPlan.totalOriginalMetres-S.originalChainLengthMetres)>.005||
  chainPlan.sourceWayIds?.join(',')!==S.chainIds.join(',')||
  chainPlan.unmarkedCrossingIds?.join(',')!=='1484073944,1484073946')
  return null;
 const one=id=>{
  const match=ways.filter(w=>String(w?.id)===id);
  return match.length===1?match[0]:null;
 };
 const main=one(S.main),side=one(S.side),cross=one(S.crossing);
 if(!main||!side||!cross||main.geometry?.length!==19||
  side.geometry?.length!==3||cross.geometry?.length!==3||
  hash(main.geometry)!==S.mainHash||hash(side.geometry)!==S.sideHash||
  hash(cross.geometry)!==S.crossingHash||
  !tagsExact(main.tags,{highway:'residential',lit:'yes',
   maxspeed:'30',name:'Rakouská'})||
  !tagsExact(side.tags,{highway:'residential'})||
  !tagsExact(cross.tags,{crossing:'unmarked',
   'crossing:markings':'no',footway:'crossing',highway:'footway'})||
  key(main.geometry[5])!==key(side.geometry[0])||
  key(side.geometry[1])!==key(cross.geometry[1])||
  Math.abs(len(side.geometry)-73.08)>.15)return null;
 const paths=S.chainIds.map((id,i)=>{
  const w=one(id);
  if(!w||w.tags?.highway!=='footway'||
   w.tags?.footway!==S.categories[i]||
   !w.geometry||hash(w.geometry)!==chainPlan.sourceHashes[i])return null;
  return {id,category:S.categories[i],geometry:w.geometry.map(p=>({...p}))};
 });
 if(paths.some(p=>!p))return null;
 return {version:'5.268',mainRoadId:S.main,sideRoadId:S.side,
  sideRoadMetres:+len(side.geometry).toFixed(3),
  sourceChainMetres:chainPlan.totalOriginalMetres,
  sourceWayIds:S.chainIds.slice(),
  crossingIds:['1484073944','1484073946'],
  mapJoinAtMain:side.geometry[0],mapJoinAtCross:cross.geometry[1],
  originalFootwaySegments:14,originalRoadSegments:2,
  paths,sideRoadGPS:side.geometry.map(p=>({...p})),
  technicalOnly:true,photoConfirmedKerbs:false,
  noPhysicalOverlayInNormalGame:true,
  originalGPSUnchanged:true,unmarkedCrossingsPreserved:true,
  newFootways:0,newKerbs:0,newZebras:0,newCrossings:0,
  newTrafficChanges:0,newColliders:0,newStreetFurniture:0};
}
export function renderRakouskaWalkLink5268(THREE,{plan,layer,terrainAt,
 inspection=false}={}){
 if(!inspection||plan?.version!=='5.268'||!plan.technicalOnly||
  !THREE||!layer||typeof terrainAt!=='function')return null;
 const kinds=[
  {name:'footways',color:'#05e4ec',ways:plan.paths.filter(p=>p.category==='sidewalk')},
  {name:'unmarked-crossings',color:'#ffd064',
   ways:plan.paths.filter(p=>p.category==='crossing')},
  {name:'residential-road-axis',color:'#f278ab',
   ways:[{geometry:plan.sideRoadGPS}]}
 ];
 const meshes=[],detail=[];
 for(const item of kinds){
  const vertices=[];let drawnMetres=0,sourceSegments=0;
  for(const way of item.ways){
   for(let i=1;i<way.geometry.length;i++){
    const a=world(way.geometry[i-1]),b=world(way.geometry[i]);
    const length=Math.hypot(b.x-a.x,b.z-a.z);
    if(!Number.isFinite(length)||length<.1||length>800)return null;
    const samples=Math.ceil(length/1.25);
    for(let j=0;j<samples;j++){
     for(const t of [j/samples,(j+1)/samples]){
      const x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;
      const y=terrainAt(x,z);
      if(!Number.isFinite(y))return null;
      vertices.push(x,y+.38,z);
     }
    }
    drawnMetres+=length;sourceSegments++;
   }
  }
  if(!vertices.length||!vertices.every(Number.isFinite))return null;
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geo.computeBoundingSphere();
  const mesh=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({
   color:item.color,transparent:false,depthTest:true}));
  mesh.name='Milovice_5268_technical_'+item.name;
  mesh.userData.lodDetail=true;
  mesh.renderOrder=5;
  layer.add(mesh);
  meshes.push(mesh);
  detail.push({kind:item.name,sourceSegments,
   sourceMetres:+drawnMetres.toFixed(3),vertices:vertices.length/3});
 }
 return {version:'5.268',technicalOnly:true,drawMeshes:meshes.length,
  groups:detail,geometryFinite:true,
  inScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(m=>m.parent===layer&&m.visible).length,
  zeroRoadOrCollisionChanges:true};
}
