// 5.311 preparation: documented section levels, not surveyed world heights.
// DEKPROJEKT 2024-017735-AdM, July 2024, figure 2, printed report p.6.
// No physical geometry until the section datum and facade position are tied to OSM.
import {planJuventaPhotoAnchor5308} from './osm-juventa-photo-anchor-5308.js';
export const JUVENTA_SECTION_5311=Object.freeze({
 source:'https://smlouvy.gov.cz/smlouva/soubor/40162820/Smlouva%20podepsan%C3%A1_redacted.pdf',
 report:'2024-017735-AdM',date:'2024-07',figure:2,reportPage:6,pdfPage:18,
 object:'A',datum:'drawing-local',floorLevels:Object.freeze([.16,3.66,7.26,10.86]),
 roofParapet:15.61,canopyUnderside:3.30,canopyTop:3.50,canopyParapet:4.40,
 photo:Object.freeze({cameraLat:50.226810,cameraLon:14.866101,heading:98.62,
  destinationLat:50.226741,destinationLon:14.866809,focalLength35mm:27,
  source:'https://commons.wikimedia.org/w/index.php?title=File:Komensk%C3%A9ho_(Milovice)_05.jpg&oldid=1237994387'})
});
export function planJuventaSection5311(input){
 const anchor=planJuventaPhotoAnchor5308(input);
 if(!anchor)return null;
 const s=JUVENTA_SECTION_5311;
 const round=n=>Math.round(n*1000)/1000;
 return {sourceOSMId:anchor.sourceOSMId,candidateEdge:anchor.edge,
  candidateRayDistance:anchor.distance,sectionObject:s.object,
  floorRise:s.floorLevels.slice(1).map((n,i)=>round(n-s.floorLevels[i])),
  canopySlabThickness:round(s.canopyTop-s.canopyUnderside),
  canopyParapetAboveSlab:round(s.canopyParapet-s.canopyTop),
  roofParapetAboveFirstFloor:round(s.roofParapet-s.floorLevels[0]),
  sourceDatum:s.datum,source:s.source,sourcePage:s.pdfPage,
  objectToEdgeVerified:false,worldDatumVerified:false,entranceWidthVerified:false,
  photoDestinationIsEntrance:false,readyForGeometry:false,newGeometry:0,newColliders:0};
}
