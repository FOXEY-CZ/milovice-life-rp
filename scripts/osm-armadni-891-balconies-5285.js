/** 5.285: Armádní 891, cautious as-built balcony column on the likely SOUTH face.
 * Exterior photos 01-93 / milovice-23 at https://jirisimon.cz/milovice/
 * show three vertically aligned projecting balconies at the corner beside
 * the parking street. The OSM street runs EAST of the original building,
 * which makes the south face (OSM edge 6) the best photo-based inference.
 *
 * Exact balcony dimensions, position, facade bearing and materials are NOT
 * measured / geotagged. No other wall side is claimed photo-matched.
 * No third-party images are copied into game assets.
 */
import {ARMADNI_891_PHOTO_5284} from './osm-armadni-891-photo-wall-5284.js';
export const ARMADNI_891_BALCONIES_5285=Object.freeze({
 sourceOSMId:'1047406190',sourceRUIANId:'107125749',
 sourceHash:'e8e44d23',sourceNodes:11,
 photoSourceUrl:'https://jirisimon.cz/milovice/',
 exteriorPhotoFilenames:['01-93','milovice-20','milovice-23','milovice-24'],
 photoFaceInference:'southern face; adjacent mapped road to the east',
 sourceParkingRoadOSMId:'1046197816',
 facadeEdgeIndex:6,sourceEdgeLengthMetres:14.442,
 floors:[1,2,3],floorStepMetres:3.05,
 firstCentreFromEastMetres:1.98,
 modelWidthMetres:2.65,modelProjectionMetres:1.38,
 slabTopOffsetMetres:0.095,parapetHeightMetres:0.91,
 verifiedPhotoHasBalconyColumn:true,exactFacadeSideSurveyed:false,
 exactDimensionsVerified:false,exactBayPositionVerified:false
});
const hash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
export function planArmadni891Balconies5285(photoPlan){
 const c=ARMADNI_891_BALCONIES_5285,g=photoPlan?.sourceGeometry;
 if(photoPlan?.version!=='5.284'||
  photoPlan.sourceOSMId!==c.sourceOSMId||
  photoPlan.sourceRUIANId!==c.sourceRUIANId||
  photoPlan.sourceHash!==c.sourceHash||
  photoPlan.modelRooflineMetres!==12.2||
  photoPlan.sourceObservedTwoTone!==true||
  photoPlan.sourceUrl!==c.photoSourceUrl||
  !Array.isArray(g)||g.length!==c.sourceNodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  g[0].lat!==g.at(-1).lat||g[0].lon!==g.at(-1).lon||
  hash(g)!==c.sourceHash||
  c.sourceHash!==ARMADNI_891_PHOTO_5284.sourceHash)return null;
 const a=g[c.facadeEdgeIndex],b=g[c.facadeEdgeIndex+1];
 // Geographic south wall: OSM edge 6 trends west, south outward.
 const eastMetres=(b.lon-a.lon)*111320*Math.cos(50.226*Math.PI/180);
 const northMetres=(b.lat-a.lat)*111320;
 const len=Math.hypot(eastMetres,northMetres);
 if(Math.abs(len-c.sourceEdgeLengthMetres)>.18||
  !(eastMetres< -14&&northMetres>0&&northMetres<1.6)||
  c.firstCentreFromEastMetres-c.modelWidthMetres/2<.3||
  c.firstCentreFromEastMetres+c.modelWidthMetres/2>len-.4||
  c.floors.at(-1)*c.floorStepMetres+c.slabTopOffsetMetres+
   c.parapetHeightMetres>=photoPlan.modelRooflineMetres-.5)return null;
 return {version:'5.285',sourceOSMId:c.sourceOSMId,
  sourceRUIANId:c.sourceRUIANId,sourceGeometry:g,
  sourceHash:c.sourceHash,sourcePhotoUrl:c.photoSourceUrl,
  sourceRoadEastId:c.sourceParkingRoadOSMId,
  originalSouthEdgeIndex:c.facadeEdgeIndex,
  originalSouthEdgeLengthMetres:+len.toFixed(3),
  floors:c.floors.slice(),floorStepMetres:c.floorStepMetres,
  centerFromEastMetres:c.firstCentreFromEastMetres,
  widthMetres:c.modelWidthMetres,projectionMetres:c.modelProjectionMetres,
  slabTopOffsetMetres:c.slabTopOffsetMetres,
  parapetHeightMetres:c.parapetHeightMetres,
  positionIsPhotoInferred:true,exactPositionSurveyed:false,
  exactMaterialsSurveyed:false,
  modelBalconyCount:3,addedBalconies:3,
  addedBuildingShells:0,addedEntrances:0,addedRoofs:0,
  addedRoads:0,addedFootways:0,addedColliders:0};
}
const materialsCache=new WeakMap();
export function renderArmadni891Balconies5285(THREE,{plan,toWorld,baseHeight,layer}={}){
 if(plan?.version!=='5.285'||plan.sourceOSMId!==ARMADNI_891_BALCONIES_5285.sourceOSMId||
  !THREE?.Mesh||!THREE?.MeshStandardMaterial||
  !THREE?.BufferGeometry||!THREE?.Float32BufferAttribute||
  typeof toWorld!=='function'||!Number.isFinite(baseHeight)||!layer?.add)return null;
 const coords=plan.sourceGeometry.map(toWorld);
 if(coords.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))return null;
 const signedArea2=coords.slice(0,-1).reduce((sum,p,i)=>{
  const q=coords[i+1];return sum+p.x*q.y-p.y*q.x;
 },0);
 if(!Number.isFinite(signedArea2)||Math.abs(signedArea2)<.01)return null;
 const a=coords[plan.originalSouthEdgeIndex],
  b=coords[plan.originalSouthEdgeIndex+1],dx=b.x-a.x,dz=b.y-a.y;
 const len=Math.hypot(dx,dz);
 if(Math.abs(len-plan.originalSouthEdgeLengthMetres)>.18)return null;
 const outwardSign=Math.sign(signedArea2);
 const ux=dx/len,uz=dz/len,nx=outwardSign*uz,nz=-outwardSign*ux;
 // Actual south-facing exterior normal is required, not a generic reversed
 // polygon winding: protects against wrong-side or inner-wall placement.
 if(nz<.95)return null;
 const positions=[[],[],[],[],[]]; // slab, parapet, rails, door glass, opaque door backing
 const pos=(along,protrusion,height)=>[
  a.x+ux*along+nx*protrusion,
  baseHeight+height,
  a.y+uz*along+nz*protrusion
 ];
 const box=(kind,x0,x1,z0,z1,y0,y1)=>{
  if(!(x1>x0&&z1>z0&&y1>y0))throw Error('Invalid modeled balcony box');
  const v=[
   pos(x0,z0,y0),pos(x1,z0,y0),
   pos(x1,z1,y0),pos(x0,z1,y0),
   pos(x0,z0,y1),pos(x1,z0,y1),
   pos(x1,z1,y1),pos(x0,z1,y1)
  ];
  const quad=(i,j,k,l)=>positions[kind].push(
   ...v[i],...v[j],...v[k],...v[i],...v[k],...v[l]
  );
  quad(0,1,2,3);quad(4,7,6,5);
  quad(0,4,5,1);quad(1,5,6,2);
  quad(2,6,7,3);quad(3,7,4,0);
 };
 const first=plan.centerFromEastMetres-plan.widthMetres/2;
 const last=first+plan.widthMetres,depth=plan.projectionMetres;
 for(const floor of plan.floors){
  const top=floor*plan.floorStepMetres+plan.slabTopOffsetMetres;
  // Each photo-observed level has one estimated solid cantilevered slab,
  // a solid L/U parapet and a small dark handrail, not a guessed enclosure.
  box(0,first,last,.14,depth,top-.18,top);
  box(1,first,last,depth-.105,depth,top+.08,top+.83);
  box(1,first,first+.10,.22,depth,top+.08,top+.83);
  box(1,last-.10,last,.22,depth,top+.08,top+.83);
  box(2,first,last,depth-.09,depth+.035,top+.83,top+1.00);
  box(2,first,first+.10,.22,depth+.035,top+.83,top+1.00);
  box(2,last-.10,last,.22,depth+.035,top+.83,top+1.00);
  // Mask the provisional windows/sills behind each modeled door. This is
  // a dark backing panel, NOT a real wall cutout or surveyed door location.
  // Its exterior face (+.140m) clears source-window sill (+.128m), while
  // the translucent glass remains just in front (+.145m).
  box(4,plan.centerFromEastMetres-.77,
   plan.centerFromEastMetres+.77,.132,.140,top+.07,top+2.22);
  box(3,plan.centerFromEastMetres-.77,
   plan.centerFromEastMetres+.77,.145,.157,top+.07,top+2.22);
  box(2,plan.centerFromEastMetres-.02,
   plan.centerFromEastMetres+.02,.162,.185,top+.07,top+2.22);
 }
 let materials=materialsCache.get(THREE);
 if(!materials){
  const colors=[0xc7c3bd,0xd9d6d1,0x767d81,0x586d78,0x253841];
  materials=colors.map((color,i)=>new THREE.MeshStandardMaterial({
   color,side:THREE.DoubleSide,roughness:i===3?.42:.87,
   metalness:i===2?.28:0,
   ...(i===3?{transparent:true,opacity:.58,depthWrite:false}:{})
  }));
  materialsCache.set(THREE,materials);
 }
 const meshes=positions.map((vertices,i)=>{
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.computeVertexNormals();geometry.computeBoundingSphere();
  const mesh=new THREE.Mesh(geometry,materials[i]);
  mesh.name='Milovice_Armadni_891_PhotoInferredBalcony_'+
   ['Slab','Parapet','Rail','GlassDoor','DoorBacking'][i]+'_5285';
  mesh.userData.sourceOSMId=plan.sourceOSMId;
  mesh.userData.sourceFacadeEdge=plan.originalSouthEdgeIndex;
  mesh.userData.sourcePhotoUrl=plan.sourcePhotoUrl;
  mesh.userData.exactPlacementSurveyed=false;
  mesh.userData.lodDetail=false;
  mesh.receiveShadow=true;layer.add(mesh);return mesh;
 });
 const visible=m=>{
  for(let parent=m;parent;parent=parent.parent)if(!parent.visible)return false;
  return true;
 };
 return {version:'5.285',sourceOSMId:plan.sourceOSMId,
  sourceFacadeEdge:plan.originalSouthEdgeIndex,
  originalSourceGeometryRetained:true,
  balconyCount:plan.modelBalconyCount,photoOrientationInferred:true,
  exactPlacementSurveyed:false,meshCount:meshes.length,
  totalTriangles:positions.reduce((sum,v)=>sum+v.length/9,0),
  addedBuildings:0,addedEntrances:0,addedRoofs:0,
  addedRoads:0,addedFootways:0,addedColliders:0,
  allInScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(visible).length};
}

