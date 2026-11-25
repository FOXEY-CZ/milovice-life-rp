// 5.311 preparation: documented section levels, not surveyed world heights.
// DEKPROJEKT 2024-017735-AdM, July 2024, figure 2, printed report p.6.
// No physical geometry until the section datum and facade position are tied to OSM.
import {planJuventaPhotoAnchor5308} from './osm-juventa-photo-anchor-5308.js';
export const JUVENTA_SECTION_5311=Object.freeze({
 source:'https://smlouvy.gov.cz/smlouva/soubor/40162820/Smlouva%20podepsan%C3%A1_redacted.pdf',
 report:'2024-017735-AdM',date:'2024-07',figure:2,reportPage:6,pdfPage:18,
 object:'A',datum:'drawing-local',entryLanding:.140,sectionLowerTerrain:-.800,
 floorLevels:Object.freeze([.16,3.66,7.26,10.86]),
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
 // The source outline contains an outward three-edge projection between two parallel wall runs.
 // The site diagram places block A in this vicinity, but roof outline != surveyed door.
 const scale=111320*Math.cos(50.226*Math.PI/180);
 const local=p=>({x:(p.lon-input.geometry[48].lon)*scale,z:(input.geometry[48].lat-p.lat)*111320});
 const [a,b,c,d,e]=input.geometry.slice(47,52).map(local);
 const f=local(input.geometry[52]);
 const len=(p,q)=>Math.hypot(q.x-p.x,q.z-p.z);
 const baseline=len(b,e),ux=(e.x-b.x)/baseline,uz=(e.z-b.z)/baseline;
 const offset=p=>(p.x-b.x)*uz-(p.z-b.z)*ux;
 const side1=len(b,c),side2=len(d,e),front=len(c,d);
 const depth1=Math.abs(offset(c)),depth2=Math.abs(offset(d));
 const continuationParallel=Math.abs((b.x-a.x)*(f.z-e.z)-(b.z-a.z)*(f.x-e.x))/(len(a,b)*len(e,f))<.02;
 const projection={edges:[48,49,50],flankingEdges:[47,51],baselineMetres:round(baseline),frontMetres:round(front),sideMetres:[round(side1),round(side2)],depthMetres:[round(depth1),round(depth2)],parallelFlanks:continuationParallel,outlineOnly:true,canopyIdentityVerified:false};
 return {sourceOSMId:anchor.sourceOSMId,candidateEdge:anchor.edge,
  candidateRayDistance:anchor.distance,sectionObject:s.object,
  floorRise:s.floorLevels.slice(1).map((n,i)=>round(n-s.floorLevels[i])),
  canopySlabThickness:round(s.canopyTop-s.canopyUnderside),
  canopyParapetAboveSlab:round(s.canopyParapet-s.canopyTop),
  roofParapetAboveFirstFloor:round(s.roofParapet-s.floorLevels[0]),
  entryLanding:s.entryLanding,sectionLowerTerrain:s.sectionLowerTerrain,
  stairRiseTotal:round(s.entryLanding-s.sectionLowerTerrain),
  landingToFirstFloor:round(s.floorLevels[0]-s.entryLanding),
  canopyClearanceAboveLanding:round(s.canopyUnderside-s.entryLanding),
  candidateOutlineProjection:projection,sourceDatum:s.datum,source:s.source,sourcePage:s.pdfPage,
  objectToEdgeVerified:false,worldDatumVerified:false,entranceWidthVerified:false,
  photoDestinationIsEntrance:false,readyForGeometry:false,newGeometry:0,newColliders:0};
}
