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
 const levels={lowerTerrain:-.8,landing:.14,firstFloor:.16,secondFloor:3.66,thirdFloor:7.26,fourthFloor:10.86,canopyUnderside:3.30,canopyTop:3.50,canopyParapet:4.40,roofParapet:15.61};
 const round=v=>Math.round(v*1000)/1000;
 const elevations=Object.fromEntries(Object.entries(levels).map(([key,value])=>[key,{nominal:round(offset+value),min:round(offset+value-uncertainty),max:round(offset+value+uncertainty)}]));
 return {anchorType:'hypothetical-lower-terrain',datumOffset:round(offset),uncertainty, elevations,aboveGroundFloors:4,risers:6,nominalRiserMetres:.1566,treadMetres:.32,worldDatumVerified:false,readyForGeometry:false,newGeometry:0,newColliders:0};
}
// Example: anchor 217 m, illustrative +/-0.5 m => landing 217.94 m,
// roof parapet 233.41 m (232.91–233.91). This is NOT a measured site height.