/** 5.286 — remove ONLY provisional source-window graphics that overlap the
 * three photo-inferred balcony-door overlays. No actual wall openings.
 * Invalid source/face/height combinations fail closed; other houses untouched.
 */
export function planArmadni891WindowOmissions5286(housePlan,balconyPlan){
 const c=ARMADNI_891_BALCONIES_5285;
 if(housePlan?.sourceFacadeVersion!=='5.282'||
  housePlan.sourceOSMId!==c.sourceOSMId||
  housePlan.sourceRUIANId!==c.sourceRUIANId||
  housePlan.sourceHash!==c.sourceHash||
  housePlan.sourceReportedFloors!==4||
  housePlan.estimatedWindows!==92||
  balconyPlan?.version!=='5.285'||
  balconyPlan.sourceOSMId!==c.sourceOSMId||
  balconyPlan.sourceRUIANId!==c.sourceRUIANId||
  balconyPlan.sourceHash!==c.sourceHash||
  balconyPlan.originalSouthEdgeIndex!==c.facadeEdgeIndex||
  Math.abs(balconyPlan.originalSouthEdgeLengthMetres-c.sourceEdgeLengthMetres)>.18||
  balconyPlan.centerFromEastMetres!==c.firstCentreFromEastMetres||
  balconyPlan.widthMetres!==c.modelWidthMetres||
  !Array.isArray(balconyPlan.floors)||
  balconyPlan.floors.join(',')!==c.floors.join(','))return null;
 const face=housePlan.facades.find(f=>f.edgeIndex===c.facadeEdgeIndex);
 if(!face||face.bays!==5||
  Math.abs(face.sourceLengthMetres-c.sourceEdgeLengthMetres)>.18)return null;
 const doorLeft=balconyPlan.centerFromEastMetres-.77;
 const doorRight=balconyPlan.centerFromEastMetres+.77;
 const overlapping=[];
 for(let bay=0;bay<face.bays;bay++){
  const center=(bay+.5)*face.sourceLengthMetres/face.bays;
  const left=center-housePlan.modelWindowWidthMetres/2;
  const right=center+housePlan.modelWindowWidthMetres/2;
  if(Math.min(right,doorRight)-Math.max(left,doorLeft)>.5)
   overlapping.push(bay);
 }
 // Exactly one original *estimated* window bay overlaps the model door.
 if(overlapping.length!==1||overlapping[0]!==0)return null;
 return balconyPlan.floors.map(floor=>Object.freeze({
  sourceOSMId:c.sourceOSMId,edgeIndex:c.facadeEdgeIndex,
  floor,bay:overlapping[0]
 }));
}
