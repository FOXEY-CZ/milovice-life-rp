// Milovice 5.0 — open OSM landuse footprints, original procedural presentation.
const landscapeMat=new WeakMap();
function materials(T){
 let m=landscapeMat.get(T);
 if(!m){
  const color={forest:0x4e7042,grass:0x759963,park:0x81a76c,playground:0xbea987,pitch:0x4c8a60};
  m=Object.fromEntries(Object.entries(color).map(([k,v])=>[k,new T.MeshLambertMaterial({color:v,side:T.DoubleSide})]));
  m.pitchLine=new T.LineBasicMaterial({color:0xe5e8dd});landscapeMat.set(T,m);
 }
 return m;
}
export function addLanduseFeature(T,el,convert,terrain,osmLayer,zones){
 const tags=el.tags||{};
 const kind=tags.landuse==='forest'?'forest':tags.landuse==='grass'?'grass':
  ['park','pitch','playground'].includes(tags.leisure)?tags.leisure:null;
 if(!kind||!Array.isArray(el.geometry)||el.geometry.length<4)return;
 const pts=el.geometry.map(convert);
 if(pts.length>3&&pts[0].distanceTo(pts[pts.length-1])<.05)pts.pop();
 if(pts.length<3)return;
 let signed=0;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length];
  signed+=a.x*b.y-b.x*a.y;
 }
 const area=Math.abs(signed)*.5;if(area<5||!Number.isFinite(area))return;
 const shape=new T.Shape();shape.moveTo(pts[0].x,-pts[0].y);
 for(let i=1;i<pts.length;i++)shape.lineTo(pts[i].x,-pts[i].y);
 shape.closePath();
 const geo=new T.ShapeGeometry(shape);geo.rotateX(-Math.PI/2);
 const p=geo.attributes.position;
 for(let i=0;i<p.count;i++)p.setY(i,terrain(p.getX(i),p.getZ(i))+.056);
 p.needsUpdate=true;geo.computeVertexNormals();
 const patch=new T.Mesh(geo,materials(T)[kind]);osmLayer.add(patch);
 if(kind==='pitch'){
  const line=new T.LineLoop(new T.BufferGeometry().setFromPoints(
   pts.map(v=>new T.Vector3(v.x,terrain(v.x,v.y)+.14,v.y))),materials(T).pitchLine);
  osmLayer.add(line);
 }
 if(kind==='forest'||kind==='park')zones.push({points:pts,area,kind});
}
function inArea(x,z,poly){
 let hit=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.y>z)!==(b.y>z)&&x<(b.x-a.x)*(z-a.y)/(b.y-a.y)+a.x)hit=!hit;
 }
 return hit;
}
export function forestInstancePlacements(zones,trunks,crowns,crowns2,rnd){
 let max=620;
 for(const zone of zones){
  if(max<=0)break;
  const bounds={
   minX:Math.min(...zone.points.map(p=>p.x)),maxX:Math.max(...zone.points.map(p=>p.x)),
   minZ:Math.min(...zone.points.map(p=>p.y)),maxZ:Math.max(...zone.points.map(p=>p.y))
  };
  const density=zone.kind==='forest'?700:1500;
  const target=Math.min(max,Math.min(70,Math.max(2,Math.floor(zone.area/density))));
  let planted=0;
  for(let k=0;k<target*6&&planted<target;k++){
   const xx=bounds.minX+rnd()*(bounds.maxX-bounds.minX);
   const zz=bounds.minZ+rnd()*(bounds.maxZ-bounds.minZ);
   if(!inArea(xx,zz,zone.points))continue;
   const height=3.2+rnd()*2.6,spread=2+rnd()*1.4;
   trunks.push([xx,height*.43,zz,.29,height*.86,.29,0]);
   crowns.push([xx,height*.96,zz,spread,spread*1.12,spread,rnd()*6]);
   crowns2.push([xx+.4,height*1.06,zz-.35,spread*.70,spread*.80,spread*.75,rnd()*6]);
   max--;planted++;
  }
 }
}
