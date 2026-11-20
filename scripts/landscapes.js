import {planOSMForestTreeInstances} from './forest-placement-597.js';
import {classifyOSMPitch,planOSMPitchMarkings} from './osm-pitch-markings-599.js';
import {makeMappedClayGrain5178} from './osm-clay-court-grain-5178.js';
// Milovice 5.0 — open OSM landuse footprints, original procedural presentation.
const landscapeMat=new WeakMap();
function materials(T){
 let m=landscapeMat.get(T);
 if(!m){
  const color={forest:0x4e7042,grass:0x759963,park:0x81a76c,playground:0xbea987,
   pitch:0x4c8a60,pitchClay:0xb96a49,pitchAsphalt:0x485058,
   pitchTurf:0x3d7b52,pitchSand:0xc5aa78};
  m=Object.fromEntries(Object.entries(color).map(([k,v])=>[k,new T.MeshLambertMaterial({color:v,side:T.DoubleSide})]));
  // 5.178: one shared 16 KiB antuka grain texture, only on OSM
  // leisure=pitch + surface=clay polygons. No geometry or extra meshes.
  const grain=makeMappedClayGrain5178(64);
  if(grain&&T.DataTexture){
   const clayTexture=new T.DataTexture(grain.data,grain.width,
    grain.height,T.RGBAFormat);
   clayTexture.wrapS=clayTexture.wrapT=T.RepeatWrapping;
   clayTexture.minFilter=T.LinearMipmapLinearFilter;
   clayTexture.magFilter=T.LinearFilter;
   clayTexture.generateMipmaps=true;
   clayTexture.colorSpace=T.SRGBColorSpace;
   clayTexture.repeat.set(.75,.75);
   clayTexture.needsUpdate=true;
   m.pitchClay.map=clayTexture;
   m.pitchClay.needsUpdate=true;
  }
  m.pitchLine=new T.LineBasicMaterial({color:0xe5e8dd});
  m.pitchPaint=new T.MeshBasicMaterial({color:0xf4eee1,side:T.DoubleSide});
  landscapeMat.set(T,m);
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
 if(kind==='forest'||kind==='park')zones.push({id:String(el.id),points:pts,area,kind,
  allowPlants:!['private','no'].includes(tags.access)});
}
// Stable 5.97 source-limited forest placements. Preserve the old renderer's
// three shared instanced geometry arrays; no extra draw-call families.
export function forestInstancePlacements(zones,trunks,crowns,crowns2,_legacyRnd,allow=()=>true){
 const plan=planOSMForestTreeInstances(zones,allow);
 for(const tree of plan.trees){
  const {x,z,height,spread,yaw}=tree;
  trunks.push([x,height*.43,z,.29,height*.86,.29,0]);
  crowns.push([x,height*.96,z,spread,spread*1.12,spread,yaw]);
  crowns2.push([x+.4,height*1.06,z-.35,
   spread*.70,spread*.80,spread*.75,yaw]);
 }
 return plan;
}


/**
 * Milovice RP 5.91: city-scale OSM greenery & sports ground batching.
 * Merge documented OSM landuse/leisure footprints inside 180m cells;
 * do not add plant positions, private gates, new lawns, sports fixtures,
 * synthetic roads or altered footprint vertices. Large forests remain
 * individual surfaces so chunks do not incorrectly cull their far edges.
 * The batch planner is geometry-library-agnostic for unit testing.
 */
export function planCityLanduseBatches(elements,convert,{cellSize=180}={}){
 if(!Array.isArray(elements)||typeof convert!=='function'||
   !Number.isFinite(cellSize)||cellSize<90||cellSize>350)return null;
 const groups=new Map(),entries=[];
 const kindFor=tags=>tags?.landuse==='forest'?'forest':
  tags?.landuse==='grass'?'grass':
  ['park','pitch','playground'].includes(tags?.leisure)?tags.leisure:null;
 for(const el of elements){
  const kind=kindFor(el?.tags);
  if(!kind||!Array.isArray(el.geometry)||el.geometry.length<4)continue;
  const pts=el.geometry.map(convert);
  if(!pts.every(p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)))continue;
  if(pts.length>3&&Math.hypot(pts[0].x-pts.at(-1).x,
   pts[0].y-pts.at(-1).y)<.05)pts.pop();
  if(pts.length<3)continue;
  let signed=0,minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(let i=0;i<pts.length;i++){
   const a=pts[i],b=pts[(i+1)%pts.length];
   signed+=a.x*b.y-b.x*a.y;
   minX=Math.min(minX,a.x);maxX=Math.max(maxX,a.x);
   minZ=Math.min(minZ,a.y);maxZ=Math.max(maxZ,a.y);
  }
  const area=Math.abs(signed)*.5;
  if(!Number.isFinite(area)||area<5)continue;
  const centerX=(minX+maxX)*.5,centerZ=(minZ+maxZ)*.5;
  const oversized=maxX-minX>cellSize||maxZ-minZ>cellSize;
  // Large polygons remain separate and never use the cell's fake zero-radius
  // draw-distance rule; they may cross many city chunks.
  const gx=Math.floor(centerX/cellSize),gz=Math.floor(centerZ/cellSize);
  const pitch=kind==='pitch'?classifyOSMPitch(el.tags):null;
  const renderMaterial=pitch?.material||kind;
  // Clay and asphalt cannot share a single merged mesh/material.
  const key=oversized?'oversized:'+String(el.id):
   renderMaterial+':'+gx+':'+gz;
  if(!groups.has(key))groups.set(key,{
   key,kind,renderMaterial,gx,gz,oversized,centerX,centerZ,items:[]
  });
  const entry={id:String(el.id),kind,renderMaterial,pts,area,key,oversized,
   tags:el.tags||{},allowPlants:!['private','no'].includes(el.tags?.access)};
  groups.get(key).items.push(entry);
  entries.push(entry);
 }
 return {
  version:'5.91',source:'mapped OSM landuse/leisure polygons',
  entries,groups:[...groups.values()],
  sourcePolygons:entries.length,
  pitchOutlines:entries.filter(e=>e.kind==='pitch').length,
  publicGreenZones:entries.filter(e=>['forest','park'].includes(e.kind)).length,
  distinctDrawGroups:groups.size,
  mappedPolygonGeometryUnchanged:true,
  generatedPrivatePlants:0,generatedPlotFences:0,generatedDriveways:0
 };
}

