// Milovice RP 5.50 — source-gated, OSM-wall relative roof details.
// This generic solver can be used for ANY building once a photo profile
// names actual OSM exterior walls. It never guesses absent evidence.
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planPhotographedRooflight} from './street-photo-block.js';
import {roofHeightAtPoint} from './roof-opening-geometry.js';

export function planSourceAnchoredRoofFixtures({outline,roof,profile}={}){
 if(!roof||!Array.isArray(roof.faces)||!Array.isArray(outline)||
  outline.length<3||!profile||typeof profile.evidence!=='string'||
  profile.evidence.length<16||!Array.isArray(profile.rooflights)||
  !Array.isArray(profile.masts)||profile.rooflights.length>16||
  profile.masts.length>12)return null;
 const rooflights=[],masts=[];
 let invalidPositions=0;
 for(const entry of profile.rooflights){
  if(!Number.isInteger(entry.edge)||!Array.isArray(entry.offsets)||
   entry.offsets.length>12)return null;
  const edge=exteriorFacadeFrame(outline,entry.edge);
  if(!edge)return null;
  for(const offset of entry.offsets){
   if(!Number.isFinite(offset))return null;
   const plan=planPhotographedRooflight(roof,edge,offset,{
    near:1.2,far:2.6,halfWidth:.44,frameLift:.038
   });
   if(!plan){invalidPositions++;continue}
   rooflights.push({...plan,edgeIndex:entry.edge,offset});
  }
 }
 for(const fixture of profile.masts){
  if(!Number.isInteger(fixture.edge)||![
   fixture.along,fixture.depth,fixture.height].every(Number.isFinite)||
   fixture.depth<.8||fixture.depth>12||fixture.height<.4||
   fixture.height>4)return null;
  const edge=exteriorFacadeFrame(outline,fixture.edge);
  if(!edge||Math.abs(fixture.along)>edge.len*.5-.3)return null;
  const x=edge.mx+edge.ux*fixture.along-edge.nx*fixture.depth;
  const z=edge.mz+edge.uz*fixture.along-edge.nz*fixture.depth;
  const y=roofHeightAtPoint(roof,{x,z});
  if(!Number.isFinite(y)){invalidPositions++;continue}
  masts.push({x,z,y,height:fixture.height,edgeIndex:fixture.edge});
 }
 return {rooflights,masts,invalidPositions,
  source:profile.evidence,positionsSurveyed:false,
  copiedPhotoPixels:false};
}
