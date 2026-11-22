/**
 * Milovice RP 5.266: photo-supported fenced, overgrown frontage.
 * Photo: "Rakouská (Milovice) 15.jpg", Stanislav Doronenko,
 * 20 Aug 2025, CC BY-SA 4.0, Wikimedia Commons.
 * Photo visibly shows thin vertical green metal fence, weeds and bushes
 * between former Vojenské zátiší and the road.
 *
 * Photo does NOT survey fence endpoints, precise vegetation or parcel boundary.
 * FENCE LINE IS AN ESTIMATE offset from original Rakouská way 8590288,
 * NOT a claim of a mapped barrier; NO colliders, gates, roads, GPS edits.
 * Conservative 2D footprint exclusion and photograph-grounded stylistic choices.
 */
export const RAKOUSKA_FRONTAGE_5266=Object.freeze({
 buildingId:'53865882',ruian:'40057411',buildingHash:'7aec42bc',
 roadId:'8590288',roadHash:'7486fd8b',
 photo:'https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg',
 author:'Stanislav Doronenko',license:'CC BY-SA 4.0',
 referenceDate:'2025-08-20',
 roadStartFraction:.12,roadEndFraction:.78,
 fenceModelOffsetMetres:4.8,
 fenceModelHeightMetres:1.16,
 fenceApproximate:true,plantedPositionsEstimated:true
});
const world=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
});
const len=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);
const distLine=(p,a,b)=>{
 const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
 const u=den?Math.min(1,Math.max(0,((p.x-a.x)*dx+(p.z-a.z)*dz)/den)):0;
 return Math.hypot(p.x-a.x-dx*u,p.z-a.z-dz*u);
};
const inside=(p,vertices)=>{
 let yes=false;
 for(let i=0,j=vertices.length-1;i<vertices.length;j=i++){
  const a=vertices[i],b=vertices[j];
  if((a.z>p.z)!==(b.z>p.z)&&
   p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)yes=!yes;
 }
 return yes;
};
const hash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const validGeo=g=>Array.isArray(g)&&g.length>=2&&g.every(p=>
 Number.isFinite(p.lat)&&Number.isFinite(p.lon));
const edgeDistance=(p,poly)=>Math.min(...poly.map((a,i)=>
 distLine(p,a,poly[(i+1)%poly.length])));
