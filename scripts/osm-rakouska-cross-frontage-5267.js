/** Milovice RP 5.267: photographed cross fence at Vojenske zatisi.
 * Source: Rakouská (Milovice) 15.jpg, S. Doronenko, 2025-08-20,
 * Wikimedia Commons CC BY-SA 4.0. Positions ARE NOT SURVEYED.
 * Model-only decoration; no OSM barrier, gate, road or collisions.
 */
export const RAKOUSKA_CROSS_5267=Object.freeze({
 building:'53865882',buildingHash:'7aec42bc',
 road:'8590288',roadHash:'7486fd8b',
 sideRoad:'8590286',sideHash:'916afa20',
 photo:'https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg',
 author:'Stanislav Doronenko',license:'CC BY-SA 4.0',modelGap:3.3
});
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const seg=(p,a,b)=>{
 const dx=b.x-a.x,dz=b.z-a.z,L=dx*dx+dz*dz;
 const t=L?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/L)):0;
 return Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t);
};
const pathGap=(p,line)=>Math.min(...line.slice(1).map((q,i)=>seg(p,line[i],q)));
const polyGap=(p,poly)=>Math.min(...poly.map((q,i)=>seg(p,q,poly[(i+1)%poly.length])));
const inside=(p,poly)=>{
 let yes=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.z>p.z)!==(b.z>p.z)&&p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)yes=!yes;
 }
 return yes;
};
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
export function planRakouskaCross5267({regionId,frontagePlan,entryPlan,sideRoad}={}){
 const S=RAKOUSKA_CROSS_5267,f=frontagePlan,e=entryPlan,g=sideRoad?.geometry;
 if(regionId!=='mlada'||f?.version!=='5.266'||e?.version!=='5.265'||
  f.buildingId!==S.building||f.originalHash!==S.buildingHash||
  f.roadId!==S.road||f.roadHash!==S.roadHash||
  f.photo!==S.photo||f.newColliders!==0||
  e.sourceOsmId!==S.building||e.sourceHash!==S.buildingHash||
  e.sourcePhoto!==S.photo||e.originalWallEdge!==2||
  String(sideRoad?.id)!==S.sideRoad||
  sideRoad.tags?.highway!=='residential'||Object.keys(sideRoad.tags).length!==1||
  !Array.isArray(g)||g.length!==3||
  !g.every(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon))||
  hash(g)!==S.sideHash||f.road?.length!==19||
  f.footprint?.length!==28||e.canopyCorners?.length!==4||
  !f.modelFenceStart)return null;
 const start=f.modelFenceStart,canopy=e.canopyCorners,target=canopy[2],
  full=dist(start,target),C=S.modelGap;
 if(full<16.9||full>17.2)return null;
 const t=(full-C)/full,end={x:start.x+(target.x-start.x)*t,
  z:start.z+(target.z-start.z)*t},length=dist(start,end),side=g.map(world);
 if(length<13.65||length>13.85)return null;
 let main=Infinity,other=Infinity,building=Infinity,aw=Infinity;
 for(let i=0;i<=100;i++){
  const u=i/100,p={x:start.x+(end.x-start.x)*u,z:start.z+(end.z-start.z)*u};
  if(inside(p,f.footprint)||inside(p,canopy))return null;
  main=Math.min(main,pathGap(p,f.road));other=Math.min(other,pathGap(p,side));
  building=Math.min(building,polyGap(p,f.footprint));
  aw=Math.min(aw,polyGap(p,canopy));
 }
 if(main<4.7||other<6.5||building<6.2||aw<3.2)return null;
 return {version:'5.267',start,end,lengthMetres:+length.toFixed(3),
  fenceHeight:f.fenceHeight,sourcePhoto:S.photo,
  buildingId:S.building,sourceRoadId:S.road,sideRoadId:S.sideRoad,
  minMainRoadGap:+main.toFixed(3),minSideRoadGap:+other.toFixed(3),
  minBuildingGap:+building.toFixed(3),minCanopyGap:+aw.toFixed(3),
  modelApproachGap:C,photoBacked:true,surveyed:false,
  newMappedBarriers:0,newGates:0,newEntrances:0,
  newColliders:0,newRoads:0,newFootways:0,newTrafficChanges:0};
}
export function renderRakouskaCross5267(THREE,{plan,layer,terrainAt}={}){
 if(plan?.version!=='5.267'||!THREE||!layer||
  typeof terrainAt!=='function'||plan.newColliders!==0)return null;
 const a=plan.start,b=plan.end,L=plan.lengthMetres,vtx=[];
 const nx=-(b.z-a.z)/L,nz=(b.x-a.x)/L;
 const point=t=>({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t});
 const ground=p=>{const y=terrainAt(p.x,p.z);return Number.isFinite(y)?y+.065:.065};
 const v=(x,y,z)=>({x,y,z});
 const tri=(a,b,c)=>{for(const p of [a,b,c])vtx.push(p.x,p.y,p.z)};
 const quad=(a,b,c,d)=>{tri(a,b,c);tri(a,c,d)};
 const strip=(t0,t1,y0,y1,offset=0)=>{
  const p=point(t0),q=point(t1),hp=ground(p),hq=ground(q);
  quad(v(p.x+nx*offset,hp+y0,p.z+nz*offset),
   v(q.x+nx*offset,hq+y0,q.z+nz*offset),
   v(q.x+nx*offset,hq+y1,q.z+nz*offset),
   v(p.x+nx*offset,hp+y1,p.z+nz*offset));
 };
 const posts=Math.ceil(L/.24),strong=Math.ceil(L/2.6),sections=Math.ceil(L/1.2);
 for(let i=0;i<=posts;i++){
  const t=i/posts,h=.022/L;
  strip(Math.max(0,t-h),Math.min(1,t+h),0,plan.fenceHeight);
 }
 for(let i=0;i<=strong;i++){
  const t=i/strong,h=.055/L;
  strip(Math.max(0,t-h),Math.min(1,t+h),-.035,plan.fenceHeight+.12,.025);
 }
 for(let i=0;i<sections;i++)for(const y of [.20,.92])
  strip(i/sections,(i+1)/sections,y-.028,y+.028,-.016);
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(vtx,3));
 geo.computeVertexNormals();geo.computeBoundingSphere();
 const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({
  color:'#45665a',roughness:1,side:THREE.DoubleSide}));
 mesh.name='Milovice_Rakouska_5267_transverse-photo-fence';
 mesh.userData.lodDetail=true;layer.add(mesh);
 return {version:'5.267',drawMeshes:1,pickets:posts+1,supports:strong+1,
  triangles:vtx.length/9,geometryFinite:vtx.every(Number.isFinite),
  inScene:()=>mesh.parent===layer,
  visibleAfterLOD:()=>Number(mesh.parent===layer&&mesh.visible)};
}
