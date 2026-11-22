/**
 * Milovice RP 5.265: photo-supported glazed vestibule at Vojenské zátiší.
 * Photo: Stanislav Doronenko, "Rakouská (Milovice) 15.jpg",
 * Wikimedia Commons, 20 Aug 2025, CC BY-SA 4.0:
 * https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg
 *
 * The photograph shows a glass-fronted entrance vestibule, thin glazed
 * wall bays and a broad flat canopy immediately BELOW a small upper balcony.
 * We use only the already mapped source wall 2 of OSM way 53865882,
 * RÚIAN 40057411; the exact vestibule location, projection, roof pitch,
 * bay count, balcony and materials are photo-informed MODEL ESTIMATES.
 * No original OSM edits, player-accessible entrance, collision or path.
 */
export const RAKOUSKA_GLAZED_ENTRY_5265=Object.freeze({
 regionId:'mlada',osmId:'53865882',ruianId:'40057411',
 footprintHash:'7aec42bc',wallEdge:2,
 sourcePhoto:'https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg',
 photoAuthor:'Stanislav Doronenko',photoDate:'2025-08-20',
 licence:'CC BY-SA 4.0',
 wallFrom:.07,wallTo:.93,projectionMetres:2.55,
 roofProjectionMetres:3.03,roofOverhangMetres:.34,
 roofFrontHeight:2.88,roofBackHeight:2.99,
 upperBalconyFrom:.05,upperBalconyTo:.385,
 photoMeasuredDimensions:false
});
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.z);
const dist=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);
const cross=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
const signedArea=p=>p.reduce((s,a,i)=>{
 const b=p[(i+1)%p.length];return s+a.x*b.z-b.x*a.z;
},0);
const pointInPoly=(p,poly)=>{
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.z>p.z)!==(b.z>p.z)&&p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)
   inside=!inside;
 }
 return inside;
};
export function planRakouskaGlazedEntry5265({upperPlan,windowPlan}={}){
 const C=RAKOUSKA_GLAZED_ENTRY_5265;
 if(upperPlan?.version!=='5.263'||windowPlan?.version!=='5.264'||
  upperPlan.sourceOsmId!==C.osmId||windowPlan.sourceOsmId!==C.osmId||
  upperPlan.sourceHash!==C.footprintHash||
  windowPlan.sourceHash!==C.footprintHash||
  upperPlan.sourceRuianId!==C.ruianId||
  windowPlan.sourceRuianId!==C.ruianId||
  upperPlan.sourcePhoto!==C.sourcePhoto||
  windowPlan.photo!==C.sourcePhoto||
  upperPlan.modelExtraHeight!==2.4||
  !Array.isArray(upperPlan.perimeter)||upperPlan.perimeter.length!==9||
  !upperPlan.perimeter.every(finite)||
  upperPlan.vertices?.join(',')!=='0,1,2,3,4,5,6,7,8'||
  windowPlan.originalUpperSourceEdges?.join(',')!=='0,2,7'||
  windowPlan.windowVisualCount!==6||
  !Number.isFinite(upperPlan.areaSquareMetres)||
  upperPlan.areaSquareMetres<55||upperPlan.areaSquareMetres>58||
  upperPlan.sourceFootprintPreserved!==true)return null;
 const shape=upperPlan.perimeter,sign=Math.sign(signedArea(shape));
 if(sign!==1)return null;
 const a=shape[C.wallEdge],b=shape[C.wallEdge+1],len=dist(a,b);
 if(!(len>5.66&&len<5.68)||cross(shape[0],a,b)===0)return null;
 const normal={x:sign*(b.z-a.z)/len,z:-sign*(b.x-a.x)/len};
 const coord=(t,projection)=>({
  x:a.x+(b.x-a.x)*t+normal.x*projection,
  z:a.z+(b.z-a.z)*t+normal.z*projection
 });
 const baseCorners=[
  coord(C.wallFrom,0),coord(C.wallTo,0),
  coord(C.wallTo,C.projectionMetres),coord(C.wallFrom,C.projectionMetres)
 ];
 const canopyCorners=[
  coord(C.wallFrom-C.roofOverhangMetres/len,-.20),
  coord(C.wallTo+C.roofOverhangMetres/len,-.20),
  coord(C.wallTo+C.roofOverhangMetres/len,C.roofProjectionMetres),
  coord(C.wallFrom-C.roofOverhangMetres/len,C.roofProjectionMetres)
 ];
 // Check actual projected model area lies entirely OUTSIDE the source wall.
 // Do not approve a "vestibule" embedded into a different part of this house.
 const topOutside=baseCorners.slice(2);
 if(topOutside.some(p=>pointInPoly(p,shape))||
  Math.abs(dist(baseCorners[0],baseCorners[1])-
   len*(C.wallTo-C.wallFrom))>.001||
  Math.abs(dist(baseCorners[2],baseCorners[3])-
   len*(C.wallTo-C.wallFrom))>.001)return null;
 const projectedArea=len*(C.wallTo-C.wallFrom)*C.projectionMetres;
 if(projectedArea<11||projectedArea>12.4)return null;
 return {version:'5.265',sourceOsmId:C.osmId,
  sourceRuianId:C.ruianId,sourceHash:C.footprintHash,
  sourcePhoto:C.sourcePhoto,author:C.photoAuthor,licence:C.licence,
  originalWallEdge:C.wallEdge,
  wallLengthMetres:+len.toFixed(3),
  anchorA:a,anchorB:b,normal,wallFrom:C.wallFrom,wallTo:C.wallTo,
  baseCorners,canopyCorners,
  projectedAreaSquareMetres:+projectedArea.toFixed(2),
  depthMetresEstimate:C.projectionMetres,
  roofFrontHeight:C.roofFrontHeight,roofBackHeight:C.roofBackHeight,
  upperBalconyFrom:C.upperBalconyFrom,upperBalconyTo:C.upperBalconyTo,
  photoGlazedVestibule:true,photoFlatWideAwning:true,photoUpperBalcony:true,
  dimensionsNotMeasured:true,noFootprintSurvey:true,
  // Physical mesh is only a visual "attachment", not a new OSM building.
  visualAttachmentCount:1,newOsmBuildings:0,newDoors:0,
  newInteractableEntrances:0,newColliders:0,newRoads:0,
  newFootways:0,newFenceSegments:0,originalRoofUnmodified:true};
}
export function renderRakouskaGlazedEntry5265(THREE,{
 plan,layer,baseHeight,roofHeight
}={}){
 if(plan?.version!=='5.265'||plan.originalWallEdge!==2||
  plan.visualAttachmentCount!==1||plan.newColliders!==0||
  !THREE||!layer||!Number.isFinite(baseHeight)||
  !Number.isFinite(roofHeight)||roofHeight<4||roofHeight>16)return null;
 const glass=[],metal=[],canopy=[],fascia=[],concrete=[];
 const width=plan.wallTo-plan.wallFrom;
 const local=(t,d,y)=>({
  x:plan.anchorA.x+
   (plan.anchorB.x-plan.anchorA.x)*t+plan.normal.x*d,
  y:baseHeight+y,
  z:plan.anchorA.z+
   (plan.anchorB.z-plan.anchorA.z)*t+plan.normal.z*d
 });
 const tri=(out,a,b,c)=>{
  for(const p of [a,b,c])out.push(p.x,p.y,p.z);
 };
 const quad=(out,a,b,c,d)=>{
  tri(out,a,b,c);tri(out,a,c,d);
 };
 const front=(out,l,r,b,t,depth=2.55)=>{
  quad(out,local(l,depth,b),local(r,depth,b),
   local(r,depth,t),local(l,depth,t));
 };
 const side=(out,t,l,r,b,y)=>{
  quad(out,local(t,l,b),local(t,r,b),
   local(t,r,y),local(t,l,y));
 };
 const frameBarFront=(t,b,top,radius=.035)=>{
  front(metal,t-radius/plan.wallLengthMetres,
   t+radius/plan.wallLengthMetres,b,top,2.576);
 };
 const frontCrossbar=(left,right,y,thick=.06)=>{
  front(metal,left,right,y-thick/2,y+thick/2,2.58);
 };
 const roofTop=(t,d)=>{
  const pitch=(d+.20)/(3.23);
  const y=plan.roofBackHeight*(1-pitch)+plan.roofFrontHeight*pitch;
  return local(t,d,y);
 };
 const roofBottom=(t,d)=>{
  const q=roofTop(t,d);return {...q,y:q.y-.145};
 };
 const C=RAKOUSKA_GLAZED_ENTRY_5265;
 const r0=C.wallFrom-C.roofOverhangMetres/plan.wallLengthMetres;
 const r1=C.wallTo+C.roofOverhangMetres/plan.wallLengthMetres;
 const rear=-.20,far=C.roofProjectionMetres;
 quad(canopy,roofTop(r0,rear),roofTop(r1,rear),
  roofTop(r1,far),roofTop(r0,far));
 quad(canopy,roofBottom(r0,rear),roofBottom(r1,rear),
  roofBottom(r1,far),roofBottom(r0,far));
 for(const [t0,d0,t1,d1] of [
  [r0,rear,r1,rear],[r1,rear,r1,far],
  [r1,far,r0,far],[r0,far,r0,rear]
 ]){
  quad(fascia,roofTop(t0,d0),roofTop(t1,d1),
   roofBottom(t1,d1),roofBottom(t0,d0));
 }
 // Front: six visible glass bays; two central bays suggest sliding glazing
 // without inventing an interactable doorway or physical cut through the wall.
 const left=C.wallFrom,right=C.wallTo;
 const yBottom=.12,yTop=2.73;
 for(let i=0;i<6;i++){
  const lo=left+width*i/6,hi=left+width*(i+1)/6;
  front(glass,lo,hi,yBottom,yTop,2.55);
 }
 // Two side returns. Back is existing photographic OSM source wall.
 for(const t of [left,right]){
  for(let i=0;i<3;i++){
   side(glass,t,2.55*i/3,2.55*(i+1)/3,yBottom,yTop);
  }
 }
 for(let i=0;i<=6;i++)
  frameBarFront(left+width*i/6,yBottom,yTop);
 frontCrossbar(left,right,.20);
 frontCrossbar(left,right,1.43,.042);
 frontCrossbar(left,right,2.70,.09);
 for(const t of [left,right]){
  for(const d of [0,1.275,2.55]){
   side(metal,t,d-.035,d+.035,yBottom,2.75);
  }
  for(const h of [.20,1.43,2.69])
   side(metal,t,0,2.55,h-.032,h+.032);
 }
 // Above the glass vestibule: thin, photographic small metal balcony
 // projecting from source wall. Relative placement/height = estimate.
 const bl=C.upperBalconyFrom,br=C.upperBalconyTo;
 const balconyLevel=3.58,depth=1.01;
 quad(concrete,local(bl,0,balconyLevel),local(br,0,balconyLevel),
  local(br,depth,balconyLevel),local(bl,depth,balconyLevel));
 quad(concrete,local(bl,0,balconyLevel-.14),local(br,0,balconyLevel-.14),
  local(br,depth,balconyLevel-.14),local(bl,depth,balconyLevel-.14));
 const railHeight=.86;
 for(const t of [bl,(bl+br)/2,br]){
  side(metal,t,depth-.038,depth+.038,balconyLevel,balconyLevel+railHeight);
 }
 side(metal,bl,0,depth,balconyLevel+railHeight-.055,
  balconyLevel+railHeight+.055);
 side(metal,br,0,depth,balconyLevel+railHeight-.055,
  balconyLevel+railHeight+.055);
 front(metal,bl,br,balconyLevel+railHeight-.04,
  balconyLevel+railHeight+.04,depth+.04);
 for(const y of [balconyLevel+.3,balconyLevel+.61]){
  front(metal,bl,br,y-.023,y+.023,depth+.046);
 }
 const meshes=[];
 for(const [name,vertices,materialProps] of [
  ['glazed-vestibule-bays',glass,{color:'#738e8b',roughness:.29,
   metalness:.04,transparent:true,opacity:.70,depthWrite:false,
   side:THREE.DoubleSide}],
  ['thin-metal-framing-and-balcony-rails',metal,{color:'#313c3b',
   metalness:.30,roughness:.70,side:THREE.DoubleSide}],
  ['overhanging-flat-entrance-canopy',canopy,{color:'#777973',
   roughness:.95,side:THREE.DoubleSide}],
  ['roof-edge-fascia',fascia,{color:'#4d5350',
   roughness:.92,side:THREE.DoubleSide}],
  ['small-balcony-slab',concrete,{color:'#c8c3ba',
   roughness:1,side:THREE.DoubleSide}]
 ]){
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.computeVertexNormals();geometry.computeBoundingSphere();
  const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial(materialProps));
  mesh.name='Milovice_Rakouska_5265_'+name;
  mesh.userData.lodDetail=true;mesh.receiveShadow=true;
  layer.add(mesh);meshes.push(mesh);
 }
 return {version:'5.265',sourceOsmId:plan.sourceOsmId,
  originalWallEdge:plan.originalWallEdge,
  vestibuleGlazingBays:12,frontGlazingBays:6,sideGlazingBays:6,
  photoBackedCanopy:true,balconyRailPresent:true,
  modelDimensionsNotMeasured:true,frontDepthMetres:plan.depthMetresEstimate,
  projectedAreaSquareMetres:plan.projectedAreaSquareMetres,
  drawMeshes:meshes.length,
  canopyTriangles:(canopy.length+fascia.length)/9,
  glassTriangles:glass.length/9,
  steelTriangles:metal.length/9,
  newOsmBuildings:0,newDoors:0,newColliders:0,newInteractableEntrances:0,
  geometryFinite:meshes.every(m=>m.geometry.attributes.position.array.every(Number.isFinite)),
  inScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(m=>m.parent===layer&&m.visible).length
 };
}
