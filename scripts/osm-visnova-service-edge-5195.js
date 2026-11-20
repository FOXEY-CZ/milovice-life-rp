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
  if(coords.some(p=>![p?.x,p?.y].every(Number.isFinite)))return null;
  // 5.196: each source vertex has ONE shared pair of offset points.
  // Adjacent strips therefore meet at exactly the same mitered corner.
  const normals=[];
  for(let i=1;i<coords.length;i++){
   const a=coords[i-1],b=coords[i],dx=b.x-a.x,dz=b.y-a.y;
   const len=Math.hypot(dx,dz);
   if(!Number.isFinite(len)||len<.2)return null;
   normals.push({x:-dz/len,z:dx/len});
  }
  const offsets=coords.map((c,i)=>{
   const before=normals[Math.max(0,i-1)];
   const after=normals[Math.min(normals.length-1,i)];
   const x=before.x+after.x,z=before.z+after.z;
   const norm=Math.hypot(x,z);
   if(norm<.2)return null; // near-hairpin, do not create giant miters
   const mx=x/norm,mz=z/norm;
   const dot=mx*after.x+mz*after.z;
   if(dot<.67)return null; // cap miter ratio <= 1.5
   const scale=1/dot;
   return [-1,1].map(side=>[half-band,half].map(rad=>({
    x:c.x+mx*side*rad*scale,
    z:c.y+mz*side*rad*scale
   })));
  });
  if(offsets.some(x=>!x))return null;
  for(let i=1;i<coords.length;i++){
   for(let sideIndex=0;sideIndex<2;sideIndex++){
    const from=offsets[i-1][sideIndex],to=offsets[i][sideIndex];
    const [a0,a1]=from,[b0,b1]=to;
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

 // 5.196 continuous miter joints: no disconnected adjacent segment ends.
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
  sharedCornerJoins:1,cornerJointMethod:'shared-miter',
  triangles:vertices.length/9,meshCount:1,
  originalRoadCentrelineChanged:false,newRoads:0,
  newParkingBays:0,newColliders:0,
  rendered:()=>mesh.parent===layer,
  visibleAfterLOD:()=>mesh.parent===layer&&layer.visible&&mesh.visible};
}
