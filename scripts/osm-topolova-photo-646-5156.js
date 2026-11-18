/** Milovice 5.156 / Topolova 646.
 * 2025 contractor photos: 3 regular window rows + gabled attic dormers.
 * OSM/CZSO still say 1 total floor; above-ground count is NOT known in
 * official metadata. No source map changes, every model metre estimated.
 */
export const TOPOLOVA_646_5156=Object.freeze({
 region:'mlada',osmId:'53866048',ruian:'25789813',
 hash:'73d119b1',nodes:9,originalOSMLevels:'1',flats:'27',
 photo:'https://www.revitalizacebytovek.cz/realizace/topolova-646-milovice',
 photoDetail:'https://realizace.revitalizacebytovek.cz/images/milovice-topolova-646/milovice--topolova-646-3.jpg',
 csu:'https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=1914643&hkodcis=43&idob=1031339361&kod=537501&kodcis=43&kodpol=nnnnnn',
 eastEdge:5,westEdge:7,windowRows:3,modelDormers:8,
 modelFloorHeight:3.05,modelRoofRise:2.5
});
const hash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const meters=(p,q)=>Math.hypot(
 (p.lat-q.lat)*111320,
 (p.lon-q.lon)*111320*Math.cos(50.226*Math.PI/180));
export function planTopolova646Photo5156({
 id,regionId,tags,geometry,baseFloors,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const s=TOPOLOVA_646_5156;
 if(regionId!==s.region||String(id)!==s.osmId||
  photoReviewed||approvedArchitecture||
  tags?.building!=='residential'||
  tags['building:levels']!==s.originalOSMLevels||
  tags['building:flats']!==s.flats||
  tags['ref:ruian:building']!==s.ruian||
  tags.source!=='cuzk:ruian'||tags.height!==undefined||
  baseFloors!==1||!Array.isArray(geometry)||geometry.length!==s.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(geometry)!==s.hash)return null;
 const east=meters(geometry[5],geometry[6]);
 const west=meters(geometry[7],geometry[8]);
 if(Math.abs(east-43.046)>.09||Math.abs(west-43.021)>.09||
  (geometry[5].lon+geometry[6].lon)/2<
  (geometry[7].lon+geometry[8].lon)/2)return null;
 return {
  version:'5.156',sourceOSMId:s.osmId,sourceRUIANId:s.ruian,
  sourceOSMHash:s.hash,sourceOriginalLevels:1,sourceRegisteredFlats:27,
  photoWindowRows:3,photoGabledAttic:true,
  modelWallFloors:3,modelWallHeightMeters:9.15,
  modelRoofRiseMeters:2.5,modelDormers:8,
  photoSource:s.photo,photoDetail:s.photoDetail,officialSource:s.csu,
  eastPhotoEdgeIndex:s.eastEdge,westEdgeIndex:s.westEdge,
  eastLengthMeters:+east.toFixed(3),westLengthMeters:+west.toFixed(3),
  photoFaceOrientationInferred:true,exactDormerCountNotSurveyed:true,
  measuredBuildingHeight:false,officialAboveGroundFloorsNotKnown:true,
  sourceOSMLevelTagUnchanged:true,sourceOSMFootprintUnchanged:true,
  suppressUnverifiedEntrance:true,
  addedBuildings:0,addedRoads:0,addedFootways:0,addedColliders:0,
  addedTrees:0,addedLamps:0,addedParking:0
 };
}
/** A single photo-facing long facade, built with four BATCHED materials
 * rather than an independent mesh per photo-modelled window or dormer.
 * World outline points use {x,y} coordinates (y is map z).
 */
export function renderTopolova646Photo5156(THREE,{
 plan,outline,baseY,layer
}={}){
 if(!THREE||plan?.version!=='5.156'||!Array.isArray(outline)||
  outline.length!==9||!Number.isFinite(baseY)||!layer?.add)return null;
 const a=outline[5],b=outline[6];
 if(![a?.x,a?.y,b?.x,b?.y].every(Number.isFinite))return null;
 const len=Math.hypot(b.x-a.x,b.y-a.y);
 if(Math.abs(len-plan.eastLengthMeters)>.15)return null;
 const ux=(b.x-a.x)/len,uz=(b.y-a.y)/len,nx=uz,nz=-ux;
 if(nx<.95)return null; // east exterior of the original mapped polygon
 const grouped=[[],[],[],[]]; // peach plaster, white frames, glass, roof
 const at=(distance,height,normalOffset=.055)=>({
  x:a.x+ux*distance+nx*normalOffset,
  y:baseY+height,
  z:a.y+uz*distance+nz*normalOffset
 });
 const tri=(k,A,B,C)=>grouped[k].push(
  A.x,A.y,A.z,B.x,B.y,B.z,C.x,C.y,C.z);
 const quadPoints=(k,A,B,C,D)=>{tri(k,A,B,C);tri(k,A,C,D);};
 const rect=(k,left,right,bottom,top,out=.055)=>
  quadPoints(k,at(left,bottom,out),at(right,bottom,out),
   at(right,top,out),at(left,top,out));
 const n=plan.modelDormers,step=len/n,h=plan.modelWallHeightMeters;
 for(let i=0;i<=n;i++){
  const x=Math.max(.09,Math.min(len-.09,i*step));
  rect(0,Math.max(.09,x-.21),Math.min(len-.09,x+.21),.13,h-.13,.065);
 }
 rect(0,.08,len-.08,h-.24,h-.09,.065);
 for(let i=0;i<n;i++){
  const t=(i+.5)*step;
  for(const y of [1.65,4.70,7.75]){
   for(const dx of [-1.02,1.02]){
    rect(1,t+dx-.66,t+dx+.66,y-.82,y+.82,.08);
    rect(2,t+dx-.54,t+dx+.54,y-.69,y+.69,.084);
   }
  }
  const width=step*.38,lo=h+.13,peak=h+1.85;
  const L=at(t-width,lo,.14),R=at(t+width,lo,.14),
   A=at(t,peak,.14);
  tri(0,L,R,A);
  for(const dx of [-.58,.58]){
   rect(1,t+dx-.45,t+dx+.45,h+.32,h+1.08,.17);
   rect(2,t+dx-.36,t+dx+.36,h+.40,h+.98,.18);
  }
  const BL=at(t-width,lo+.10,-1.2),
   BR=at(t+width,lo+.10,-1.2),
   BA=at(t,peak-.38,-1.2);
  quadPoints(3,L,A,BA,BL);
  quadPoints(3,A,R,BR,BA);
 }
 const mats=[
  new THREE.MeshStandardMaterial({color:0xd68d71,roughness:.86,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0xf3f0e9,roughness:.81,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x859ea9,roughness:.37,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x773336,roughness:.72,side:THREE.DoubleSide})
 ];
 const names=['PeachBands','WindowFrames','Glass','DormerRoof'];
 const meshes=[];
 grouped.forEach((vertices,i)=>{
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geo.computeVertexNormals();geo.computeBoundingSphere();
  const mesh=new THREE.Mesh(geo,mats[i]);
  mesh.name='Milovice_Topolova646Photo_'+names[i]+'_5156';
  mesh.userData.lodX=(a.x+b.x)/2;
  mesh.userData.lodZ=(a.y+b.y)/2;
  mesh.userData.lodDetail=false;
  mesh.userData.sourcePhoto2025=true;
  mesh.receiveShadow=true;layer.add(mesh);meshes.push(mesh);
 });
 const visible=m=>{for(let p=m;p;p=p.parent)if(!p.visible)return false;return true};
 return {
  renderedMeshes:meshes.length,renderedTriangleCount:grouped.reduce((n,a)=>n+a.length/9,0),
  modelMainWindows:n*2*3,modelAtticWindows:n*2,modelGables:n,
  modelPhotoFacadeMeters:+len.toFixed(3),
  visibleAfterLOD:()=>meshes.filter(visible).length,
  allInScene:()=>meshes.every(m=>m.parent===layer)
 };
}
