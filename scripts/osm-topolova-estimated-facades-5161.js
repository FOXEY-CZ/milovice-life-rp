/** Milovice RP 5.161: conservative visual-only facade rhythm for 616–618.
 * The five adjoining parts 614–618 share a cadastral roof / four common
 * walls (5.155/5.160). The signed 2024 elevations cover 614 and 615 only.
 * City 2023 documents confirm real balconies at SOME flats 617/618, but do
 * NOT georeference window/balcony bays of 616/617/618. We extrapolate the
 * repeated 614/615 bay rhythm as an explicit MODEL, not a photo match.
 * We deliberately add ZERO speculative door canopies, external balconies,
 * pedestrian links, roof dormers, or colliders. Existing solid walls stay.
 */
export const TOPOLOVA_FACADE_ESTIMATE_5161=Object.freeze({
 region:'mlada',
 rows:Object.freeze([
  Object.freeze({address:616,id:'61979144',ruian:'22968083',
   hash:'ace63062',originalLevels:'5',east:1,west:3}),
  Object.freeze({address:617,id:'61979139',ruian:'22968091',
   hash:'43ca97b1',originalLevels:'5',east:1,west:3}),
  Object.freeze({address:618,id:'61979145',ruian:'22968105',
   hash:'b69a7ef6',originalLevels:'1',east:1,west:3})
 ]),
 architecturalReference:
  'https://zakazky.mesto-milovice.cz/document_184/107a3038c3f90b7000c396e9ce9f9f75-projektova_dokumentace_podepsana-pdf',
 balconyEvidence:'https://www.celakovice.cz/filemanager/files/3095067.pdf',
 roadOSMId:'202399863',footwayOSMId:'1316882860'
});
const hash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const meters=(a,b)=>Math.hypot((a.lat-b.lat)*111320,
 (a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180));
