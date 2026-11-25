// Juventa 5.314, independent preparation; not imported into game.
// Source: DEKPROJEKT 2024-017735-AdM, PDF p.18, printed p.6, figure 2.
// https://smlouvy.gov.cz/smlouva/soubor/40162820/Smlouva%20podepsan%C3%A1_redacted.pdf
// Reopened 2026-11-25: section explicitly at main entrance of A, 4 above-ground
// floors, six risers 156.6 mm, tread dimension 320 mm. No absolute Bpv datum
// shown; aerial figure p.17 is a roof registration, not a surveyed entrance.
// Anchor and uncertainty are caller-specified hypothetical values in metres,
// NOT inferred from DEM or statistical confidence. Never use for geometry.
// No changes to the existing 73-node footprint or the other school wings.
export function scenario(anchor, uncertainty) {
 if(!Number.isFinite(anchor)||!Number.isFinite(uncertainty)||uncertainty<0)return null;
 const offset=anchor+.8;
 if(Math.abs(anchor)>10000||uncertainty>10000)return null;
 const levels={lowerTerrain:-.8,landing:.14,firstFloor:.16,secondFloor:3.66,thirdFloor:7.26,fourthFloor:10.86,canopyUnderside:3.30,canopyTop:3.50,canopyParapet:4.40,roofParapet:15.61};
 const round=v=>Math.round(v*1000)/1000;
 const elevations=Object.fromEntries(Object.entries(levels).map(([key,value])=>[key,{nominal:round(offset+value),min:round(offset+value-uncertainty),max:round(offset+value+uncertainty)}]));
 return {anchorType:'hypothetical-lower-terrain',datumOffset:round(offset),uncertainty, elevations,aboveGroundFloors:4,risers:6,nominalRiserMetres:.1566,treadMetres:.32,worldDatumVerified:false,readyForGeometry:false,newGeometry:0,newColliders:0};
}
// Example: anchor 217 m, illustrative +/-0.5 m => landing 217.94 m,
// roof parapet 233.41 m (232.91–233.91). This is NOT a measured site height.

 // Compare the two actual stored DEM samples, never assume that any vertex is
 // the entrance or that the resulting interval is a confidence interval.
 import {auditJuventaTerrain5312} from './osm-juventa-terrain-audit-5312.js';
 import {JUVENTA_SECTION_5311 as section} from './osm-juventa-section-5311.js';
 export function compareJuventaSectionScenarios5314(input, options){
  const audit=auditJuventaTerrain5312(input,options);
  if(!audit)return null;
  const samples=audit.audits.flatMap(a=>a.candidateNodeElevations);
  if(samples.length!==10||samples.some(n=>!Number.isFinite(n)))return null;
  const lo=Math.min(...samples),hi=Math.max(...samples);
  const variants=audit.audits.map(a=>({
   region:a.region,anchorRange:[a.candidateMinElevation,a.candidateMaxElevation],
   lowerScenario:scenario(a.candidateMinElevation,0),
   upperScenario:scenario(a.candidateMaxElevation,0),
   existingFoundation:a.modelFoundationElevation
  }));
  const min=scenario(lo,0),max=scenario(hi,0);
  if(!min||!max||variants.some(v=>!v.lowerScenario||!v.upperScenario))return null;
  return {sourceOSMId:audit.sourceOSMId,sourceHash:audit.sourceHash,
   sourcePage:section.pdfPage,sourceObject:section.object,
   anchorNodeIndices:[...audit.candidateNodeIndices],anchorRange:[lo,hi],
   variants,
   hypotheticalElevationRanges:Object.fromEntries(Object.keys(min.elevations).map(k=>[k,[min.elevations[k].nominal,max.elevations[k].nominal]])),
   rangeIsConfidenceInterval:false,anchorIsVerifiedEntrance:false,
   worldDatumVerified:false,readyForGeometry:false,newGeometry:0,newColliders:0};
 }
