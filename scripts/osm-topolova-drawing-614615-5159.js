/** Topolova 614/615 5.159: 2024 signed east/west facade drawings.
 * https://zakazky.mesto-milovice.cz/document_184/107a3038c3f90b7000c396e9ce9f9f75-projektova_dokumentace_podepsana-pdf
 * PDF p10 west, p11 east, p12 window schedule. Heights & spacings MODEL.
 */
export const DRAWINGS_5159=[
 {address:614,id:'61979151',ruian:'22968067',hash:'c28a14a4',east:2,west:0},
 {address:615,id:'61979152',ruian:'22968075',hash:'46937fbc',east:1,west:3}
];
const hash=g=>{let h=2166136261;for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')};
const length=(a,b)=>Math.hypot((a.lat-b.lat)*111320,(a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180));
export function planTopolovaDrawing5159({id,regionId,tags,geometry,visualHeight,
 photoReviewed=false,approvedArchitecture=false}={}){
 const s=DRAWINGS_5159.find(x=>x.id===String(id));
 if(!s||regionId!=='mlada'||photoReviewed||approvedArchitecture||
  tags?.building!=='residential'||tags['building:levels']!=='5'||
  tags['building:flats']!=='10'||tags['ref:ruian:building']!==s.ruian||
  tags.source!=='cuzk:ruian'||tags.height!==undefined||
  Math.abs(visualHeight-15.25)>.001||!Array.isArray(geometry)||
  geometry.length!==5||geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(geometry)!==s.hash)return null;
 const facades=[{edge:s.east,side:'east'},{edge:s.west,side:'west'}]
  .map(f=>({...f,meters:+length(geometry[f.edge],geometry[f.edge+1]).toFixed(3)}));
 if(facades.some(f=>f.meters<15.8||f.meters>16.3))return null;
 return {version:'5.159',sourceAddress:s.address,sourceOSMId:s.id,
  sourceRUIANId:s.ruian,sourceHash:s.hash,facades,
  facadeEdges:facades.map(f=>f.edge),
  officialFiveAboveGroundFloors:true,whitePVCFramesFromProject:true,
  doubleLeafWindowMetres:[1.75,1.35],balconyDoorHeightMetres:2,
  roundedStairHeadsFromDrawings:true,entrancesTwoSides:true,
  estimatedDistances:true,estimatedRoofCapHeight:true,
  doorsNotWalkable:true,sourceFootprintUntouched:true,
  newColliders:0,newRoads:0,newParking:0,newTrees:0,newLamps:0};
}
export function renderTopolovaDrawing5159(THREE,{plan,outline,baseY,layer}={}){
 if(!THREE||plan?.version!=='5.159'||!Array.isArray(outline)||
  outline.length!==4||!Number.isFinite(baseY)||!layer?.add)return null;
 const batches=[[],[],[]],counts={normalWindows:0,balconySets:0,stairWindows:0,entries:0,roundedCaps:0},centres=[];
 const tri=(g,a,b,c)=>batches[g].push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);
 const quad=(g,a,b,c,d)=>{tri(g,a,b,c);tri(g,a,c,d)};
 for(const f of plan.facades){
  const a=outline[f.edge],b=outline[(f.edge+1)%4];
  if(![a?.x,a?.y,b?.x,b?.y].every(Number.isFinite))return null;
  const len=Math.hypot(b.x-a.x,b.y-a.y);
  if(Math.abs(len-f.meters)>.18)return null;
  const ux=(b.x-a.x)/len,uz=(b.y-a.y)/len,nx=uz,nz=-ux;
  if(f.side==='east'?nx<.95:nx>-.95)return null;
  centres.push({x:(a.x+b.x)/2,z:(a.y+b.y)/2});
  const P=(t,y,out=.08)=>({x:(a.x+b.x)/2+ux*t+nx*out,
   y:baseY+y,z:(a.y+b.y)/2+uz*t+nz*out});
  const rect=(g,l,r,lo,hi,out=.08)=>quad(g,P(l,lo,out),P(r,lo,out),
   P(r,hi,out),P(l,hi,out));
  const pane=(t,y,w,h,bar)=>{
   rect(0,t-w/2,t+w/2,y-h/2,y+h/2,.082);
   rect(1,t-w/2+.075,t+w/2-.075,y-h/2+.075,y+h/2-.075,.095);
   if(bar)rect(0,t-.035,t+.035,y-h/2+.03,y+h/2-.03,.107);
   rect(0,t-w/2-.05,t+w/2+.05,y-h/2-.07,y-h/2+.015,.108);
  };
  for(let floor=0;floor<5;floor++){
   for(const t of [-6.1,6.1]){
    pane(t,1.63+floor*3.05,1.75,1.35,true);counts.normalWindows++;
   }
   for(const t of [-3.45,3.45]){
    if(floor===0){
     pane(t,1.63,1.75,1.35,true);counts.normalWindows++;
    }else{
     pane(t-.40,floor*3.05+1.6,.95,1.35,false);
     pane(t+.48,floor*3.05+1.28,.8,2,false);
     counts.balconySets++;
    }
   }
  }
  for(const y of [4.26,7.31,10.36,13.41]){
   pane(0,y,.76,.66,false);counts.stairWindows++;
  }
  pane(0,1.22,1.36,2.30,false);counts.entries++;
  // Entrance canopy in both signed elevations; modelled projection.
  quad(2,P(-1.13,2.51,.12),P(1.13,2.51,.12),
   P(1.03,2.57,.87),P(-1.03,2.57,.87));
  const h=15.25,w=1.2,profile=[P(-w,h-.14,.1),P(w,h-.14,.1),P(w,h+.08,.1)];
  for(let i=1;i<=14;i++){
   const a=Math.PI*i/14;
   profile.push(P(w*Math.cos(a),h+.08+w*Math.sin(a),.1));
  }
  const c=P(0,h+.13,.1);
  for(let i=0;i<profile.length;i++)tri(2,c,profile[i],profile[(i+1)%profile.length]);
  pane(0,h+.30,.78,.70,false);counts.roundedCaps++;
 }
 if(counts.normalWindows!==24||counts.balconySets!==16||counts.stairWindows!==8||
  counts.entries!==2||counts.roundedCaps!==2)return null;
 const cx=centres.reduce((s,p)=>s+p.x,0)/2,cz=centres.reduce((s,p)=>s+p.z,0)/2;
 const meshes=batches.map((positions,i)=>{
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  g.computeVertexNormals();g.computeBoundingSphere();
  const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({
   color:[0xf0f0eb,0x8095a1,0xd6d6d0][i],roughness:i===1?.32:.83,side:THREE.DoubleSide}));
  m.name='Topolova_'+plan.sourceAddress+'_PDF_'+['PVC','Glass','RoundStair'][i]+'_5159';
  m.userData.lodX=cx;m.userData.lodZ=cz;m.userData.lodDetail=false;
  m.receiveShadow=true;layer.add(m);return m;
 });
 const visible=m=>{for(let p=m;p;p=p.parent)if(!p.visible)return false;return true};
 return {...counts,sourceAddress:plan.sourceAddress,renderedFaces:2,renderedMeshes:3,
  gpuTriangles:batches.reduce((s,p)=>s+p.length/9,0),
  visibleAfterLOD:()=>meshes.filter(visible).length,
  allInScene:()=>meshes.every(m=>m.parent===layer)};
}
