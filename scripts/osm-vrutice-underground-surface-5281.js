/** Milovice RP 5.281 — do not paint documented underground footpaths
 * on the DEM surface. These five source-locked OSM ways have tunnel=yes
 * AND layer=-1; their real subterranean 3D section has not been surveyed.
 * Keep the original GPS data, routes and collision graph unchanged.
 */
export const VRUTICE_UNDERGROUND_SOURCE_5281=Object.freeze({
 '435045331':{vertices:8,hash:'8d2fc715'},
 '435050519':{vertices:2,hash:'779aa363'},
 '1330579585':{vertices:2,hash:'09a6547b'},
 '1330579586':{vertices:2,hash:'780de7bb'},
 '1330579587':{vertices:2,hash:'a276561e'}
});
function geometryHash(geometry){
 const str=geometry.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 let h=2166136261;
 for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
 return(h>>>0).toString(16).padStart(8,'0');
}
export function planVruticeUndergroundSurface5281({regionId,way}={}){
 if(!['vrutice','westlink'].includes(regionId)||!way||
  way.type!=='way'||way.tags?.highway!=='path'||
  way.tags?.tunnel!=='yes'||String(way.tags?.layer)!=='-1')return null;
 const id=String(way.id),source=VRUTICE_UNDERGROUND_SOURCE_5281[id];
 if(!source||!Array.isArray(way.geometry)||
  way.geometry.length!==source.vertices||!way.geometry.every(p=>
   Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)&&
   p.lat>50.238&&p.lat<50.241&&p.lon>14.859&&p.lon<14.862)||
  geometryHash(way.geometry)!==source.hash)return null;
 let metres=0;
 for(let i=1;i<way.geometry.length;i++){
  const a=way.geometry[i-1],b=way.geometry[i];
  metres+=Math.hypot((b.lat-a.lat)*111320,
   (b.lon-a.lon)*111320*Math.cos(a.lat*Math.PI/180));
 }
 if(!Number.isFinite(metres)||metres<1)return null;
 return {version:'5.281',sourceOSMId:id,sourceHash:source.hash,
  sourceHighway:'path',sourceTunnel:'yes',sourceLayer:'-1',
  sourceNodes:way.geometry.length,sourceEdges:way.geometry.length-1,
  originalMetres:metres,drawOnDEM:false,
  trueSubterraneanMeshBuilt:false,depthSurveyed:false,
  mapGeometryUnchanged:true,newRoads:0,newFootways:0,newColliders:0};
}
