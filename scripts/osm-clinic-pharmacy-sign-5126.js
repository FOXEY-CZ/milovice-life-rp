// Milovice RP 5.126 — photo-confirmed pharmacy lettering, no guessed brand.
// RE/MAX exterior photograph shows green "LÉKÁRNA" south/photo-left
// of the teal entrance. Exact 8-bay mapping and dimensions are unmeasured.
// Third-party photo pixels are never copied into our canvas texture.
export const CLINIC_PHARMACY_SIGN_SOURCES=Object.freeze({
 clinicWay:'1057548624',
 photo:'https://www.remax-czech.cz/reality/detail/423323/pronajem-komercniho-prostoru-41-m2-milovice',
 photoFrame:'https://mlsf.remax-czech.cz/data/zs/423323/3002119.jpg',
 pharmacyOperator:'https://www.lekarnalemon.cz/index.php/lekarny/lemon-lekarna-milovice-spojovaci-873',
 seenLetters:'LÉKÁRNA',
 relativePosition:'photo-left-of-teal-entrance',
 exactBaySurveyed:false
});
export function planClinicPhotoPharmacySign({
 id,regionId,tags={},front,storefront,entrance,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const src=CLINIC_PHARMACY_SIGN_SOURCES;
 if(String(id)!==src.clinicWay||regionId!=='mlada'||
  tags.building!=='yes'||tags.amenity!=='clinic'||
  tags.healthcare!=='clinic'||tags.name!=='Poliklinika Milovice'||
  photoReviewed||approvedArchitecture||
  !front||front.index!==2||!Number.isFinite(front.len)||
  Math.abs(front.len-44.86)>.5||
  ![front.mx,front.mz,front.ux,front.uz,front.nx,front.nz]
   .every(Number.isFinite)||
  Math.abs(Math.hypot(front.ux,front.uz)-1)>.01||
  Math.abs(Math.hypot(front.nx,front.nz)-1)>.01||
  Math.abs(front.ux*front.nx+front.uz*front.nz)>.01||
  front.nx<.95||front.uz>-.97||
  !storefront||storefront.sourceBuildingId!==src.clinicWay||
  storefront.frontFaceEdge!==2||
  storefront.bays!==8||storefront.groundWindowBays!==7||
  storefront.existingMainEntranceBay!==4||
  storefront.pharmacyExactShopfrontBayKnown!==false||
  !Array.isArray(storefront.groundGlass)||
  !entrance||entrance.faceIndex!==2||entrance.bayIndex!==4||
  entrance.sourceWayId!==src.clinicWay)return null;
 // The chosen renderer bay lies SOUTH (left in the east-facing photo).
 // It is only an approximate location, NOT an actual tenant-unit survey.
 const bay=storefront.groundGlass.find(g=>g.bay===1);
 if(!bay||!Number.isFinite(bay.along)||
  bay.along>=0||bay.glassWidth<3.6)return null;
 const width=3.25,height=.46,aboveFoundation=3.34,outset=.14;
 if(Math.abs(bay.along)+width/2>=front.len/2-.35)return null;
 return {
  version:'5.126',osmClinicId:src.clinicWay,
  photographedText:src.seenLetters,letteringColour:'#2e6535',
  photoSource:src.photo,photoFrame:src.photoFrame,
  verifiedPharmacyOperator:src.pharmacyOperator,
  signActuallyVisibleInPhoto:true,
  photoRelativeSouthSideConfirmed:true,
  relativeToEntrance:src.relativePosition,
  approximatedGlassBay:bay.bay,
  exactStorefrontBayEstablished:false,
  exactWorldLetteringPositionMeasured:false,
  signDimensionsMeasured:false,
  LEMONBrandSignObserved:false,
  photoPixelsCopied:false,
  frontEdgeIndex:2,along:bay.along,
  width,height,aboveFoundation,outset,
  addedSignMeshes:1,addedMaterials:1,
  newDoors:0,newBuildings:0,newFootways:0,newRoads:0,
  newParkingSpaces:0,newTrafficSigns:0,
  existingOSMBuildingUnchanged:true,
  originalForecourtAndCarriagewayUntouched:true,
  preserveMobileDetailLOD:true
 };
}