export function planTopolovaEstimatedFacades5161({
 regionId,rowPlan,hipPlan,ways
}={}){
 const s=TOPOLOVA_FACADE_ESTIMATE_5161;
 if(regionId!==s.region||rowPlan?.version!=='5.155'||
  hipPlan?.version!=='5.160'||!hipPlan.fiveEntrySharedRoof||
  rowPlan.visualAboveGroundLevels!==5||
  rowPlan.visualHeightMeters!==15.25||
  rowPlan.contiguousExactSharedPartyWalls!==4||
  !Array.isArray(ways)||hipPlan.sourceOSMIds.join(',')!==
  rowPlan.sourceOSMIds.join(','))return null;
 const faces=[],facadeEdgesById={};
 for(const item of s.rows){
  const matches=ways.filter(w=>String(w?.id)===item.id);
  if(matches.length!==1)return null;
  const w=matches[0],t=w.tags||{},g=w.geometry;
  if(t.building!=='residential'||
   t['building:levels']!==item.originalLevels||
   t['building:flats']!=='10'||
   t['ref:ruian:building']!==item.ruian||
   t.source!=='cuzk:ruian'||t.height!==undefined||
   !Array.isArray(g)||g.length!==5||
   !g.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
   g[0].lat!==g[4].lat||g[0].lon!==g[4].lon||
   hash(g)!==item.hash||
   rowPlan.sourceOSMIds.indexOf(item.id)<2||
   rowPlan.sourceOriginalGeometryHashes[rowPlan.sourceOSMIds.indexOf(item.id)]!==item.hash)
   return null;
  const out=[];
  for(const [side,edge] of [['east',item.east],['west',item.west]]){
   const len=meters(g[edge],g[edge+1]);
   if(len<15.8||len>16.4)return null;
   const face={id:item.id,address:item.address,side,edge,
    length:+len.toFixed(3),geometry:g};
   out.push(edge);faces.push(face);
  }
  facadeEdgesById[item.id]=out;
 }
 // Keep the 614/615 construction documented and protected by 5.159.
 if(faces.length!==6||
  faces.some(f=>f.address<616||f.address>618))return null;
 return {
  version:'5.161',
  sourceAddresses:s.rows.map(r=>r.address),
  sourceOSMIds:s.rows.map(r=>r.id),
  sourceOriginalOSMHashes:s.rows.map(r=>r.hash),
  sourceRUIANIds:s.rows.map(r=>r.ruian),
  facadeEdgesById,faces,
  modelHeightMeters:15.25,modelFloors:5,
  referenceNeighbourDrawing:s.architecturalReference,
  balconyExistenceSource:s.balconyEvidence,
  sourceMatchedContiguousRow:true,
  inferredBayPositionsNotGeoreferenced:true,
  source617618HaveSomeBalconies:true,
  source616BalconyLocationsUnknown:true,
  provisional616NoInventedBalconyDoors:true,
  frameColourNotIndependentlyVerified:true,
  addedPhysicalBalconyPlatforms:0,addedDoors:0,
  addedRoofCaps:0,addedColliders:0,addedPaths:0,
  addedRoads:0,addedParking:0,addedStreetFurniture:0,
  originalOSMGeometryPreserved:true
 };
}
export function renderTopolovaEstimatedFacades5161(THREE,{
 plan,toWorld,baseById,layer
}={}){
 if(!THREE||plan?.version!=='5.161'||
  typeof toWorld!=='function'||typeof baseById!=='function'||
  !layer?.add)return null;
 // Batched geometry shared across three actual mapped building outlines.
 const positions=[[],[],[]]; // model frame, glass, lower ledge
 let normalWindows=0,balconyWindowDoorSets=0,stairWindows=0;
 let missingGeometry=0;
 const tri=(g,a,b,c)=>positions[g].push(
  a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);
 const quad=(g,a,b,c,d)=>{tri(g,a,b,c);tri(g,a,c,d)};
 for(const face of plan.faces){
  const outline=face.geometry.slice(0,-1).map(toWorld);
  const A=outline[face.edge],B=outline[(face.edge+1)%4];
  const base=baseById(face.id);
  if(![A?.x,A?.y,B?.x,B?.y,base?.base,base?.height]
   .every(Number.isFinite)||Math.abs(base.height-15.25)>.01)
   return null;
  const len=Math.hypot(B.x-A.x,B.y-A.y);
  if(Math.abs(len-face.length)>.18){missingGeometry++;return null}
  const ux=(B.x-A.x)/len,uz=(B.y-A.y)/len;
  const nx=uz,nz=-ux;
  if(face.side==='east'?nx<.95:nx>-.95)return null;
  const P=(at,y,offset)=>({
   x:(A.x+B.x)/2+ux*at+nx*offset,
   y:base.base+y,z:(A.y+B.y)/2+uz*at+nz*offset
  });
  const rect=(g,l,r,lo,hi,out)=>quad(g,
   P(l,lo,out),P(r,lo,out),P(r,hi,out),P(l,hi,out));
  const pane=(x,y,w,h,mullion)=>{
   // Base wall keeps solid collision; thin facade layers do not.
   rect(0,x-w/2,x+w/2,y-h/2,y+h/2,.080);
   rect(1,x-w/2+.075,x+w/2-.075,y-h/2+.075,y+h/2-.075,.096);
   if(mullion)rect(0,x-.038,x+.038,y-h/2+.036,y+h/2-.036,.112);
   rect(2,x-w/2-.056,x+w/2+.056,y-h/2-.074,y-h/2+.015,.116);
  };
  for(let floor=0;floor<5;floor++){
   const cy=1.63+floor*3.05;
   for(const x of [-6.05,6.05]){
    pane(x,cy,1.75,1.35,true);normalWindows++;
   }
   for(const x of [-3.45,3.45]){
    // 5.184: 616 has no georeferenced balcony-door evidence.
    // Avoid giving it 16 invented facade door positions. The neutral
    // neighbour-style window rhythm remains a declared MODEL estimate.
    if(floor===0||face.address===616){
     pane(x,cy,1.75,1.35,true);normalWindows++;
    }else{
     // Some 617/618 balconies are documented, but their precise bays
     // are still a MODEL extrapolation from the 614/615 drawing.
     pane(x-.40,floor*3.05+1.6,.95,1.35,false);
     pane(x+.48,floor*3.05+1.28,.80,2.0,false);
     balconyWindowDoorSets++;
    }
   }
  }
  for(const y of [4.26,7.31,10.36,13.41]){
   pane(0,y,.76,.66,false);stairWindows++;
  }
  // Never hallucinate a particular street-facing door or rooftop tower.
 }
 if(normalWindows!==88||balconyWindowDoorSets!==32||
  stairWindows!==24||missingGeometry)return null;
 const centroid=plan.faces.reduce((a,f)=>{
  const vertices=f.geometry.slice(0,-1);
  const left=vertices[f.edge],right=vertices[(f.edge+1)%4];
  a.lon+=(left.lon+right.lon)/2;a.lat+=(left.lat+right.lat)/2;
  return a;
 },{lat:0,lon:0});
 centroid.lon/=6;centroid.lat/=6;
 const centre=toWorld(centroid),colors=[0xc6c8c3,0x8298a6,0xe2ddd5];
 const meshes=positions.map((data,i)=>{
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(data,3));
  geo.computeVertexNormals();geo.computeBoundingSphere();
  const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({
   color:colors[i],roughness:i===1?.35:.82,
   side:THREE.DoubleSide
  }));
  mesh.name='Milovice_Topolova_616_618_Provisional_'+
   ['Frames','Glass','Sills'][i]+'_5161';
  mesh.userData.lodX=centre.x;mesh.userData.lodZ=centre.y;
  mesh.userData.lodDetail=false;
  mesh.userData.inferredFacadeNotPhotoVerified=true;
  mesh.receiveShadow=true;
  layer.add(mesh);return mesh;
 });
 const visible=m=>{
  for(let p=m;p;p=p.parent)if(!p.visible)return false;
  return true;
 };
 return {
  version:'5.161',renderedFacades:6,renderedMeshes:3,
  normalWindows,balconyWindowDoorSets,stairWindows,
  gpuTriangles:positions.reduce((n,p)=>n+p.length/9,0),
  allInScene:()=>meshes.every(m=>m.parent===layer),
  visibleAfterLOD:()=>meshes.filter(visible).length,
  createdBalconyPlatforms:0,createdEntranceDoors:0,
  addedColliders:0
 };
}
