// Milovice RP 5.58 — canopy explicitly over the MAPPED station passage portal.
//
// The old green ~29 m structure on the STREET/Bike Tower side was wrong and
// remains removed. OSM 549346219 identifies an actual sheltered train
// platform. This modest wall-mounted canopy is planned exclusively on the
// station perimeter which faces INSIDE that platform polygon. The size and
// cross-section are 2013/2024 PHOTO-INFORMED estimates, not survey measurements.
//
// References (links only, images never baked into textures):
// https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_n%C3%A1stupi%C5%A1t%C4%9B.jpg
// https://commons.wikimedia.org/wiki/Category:Milovice_(train_station)
// © OpenStreetMap contributors, ODbL for the mapped polygons.
export const PLATFORM_CANOPY_OSM={station:53865956,platform:549346219,passage:1550920096};
export const PLATFORM_CANOPY_SOURCE={
  photo:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_n%C3%A1stupi%C5%A1t%C4%9B.jpg',
  author:'Palickap',license:'CC BY-SA 3.0',taken:'2013-05-25',
  assertion:'Platform canopy exists; width, length, color and detailed supports are approximate',
};
const EPS=1e-7;
function pts(input){
  if(!Array.isArray(input)||input.length<4)return [];
  const valid=input.map(p=>({x:Number(p.x),z:Number(p.z??p.y)}));
  if(valid.some(p=>![p.x,p.z].every(Number.isFinite)))return [];
  if(Math.hypot(valid[0].x-valid.at(-1).x,valid[0].z-valid.at(-1).z)<.05)valid.pop();
  return valid.length>=3?valid:[];
}
function area(poly){
  let out=0;for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length];out+=a.x*b.z-b.x*a.z;
  }
  return out*.5;
}
function inPoly(p,polygon){
  let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const a=polygon[i],b=polygon[j];
    if((a.z>p.z)!==(b.z>p.z)&&p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)
      inside=!inside;
  }
  return inside;
}
function positionOnEdge(a,b,nx,nz,t,outside){
  return {x:a.x+(b.x-a.x)*t+nx*outside,z:a.z+(b.z-a.z)*t+nz*outside};
}
function nearestTrackDistance(p,trackLines){
  let best=Infinity;
  for(const line of trackLines){
    for(let j=1;j<line.length;j++){
      const a=line[j-1],b=line[j],dx=b.x-a.x,dz=b.z-a.z,d=dx*dx+dz*dz;
      if(d<EPS)continue;
      const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/d));
      best=Math.min(best,Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz));
    }
  }
  return best;
}
/**
 * Returns wall-backed roof strips wholly on the rail-platform side of the
 * real OSM station footprint. Never extends along the street-facing wall.
 * Each entry stores world-space x/z vertices; the renderer shares the
 * same Y foundation anchor as the station. No interpolated fake entrance.
 */
