// Milovice RP 5.124 — completed Poliklinika Spojovaci ground-floor glazing.
// ABP completed-building photos (2019–2023) and SPADIA's later exterior
// photograph show near-ground-height, segmented glass units on this facade.
// Their individual mullion and tenant bay positions were NOT surveyed.
// A pharmacy at this address is documented, but its exact storefront bay
// is NOT established by the photos. Never fabricate a LEMON wall sign.
export const CLINIC_STOREFRONT_SOURCES=Object.freeze({
  clinicOsmId:'1057548624',
  constructionPhoto:'https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice',
  recentExteriorPhoto:'https://www.spadia.cz/verejnost/odberova-mista/praha-a-stredocesky-kraj/milovice/',
  pharmacyOfficial:'https://www.lekarnalemon.cz/index.php/lekarny/lemon-lekarna-milovice-spojovaci-873',
  pharmacyRegister:'https://lekarnici.cz/lekarna/lemon-spojovaci-873-milovice/',
  labOfficial:'https://www.spadia.cz/verejnost/odberova-mista/praha-a-stredocesky-kraj/milovice/'
});
const X=p=>p?.x,Z=p=>p?.z??p?.y;
function signedArea(poly){
 let v=0;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length];
  v+=X(a)*Z(b)-X(b)*Z(a);
 }
 return v/2;
}
export function planClinicPhotoStorefronts({
 id,regionId,tags={},polygon=[],front,
 floors,modelHeight,existingEntrance,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const src=CLINIC_STOREFRONT_SOURCES;
 if(String(id)!==src.clinicOsmId||regionId!=='mlada'||
  tags.name!=='Poliklinika Milovice'||tags.building!=='yes'||
  tags.amenity!=='clinic'||tags.healthcare!=='clinic'||
  tags.height!==undefined||tags['building:levels']!==undefined||
  tags.access==='private'||tags.access==='no'||
  photoReviewed||approvedArchitecture||
  !Array.isArray(polygon)||polygon.length!==4||
  polygon.some(p=>!Number.isFinite(X(p))||!Number.isFinite(Z(p)))||
  !front||front.index!==2||!Number.isFinite(front.len)||
  front.len<44.4||front.len>45.3||
  ![front.mx,front.mz,front.ux,front.uz,front.nx,front.nz]
   .every(Number.isFinite)||
  front.nx<.95||
  Math.abs(Math.hypot(front.nx,front.nz)-1)>.01||
  Math.abs(front.ux*front.nx+front.uz*front.nz)>.01||
  Math.abs(Math.abs(signedArea(polygon))-827.58)>1||
  floors!==4||modelHeight<12.6||modelHeight>13.2||
  !existingEntrance||existingEntrance.faceIndex!==2||
  existingEntrance.bays!==8||existingEntrance.bayIndex!==4||
  existingEntrance.sourceWayId!==src.clinicOsmId)return null;
 const bays=existingEntrance.bays;
 const pitch=front.len/bays;
 const glassWidth=Math.min(3.9,pitch*.78);
 const topAboveFoundation=Math.min(3.03,modelHeight/4-.14);
 const groundGlass=[];
 for(let bay=0;bay<bays;bay++){
  if(bay===existingEntrance.bayIndex)continue;
  const along=(bay+.5-bays/2)*pitch;
  if(Math.abs(along)+glassWidth/2>front.len/2-.25)return null;
  groundGlass.push({
   bay,along,glassWidth,topAboveFoundation,
   mullionAlong:[-glassWidth*.5,-glassWidth/6,
    glassWidth/6,glassWidth*.5],
   transomHeightFromGround:1.12,
   frameThickness:.062,
   realDoorExistsHere:false,
   glassWallIsPassable:false
  });
 }
 if(groundGlass.length!==7)return null;
 return {
  version:'5.124',sourceBuildingId:src.clinicOsmId,
  photoSource:src.constructionPhoto,
  secondExterior:src.recentExteriorPhoto,
  actualPharmacyInBuilding:true,
  pharmacyBusinessName:'Lékárna LEMON',
  pharmacySource:src.pharmacyOfficial,
  pharmacyRegister:src.pharmacyRegister,
  actualLabInBuilding:true,labBusinessName:'SPADIA odběrové místo',
  laboratorySource:src.labOfficial,
  pharmacyExactShopfrontBayKnown:false,
  pharmacySignPhysicallyObserved:false,
  photoBuildingBasementOrInsideNotDocumented:true,
  sourceGeometryUnchanged:true,
  frontFaceEdge:front.index,
  bays,existingMainEntranceBay:existingEntrance.bayIndex,
  groundWindowBays:groundGlass.length,
  originalFloatingGroundWindowsRemoved:groundGlass.length,
  replacementGlassPanels:groundGlass.length,
  framePiecesPerBay:7,
  newBusinessSignMeshes:0,newAssumedShopDoorHoles:0,
  newRoads:0,newParkingBays:0,newFootways:0,
  allMullionDimensionsEstimated:true,
  allGroundGlazingPhotoSupported:true,
  floorGroundingUsesExistingTerrainSampler:true,
  groundGlass
 };
}
