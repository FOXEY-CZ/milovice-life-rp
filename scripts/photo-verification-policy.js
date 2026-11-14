/**
 * Milovice RP 5.61 — restore mistakenly hidden legacy buildings without claiming photo validation.
 *
 * OpenStreetMap is a useful source for approximate position, feature IDs,
 * road geometry and tagged building footprints. An OSM building tag is NOT
 * photographic proof of the building's appearance, use, entrances or current
 * existence. Never promote geometry-based guesses to photo-verified assets.
 *
 * The previously hidden 17 OSM-tagged 'garage' ways in northern Nádražní
 * were DIFFERENT from the buildings in the user's screenshots. Reinstate
 * their already existing legacy model; do not approve or re-create the
 * speculative gate-orientation algorithm from 5.59. Mark as unverified.
 */
export const NADRAZNI_PHOTO_PENDING_OSM_IDS=Object.freeze([
  194679587,194679590,194679596,194679600,194679625,194679639,
  194679673,194679677,194679695,194679698,194679708,194679715,
  194679719,194679741,194679745,194679758,194679763
]);

// Explicitly EMPTY: none of the restored legacy buildings has an approved
// photograph of its exact identity or visible architectural details.
// Do not populate from nearby street photos, map tags or generated images.
export const PHOTO_VERIFIED_ARCHITECTURE=Object.freeze([]);

const pendingIds=new Set(NADRAZNI_PHOTO_PENDING_OSM_IDS);
const validSource=e=>e&&typeof e==='object'&&
 e.identityReviewed===true&&e.photographicMatchConfirmed===true&&
 e.buildingTypeConfirmed===true&&e.geometryChecked===true&&
 Array.isArray(e.osmIds)&&e.osmIds.length>0&&
 typeof e.sourceUrl==='string'&&/^https:\/\//i.test(e.sourceUrl)&&
 typeof e.capturedAt==='string'&&/^\d{4}-\d\d-\d\d$/.test(e.capturedAt)&&
 typeof e.reviewNote==='string'&&e.reviewNote.trim().length>=12;
/**
 * Every NEW photo-claimed 3D asset needs an identity-verified photograph of
 * that exact OSM object; proximity of the photographer alone is insufficient.
 * Evidence must be bound to OSM IDs explicitly, with human review notes.
 */
export function hasReviewedPhotoEvidence(osmId,{records=PHOTO_VERIFIED_ARCHITECTURE}={}){
 const id=Number(osmId);
 return Number.isSafeInteger(id)&&Array.isArray(records)&&
  records.some(e=>validSource(e)&&e.osmIds.some(x=>Number(x)===id));
}
/**
 * Roll back the mistaken 5.60 hide operation: all 17 existing models may
 * render again as LEGACY placeholders. This is explicitly NOT a claim that
 * their OSM building=garage tag, shutters or facade designs are accurate.
 * Their photographs must still be checked before further improvements.
 */
export function photoRenderingDecision(osmId,{records=PHOTO_VERIFIED_ARCHITECTURE}={}){
 const id=Number(osmId);
 if(!pendingIds.has(id))return {
   render:true,status:'legacy-needs-separate-audit',
   photographicApproval:false,osmId:id
 };
 const approved=hasReviewedPhotoEvidence(id,{records});
 return {render:true,status:approved?'photo-reviewed':'legacy-restored-awaiting-photo',
  photographicApproval:approved,osmId:id,
  reason:approved?'photo-match-reviewed':
   'Reinstated pre-5.59 legacy 3D placeholder after wrong-location hide; OSM type and visual appearance still unverified'};
}
/**
 * A dedicated gate for ALL NEW 3D feature proposals. Do not use OSM type,
 * guessed geometry, nearby photos or an AI-created image as the source.
 */
export function approveNew3DFeature({osmId,feature,records=PHOTO_VERIFIED_ARCHITECTURE}={}){
 const supported=typeof feature==='string'&&feature.trim().length>1;
 return Boolean(supported&&hasReviewedPhotoEvidence(osmId,{records}));
}
