// Milovice RP 5.118: actual Billa and Poliklinika by Armádní/Spojovací.
// Original OSM polygon and type, exterior appearance informed by PUBLIC photos.
// Estimated wall height/window spacing is not a survey or OSM level tag.
// OSM's clinic polygon has NO building:levels tag; four visible rows come
// from ABP's completed exterior photograph (2019–2023 project).
export const ARMADNI_LANDMARK_SOURCES=Object.freeze({
 billa:Object.freeze({
  osmId:'53865798',kind:'supermarket',name:'Billa',
  photo:'https://www.firmy.cz/detail/13214923-billa-milovice-mlada.html',
  evidence:'Firmy.cz entrance photograph: grey horizontally ribbed cladding, dark entrance canopy, roof-level BILLA lettering'
 }),
 clinic:Object.freeze({
  osmId:'1057548624',kind:'polyclinic',name:'Poliklinika Milovice',
  photo:'https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice',
  evidence:'ABP exterior photograph: four visible storeys, white facade, teal infill bands, rectangular windows'
 })
});
const X=p=>p?.x,Z=p=>p?.z??p?.y;
const area=ring=>{
 let twice=0;
 for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length];
  twice+=X(a)*Z(b)-X(b)*Z(a);
 }
 return Math.abs(twice)*.5;
};
export function planArmLandmarkMassing({
 id,regionId,tags={},points=[],photoReviewed=false,
 approvedArchitecture=false
}={}){
 const key=String(id??'');
 const isBilla=key===ARMADNI_LANDMARK_SOURCES.billa.osmId;
 const source=isBilla?ARMADNI_LANDMARK_SOURCES.billa:
  key===ARMADNI_LANDMARK_SOURCES.clinic.osmId?
  ARMADNI_LANDMARK_SOURCES.clinic:null;
 if(!source||regionId!=='mlada'||photoReviewed||approvedArchitecture||
  !Array.isArray(points)||points.length<5||points.length>12||
  !points.every(p=>Number.isFinite(X(p))&&Number.isFinite(Z(p)))||
  tags.name!==source.name||
  (isBilla?
   tags.building!=='supermarket'||tags.shop!=='supermarket'||
   tags['building:levels']!=='1':
   tags.building!=='yes'||tags.amenity!=='clinic'||
   tags.healthcare!=='clinic'||tags['building:levels']!==undefined)||
  tags.height!==undefined||tags['building:part']!==undefined||
  ['private','no'].includes(tags.access))return null;
 const ring=points.slice();
 if(Math.hypot(X(ring[0])-X(ring.at(-1)),Z(ring[0])-Z(ring.at(-1)))<.1)
  ring.pop();
 const a=area(ring);
 if(!(a>(isBilla?1050:760)&&a<(isBilla?1200:900)))return null;
 let photoFrontEdgeIndex=null,photoFrontEdgeLength=null;
 if(!isBilla){
  // East-facing longest facade is on the Spojovací/forecourt side
  // of the actual OSM polygon. Exact photo camera position is unknown:
  // calling this an inferred facing, NOT survey-verified.
  let best=null;
  for(let i=0;i<ring.length;i++){
   const p=ring[i],q=ring[(i+1)%ring.length];
   const len=Math.hypot(X(q)-X(p),Z(q)-Z(p));
   if(len<30||len>65)continue;
   const x=(X(p)+X(q))*.5;
   if(!best||x>best.x){best={i,x,len};}
  }
  if(!best)return null;
  photoFrontEdgeIndex=best.i;
  photoFrontEdgeLength=+best.len.toFixed(2);
 }
 return {
  sourceWayId:key,name:source.name,kind:source.kind,
  polygonAreaSquareMeters:+a.toFixed(2),footprintVertices:ring.length,
  floors:isBilla?1:4,
  modelHeightMeters:isBilla?5.2:12.9,
  mappedFloors:isBilla?1:null,
  sourceFloors:isBilla?'OSM building:levels=1':'4 rows observed in public ABP photo',
  photoSource:source.photo,photoEvidence:source.evidence,
  frontEdgeIndex:photoFrontEdgeIndex,
  frontEdgeLength:photoFrontEdgeLength,
  allOtherFacadesNotVerified:true,
  windowsAsExactSurvey:false,roofHeightMeasured:false,
  originalFootprintUntouched:true,newBuildingsCreated:0,
  newPathsCreated:0,doorsSurveyed:false,
  disableGenericSideGlazing:isBilla,
  disableGenericBusinessCanopy:!isBilla
 };
}