/** Render the same source polygon shapes as addLanduseFeature, grouped by
 * geographic chunk and material. One outline draw call per pitch batch. */
export function addCityLanduseBatches(T,elements,convert,terrain,osmLayer,zones,
 mergeGeometries,{cellSize=180,tennisPlan=null}={}){
 const plan=planCityLanduseBatches(elements,convert,{cellSize});
 if(!plan||!T||typeof terrain!=='function'||!osmLayer||
  !Array.isArray(zones)||typeof mergeGeometries!=='function')return null;
 const materialsForCity=materials(T);
 let surfaceDrawMeshes=0,outlineDrawMeshes=0,sourcePitchLines=0;
 let courtMarkSegments=0,surfaceTaggedPitches=0,sportTaggedPitches=0;
 const sportPitchIds=[];
 let failedMerges=0;
 const batchMeshes=[];
 function annotate(object,g){
  if(g.oversized)return;
  object.userData.cityBatched=true;
  object.userData.cityGreenBatched=true;
  object.userData.lodX=(g.gx+.5)*cellSize;
  object.userData.lodZ=(g.gz+.5)*cellSize;
 }
 function addMark(vertices,a,b,thickness=.12){
  const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
  if(!Number.isFinite(len)||len<.15)return;
  const ox=dz/len*thickness*.5,oz=-dx/len*thickness*.5;
  const p=(x,z)=>[x,terrain(x,z)+.14,z];
  const v1=p(a.x-ox,a.z-oz),v2=p(b.x-ox,b.z-oz),
   v3=p(a.x+ox,a.z+oz),v4=p(b.x+ox,b.z+oz);
  vertices.push(...v1,...v2,...v3,...v2,...v4,...v3);
 }
 for(const group of plan.groups){
  const parts=[],pitchPaintVertices=[];
  for(const entry of group.items){
   const pts=entry.pts;
   const shape=new T.Shape();
   shape.moveTo(pts[0].x,-pts[0].y);
   for(let i=1;i<pts.length;i++)shape.lineTo(pts[i].x,-pts[i].y);
   shape.closePath();
   const geo=new T.ShapeGeometry(shape);
   geo.rotateX(-Math.PI/2);
   const p=geo.attributes.position;
   for(let i=0;i<p.count;i++)
    p.setY(i,terrain(p.getX(i),p.getZ(i))+.056);
   p.needsUpdate=true;
   geo.computeVertexNormals();
   parts.push(geo);
   if(['forest','park'].includes(entry.kind))
    zones.push({id:entry.id,points:pts,area:entry.area,kind:entry.kind,
     allowPlants:entry.allowPlants});
   if(entry.kind==='pitch'){
    sourcePitchLines++;
    if(entry.tags.surface)surfaceTaggedPitches++;
    if(classifyOSMPitch(entry.tags)?.sportSourceConfirmed)sportTaggedPitches++;
    if(sportPitchIds.length<40)sportPitchIds.push(entry.id);
    // Preserve every OSM perimeter; draw source-only polygon edges.
    for(let i=0;i<pts.length;i++){
     const a=pts[i],b=pts[(i+1)%pts.length];
     addMark(pitchPaintVertices,{x:a.x,z:a.y},{x:b.x,z:b.y},.10);
    }
    // These interior lines are SCHEMATIC, not verified photographed paint.
    // 5.150: this exact source-locked Milten complex contains seven
    // outdoor playing courts across four mapped OSM sport polygons.
    // Replace the old ONE-court-per-polygon schematic with seven inside
    // these SAME polygons, reusing the existing batched paint renderer.
    const dedicated=tennisPlan?.version==='5.150'&&
     Object.hasOwn(tennisPlan.segmentsById,entry.id)?
     tennisPlan.segmentsById[entry.id]:null;
    const segments=dedicated||planOSMPitchMarkings(entry.tags,pts).segments;
    courtMarkSegments+=segments.length;
    for(const segment of segments)
     addMark(pitchPaintVertices,segment.a,segment.b,.13);
   }
  }
  let combined=null;
  if(parts.length===1)combined=parts[0];
  else{
   try{combined=mergeGeometries(parts,false)}
   catch(error){console.warn('OSM landuse chunk merge failed:',error)}
  }
  if(combined){
   if(parts.length>1)for(const p of parts)p.dispose();
   const mesh=new T.Mesh(combined,materialsForCity[group.renderMaterial]);
   annotate(mesh,group);
   mesh.name='OSM_city_green_591_'+group.kind;
   osmLayer.add(mesh);
   batchMeshes.push(mesh);surfaceDrawMeshes++;
  }else{
   failedMerges++;
   for(const geo of parts){
    const mesh=new T.Mesh(geo,materialsForCity[group.renderMaterial]);
    annotate(mesh,group);
    osmLayer.add(mesh);batchMeshes.push(mesh);surfaceDrawMeshes++;
   }
  }
  if(pitchPaintVertices.length){
   // Polygon outline + marked sport lines share the SAME draw call per
   // pitch material/spatial cell, preserving the old 5.91 draw-call budget.
   const geometry=new T.BufferGeometry();
   geometry.setAttribute('position',
    new T.Float32BufferAttribute(pitchPaintVertices,3));
   geometry.computeBoundingSphere();
   const paint=new T.Mesh(geometry,materialsForCity.pitchPaint);
   annotate(paint,group);
   paint.name='OSM_city_pitch_markings_599';
   osmLayer.add(paint);batchMeshes.push(paint);outlineDrawMeshes++;
  }
 }
 return {
  version:plan.version,
  polygons:plan.sourcePolygons,
  kinds:Object.fromEntries(['grass','forest','park','playground','pitch']
   .map(k=>[k,plan.entries.filter(e=>e.kind===k).length])),
  mappedGreenZones:plan.publicGreenZones,
  originalDrawMeshes:plan.sourcePolygons+plan.pitchOutlines,
  surfaceDrawMeshes,outlineDrawMeshes,
  drawMeshes:surfaceDrawMeshes+outlineDrawMeshes,
  meshesSaved:plan.sourcePolygons+plan.pitchOutlines-
   (surfaceDrawMeshes+outlineDrawMeshes),
  sourcePitchLines,courtMarkSegments,sportTaggedPitches,surfaceTaggedPitches,
  sportPitchIds,failedMerges,
  pitchColorsFromOSMSurface:true,inferredLineLayouts:true,
  noUndocumentedSportEquipment:true,
  oversizedPolygons:plan.entries.filter(e=>e.oversized).length,
  geometryFromOSMOnly:true,treesInvented:0,
  newRoads:0,newFootways:0,newPrivatePlots:0,
  chunkCount:plan.groups.length
 };
}