export function planStationPlatformCanopy({station,platform,passage,tracks=[],
  stationId=53865956,platformId=549346219,passageId=1550920096,
  spanWidth=2.2,halfLength=3.2,minRailDistance=3.9}={}){
  if(stationId!==PLATFORM_CANOPY_OSM.station||
    platformId!==PLATFORM_CANOPY_OSM.platform||
    passageId!==PLATFORM_CANOPY_OSM.passage)
    return {segments:[],reason:'unknown-OSM-site'};
  const wall=pts(station),ground=pts(platform);
  if(!wall.length||!ground.length||Math.abs(area(wall))<25||Math.abs(area(ground))<25)
    return {segments:[],reason:'invalid-footprints'};
  if(!Number.isFinite(spanWidth)||spanWidth<1||spanWidth>3||
    !Number.isFinite(halfLength)||halfLength<1.5||halfLength>4.5||
    !Number.isFinite(minRailDistance)||minRailDistance<2.8)
    return {segments:[],reason:'unsafe-parameters'};
  // This is the real through-building OSM footway. Two endpoints are
  // independently mapped on the street and platform sides of the building.
  // No passage data = no roof; length of an arbitrary wall proves nothing.
  if(!Array.isArray(passage)||passage.length<2||
    passage.some(p=>![Number(p?.x),Number(p?.z??p?.y)].every(Number.isFinite)))
    return {segments:[],reason:'missing-mapped-passage'};
  const portals=[passage[0],passage[passage.length-1]].map(p=>({
    x:Number(p.x),z:Number(p.z??p.y)}));
  const direction=Math.sign(area(wall));
  // Tracks are linear OSM ways, sometimes only TWO vertices. Polygon
  // validation would silently drop them and miss a rail clearance hazard.
  const trackLines=(tracks||[]).map(line=>Array.isArray(line)?line.map(p=>({
    x:Number(p?.x),z:Number(p?.z??p?.y)
  })).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)):[])
   .filter(line=>line.length>=2);
  const segments=[],rejected=[];
  for(let i=0;i<wall.length;i++){
    const a=wall[i],b=wall[(i+1)%wall.length],dx=b.x-a.x,dz=b.z-a.z;
    const length=Math.hypot(dx,dz);
    if(length<4.4)continue;
    const nx=direction*dz/length,nz=-direction*dx/length;
    // Must face a verified mapped rail PLATFORM, not any ordinary roadside.
    // Samples at both ends as well as the middle reject a projecting roof
    // across a platform boundary on a concave footprint.
    const groundChecks=[.1,.25,.5,.75,.9].every(t=>
      [0.35,1.1,spanWidth].every(offset=>
        inPoly(positionOnEdge(a,b,nx,nz,t,offset),ground)));
    if(!groundChecks){rejected.push({edge:i,reason:'not-rail-platform'});continue;}
    const points=[.1,.5,.9].map(t=>positionOnEdge(a,b,nx,nz,t,spanWidth));
    const minTrack=Math.min(...points.map(p=>nearestTrackDistance(p,trackLines)));
    if(minTrack<minRailDistance){
      rejected.push({edge:i,reason:'track-clearance',metres:minTrack});continue;
    }
    segments.push({edge:i,a,b,length,nx,nz,width:spanWidth,railClearance:minTrack,
      placement:'platform-polygon-facing-wall',estimated:true});
  }
  // Crucial: choose the PLATFORM-SIDE exit of the *mapped station passage*,
  // never the longest available facade. The old algorithm chose edge 2,
  // some 10+ metres away from the exit. In this OSM footprint the exit is
  // the shared vertex between the two platform-facing wall edges 4 and 5.
  const projected=(p,s)=>{
    const dx=s.b.x-s.a.x,dz=s.b.z-s.a.z;
    const t=Math.max(0,Math.min(1,((p.x-s.a.x)*dx+(p.z-s.a.z)*dz)/
      (s.length*s.length)));
    const foot=positionOnEdge(s.a,s.b,0,0,t,0);
    return {distance:Math.hypot(foot.x-p.x,foot.z-p.z),t};
  };
  let match=null;
  for(const portal of portals)for(const seg of segments){
    const hit=projected(portal,seg);
    if(hit.distance>.65)continue;
    if(!match||hit.distance<match.distance-1e-5||
      Math.abs(hit.distance-match.distance)<1e-5&&seg.edge<match.segment.edge)
      match={portal,segment:seg,...hit};
  }
  if(!match)return {segments:[],reason:'unmatched-rail-passage',
    rejectedEdges:rejected,allCandidateEdges:segments.length};

  // Trim the roof to the short area ABOVE that exit. When the portal lies
  // at an OSM corner, continue a few metres along its contiguous neighbour
  // instead of pulling the whole 15 m roof down the station frontage.
  const chosen=[],available=segments.filter(s=>projected(match.portal,s).distance<.1 &&
    s.nx*match.segment.nx+s.nz*match.segment.nz>.96);
  const anchored=available.length?available:[match.segment];
  for(const seg of anchored){
    const hit=projected(match.portal,seg),left=Math.min(halfLength,hit.t*seg.length),
      right=Math.min(halfLength,(1-hit.t)*seg.length);
    if(left+right<.8)continue;
    const a=positionOnEdge(seg.a,seg.b,0,0,hit.t-left/seg.length,0);
    const b=positionOnEdge(seg.a,seg.b,0,0,hit.t+right/seg.length,0);
    const length=Math.hypot(b.x-a.x,b.z-a.z);
    if(length<.8)continue;
    const polygonClear=[.05,.2,.5,.8,.95].every(t=>
      [.35,1.05,spanWidth].every(offset=>
        inPoly(positionOnEdge(a,b,seg.nx,seg.nz,t,offset),ground)));
    const railClearance=Math.min(...[.05,.5,.95].map(t=>
      nearestTrackDistance(positionOnEdge(a,b,seg.nx,seg.nz,t,spanWidth),
      trackLines)));
    if(!polygonClear||railClearance<minRailDistance)continue;
    chosen.push({...seg,a,b,length,railClearance,
      portalDistanceM:hit.distance,placement:'mapped-passage-platform-exit'});
  }
  chosen.sort((a,b)=>a.edge-b.edge);
  const metres=chosen.reduce((sum,s)=>sum+s.length,0);
  if(!chosen.length||metres>halfLength*2+.15)return {
    segments:[],reason:'passage-roof-clearance-failed',
    rejectedEdges:rejected};
  // Seal the roof joint at a notched, real OSM wall vertex.
  // At a corner both panels use one shared, averaged outward normal.
  for(let i=0;i<chosen.length-1;i++){
    const a=chosen[i],b=chosen[i+1];
    if(Math.hypot(a.b.x-b.a.x,a.b.z-b.a.z)<.08){
      const dx=a.nx+b.nx,dz=a.nz+b.nz,len=Math.hypot(dx,dz)||1;
      a.endNormal={x:dx/len,z:dz/len};
      b.startNormal=a.endNormal;
    }
  }
  return {segments:chosen,metres,railFacing:true,streetFacingRoofCount:0,
    passageAnchored:true,passageWayId:PLATFORM_CANOPY_OSM.passage,
    railPortal:match.portal,portalDistanceM:match.distance,
    source:PLATFORM_CANOPY_SOURCE,estimated:true,
    rejectedEdges:rejected,allCandidateEdges:segments.length,
    model:'short canopy centered above mapped station rail passage'};
}
function appendQuad(vertices,a,b,c,d){
  // Both sided material: consistent source winding still gives a continuous
  // weather roof, with two triangles and NO rectangular end caps.
  for(const p of [a,b,c,a,c,d])vertices.push(p.x,p.y,p.z);
}
export function createStationPlatformCanopy(THREE,{
  layer,stationBaseY,plan
}={}){
  if(!THREE||!layer||!plan?.segments?.length||
    !Number.isFinite(stationBaseY))return {drawMeshes:0,segments:0,reason:'missing-station-base'};
  const verts=[],under=[],outerEdges=[],brackets=[];
  // Ground floor of the station is leveled to the highest sampled perimeter
  // grade. The canopy must share THAT EXACT Y reference, never sample DEM
  // independently at each corner (which creates gaps at sloping sites).
  const baseAt=()=>stationBaseY;
  for(const seg of plan.segments){
    const {a,b,nx,nz,width,length}=seg;
    const start=0,end=1;
    const first=seg.startNormal||{x:nx,z:nz};
    const last=seg.endNormal||{x:nx,z:nz};
    const p={x:a.x+first.x*.16,z:a.z+first.z*.16};
    const q={x:b.x+last.x*.16,z:b.z+last.z*.16};
    const r={x:b.x+last.x*width,z:b.z+last.z*width};
    const s={x:a.x+first.x*width,z:a.z+first.z*width};
    // Keep station eaves above the strip; existing roof is not replaced.
    const nearHeight=3.32,outerHeight=3.06,thickness=.09;
    const v=(x,y,z)=>({x,y:baseAt(x,z)+y,z});
    const A=v(p.x,nearHeight,p.z),B=v(q.x,nearHeight,q.z);
    const C=v(r.x,outerHeight,r.z),D=v(s.x,outerHeight,s.z);
    appendQuad(verts,A,B,C,D);
    appendQuad(under,
      v(p.x,nearHeight-thickness,p.z),
      v(q.x,nearHeight-thickness,q.z),
      v(r.x,outerHeight-thickness,r.z),
      v(s.x,outerHeight-thickness,s.z));
    outerEdges.push({a:C,b:D});
    // Thin painted brackets attached to STATION masonry, always higher
    // than 2.3m above the platform; there are NO floor columns.
    const steps=Math.max(2,Math.ceil(length/3.9));
    for(let i=0;i<=steps;i++){
      const t=start+(end-start)*i/steps;
      const wallPoint=positionOnEdge(a,b,nx,nz,t,.15);
      const tip=positionOnEdge(a,b,nx,nz,t,width-.12);
      brackets.push({from:v(wallPoint.x,2.51,wallPoint.z),
        to:v(tip.x,outerHeight-.12,tip.z)});
    }
  }
  const metalRoof=new THREE.MeshLambertMaterial({color:0x3d675b,
    side:THREE.DoubleSide,roughness:.93});
  const soffit=new THREE.MeshLambertMaterial({color:0x536f63,
    side:THREE.DoubleSide});
  const steel=new THREE.MeshLambertMaterial({color:0x344e48});
  function meshFromTriangles(coords,material,name){
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));
    geo.computeVertexNormals();
    const mesh=new THREE.Mesh(geo,material);mesh.name=name;
    mesh.receiveShadow=true;mesh.userData.lodDetail=true;
    layer.add(mesh);return mesh;
  }
  meshFromTriangles(verts,metalRoof,'Milovice_platform_canopy_rail_side_roof');
  meshFromTriangles(under,soffit,'Milovice_platform_canopy_soffit');
  const edgeGeometry=new THREE.BoxGeometry(.10,.13,1);
  const structuralMembers=[...brackets,...outerEdges.map(v=>({from:v.a,to:v.b}))];
  const structure=new THREE.InstancedMesh(edgeGeometry,steel,structuralMembers.length);
  const center=new THREE.Vector3(),unit=new THREE.Vector3(0,0,1),direction=new THREE.Vector3();
  const dummy=new THREE.Object3D();
  for(let i=0;i<structuralMembers.length;i++){
    const {from,to}=structuralMembers[i];
    direction.set(to.x-from.x,to.y-from.y,to.z-from.z);
    const len=direction.length();
    center.set((from.x+to.x)*.5,(from.y+to.y)*.5,(from.z+to.z)*.5);
    dummy.position.copy(center);dummy.quaternion.setFromUnitVectors(unit,direction.normalize());
    dummy.scale.set(1,1,len);dummy.updateMatrix();
    structure.setMatrixAt(i,dummy.matrix);
  }
  structure.instanceMatrix.needsUpdate=true;structure.computeBoundingSphere();
  structure.name='Milovice_platform_canopy_cantilever_brackets';
  layer.add(structure);
  return {drawMeshes:3,segments:plan.segments.length,
    bracketCount:brackets.length,metres:plan.metres,
    positionSource:'real OSM rail-platform polygon',
    photographedShapeApproximate:true,
    streetSideCanopy:false,noGroundColumns:true,
    roofVertices:verts.length/3,stationBaseY,
    passageAnchored:plan.passageAnchored===true,passageWayId:plan.passageWayId,
    railPortal:plan.railPortal,portalDistanceM:plan.portalDistanceM};
}
