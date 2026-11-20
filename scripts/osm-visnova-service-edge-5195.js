/** Milovice RP 5.195 — two mapped service lanes immediately east of Višňová 572.
 * Visual edge bands follow the exact original OSM centreline. Their 4.5m
 * corridor width, band width, height and grey colour are game estimates:
 * NOT a claim that real concrete kerbs exist at these positions.
 */
export const VISNOVA_LANE_EDGES_5195=Object.freeze({
 region:'mlada',
 ways:Object.freeze([
  Object.freeze({id:'1201945276',hash:'5ec91c92',nodes:2,service:null,lit:null}),
  Object.freeze({id:'202399861',hash:'1e167cf8',nodes:3,service:'alley',lit:'yes'})
 ]),
 estimatedWidth:4.5,estimatedBandWidth:.13,photoVerified:false
});
const geoHash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
export function planVisnovaLaneEdges5195({regionId,ways}={}){
 if(regionId!==VISNOVA_LANE_EDGES_5195.region||!Array.isArray(ways))return null;
 const chosen=[];
 for(const c of VISNOVA_LANE_EDGES_5195.ways){
  const matches=ways.filter(w=>String(w.id)===c.id);
  if(matches.length!==1)return null;
  const w=matches[0],t=w.tags||{},g=w.geometry;
  if(t.highway!=='service'||(t.service||null)!==c.service||
   (t.lit||null)!==c.lit||!Array.isArray(g)||g.length!==c.nodes||
   g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   geoHash(g)!==c.hash)return null;
  chosen.push({id:c.id,geometry:g,tags:t,sourceHash:c.hash});
 }
 return {version:'5.195',regionId,ways:chosen,
  estimatedWidth:VISNOVA_LANE_EDGES_5195.estimatedWidth,
  estimatedBandWidth:VISNOVA_LANE_EDGES_5195.estimatedBandWidth,
  estimatedShape:true,photoVerified:false,
  sourceGeometryUntouched:true,newRoads:0,newFootways:0,
  newParkingBays:0,newColliders:0};
}
export function renderVisnovaLaneEdges5195(THREE,{
 plan,toWorld,terrainAt,layer
}={}){
 if(plan?.version!=='5.195'||plan.ways?.length!==2||
  !THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||
  !THREE?.MeshStandardMaterial||!THREE?.Mesh||
  typeof toWorld!=='function'||typeof terrainAt!=='function'||
  typeof layer?.add!=='function')return null;
 const vertices=[],uvs=[];
 const half=plan.estimatedWidth/2,band=plan.estimatedBandWidth;
 let sections=0;
 for(const w of plan.ways){
  const coords=w.geometry.map(toWorld);
  for(let i=1;i<coords.length;i++){
   const a=coords[i-1],b=coords[i];
   if(![a?.x,a?.y,b?.x,b?.y].every(Number.isFinite))return null;
   const dx=b.x-a.x,dz=b.y-a.y,len=Math.hypot(dx,dz);
   if(len<.2)return null;
   const nx=-dz/len,nz=dx/len;
   for(const side of [-1,1]){
    const offset0=side*(half-band),offset1=side*half;
    const p=(c,off)=>({
     x:c.x+nx*off,z:c.y+nz*off
    });
    const a0=p(a,offset0),a1=p(a,offset1),
      b0=p(b,offset0),b1=p(b,offset1);
    const tri=[a0,b0,a1,a1,b0,b1];
    for(const point of tri){
     const elev=terrainAt(point.x,point.z);
     if(!Number.isFinite(elev))return null;
     vertices.push(point.x,elev+.205,point.z);
     uvs.push(point.x*.2,point.z*.2);
    }
   }
   sections++;
  }
 }
 // Construct the only mesh after ALL inputs have passed validation.
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
 geometry.computeVertexNormals();geometry.computeBoundingSphere();
 const material=new THREE.MeshStandardMaterial({
  color:0xb7b6af,roughness:.96,metalness:0,side:THREE.DoubleSide
 });
 const mesh=new THREE.Mesh(geometry,material);
 mesh.name='Višňová_572_OSM_service_lane_edge_bands_5195';
 mesh.receiveShadow=true;
 mesh.userData={sourceWayIds:plan.ways.map(w=>w.id),
  estimatedKerbAppearance:true,lodDetail:false};
 layer.add(mesh);
 return {version:'5.195',sourceWayIds:plan.ways.map(w=>w.id),
  originalSegments:sections,edgeBands:sections*2,
  triangles:vertices.length/9,meshCount:1,
  originalRoadCentrelineChanged:false,newRoads:0,
  newParkingBays:0,newColliders:0,
  rendered:()=>mesh.parent===layer,
  visibleAfterLOD:()=>mesh.parent===layer&&layer.visible&&mesh.visible};
}
