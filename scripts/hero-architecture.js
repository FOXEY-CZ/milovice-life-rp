// Milovice RP 5.7: genuine cut-out architectural shells in the old-town core.
// Public OSM footprints anchor the buildings. Window/door placement is a game
// approximation and not a surveyed record of each individual house.
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {selectFacadeEdges,planFaceOpenings} from './facade-model.js';
import {analyzeGableFootprint} from './city-roof-geometry.js';
import {classifyFacadeEdgeLength,planFacadePerimeterTrims} from './facade-perimeter.js';
import {makeSharedFacadeSurfaceMaps} from './facade-surface-kit.js';

export function makeMiloviceHeroArchitecture(THREE,{
  sites=[],radius=240,maxBuildings=68,terrainAt=()=>0
}={}){
 const chunks=new Map(),selected=new Set();
 const appliedFaces=[];
 const state={buildings:0,verifiedOverrides:0,verifiedFaces:0,photoMappedFaces:0,
  photoMappedWindows:0,solidWalls:0,cutoutWindows:0,cutoutDoors:0,gables:0,
  detailInstances:0,drawMeshes:0,chunkCount:0,
  suppressedArbitraryChimneys:0,skippedUnverifiedGables:0,
  suppressedUnverifiedPhotoOrnaments:0,shortWallSegmentsSealed:0,
  skippedDegenerateEdges:0,
  trimmedWallEdges:0,trimmedShortReturns:0,trimmedPerimeterMetres:0,
  sharedSurfaceTextures:3,surfaceResolution:128,extraMaterialDrawCalls:0};
 const box=new THREE.BoxGeometry(1,1,1),glassPlane=new THREE.PlaneGeometry(1,1);
 const mats={
  wall:new THREE.MeshStandardMaterial({vertexColors:true,roughness:.92,side:THREE.DoubleSide}),
  glass:new THREE.MeshStandardMaterial({color:0x82aec4,metalness:.14,roughness:.24,side:THREE.DoubleSide}),
  frame:new THREE.MeshStandardMaterial({color:0xe7e5dd,roughness:.78}),
  sill:new THREE.MeshStandardMaterial({color:0xc0bab0,roughness:.89}),
  base:new THREE.MeshStandardMaterial({color:0x77746d,roughness:.97}),
  dark:new THREE.MeshStandardMaterial({color:0x343e43,roughness:.71}),
  wood:new THREE.MeshStandardMaterial({color:0x715242,roughness:.83}),
  awning:new THREE.MeshStandardMaterial({color:0x786e62,roughness:.82})
 };
 // Single set of 128px textures shared by every batched hero house.
 // Never generate one texture per building or add draw calls.
 const sharedSurfaces=makeSharedFacadeSurfaceMaps(THREE);
 mats.wall.map=sharedSurfaces.stucco;
 mats.base.map=sharedSurfaces.plinth;
 mats.glass.map=sharedSurfaces.glass;
 const colors=[0xd0bea5,0xdcd2bd,0xd2c3a6,0xc8c0b2,0xe1d3b8,0xbebda9,0xd5c4b1,0xd7cbac];
 const kinds=Object.keys(mats).filter(k=>k!=='wall');
 
 const cell=120;
 function bucket(x,z){
  const k=Math.floor(x/cell)+','+Math.floor(z/cell);
  if(!chunks.has(k))chunks.set(k,{key:k,walls:[],props:new Map()});
  return chunks.get(k);
 }
 function placement(chunk,kind,x,y,z,w,h,d,yaw=0,asPlane=false){
  const id=kind+(asPlane?':plane':':box');
  if(!chunk.props.has(id))chunk.props.set(id,[]);
  const o=new THREE.Object3D();
  o.position.set(x,y,z);o.rotation.y=yaw;o.scale.set(w,h,d);o.updateMatrix();
  chunk.props.get(id).push(o.matrix.clone());
  state.detailInstances++;
 }
 function colorGeometry(geometry,color){
  const attr=geometry.getAttribute('position'),c=new THREE.Color(color),array=new Float32Array(attr.count*3);
  for(let i=0;i<attr.count;i++){array[i*3]=c.r;array[i*3+1]=c.g;array[i*3+2]=c.b}
  geometry.setAttribute('color',new THREE.BufferAttribute(array,3));
  return geometry;
 }
 function wallGeometry(a,b,base,height,holes,color){
  // Match the same 8cm geometry threshold as classifyFacadeEdgeLength:
  // <1m returns used to receive decorative trims but no physical wall.
  const len=Math.hypot(b.x-a.x,b.y-a.y);if(len<.08)return null;
  const shape=new THREE.Shape();
  shape.moveTo(0,0);shape.lineTo(len,0);shape.lineTo(len,height);shape.lineTo(0,height);shape.closePath();
  for(const hole of holes){
   const x0=hole.x-hole.w*.5,x1=hole.x+hole.w*.5;
   if(x0<=.08||x1>=len-.08)continue;
   const path=new THREE.Path();
   path.moveTo(x0,hole.y);path.lineTo(x0,hole.y+hole.h);
   path.lineTo(x1,hole.y+hole.h);path.lineTo(x1,hole.y);path.closePath();
   shape.holes.push(path);
  }
  const geo=new THREE.ShapeGeometry(shape,2);
  const p=geo.getAttribute('position'),ux=(b.x-a.x)/len,uz=(b.y-a.y)/len;
  for(let i=0;i<p.count;i++){
   const along=p.getX(i),vertical=p.getY(i);
   p.setXYZ(i,a.x+ux*along,base+vertical,a.y+uz*along);
  }
  p.needsUpdate=true;geo.computeVertexNormals();
  return colorGeometry(geo,color);
 }
 function triangleGeometry(a,b,base,height,rise,color){
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute([
   a.x,base+height,a.y,
   b.x,base+height,b.y,
   (a.x+b.x)*.5,base+height+rise,(a.y+b.y)*.5
  ],3));
  geo.setIndex([0,1,2]);
  geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1],2));
  geo.computeVertexNormals();
  return colorGeometry(geo,color);
 }
 function publish(){
  if(typeof window!=='undefined')window.__miloviceHeroArchitecture={...state,
   selectedIds:[...selected].slice(0,8),faceAudits:appliedFaces.slice(0,32),radius,maxBuildings};
 }
 function supports({points,height,floors,type,index,id,excluded=false,override=null}){
  if(excluded||(!override&&selected.size>=maxBuildings)||points?.length<4||points.length>10||
    !(height>=2.7&&height<=(override?25:12.5))||floors>(override?6:3))return false;
  if(!['house','residential','yes','detached','semidetached_house','terrace'].includes(type))return false;
  const center=points.reduce((a,p)=>({x:a.x+p.x/points.length,z:a.z+p.y/points.length}),{x:0,z:0});
  if(!override&&!sites.some(p=>Math.hypot(p.x-center.x,p.z-center.z)<radius))return false;
  const xs=points.map(p=>p.x),zs=points.map(p=>p.y);
  const width=Math.max(...xs)-Math.min(...xs),depth=Math.max(...zs)-Math.min(...zs);
  if(width<4||depth<4||width>44||depth>44||width*depth>850)return false;
  const identity=id??('local-'+index);
  if(selected.has(identity))return false;
  return true;
 }
 function addBuilding({points,base,height,floors,type,index,id,excluded=false,override=null}){
  if(!supports({points,height,floors,type,index,id,excluded,override}))return false;
  const identity=id??('local-'+index);
  selected.add(identity);
  const pts=[...points];
  if(pts.length>4&&pts[0].distanceTo(pts[pts.length-1])<.10)pts.pop();
  const centroid=pts.reduce((a,p)=>({x:a.x+p.x/pts.length,z:a.z+p.y/pts.length}),{x:0,z:0});
  const chunk=bucket(centroid.x,centroid.z);
  const tone=override?.facadeColor||colors[Math.abs(Number(id)||index)%colors.length];
  if(override)state.verifiedOverrides++;
  const sides=pts.map((a,i)=>({a,b:pts[(i+1)%pts.length],len:a.distanceTo(pts[(i+1)%pts.length])}));
  const entrySide=sides.reduce((best,s,i)=>s.len>best.len?{i,len:s.len}:best,{i:0,len:0}).i;
  const faceEdges=selectFacadeEdges(pts);
  const explicitDoor=Object.values(override?.facades||{}).some(f=>
   ['left','center','right'].includes(f.doorAt)||f.openings?.some(o=>o.type==='door'));
  const levels=Math.min(6,Math.max(1,floors));
  for(let sideIndex=0;sideIndex<sides.length;sideIndex++){
   const {a,b,len}=sides[sideIndex];
   // All perimeter edges, including 1.2m returns and short recessed
   // walls, MUST be closed. Previous len<3 skip omitted exterior walls
   // on concave OSM buildings, exposing the sky below the hip roof.
   const wallKind=classifyFacadeEdgeLength(len);
   if(wallKind==='degenerate'){state.skippedDegenerateEdges++;continue;}
   // The SAME base/cornice planner is used BEFORE splitting long facades
   // from short, undecorated returns. Previously an early continue skipped
   // both bands on every short return, leaving visibly broken plinths.
   const trim=planFacadePerimeterTrims(a,b,centroid,{base,height});
   if(!trim)throw Error('Valid facade edge has no perimeter bands');
   const addBand=band=>placement(chunk,band.kind,
    band.x,band.y,band.z,band.width,band.height,band.depth,band.yaw);
   addBand(trim.base);
   addBand(trim.upper);
   state.trimmedWallEdges++;
   state.trimmedPerimeterMetres+=trim.length;
   if(wallKind==='solid-return')state.trimmedShortReturns++;
   if(wallKind==='solid-return'){
    const shortWall=wallGeometry(a,b,base,height,[],tone);
    if(shortWall){
     chunk.walls.push(shortWall);state.solidWalls++;
     state.shortWallSegmentsSealed++;
    }
    continue;
   }
   const {ux,uz,nx,nz,mx,mz,yaw}=trim,holes=[];
   // One independently reviewed facade can replace only its own selected
   // surveyed wall; corners/chamfers and unreviewed sides keep the old model.
   const photoAnchored=Boolean(override?.source);
   // A photographed building may have an incomplete facade survey.
   // Show functional provisional openings, not randomly invented ornaments.
   const cardinal=faceEdges.get(sideIndex);
   const sideLayout=cardinal?override?.facades?.[cardinal]||null:null;
   const autoEntrance=sideIndex===entrySide&&len>5&&!explicitDoor&&!sideLayout?.openings?.length;
   const planned=planFaceOpenings({length:len,height,levels,side:sideLayout,
    legacyWindows:override?.windowsPerWall||Math.min(6,Math.max(1,Math.floor((len-1.4)/3.0))),
    autoEntrance});
   const entry=!!planned.door;
   const entranceU=planned.door?.x??len*.5;
   const doorWidth=planned.door?.w??1.21;
   const doorBottom=planned.door?.y??.13,doorHeight=planned.door?.h??2.27;
   if(entry){holes.push(planned.door);state.cutoutDoors++}
   if(sideLayout){
    state.verifiedFaces++;
    if(planned.photoMapped){
     state.photoMappedFaces++;state.photoMappedWindows+=planned.windows.length;
    }
    appliedFaces.push({id:String(identity),side:cardinal,windows:planned.windows.length,
     door:entry,wallColor:sideLayout.wallColor||null,
     photoMapped:!!planned.photoMapped,
     windowPositions:planned.photoMapped?planned.windows.slice(0,10).map(w=>({x:+w.x.toFixed(2),y:+w.y.toFixed(2),w:+w.w.toFixed(2),h:+w.h.toFixed(2)})):[]});
   }
   let windowIndex=0;
   for(const window of planned.windows){
     const {x:along,y:bottom,w,h,floor}=window,i=windowIndex++;
     holes.push({x:along,y:bottom,w,h});
     state.cutoutWindows++;
     const wx=a.x+ux*along,wz=a.y+uz*along;
     const front=(offset)=>({x:wx+nx*offset,z:wz+nz*offset});
     const inner=front(-.18),frame=front(.065),sill=front(.18);
     placement(chunk,'dark',inner.x,base+bottom+h*.50,inner.z,w+.08,h+.08,.04,yaw);
     placement(chunk,'glass',wx+nx*(-.13),base+bottom+h*.5,wz+nz*(-.13),w-.035,h-.035,1,yaw,true);
     placement(chunk,'frame',frame.x,base+bottom+h+.035,frame.z,w+.13,.085,.18,yaw);
     placement(chunk,'frame',frame.x,base+bottom-.035,frame.z,w+.13,.09,.18,yaw);
     placement(chunk,'frame',wx+ux*(w*.5+.038)+nx*.065,base+bottom+h*.5,
       wz+uz*(w*.5+.038)+nz*.065,.082,h+.10,.18,yaw);
     placement(chunk,'frame',wx-ux*(w*.5+.038)+nx*.065,base+bottom+h*.5,
       wz-uz*(w*.5+.038)+nz*.065,.082,h+.10,.18,yaw);
     placement(chunk,'frame',frame.x,base+bottom+h*.5,frame.z,.054,h,.13,yaw);
     placement(chunk,'sill',sill.x,base+bottom-.055,sill.z,w+.28,.11,.32,yaw);
     // On a verified facade never invent shutter/lintel ornaments at random.
     if(!sideLayout&&(index+i+floor)%2===0){
      if(photoAnchored)state.suppressedUnverifiedPhotoOrnaments++;
      else placement(chunk,'sill',frame.x,base+bottom+h+.16,frame.z,w+.22,.12,.23,yaw);
     }
     // Window shutters are a PHOTOGRAPHIC property, never an
     // index-based random decoration. Unsupported facades stay provisional.
     const randomShutters=floor===0&&i%3===1;
     const useShutters=sideLayout?.shutters===true;
     if(!sideLayout&&randomShutters)
      state.suppressedUnverifiedPhotoOrnaments++;
     if(useShutters){
      const off=w*.5+.26;
      for(const sign of [-1,1])
       placement(chunk,'wood',wx+ux*off*sign+nx*.08,base+bottom+h*.5,
         wz+uz*off*sign+nz*.08,.22,h-.05,.09,yaw);
     }
   }
   // Actual front door opening, framed with a 3D threshold/hood.
   if(entry){
    const xx=a.x+ux*entranceU,zz=a.y+uz*entranceU;
    placement(chunk,'dark',xx-nx*.15,base+doorBottom+doorHeight*.5,zz-nz*.15,doorWidth+.03,doorHeight,.07,yaw);
    placement(chunk,'wood',xx-nx*.105,base+doorBottom+doorHeight*.5,zz-nz*.105,doorWidth-.14,doorHeight-.11,.07,yaw);
    for(const d of [-1,1]){
     placement(chunk,'frame',xx+ux*d*(doorWidth*.5+.06)+nx*.07,base+doorBottom+doorHeight*.5,
       zz+uz*d*(doorWidth*.5+.06)+nz*.07,.11,doorHeight+.18,.24,yaw);
    }
    placement(chunk,'frame',xx+nx*.08,base+doorBottom+doorHeight+.055,zz+nz*.08,doorWidth+.22,.12,.27,yaw);
    placement(chunk,'base',xx+nx*.53,base+doorBottom-.025,zz+nz*.53,doorWidth+.36,.20,.82,yaw);
    // No photo-approved awning geometry exists in the per-facade schema.
    // Suppress blanket door awnings rather than falsely decorating every
    // unrelated house. A later explicit source-backed profile may add it.
    if(!sideLayout)state.suppressedUnverifiedPhotoOrnaments++;
   }
   const geometry=wallGeometry(a,b,base,height,holes,sideLayout?.wallColor||tone);
   if(geometry){chunk.walls.push(geometry);state.solidWalls++}
  }
  // ONLY cap a true supported GABLE where its TWO end walls are across
  // the verified roof ridge. Former code guessed ends from pts[0]-pts[1]
  // and erected triangular walls in the wrong direction on reversed/rotated
  // cadastral polygons — they were plainly visible as floating dark spikes.
  // The new roof generator uses dominantRoofAxis on this same footprint.
  const roofKind=override?.roofKind||'auto';
 const gable=roofKind==='hip'||roofKind==='flat'?null:
  analyzeGableFootprint(pts,{allowSquare:roofKind==='gable'});
 if(gable){
  const rise=Math.min(3.2,gable.width*.32);
  for(const i of gable.endIndices)
   chunk.walls.push(triangleGeometry(pts[i],pts[(i+1)%4],base,height,rise,tone));
  state.gables+=2;
 }else if(pts.length===4&&roofKind!=='hip'&&roofKind!=='flat'){
  state.skippedUnverifiedGables++;
 }
 // No fake chimney every third building. Rooftop accessories must be
  // supplied by an individual surveyed/photo-verified house model.
  if(index%3===0)state.suppressedArbitraryChimneys++;
  state.buildings++;publish();return true;
 }
 function flush(parent){
  let batches=0;
  for(const [key,chunk] of [...chunks]){
   if(chunk.walls.length){
    const g=mergeGeometries(chunk.walls,false);
    if(!g)throw Error('Cannot merge old-town facade geometry');
    const mesh=new THREE.Mesh(g,mats.wall);mesh.receiveShadow=true;
    mesh.userData.lodX=(Math.floor(Number(key.split(',')[0]))+.5)*cell;
    mesh.userData.lodZ=(Math.floor(Number(key.split(',')[1]))+.5)*cell;
    parent.add(mesh);state.drawMeshes++;batches++;
    chunk.walls.forEach(geo=>geo.dispose());
   }
   for(const [id,matrices] of chunk.props){
    if(!matrices.length)continue;
    const [name,geomType]=id.split(':');
    const geo=geomType==='plane'?glassPlane:box;
    const inst=new THREE.InstancedMesh(geo,mats[name],matrices.length);
    for(let i=0;i<matrices.length;i++)inst.setMatrixAt(i,matrices[i]);
    inst.instanceMatrix.needsUpdate=true;inst.computeBoundingSphere();
    const [bx,bz]=key.split(',').map(Number);
    inst.userData.lodX=(bx+.5)*cell;inst.userData.lodZ=(bz+.5)*cell;
    inst.userData.lodDetail=true;
    parent.add(inst);state.drawMeshes++;batches++;
   }
   chunks.delete(key);
  }
  state.chunkCount+=batches;publish();
 }
 function reset(){chunks.clear();selected.clear();appliedFaces.length=0;for(const key of Object.keys(state))state[key]=0;publish()}
 publish();
 return {addBuilding,flush,reset,stats:()=>({...state})};
}
