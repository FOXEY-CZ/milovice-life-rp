/** Milovice RP 5.189: 2020 tender-informed west facade GLASS SCALE,
 * not a survey of its bays. The published bill lists 2.4m-wide blinds,
 * but their individual GPS / room allocation is NOT disclosed.
 * Keep the original school wall, OSM vertices, foundation and colliders.
 */
export const SLUNICKO_WEST_WINDOWS_5189=Object.freeze({
 sourceOSMId:'53865699',sourceHash:'912f8e04',westEdgeIndex:1,
 source:'https://www.e-zakazky.cz/stazenisouboru/61b37d16-23a5-4b6b-ae61-13e546a3e2ad',
 documentedBlindWidthMeters:2.4,documentedBlindHeightMeters:1.8,
 inferredModelColumns:9,inferredModelRows:4,inferredModelPitchMeters:4.4,
 photoVerifiedExactBayCount:false,documentedWindowsAllocatedToWest:false
});
const hash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const meters=(a,b)=>Math.hypot(
 (a.lat-b.lat)*111320,(a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180)
);
export function planSlunickoWestWindows5189({westPlan,geometry}={}){
 const cfg=SLUNICKO_WEST_WINDOWS_5189;
 if(westPlan?.version!=='5.154'||westPlan.sourceOSMId!==cfg.sourceOSMId||
  westPlan.originalOSMGeometryUntouched!==true||
  westPlan.westEdgeIndex!==cfg.westEdgeIndex||
  westPlan.modelHeightMeters!==13.15||
  !Array.isArray(geometry)||geometry.length!==9||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(geometry)!==cfg.sourceHash||
  Math.abs(meters(geometry[1],geometry[2])-westPlan.westEdgeMeters)>.02)
  return null;
 return {
  version:'5.189',sourceOSMId:cfg.sourceOSMId,
  sourceHash:cfg.sourceHash,westEdgeIndex:cfg.westEdgeIndex,
  sourceGeometry:geometry,
  originalWestLengthMeters:westPlan.westEdgeMeters,
  modelHeightMeters:westPlan.modelHeightMeters,
  modelColumns:cfg.inferredModelColumns,modelRows:cfg.inferredModelRows,
  modelWindowWidthMeters:cfg.documentedBlindWidthMeters,
  modelWindowHeightMeters:cfg.documentedBlindHeightMeters,
  modelWindowPitchMeters:cfg.inferredModelPitchMeters,
  estimatedWindowBays:cfg.inferredModelColumns*cfg.inferredModelRows,
  sourceBill:cfg.source,allWindowLocationsEstimated:true,
  westAssignmentOfTenderUnitsUnverified:true,windowColourPhotoVerified:false,
  newRealDoors:0,newBalconies:0,newRoads:0,newColliders:0,
  changedOSMGeometry:false,changedBuildingHeight:false
 };
}
export function renderSlunickoWestWindows5189(THREE,{
 plan,toWorld,baseHeight,layer
}={}){
 if(plan?.version!=='5.189'||!THREE?.BufferGeometry||
  !THREE?.Float32BufferAttribute||!THREE?.MeshStandardMaterial||
  !THREE?.Mesh||typeof toWorld!=='function'||!Number.isFinite(baseHeight)||
  !layer?.add)return null;
 const g=plan.sourceGeometry;
 const a=toWorld(g[1]),b=toWorld(g[2]);
 if(![a?.x,a?.y,b?.x,b?.y].every(Number.isFinite))return null;
 const len=Math.hypot(b.x-a.x,b.y-a.y);
 if(Math.abs(len-plan.originalWestLengthMeters)>.2)return null;
 const ux=(b.x-a.x)/len,uz=(b.y-a.y)/len,nx=uz,nz=-ux;
 if(nx>-.95)return null; // west-facing original RUIAN edge
 const buffers=[[],[],[]];
 const pt=(x,y,offset)=>({
  x:(a.x+b.x)/2+ux*x+nx*offset,
  y:baseHeight+y,z:(a.y+b.y)/2+uz*x+nz*offset
 });
 const tri=(k,a,b,c)=>buffers[k].push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);
 const rect=(k,left,right,low,high,out)=>{
  const a=pt(left,low,out),b=pt(right,low,out),
   c=pt(right,high,out),d=pt(left,high,out);
  tri(k,a,b,c);tri(k,a,c,d);
 };
 const width=plan.modelWindowWidthMeters,height=plan.modelWindowHeightMeters;
 for(let floor=0;floor<plan.modelRows;floor++){
  const y=1.6+floor*3.03;
  for(let col=0;col<plan.modelColumns;col++){
   const x=(col-(plan.modelColumns-1)/2)*plan.modelWindowPitchMeters;
   const left=x-width/2,right=x+width/2,low=y-height/2,high=y+height/2;
   const edge=.09;
   rect(0,left,left+edge,low,high,.075);
   rect(0,right-edge,right,low,high,.075);
   rect(0,left+edge,right-edge,low,low+edge,.075);
   rect(0,left+edge,right-edge,high-edge,high,.075);
   rect(1,left+edge,right-edge,low+edge,high-edge,.098);
   rect(0,x-.05,x+.05,low+edge,high-edge,.115);
   rect(2,left-.08,right+.08,low-.09,low+.02,.128);
  }
 }
 const colors=[0xd3d7d2,0x7895a4,0xb8b7ad];
 const meshes=buffers.map((verts,k)=>{
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  geo.computeVertexNormals();geo.computeBoundingSphere();
  const material=new THREE.MeshStandardMaterial({
   color:colors[k],metalness:k===1?.08:0,roughness:k===1?.34:.85,
   side:THREE.DoubleSide
  });
  const mesh=new THREE.Mesh(geo,material);
  mesh.name='Milovice_Slunicko_West_Estimated_'+['Frames','Glass','Sills'][k]+'_5189';
  mesh.userData.lodDetail=false;
  mesh.userData.estimatedWindowPositions=true;
  mesh.userData.sourceOSMId=plan.sourceOSMId;
  mesh.receiveShadow=true;layer.add(mesh);return mesh;
 });
 const visible=m=>{for(let n=m;n;n=n.parent)if(!n.visible)return false;return true};
 return {
  version:'5.189',sourceOSMId:plan.sourceOSMId,
  renderedWestBays:plan.estimatedWindowBays,
  documentReportedWidthMeters:width,windowPositionsEstimated:true,
  renderedMeshes:meshes.length,
  gpuTriangles:buffers.reduce((sum,b)=>sum+b.length/9,0),
  inScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(visible).length,
  addedColliders:0,newDoorPositions:0,
  originalFootprintPreserved:true
 };
}
