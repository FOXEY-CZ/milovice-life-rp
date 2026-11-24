import {inspectAthleticsOutline5300} from './osm-athletics-outline-5300.js';
// The 2019 school report documents a long-jump competition; sand is a
// model inference for the exact mapped rectangle, not a present-day survey.
export function inspectJuventaLongJump5302(way){
 const source=inspectAthleticsOutline5300(way);
 if(source?.id!=='1472419120'||way.tags.surface!==undefined)return null;
 return {sourceOSMId:source.id,sourceHash:source.sourceHash,material:'pitchSand',
  modelSurfaceInferred:true,currentSurfaceVerified:false,sourceGeometryPreserved:true,
  newEquipment:0,newMaterials:0};
}
