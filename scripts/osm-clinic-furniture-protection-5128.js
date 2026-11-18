// Milovice RP 5.128 — photo-reviewed Spojovací clinic forecourt.
// Municipal 2022 paperwork says some light poles were to be MOVED,
// but supplies no as-built pole coordinates. OSM lit=yes confirms a
// lit STREET, not pole placements. Do not generate guessed furniture
// on the 5.123 photo-observed, real-OSM-clipped paved surface.
// This module removes neither existing OSM highways nor tagged poles.
export const CLINIC_NO_GUESSED_FURNITURE_SOURCES=Object.freeze({
  clinicWay:'1057548624',
  streetWay:'246652750',
  footwayWay:'1339091016',
  photo:'https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice',
  sitePlan:'https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=3513&id_org=9519',
  streetLitConfirmedByOSM:true,
  actualLampPositionsDocumented:false,
  photoPavingIsNotForRandomPoles:true
});
const finite=Number.isFinite;
function coords(p){return {x:p?.x,z:p?.z??p?.y};}
export function planClinicPavingFurnitureProtection({
  id,regionId,tags={},front,pavement,street,footway
}={}){
 const source=CLINIC_NO_GUESSED_FURNITURE_SOURCES;
 if(String(id)!==source.clinicWay||regionId!=='mlada'||
   tags.name!=='Poliklinika Milovice'||
   tags.building!=='yes'||tags.amenity!=='clinic'||
   tags.healthcare!=='clinic'||!front||
   front.index!==2||front.nx<.95||front.uz>-.97||
   ![front.mx,front.mz,front.ux,front.uz,front.nx,front.nz,front.len]
    .every(finite)||
   Math.abs(front.len-44.86)>.5||
   Math.abs(Math.hypot(front.ux,front.uz)-1)>.01||
   Math.abs(Math.hypot(front.nx,front.nz)-1)>.01||
   Math.abs(front.ux*front.nx+front.uz*front.nz)>.01||
   !pavement||pavement.clinicId!==source.clinicWay||
   pavement.sourceStreetId!==source.streetWay||
   pavement.sourceFootwayId!==source.footwayWay||
   pavement.photoObservedPaving!==true||
   !Array.isArray(pavement.cells)||pavement.cells.length<300||
   pavement.pavedModelArea<400||pavement.pavedModelArea>700||
   !street||String(street.id)!==source.streetWay||
   street.name!=='Spojovací'||street.kind!=='residential'||
   street.tags?.lit!=='yes'||
   !footway||String(footway.id)!==source.footwayWay||
   footway.kind!=='footway'||footway.tags?.lit!=='yes'
 )return null;
 const toLocal=p=>{
   const v=coords(p),x=v.x-front.mx,z=v.z-front.mz;
   return {a:x*front.ux+z*front.uz,b:x*front.nx+z*front.nz};
 };
 const tiles=[];
 for(const cell of pavement.cells){
   if(!Array.isArray(cell?.corners)||cell.corners.length!==4)return null;
   const points=cell.corners.map(toLocal);
   if(points.some(p=>![p.a,p.b].every(finite)))return null;
   const minA=Math.min(...points.map(p=>p.a)),
    maxA=Math.max(...points.map(p=>p.a)),
    minB=Math.min(...points.map(p=>p.b)),
    maxB=Math.max(...points.map(p=>p.b));
   tiles.push({minA,maxA,minB,maxB});
 }
 // 55 cm fringe covers typical procedural post base / mast thickness,
 // not an invented change to pavement/footway boundaries.
 const margin=.55;
 const minA=Math.min(...tiles.map(t=>t.minA))-margin,
   maxA=Math.max(...tiles.map(t=>t.maxA))+margin,
   minB=Math.min(...tiles.map(t=>t.minB))-margin,
   maxB=Math.max(...tiles.map(t=>t.maxB))+margin;
 const contains=(x,z)=>{
   if(!finite(x)||!finite(z))return false;
   const dx=x-front.mx,dz=z-front.mz,
    a=dx*front.ux+dz*front.uz,
    b=dx*front.nx+dz*front.nz;
   if(a<minA||a>maxA||b<minB||b>maxB)return false;
   return tiles.some(t=>a>=t.minA-margin&&a<=t.maxA+margin&&
     b>=t.minB-margin&&b<=t.maxB+margin);
 };
 return {
   version:'5.128',clinicWayId:source.clinicWay,
   streetWayId:source.streetWay,
   footwayWayId:source.footwayWay,
   photoSource:source.photo,municipalSitePlan:source.sitePlan,
   basedOnActualPavingTiles:pavement.cells.length,
   photoObservedPaving:true,basePavingModelArea:pavement.pavedModelArea,
   proceduralPoleSafetyMarginMeters:margin,
   streetIsLitInOSM:true,actualPoleCoordinatesKnown:false,
   suppressesOnlyInferredLampPoleCandidates:true,
   existingMappedLampPolesDeleted:0,existingOSMBuildingsChanged:0,
   existingOSMRoadsChanged:0,existingOSMFootwaysChanged:0,
   addedFurniture:0,addedTrees:0,addedShrubs:0,
   grasslandPolygonsUntouched:true,onlyCandidateFilter:true,
   contains
 };
}
