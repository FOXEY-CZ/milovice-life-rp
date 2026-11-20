/** Milovice RP 5.202: RÚIAN-sourced two-level parking structure.
 * Original building walls/roof/collision stay in the city renderer. Only
 * an explicitly ESTIMATED garage-style upper screen is modelled; no
 * actual openings, ramps or entry locations are claimed as surveyed.
 */
export const VISNOVA_PARKING_HOUSE_5202=Object.freeze({
 id:'1025752710',region:'mlada',ruian:'105243469',
 polygonHash:'20bb417f',nodes:15,levels:2,
 visualEdges:Object.freeze([1,3,4,5,12,13]),
 approximateHeight:6.10,visualScreenHeight:1.28,
 photoVerified:false
});
const sourceHash=geometry=>{
 let h=2166136261;
 for(const c of geometry.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({
 x:p.lon*111320*Math.cos(50.226*Math.PI/180),z:-p.lat*111320
});
export function planVisnovaParkingHouse5202({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=VISNOVA_PARKING_HOUSE_5202;
 if(String(id)!==c.id||regionId!==c.region||photoReviewed||
  approvedArchitecture||tags?.amenity!=='parking'||
  tags.building!=='yes'||tags.parking!=='multi-storey'||
  tags['ref:ruian:building']!==c.ruian||
  tags.source!=='cuzk:ruian'||
  tags['building:levels']!==String(c.levels)||
  tags.height!==undefined||
  modelFloors!==c.levels||
  Math.abs(modelHeight-c.approximateHeight)>.005||
  !Array.isArray(geometry)||geometry.length!==c.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  sourceHash(geometry)!==c.polygonHash||
  geometry[0].lat!==geometry.at(-1).lat||
  geometry[0].lon!==geometry.at(-1).lon)return null;
 const coords=geometry.map(xy);
 const facades=[];
 for(const edge of c.visualEdges){
  const a=coords[edge],b=coords[edge+1];
  const length=Math.hypot(b.x-a.x,b.z-a.z);
  if(length<10||length>72)return null;
  facades.push({edge,length:+length.toFixed(3)});
 }
 return {version:'5.202',sourceOSMId:c.id,sourceRUIANId:c.ruian,
  sourceGeometry:geometry,sourceHash:c.polygonHash,levels:c.levels,
  facades,estimatedUpperScreens:facades.length,
  estimatedHeight:c.approximateHeight,
  exactFacadeAppearanceVerified:false,
  originalBuildingVolumeUnchanged:true,
  originalRoadsUnchanged:true,newParkingSpaces:0,newRamps:0,
  newEntrances:0,newColliders:0,newBuildingVolumes:0};
}
export function renderVisnovaParkingHouse5202(THREE,{
 plan,toWorld,baseHeight,layer
}={}){
 if(plan?.version!=='5.202'||plan.facades?.length!==6||
  !THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||
  !THREE?.MeshStandardMaterial||!THREE?.Mesh||
  typeof toWorld!=='function'||!Number.isFinite(baseHeight)||
  typeof layer?.add!=='function')return null;
 const coords=plan.sourceGeometry.map(toWorld);
 if(coords.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))return null;
 const panels=[],rails=[];
 const quad=(out,a,b,y0,y1,nx,nz,offset)=>{
  const pts=[
   [a.x+nx*offset,baseHeight+y0,a.y+nz*offset],
   [b.x+nx*offset,baseHeight+y0,b.y+nz*offset],
   [b.x+nx*offset,baseHeight+y1,b.y+nz*offset],
   [a.x+nx*offset,baseHeight+y1,a.y+nz*offset]
  ];
  for(const i of [0,1,2,0,2,3])out.push(...pts[i]);
 };
 let strips=0;
 for(const {edge,length} of plan.facades){
  const a=coords[edge],b=coords[edge+1];
  const dx=b.x-a.x,dz=b.y-a.y,len=Math.hypot(dx,dz);
  if(Math.abs(len-length)>.17)return null;
  // Exterior normal follows same CCW source convention as housing facades.
  const nx=dz/len,nz=-dx/len;
  const lower=3.3,upper=4.58;
  // An opaque model screen on the existing solid wall (NOT a physical hole).
  quad(panels,a,b,lower,upper,nx,nz,.083);
  for(let i=1;i<=3;i++){
   const y=lower+i*(upper-lower)/4;
   quad(rails,a,b,y-.065,y+.065,nx,nz,.113);strips++;
  }
 }
 const material=(color)=>new THREE.MeshStandardMaterial({
  color,roughness:.83,metalness:.10,side:THREE.DoubleSide
 });
 const meshes=[
  {name:'Parking_Mapped_Screen_5202',vertices:panels,color:0x526168},
  {name:'Parking_Model_Bands_5202',vertices:rails,color:0xb9b7af}
 ].map(({name,vertices,color})=>{
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  g.computeVertexNormals();g.computeBoundingSphere();
  const mesh=new THREE.Mesh(g,material(color));
  mesh.name=name;mesh.userData={sourceOSMId:plan.sourceOSMId,
   modelledParkingScreen:true,photoVerified:false,lodDetail:false};
  mesh.receiveShadow=true;layer.add(mesh);return mesh;
 });
 return {version:'5.202',sourceOSMId:plan.sourceOSMId,
  sourceRUIANId:plan.sourceRUIANId,facades:plan.facades.length,
  screenPanels:plan.facades.length,decorativeBands:strips,
  triangles:(panels.length+rails.length)/9,meshCount:2,
  noNewRoads:true,noNewParkingSpaces:true,noNewColliders:true,
  inScene:()=>meshes.every(m=>m.parent===layer),
  visibleMeshes:()=>meshes.filter(m=>{
   for(let n=m;n;n=n.parent)if(!n.visible)return false;
   return true;
  }).length};
}
