/** 5.146: 2024 Sportovní photo documents the northern pavement beside
 * the sports hall. Its exact geometry is NOT in our OSM export.
 * Draw a visual-only, 49m inferred paved strip from the EXISTING road,
 * not an OSM way, routing edge, crossing, or collision object. */
export const SPORTOVNI_NORTHWALK_5146=Object.freeze({
 region:'mlada',road:'8618266',roadHash:'e9f06930',roadNodes:4,
 south:'1316882852',southHash:'a50c0251',southNodes:28,
 photo:'https://commons.wikimedia.org/wiki/File:Sportovn%C3%AD_(3).jpg',
 photoDate:'2024-06-06',license:'CC BY-SA 3.0',sidewalkWidth:1.85,
 roadMargin:.08,westTrim:2,eastTrim:8
});
const P=p=>({x:p?.x,z:p?.z??p?.y});
function hash(g){
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16).padStart(8,'0');
}
function distanceToSegment(p,a,b){
 const dx=b.x-a.x,dz=b.z-a.z,len2=dx*dx+dz*dz;
 const t=len2>0?Math.max(0,Math.min(1,
  ((p.x-a.x)*dx+(p.z-a.z)*dz)/len2)):0;
 return Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t);
}
export function planSportovniPhotoNorthWalk({
 regionId,ways,toWorld,roadWidth,roads,buildings
}={}){
 const s=SPORTOVNI_NORTHWALK_5146;
 if(regionId!==s.region||!Array.isArray(ways)||
  typeof toWorld!=='function'||!Number.isFinite(roadWidth)||
  roadWidth<6.5||roadWidth>9.0)return null;
 const find=id=>ways.filter(w=>String(w?.id)===id);
 const road=find(s.road),foot=find(s.south);
 if(road.length!==1||foot.length!==1)return null;
 const r=road[0],f=foot[0];
 const validGeo=(w,n,h)=>Array.isArray(w?.geometry)&&
  w.geometry.length===n&&w.geometry.every(p=>
   Number.isFinite(p.lat)&&Number.isFinite(p.lon))&&
  hash(w.geometry)===h;
 if(r.tags?.highway!=='residential'||r.tags?.name!=='Sportovní'||
  r.tags.oneway||r.tags.width||r.tags.surface||
  !validGeo(r,s.roadNodes,s.roadHash)||
  f.tags?.highway!=='footway'||f.tags?.footway!=='sidewalk'||
  f.tags?.surface!=='paving_stones'||f.tags?.lit!=='yes'||
  !validGeo(f,s.southNodes,s.southHash))return null;
 const a=P(toWorld(r.geometry[2])),b=P(toWorld(r.geometry[3]));
 if(![a.x,a.z,b.x,b.z].every(Number.isFinite))return null;
 const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
 if(len<58||len>60||dx<50||Math.abs(dz)>7)return null;
 const ux=dx/len,uz=dz/len,normal={x:uz,z:-ux};
 if(normal.z>-.9)return null; // geographic NORTH, not random left
 const width=s.sidewalkWidth,offset=roadWidth/2+s.roadMargin+width/2,
  meters=len-s.westTrim-s.eastTrim;
 if(meters<46||meters>51)return null;
 const n=Math.ceil(meters/2.5),samples=[];
 for(let i=0;i<=n;i++){
  const along=s.westTrim+meters*i/n,roadPt={
   x:a.x+ux*along,z:a.z+uz*along};
  const center={x:roadPt.x+normal.x*offset,
   z:roadPt.z+normal.z*offset};
  const inner={x:center.x-normal.x*width/2,
   z:center.z-normal.z*width/2};
  const outer={x:center.x+normal.x*width/2,
   z:center.z+normal.z*width/2};
  if(roads?.isClear&&!roads.isClear(center.x,center.z,.2,.05)||
   buildings?.isClear&&!buildings.isClear(center.x,center.z,1.1))
   return null;
  samples.push({center,inner,outer,along});
 }
 // An EXISTING mapped north footway would supersede this approximation.
 let nearest=Infinity;
 for(const w of ways){
  if(!['footway','path'].includes(w.tags?.highway)||
   w.tags?.footway==='crossing'||w.geometry?.length<2||
   !w.geometry.some(p=>Math.abs(p.lat-50.2306)<.0015&&
    Math.abs(p.lon-14.8659)<.002))continue;
  const g=w.geometry.map(x=>P(toWorld(x)));
  for(let k=1;k<g.length;k++)
   for(const point of samples)
    nearest=Math.min(nearest,distanceToSegment(point.center,g[k-1],g[k]));
 }
 if(nearest<2.25)return null;
 return {
  version:'5.146',sourceRoadId:s.road,sourceRoadHash:s.roadHash,
  sourceSouthernSidewalkId:s.south,sourceSouthernHash:s.southHash,
  sourcePhoto:s.photo,modelVisualOnly:true,photoProvesExistence:true,
  exactPositionUnsurveyed:true,modelWidthMeters:width,
  modelNorthLengthMeters:+meters.toFixed(2),
  nearestMappedFootwayMeters:isFinite(nearest)?+nearest.toFixed(2):null,
  samples,originalOSMRoadUntouched:true,originalSouthernWalkUntouched:true,
  stopsBeforeTopolovaJunction:true,stopsBeforeWestJunction:true,
  noNewOSMFootway:true,addedRoutingEdges:0,addedColliders:0,
  changedRoadCenterlines:0,addedZebras:0,addedParking:0,
  addedTrees:0,addedLamps:0,addedBuildings:0
 };
}
export function renderSportovniPhotoNorthWalk(THREE,{
 layer,terrainAt,plan,material,kerbMaterial
}={}){
 if(!THREE||!layer?.add||typeof terrainAt!=='function'||
  !material||!kerbMaterial||plan?.version!=='5.146'||
  plan.samples?.length<12)return null;
 const top=[],uv=[],curb=[],indices=[],curbIndex=[];
 for(let i=0;i<plan.samples.length;i++){
  const p=plan.samples[i];
  for(const [j,x] of [p.inner,p.outer].entries()){
   top.push(x.x,terrainAt(x.x,x.z)+.215,x.z);
   uv.push(j,p.along/8);
  }
  const y=terrainAt(p.inner.x,p.inner.z);
  curb.push(p.inner.x,y+.215,p.inner.z,p.inner.x,y+.163,p.inner.z);
  if(i){const a=2*(i-1),b=2*i;
   indices.push(a,b,a+1,a+1,b,b+1);
   curbIndex.push(a,a+1,b,a+1,b+1,b)}
 }
 const make=(pos,ind,mat,name,coords)=>{
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  if(coords)geo.setAttribute('uv',
   new THREE.Float32BufferAttribute(coords,2));
  geo.setIndex(ind);geo.computeVertexNormals();geo.computeBoundingSphere();
  const mesh=new THREE.Mesh(geo,mat);mesh.name=name;mesh.receiveShadow=true;
  const center=plan.samples[Math.floor(plan.samples.length/2)].center;
  mesh.userData.lodX=center.x;mesh.userData.lodZ=center.z;
  mesh.userData.photoDerivedNotGeodetic=true;layer.add(mesh);
  return mesh;
 };
 const meshes=[
  make(top,indices,material,'Milovice_Sportovni_NorthWalk_5146',uv),
  make(curb,curbIndex,kerbMaterial,'Milovice_Sportovni_NorthKerb_5146')
 ];
 const visible=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true};
 return {meshCount:meshes.length,
  visibleMeshes:()=>meshes.filter(visible).length,
  triangles:(indices.length+curbIndex.length)/3};
}