function seeded(seed){return()=>{
 seed=(Math.imul(seed,1664525)+1013904223)>>>0;
 return seed/4294967296;
};}
export function planRakouskaFrontage5266({
 regionId,building,road,entryPlan
}={}){
 const S=RAKOUSKA_FRONTAGE_5266,g=building?.geometry,rg=road?.geometry;
 if(regionId!=='mlada'||String(building?.id)!==S.buildingId||
  String(road?.id)!==S.roadId||
  building.tags?.building!=='yes'||
  building.tags?.source!=='cuzk:ruian'||
  building.tags?.['ref:ruian:building']!==S.ruian||
  Object.keys(building.tags).length!==3||
  road.tags?.highway!=='residential'||
  road.tags?.name!=='Rakouská'||road.tags?.lit!=='yes'||
  road.tags?.maxspeed!=='30'||Object.keys(road.tags).length!==4||
  !validGeo(g)||g.length!==29||!validGeo(rg)||rg.length!==19||
  g[0].lat!==g.at(-1).lat||g[0].lon!==g.at(-1).lon||
  hash(g)!==S.buildingHash||hash(rg)!==S.roadHash||
  entryPlan?.version!=='5.265'||
  entryPlan.sourceOsmId!==S.buildingId||
  entryPlan.sourceHash!==S.buildingHash||
  entryPlan.sourcePhoto!==S.photo||
  entryPlan.originalWallEdge!==2||
  entryPlan.newColliders!==0||
  !Array.isArray(entryPlan.canopyCorners)||
  entryPlan.canopyCorners.length!==4)return null;
 const poly=g.slice(0,-1).map(world),base=rg.map(world),
  roadLength=len(base[5],base[6]);
 if(roadLength<57.2||roadLength>57.3)return null;
 const dx=(base[6].x-base[5].x)/roadLength,
  dz=(base[6].z-base[5].z)/roadLength,
  normal={x:dz,z:-dx};
 const location=(fraction,offset)=>({
  x:base[5].x+(base[6].x-base[5].x)*fraction+
   normal.x*offset,
  z:base[5].z+(base[6].z-base[5].z)*fraction+
   normal.z*offset
 });
 const start=location(S.roadStartFraction,S.fenceModelOffsetMetres),
  end=location(S.roadEndFraction,S.fenceModelOffsetMetres);
 const fenceLength=len(start,end),samples=[];
 if(fenceLength<37.7||fenceLength>37.9)return null;
 for(let i=0;i<=96;i++){
  const u=i/96,p={x:start.x+(end.x-start.x)*u,
   z:start.z+(end.z-start.z)*u};
  const fromRoad=distLine(p,base[5],base[6]),
   fromBuilding=edgeDistance(p,poly),
   fromCanopy=Math.min(...entryPlan.canopyCorners.map((q,j)=>
    distLine(p,q,entryPlan.canopyCorners[(j+1)%4])));
  if(inside(p,poly)||inside(p,entryPlan.canopyCorners)||
   fromBuilding<1.5||fromRoad<4.7||fromCanopy<1.2)
   return null;
  samples.push({p,fromRoad,fromBuilding,fromCanopy});
 }
 let seed=seeded(5266086),weeds=[],shrubs=[];
 // Vegetation occupies the photographically observed frontage band.
 // No precise shrub coordinate is implied by the photo.
 for(let i=0;i<260;i++){
  const fraction=.135+seed()*.630,offset=5.5+seed()*2.6,
   candidate=location(fraction,offset);
  if(inside(candidate,poly)||
   inside(candidate,entryPlan.canopyCorners)||
   edgeDistance(candidate,poly)<1.35||
   Math.min(...entryPlan.canopyCorners.map((q,j)=>
    distLine(candidate,q,entryPlan.canopyCorners[(j+1)%4])))<1.15)
   continue;
  if(weeds.length<86){
   weeds.push({p:candidate,height:.37+seed()*.70,
    spread:.24+seed()*.37,seed:i});
  }else if(shrubs.length<10){
   shrubs.push({p:candidate,height:.65+seed()*.65,
    spread:.35+seed()*.42,seed:i});
  }
  if(weeds.length===86&&shrubs.length===10)break;
 }
 if(weeds.length<62||shrubs.length<7)return null;
 return {version:'5.266',
  buildingId:S.buildingId,ruian:S.ruian,originalHash:S.buildingHash,
  roadId:S.roadId,roadHash:S.roadHash,
  photo:S.photo,author:S.author,license:S.license,
  sourceRoadAnchorPoints:2,modelFenceStart:start,modelFenceEnd:end,
  fenceLengthMetres:+fenceLength.toFixed(2),fenceHeight:S.fenceModelHeightMetres,
  modelOffsetFromRoadCentreline:S.fenceModelOffsetMetres,
  minRoadCentrelineGapMetres:+Math.min(...samples.map(x=>x.fromRoad)).toFixed(3),
  minBuildingGapMetres:+Math.min(...samples.map(x=>x.fromBuilding)).toFixed(3),
  minCanopyGapMetres:+Math.min(...samples.map(x=>x.fromCanopy)).toFixed(3),
  road:base,footprint:poly,canopy:entryPlan.canopyCorners,
  weeds,shrubs,fenceSurveyed:false,vegetationSurveyed:false,
  photoFencePresent:true,photoOvergrowthPresent:true,
  fenceRouteInferredFromRoad:true,photoObjectShapesEstimated:true,
  newMappedBarriers:0,newTrees:0,newGates:0,newEntrances:0,
  newColliders:0,newRoads:0,newFootways:0,newTrafficChanges:0
 };
}
export function renderRakouskaFrontage5266(THREE,{
 plan,layer,terrainAt
}={}){
 if(plan?.version!=='5.266'||!THREE||!layer||
  !plan.photoFencePresent||plan.newColliders!==0||
  typeof terrainAt!=='function')return null;
 const metal=[],weeds=[],shrubs=[];
 const vert=(x,y,z)=>({x,y,z});
 const tri=(dst,a,b,c)=>{for(const p of [a,b,c])dst.push(p.x,p.y,p.z);};
 const quad=(dst,a,b,c,d)=>{tri(dst,a,b,c);tri(dst,a,c,d);};
 const ground=p=>{
  const h=terrainAt(p.x,p.z);
  return Number.isFinite(h)?h+.065:0.065;
 };
 const a=plan.modelFenceStart,b=plan.modelFenceEnd;
 const fenceVec={x:(b.x-a.x)/plan.fenceLengthMetres,
  z:(b.z-a.z)/plan.fenceLengthMetres};
 const cross={x:-fenceVec.z,z:fenceVec.x};
 const fencePoint=t=>({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t});
 const fenceStrip=(t0,t1,y0,y1,offset=0)=>{
  const p=fencePoint(t0),q=fencePoint(t1),heightP=ground(p),
   heightQ=ground(q);
  quad(metal,
   vert(p.x+cross.x*offset,heightP+y0,p.z+cross.z*offset),
   vert(q.x+cross.x*offset,heightQ+y0,q.z+cross.z*offset),
   vert(q.x+cross.x*offset,heightQ+y1,q.z+cross.z*offset),
   vert(p.x+cross.x*offset,heightP+y1,p.z+cross.z*offset));
 };
 const posts=Math.ceil(plan.fenceLengthMetres/.24);
 for(let j=0;j<=posts;j++){
  const t=j/posts,half=.022/plan.fenceLengthMetres;
  fenceStrip(Math.max(0,t-half),Math.min(1,t+half),0,plan.fenceHeight);
 }
 const heavy=Math.ceil(plan.fenceLengthMetres/2.6);
 for(let j=0;j<=heavy;j++){
  const t=j/heavy,half=.055/plan.fenceLengthMetres;
  fenceStrip(Math.max(0,t-half),Math.min(1,t+half),
   -.035,plan.fenceHeight+.12,.025);
 }
 // Rails are terrain-draped in short 1.2 m segments, not suspended in air.
 const railSections=Math.ceil(plan.fenceLengthMetres/1.2);
 for(let k=0;k<railSections;k++){
  const start=k/railSections,end=(k+1)/railSections;
  for(const y of [.20,.92])fenceStrip(start,end,y-.028,y+.028,-.016);
 }
 const grassTriangle=(out,p,h,span,angle)=>{
  const g=ground(p),c=Math.cos(angle),s=Math.sin(angle);
  const p0=vert(p.x-c*span*.5,g,p.z-s*span*.5),
   p1=vert(p.x+c*span*.5,g,p.z+s*span*.5),
   p2=vert(p.x+s*span*.13,g+h,p.z-c*span*.13);
  tri(out,p0,p1,p2);tri(out,p1,p0,p2);
 };
 for(const w of plan.weeds){
  const angle=w.seed*2.399;
  grassTriangle(weeds,w.p,w.height,w.spread,angle);
  grassTriangle(weeds,w.p,w.height*.79,w.spread*.77,angle+1.047);
  grassTriangle(weeds,w.p,w.height*.93,w.spread*.88,angle+2.094);
 }
 for(const v of plan.shrubs){
  const gh=ground(v.p),h=v.height,s=v.spread;
  const top=vert(v.p.x,gh+h,v.p.z);
  for(let j=0;j<7;j++){
   const a=j*2*Math.PI/7,b=(j+1)*2*Math.PI/7;
   const r1=vert(v.p.x+Math.cos(a)*s,gh+.15,v.p.z+Math.sin(a)*s),
    r2=vert(v.p.x+Math.cos(b)*s,gh+.15,v.p.z+Math.sin(b)*s);
   tri(shrubs,r1,r2,top);tri(shrubs,r2,r1,top);
  }
 }
 const meshes=[];
 for(const [name,vertices,color,opacity] of [
  ['green-photographed-fence',metal,'#45665a',1],
  ['model-weed-stems',weeds,'#6d7841',.90],
  ['model-low-bushes',shrubs,'#51683c',1]
 ]){
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',
   new THREE.Float32BufferAttribute(vertices,3));
  geometry.computeVertexNormals();geometry.computeBoundingSphere();
  const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({
   color,roughness:1,side:THREE.DoubleSide,
   transparent:opacity<1,opacity,depthWrite:opacity===1
  }));
  mesh.name='Milovice_Rakouska_5266_'+name;
  mesh.userData.lodDetail=true;
  mesh.receiveShadow=false;
  layer.add(mesh);meshes.push(mesh);
 }
 return {version:'5.266',fenceLengthMetres:plan.fenceLengthMetres,
  fencePickets:posts+1,fenceSupportPosts:heavy+1,
  weedClusters:plan.weeds.length,bushClusters:plan.shrubs.length,
  fenceTriangles:metal.length/9,weedTriangles:weeds.length/9,
  shrubTriangles:shrubs.length/9,drawMeshes:meshes.length,
  fenceActuallySurveyed:false,vegetationActuallySurveyed:false,
  newMappedBarriers:0,newTrees:0,newColliders:0,newGates:0,
  geometryFinite:meshes.every(m=>
   m.geometry.attributes.position.array.every(Number.isFinite)),
  inScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(m=>m.parent===layer&&m.visible).length};
}
