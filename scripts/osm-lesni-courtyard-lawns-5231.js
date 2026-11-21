/** Milovice RP 5.231 — source-locked near-field grass ONLY inside three
 * existing OSM landuse=grass polygons at the Lesní / Višňová courtyard.
 * The existing terrain landscape polygons already draw the ground.
 * 3D blades are subtle game estimates; NO individual plants photographed.
 * Reject all candidate blades intersecting roads, footways, buildings/water.
 */
import {lawnPolygonContains5218,lawnBoundaryDistance5218}
 from './osm-visnova-garden-lawns-5218.js';
export const LESNI_COURTYARD_LAWNS_5231=Object.freeze({
 region:'mlada',
 polygons:Object.freeze([
  Object.freeze({id:'1460019789',nodes:7,hash:'b977361a',area:69.50}),
  Object.freeze({id:'1460019790',nodes:5,hash:'70d93254',area:53.22}),
  Object.freeze({id:'1460019792',nodes:7,hash:'e17fd422',area:83.61})
 ]),
 areaM2:206.33,spacing:1.80,maxTuftsPerPolygon:56,
 inset:.37,roadBuffer:.27,walkBuffer:.24,buildingBuffer:.48,
 actualBladeLocationsUnknown:true
});
const pointKey=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const gpsHash=g=>{let h=2166136261;for(const c of g.map(pointKey).join(';')){
 h^=c.charCodeAt(0);h=Math.imul(h,16777619)
}return(h>>>0).toString(16).padStart(8,'0')};
const area=poly=>Math.abs(poly.reduce((s,a,i)=>{
 const b=poly[(i+1)%poly.length];return s+a.x*b.z-b.x*a.z
},0)/2);
export function planLesniCourtyardLawns5231(ways,{
 regionId,toWorld,roads,pedestrians,buildings,water,excludedLawnIds=[]
}={}){
 const c=LESNI_COURTYARD_LAWNS_5231;
 if(regionId!==c.region||!Array.isArray(ways)||
  typeof toWorld!=='function'||!Array.isArray(excludedLawnIds)||
  ![roads,pedestrians,buildings,water].every(v=>typeof v?.isClear==='function'))
  return null;
 const accepted=[];
 for(const spec of c.polygons){
  const matches=ways.filter(w=>String(w?.id)===spec.id);
  if(matches.length!==1)return null;
  const g=matches[0].geometry,t=matches[0].tags;
  if(!Array.isArray(g)||g.length!==spec.nodes||
   g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   !t||Object.keys(t).length!==1||t.landuse!=='grass'||
   pointKey(g[0])!==pointKey(g.at(-1))||gpsHash(g)!==spec.hash)
    return null;
  const poly=g.slice(0,-1).map(toWorld)
   .map(p=>({x:p?.x,z:p?.y??p?.z}));
  if(poly.length<3||poly.some(p=>![p.x,p.z].every(Number.isFinite))||
   Math.abs(area(poly)-spec.area)>.12)return null;
  accepted.push({id:spec.id,polygon:poly,areaM2:spec.area});
 }
 if(Math.abs(accepted.reduce((s,p)=>s+p.areaM2,0)-c.areaM2)>.01)
  return null;
 const exclude=new Set(excludedLawnIds.map(String)),
  tufts=[],byPolygon={},skippedPreviouslyDetailed=[];
 const rejected={boundary:0,roads:0,pedestrians:0,buildings:0,water:0};
 for(const {id,polygon} of accepted){
  byPolygon[id]=0;
  if(exclude.has(id)){skippedPreviouslyDetailed.push(id);continue;}
  const xs=polygon.map(p=>p.x),zs=polygon.map(p=>p.z),
   minX=Math.min(...xs),maxX=Math.max(...xs),
   minZ=Math.min(...zs),maxZ=Math.max(...zs),step=c.spacing;
  for(let z=minZ+step*.5;z<maxZ-step*.5&&
   byPolygon[id]<c.maxTuftsPerPolygon;z+=step){
   for(let x=minX+step*.5;x<maxX-step*.5&&
    byPolygon[id]<c.maxTuftsPerPolygon;x+=step){
    const ix=Math.round((x-minX)/step),iz=Math.round((z-minZ)/step),
     px=x+(((ix*13+iz*5)%11)-5)*.027,
     pz=z+(((ix*3+iz*17)%11)-5)*.027;
    if(!lawnPolygonContains5218(px,pz,polygon)||
     lawnBoundaryDistance5218(px,pz,polygon)<c.inset){
     rejected.boundary++;continue;
    }
    if(!roads.isClear(px,pz,.35,c.roadBuffer)){rejected.roads++;continue;}
    if(!pedestrians.isClear(px,pz,.30,c.walkBuffer)){
     rejected.pedestrians++;continue;
    }
    if(!buildings.isClear(px,pz,c.buildingBuffer)){
     rejected.buildings++;continue;
    }
    if(!water.isClear(px,pz,.5,.3)){rejected.water++;continue;}
    const seed=(ix*31+iz*47+Number(id.slice(-4)))>>>0,
     height=.16+(seed%5)*.025;
    tufts.push({x:px,z:pz,spread:.1+height*.24,height,
     yaw:(seed*2.399963229728653)%6.283185307179586,
     sourceOSMId:id,positionEstimated:true});
    byPolygon[id]++;
   }
  }
 }
 return {
  version:'5.231',sourceLawnIds:accepted.map(p=>p.id),
  sourceHashes:c.polygons.map(p=>p.hash),
  sourceAreaM2:c.areaM2,sourcePolygonAreasM2:c.polygons.map(p=>p.area),
  sourceNodes:c.polygons.map(p=>p.nodes),
  byPolygon,tufts,skippedPreviouslyDetailed,rejected,
  originalOSMPolygonsUnchanged:true,actualBladeLocationsUnknown:true,
  estimatedBladesOnly:true,roadsAndFootwaysCleared:true,
  newGrassPolygons:0,newTrees:0,newShrubs:0,newFootways:0,
  newRoads:0,newCrossings:0,newColliders:0,newBuildings:0,
  newGardenFences:0,newParkingPlaces:0,newStreetFurniture:0
 };
}
