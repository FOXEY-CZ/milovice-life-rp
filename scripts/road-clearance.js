// Milovice RP 5.22 — road/crosswalk-safe placement based on actual OSM
// centreline geometries and their modelled carriageway/footpath widths.
// No placement is considered "verified" merely because it passes this check.
export function createRoadClearance({cellSize=80}={}){
 if(!(Number.isFinite(cellSize)&&cellSize>=20))throw Error('Invalid road-clearance cellSize');
 const cells=new Map(),known=new Set(),segments=[];
 const key=(x,z)=>x+','+z;
 function addRoad({points,width=7.8,id,osmId,kind='residential'}={}){
  if(!Array.isArray(points)||points.length<2)return 0;
  const routeId=String(id??osmId??'');
  if(routeId&&known.has(routeId))return 0;
  // Protect pedestrian footways and mapped paths as well as road lanes.
  const modelWidth=Number.isFinite(Number(width))?Math.max(.6,Number(width)):7.8;
  let added=0;
  for(let i=1;i<points.length;i++){
   const a=points[i-1],b=points[i];
   const ax=a.x,az=a.z??a.y,bx=b.x,bz=b.z??b.y;
   if(![ax,az,bx,bz].every(Number.isFinite))continue;
   const lenSq=(bx-ax)**2+(bz-az)**2;
   if(lenSq<.04)continue;
   const item={ax,az,bx,bz,lenSq,width:modelWidth,kind,id:routeId};
   segments.push(item);
   // Bounds already include generous 12m beyond the centreline + road half-width
   // so a 1-cell query catches all potentially conflicting street surfaces.
   const reach=modelWidth*.5+12;
   const x0=Math.floor((Math.min(ax,bx)-reach)/cellSize),x1=Math.floor((Math.max(ax,bx)+reach)/cellSize);
   const z0=Math.floor((Math.min(az,bz)-reach)/cellSize),z1=Math.floor((Math.max(az,bz)+reach)/cellSize);
   for(let gx=x0;gx<=x1;gx++)for(let gz=z0;gz<=z1;gz++){
    const k=key(gx,gz);
    if(!cells.has(k))cells.set(k,[]);
    cells.get(k).push(item);
   }
   added++;
  }
  if(routeId)known.add(routeId);
  return added;
 }
 function nearest(x,z){
  const candidates=cells.get(key(Math.floor(x/cellSize),Math.floor(z/cellSize)))||[];
  let closest=null;
  for(const seg of candidates){
   const dx=seg.bx-seg.ax,dz=seg.bz-seg.az;
   const t=Math.max(0,Math.min(1,((x-seg.ax)*dx+(z-seg.az)*dz)/seg.lenSq));
   const dist=Math.hypot(x-(seg.ax+t*dx),z-(seg.az+t*dz));
   const clearance=dist-seg.width*.5;
   if(!closest||clearance<closest.clearance)
    closest={clearance,distance:dist,width:seg.width,kind:seg.kind,id:seg.id,t};
  }
  return closest;
 }
 function isClear(x,z,radius=.6,buffer=1.2){
  if(!Number.isFinite(x)||!Number.isFinite(z)||radius<0||buffer<0)return false;
  const closest=nearest(x,z);
  // If no OSM way is within 12m of the coordinate, this candidate is not in
  // any known roadway. Other geospatial checks (buildings/private land) differ.
  return !closest||closest.clearance>=radius+buffer;
 }
 return {addRoad,nearest,isClear,stats:()=>({indexedRoutes:known.size,segments:segments.length,cells:cells.size})};
}

// Strict 5.26.2 roadside geometry: verify the WHOLE projected rectangle,
// not only its centre. Three.js BoxGeometry rotated about Y maps local X/Z
// to (cos(yaw),-sin(yaw)) and (sin(yaw),cos(yaw)) respectively.
// This check uses the existing OSM road/footway index only: it does not turn
// a photographed but unmeasured prop into a surveyed real-world position.
export function isRoadFreeRect(roadClearance,{x,z,length,depth,yaw=0,buffer=.10,step=.65}={}){
 if(!roadClearance||typeof roadClearance.isClear!=='function')return false;
 if(![x,z,length,depth,yaw,buffer,step].every(Number.isFinite)||
   length<=0||depth<=0||length>70||depth>70||step<=0||buffer<0)return false;
 const nx=Math.ceil(length/step),nz=Math.ceil(depth/step);
 const dx=length/nx,dz=depth/nz;
 // A cell is enclosed by a circle of this radius. Conservatively testing
 // every cell therefore covers its edges and corners, including rotations.
 const cellRadius=Math.hypot(dx,dz)*.5;
 const ca=Math.cos(yaw),sa=Math.sin(yaw);
 for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){
  const u=-length*.5+(i+.5)*dx,v=-depth*.5+(j+.5)*dz;
  const px=x+ca*u+sa*v,pz=z-sa*u+ca*v;
  if(!roadClearance.isClear(px,pz,cellRadius,buffer))return false;
 }
 return true;
}
