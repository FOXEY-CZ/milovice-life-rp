/** 5.263: photographed higher north corner of Vojenské zátiší.
 * Photos: Doronenko, 20 Aug 2025, CC BY-SA 4.0, Commons:
 * Rakouská (Milovice) 15.jpg; Italská, Milovice 05.jpg.
 * Footprint segment and +2.4 m height are ESTIMATED; no surveyed towers.
 * Only original OSM 53865882/RUIAN 40057411, NO extra footprint or entrances.
 */
export const UPPER_CORNER_5263=Object.freeze({
 id:'53865882',ruian:'40057411',hash:'7aec42bc',
 vertices:Object.freeze([0,1,2,3,4,5,6,7,8]),
 height:2.4,
 photo:'https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg',
 photo2:'https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_05.jpg'
});
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const cross=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
const area2=p=>p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];
 return s+a.x*b.z-b.x*a.z},0);
const inside=(p,a,b,c,sgn)=>[cross(a,b,p),cross(b,c,p),cross(c,a,p)]
 .every(v=>v*sgn>=-1e-8);
function triangles(p){
 const order=p.map((_,i)=>i),out=[],sgn=Math.sign(area2(p));
 if(!sgn)return null;
 while(order.length>3){
  let found=false;
  for(let j=0;j<order.length;j++){
   const a=order[(j-1+order.length)%order.length],b=order[j],
    c=order[(j+1)%order.length];
   if(cross(p[a],p[b],p[c])*sgn<=1e-7)continue;
   if(order.some(k=>k!==a&&k!==b&&k!==c&&
    inside(p[k],p[a],p[b],p[c],sgn)))continue;
   out.push([a,b,c]);order.splice(j,1);found=true;break;
  }
  if(!found)return null;
 }
 return out.concat([order]);
}
const fingerprint=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
export function planRakouskaUpper5263({regionId,building,basePlan}={}){
 const src=UPPER_CORNER_5263,g=building?.geometry,tags=building?.tags;
 if(regionId!=='mlada'||String(building?.id)!==src.id||
  tags?.building!=='yes'||tags?.source!=='cuzk:ruian'||
  tags?.['ref:ruian:building']!==src.ruian||
  Object.keys(tags).length!==3||
  basePlan?.version!=='5.251'||basePlan?.sourceHash!==src.hash||
  basePlan?.sourceOsmId!==src.id||basePlan?.rakouskaNorthAddedEdges5251!==6||
  !Array.isArray(g)||g.length!==29||
  g.some(p=>!Number.isFinite(p.lat)||!Number.isFinite(p.lon))||
  g[0].lat!==g.at(-1).lat||g[0].lon!==g.at(-1).lon||
  fingerprint(g)!==src.hash)return null;
 const all=g.slice(0,-1).map(xy);
 if(Math.abs(area2(all))*.5<912||Math.abs(area2(all))*.5>916)return null;
 const perimeter=src.vertices.map(i=>all[i]),size=Math.abs(area2(perimeter))*.5;
 if(size<55||size>58)return null;
 const roof=triangles(perimeter);
 if(!roof||roof.length!==7)return null;
 const check=roof.reduce((s,[a,b,c])=>
  s+Math.abs(cross(perimeter[a],perimeter[b],perimeter[c]))*.5,0);
 if(Math.abs(check-size)>1e-5)return null;
 return {version:'5.263',sourceOsmId:src.id,sourceRuianId:src.ruian,
  sourceHash:src.hash,vertices:[...src.vertices],perimeter,roof,
  areaSquareMetres:+size.toFixed(2),modelExtraHeight:src.height,
  sourcePhoto:src.photo,secondPhoto:src.photo2,
  photographedHigherVolume:true,modelOutlineNotSurveyed:true,
  modelHeightNotSurveyed:true,sourceFootprintPreserved:true,
  newBuildings:0,newWindows:0,newEntrances:0,newColliders:0,
  newRoads:0,newFootways:0};
}
export function renderRakouskaUpper5263(THREE,{
 plan,layer,baseHeight,roofHeight
}={}){
 if(plan?.version!=='5.263'||!THREE||!layer||
  !Number.isFinite(baseHeight)||!Number.isFinite(roofHeight)||
  roofHeight<4||roofHeight>16)return null;
 const y0=baseHeight+roofHeight-.018,
  y1=baseHeight+roofHeight+plan.modelExtraHeight,wall=[],roof=[];
 const push=(dst,p,y)=>dst.push(p.x,y,p.z);
 for(let i=0;i<plan.perimeter.length;i++){
  const a=plan.perimeter[i],b=plan.perimeter[(i+1)%plan.perimeter.length];
  for(const [p,y] of [[a,y0],[b,y0],[b,y1],[a,y0],[b,y1],[a,y1]])
   push(wall,p,y);
 }
 for(const tri of plan.roof)for(const i of tri)
  push(roof,plan.perimeter[i],y1+.012);
 const meshes=[];
 for(const [kind,positions,color] of [
  ['photographed-higher-corner-walls',wall,'#eeeae4'],
  ['estimated-flat-upper-roof',roof,'#625c56']
 ]){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  g.computeVertexNormals();g.computeBoundingSphere();
  const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({
   color,roughness:1,side:THREE.DoubleSide
  }));
  m.name='Milovice_Rakouska_5263_'+kind;
  m.userData.lodDetail=true;m.receiveShadow=true;
  layer.add(m);meshes.push(m);
 }
 return {drawMeshes:meshes.length,wallTriangles:wall.length/9,
  roofTriangles:roof.length/9,oldRoofLevel:baseHeight+roofHeight,
  newRoofLevel:y1+.012,sourceFootprintPreserved:true,
  visibleAfterLOD:()=>meshes.filter(m=>m.parent===layer&&m.visible).length,
  inScene:()=>meshes.every(m=>m.parent===layer)};
}
