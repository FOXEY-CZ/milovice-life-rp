import {inspectAthleticsOutline5300} from './osm-athletics-outline-5300.js';
const area=p=>p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+(a.x-p[0].x)*(b.y-p[0].y)-(a.y-p[0].y)*(b.x-p[0].x)},0)/2;
// Divide only the documented outline along an inferred chord between
// existing source vertices. The rounded cap is not a surveyed throwing circle.
export function planJuventaShotPut5303(way,pts){
 const source=inspectAthleticsOutline5300(way);
 if(source?.id!=='1472419115'||way.tags.surface!==undefined||
  !Array.isArray(pts)||pts.length!==20||pts.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))return null;
 const sector=pts.slice(4,8),cap=pts.slice(7).concat(pts.slice(0,5));
 const total=area(pts),a=area(sector),b=area(cap);
 if(![total,a,b].every(Number.isFinite)||Math.sign(a)!==Math.sign(total)||Math.sign(b)!==Math.sign(total)||
  Math.abs(a+b-total)>1e-6||Math.abs(a)<80||Math.abs(a)>115||Math.abs(b)<6||Math.abs(b)>10)return null;
 return {sourceOSMId:source.id,sourceHash:source.sourceHash,sector,cap,capMaterial:'pitchAsphalt',
  sectorArea:Math.abs(a),capArea:Math.abs(b),sourceArea:Math.abs(total),
  sourceGeometryPreserved:true,splitInferred:true,currentSurfaceVerified:false,
  regulationCircleVerified:false,newEquipment:0,newMaterials:0};
}
