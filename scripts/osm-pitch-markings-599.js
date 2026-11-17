// Milovice RP 5.99: map-proven sports pitches, inferred line decoration.
// Source: OSM leisure=pitch / sport=* / surface=* for each existing polygon.
// The painted sport lines are schematic and NOT evidenced by photographs.
// No goals, hoops, nets, fences or other undocumented equipment are added.
const X=p=>p.x,Z=p=>p.z??p.y;
const LENGTHS={tennis:[23.77,10.97],soccer:[100,64],basketball:[28,15],
 futsal:[40,20],multisport:[28,15]};

export function classifyOSMPitch(tags={}){
 if(tags?.leisure!=='pitch')return null;
 const surface=String(tags.surface||'').toLowerCase();
 const material=surface==='clay'?'pitchClay':
  ['asphalt','concrete','paved','paving_stones'].includes(surface)?'pitchAsphalt':
  ['artificial_turf','synthetic','tartan'].includes(surface)?'pitchTurf':
  ['sand','dirt','ground','fine_gravel','gravel'].includes(surface)?'pitchSand':'pitch';
 const sportTags=String(tags.sport||'').split(/[;,]/).map(v=>v.trim().toLowerCase());
 const known=sportTags.filter(v=>Object.hasOwn(LENGTHS,v));
 const sport=known.length>=2?'multisport':known[0]||null;
 return {material,surfaceRaw:surface||null,surfaceSourceConfirmed:!!surface,
  sport,sportSourceConfirmed:Boolean(sport),
  linesAreEstimated:true,noEquipmentInvented:true};
}
export function insideMappedPitch(x,z,polygon){
 if(!Array.isArray(polygon)||polygon.length<3)return false;
 let hit=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j],az=Z(a),bz=Z(b);
  if(![a.x,az,b.x,bz].every(Number.isFinite))return false;
  if((az>z)!==(bz>z)&&x<(b.x-a.x)*(z-az)/(bz-az)+a.x)hit=!hit;
 }
 return hit;
}
export function planOSMPitchMarkings(tags,polygon){
 const category=classifyOSMPitch(tags);
 const empty={category,segments:[],center:null,axis:null,length:0,width:0,
  estimatedLineDimensions:true,equipmentModels:0,
  sourcePolygonMoved:false};
 if(!category||!category.sport||!Array.isArray(polygon)||
    polygon.length<4||polygon.length>80)return empty;
 const pts=polygon.map(p=>({x:X(p),z:Z(p)}));
 if(pts.some(p=>![p.x,p.z].every(Number.isFinite)))return empty;
 if(Math.hypot(pts[0].x-pts.at(-1).x,pts[0].z-pts.at(-1).z)<.1)pts.pop();
 if(pts.length<3)return empty;
 let longest=0,axis=null;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
  if(len>longest){longest=len;axis={x:dx/len,z:dz/len}}
 }
 if(!axis||longest<8)return empty;
 const side={x:-axis.z,z:axis.x};
 const uv=pts.map(p=>({u:p.x*axis.x+p.z*axis.z,
  v:p.x*side.x+p.z*side.z}));
 const minU=Math.min(...uv.map(p=>p.u)),maxU=Math.max(...uv.map(p=>p.u));
 const minV=Math.min(...uv.map(p=>p.v)),maxV=Math.max(...uv.map(p=>p.v));
 const extentL=maxU-minU,extentW=maxV-minV;
 if(extentL<8||extentW<7)return empty;
 const [idealL,idealW]=LENGTHS[category.sport];
 let halfL=Math.min(idealL/2,extentL*.42),
  halfW=Math.min(idealW/2,extentW*.42);
 const midU=(maxU+minU)/2,midV=(maxV+minV)/2;
 const center={x:axis.x*midU+side.x*midV,
  z:axis.z*midU+side.z*midV};
 const world=(u,v)=>({x:center.x+axis.x*u+side.x*v,
  z:center.z+axis.z*u+side.z*v});
 // Some OSM pitches have six vertices or clipped corners. A drawn
 // rectangle must be safely inside the mapped surface, not through a road.
 let fits=false;
 for(let i=0;i<10;i++){
  if([[halfL,halfW],[halfL,-halfW],[-halfL,halfW],[-halfL,-halfW]]
   .every(([u,v])=>{const p=world(u,v);return insideMappedPitch(p.x,p.z,pts)})){
   fits=true;break;
  }
  halfL*=.91;halfW*=.91;
 }
 if(!fits||halfL<4||halfW<3)return empty;
 const linePoints=[],rect=(left,right,bottom,top)=>{
  linePoints.push([left,bottom,right,bottom],[right,bottom,right,top],
   [right,top,left,top],[left,top,left,bottom]);
 };
 const line=(u1,v1,u2,v2)=>linePoints.push([u1,v1,u2,v2]);
 const circle=(r,u=0,v=0)=>{
  for(let i=0;i<24;i++){
   const a=i*Math.PI/12,b=(i+1)*Math.PI/12;
   line(u+r*Math.cos(a),v+r*Math.sin(a),
    u+r*Math.cos(b),v+r*Math.sin(b));
  }
 };
 rect(-halfL,halfL,-halfW,halfW);
 const sport=category.sport;
 if(sport==='tennis'){
  const singles=Math.min(4.115,halfW*.82);
  line(-halfL,-singles,halfL,-singles);
  line(-halfL,singles,halfL,singles);
  const service=Math.min(6.4,halfL*.67);
  line(-service,-singles,-service,singles);
  line(service,-singles,service,singles);
  line(-service,0,service,0);
  // Do NOT paint a fictitious net as a court line.
 }else{
  line(0,-halfW,0,halfW);
  circle(Math.min(sport==='soccer'?9.15:sport==='basketball'?1.8:3,
   halfL*.22,halfW*.72));
  if(sport==='soccer'){
   for(const sign of [-1,1]){
    const u=sign*halfL,penalty=Math.min(16.5,halfL*.32);
    const goal=Math.min(5.5,halfL*.12);
    const pw=Math.min(20.15,halfW*.75);
    const gw=Math.min(9.16,halfW*.45);
    line(u-sign*penalty,-pw,u-sign*penalty,pw);
    line(u,-pw,u-sign*penalty,-pw);
    line(u,pw,u-sign*penalty,pw);
    line(u-sign*goal,-gw,u-sign*goal,gw);
    line(u,-gw,u-sign*goal,-gw);
    line(u,gw,u-sign*goal,gw);
   }
  }
 }
 const segments=[];
 for(const [u1,v1,u2,v2] of linePoints){
  const a=world(u1,v1),b=world(u2,v2);
  // Finer than the source polygon is an inferred court layout. Every
  // line centre stays INSIDE that map-derived polygon.
  const mid={x:(a.x+b.x)/2,z:(a.z+b.z)/2};
  if(!insideMappedPitch(mid.x,mid.z,pts))continue;
  segments.push({a,b});
 }
 return {...empty,segments,center,axis,length:halfL*2,width:halfW*2,
  sport,sourceSurface:category.surfaceRaw,
  cameraEye:world(-Math.min(halfL*.68,18),0),
  cameraHeight:Math.max(9,Math.min(24,halfL*.72)),
  markedFromOSMSportTag:true};
}
