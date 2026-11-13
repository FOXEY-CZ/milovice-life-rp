// Milovice RP 5.29.1: photo-anchored Školská 220/1 roof repairs.
// OSM 118487980 is a seven-edge building, NOT the rectangle assumed by
// old roof/gable rendering. These are only mathematically grounded join
// meshes; neither roof pitch nor the dormer placement is a field survey.
import {planRoofPerimeterClosure} from './station-roof-seams.js';
import {planStationRoofEaves} from './station-roof-eaves.js';

export const SKOLSKA_WAY_ID=118487980;
const finite=p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.z);
const triangle=(a,b,c)=>[a,b,c];
const quad=(a,b,c,d)=>[triangle(a,b,c),triangle(a,c,d)];

export function planSkolskaRoofJoins({outline,roof,origin,wallTopY,
 eaveWidth=.30}={}){
 if(!Array.isArray(outline)||outline.length<4||
  !(roof?.bounds||roof?.roofModel==='perimeter-constrained')||!origin||
   !Number.isFinite(wallTopY))return null;
 const pts=outline.map(p=>({x:p.x,z:p.z??p.y}));
 const join=planRoofPerimeterClosure({
  outline:pts,roof,origin,wallTopY
 });
 const eave=planStationRoofEaves({
  outline:pts,originalOutline:pts,roof,origin,
  width:eaveWidth,thickness:.09
 });
 if(!join||!eave||!join.closedToRoof||!eave.closedUnderside||
   eave.exteriorEdges!==pts.length||!eave.exactPlanePartitions)return null;
 for(const faces of [join.faces,eave.tiles,eave.soffit,eave.fascia])
  for(const face of faces)if(face.some(p=>!finite(p)))return null;
 return {joinFaces:join.faces,eave,
  maxWallGap:join.maxGapBefore,wallSections:join.edgeSections,
  closedWallAndEave:true,sourceWayId:SKOLSKA_WAY_ID};
}
// One continuous, sealed two-slope roof for a GABLE DORMER.
// Replaces disconnected rotated box plates: each tilted plate previously
// had its own large rectangle and no roof-thickness connection at the
// common ridge. The new geometry shares all eave, ridge and cap vertices.
export function planSkolskaDormerRoof({width=2.12,depth=1.38,rise=.94,
 wallEaveY=1.43,overhang=.12,thickness=.085}={}){
 if(![width,depth,rise,wallEaveY,overhang,thickness].every(Number.isFinite)||
   width<1||width>4.5||depth<.7||depth>3.5||rise<.3||rise>2.5||
   overhang<.04||overhang>.25||thickness<.04||thickness>.16)return null;
 const half=width*.5;
 const reach=half+overhang,edgeY=wallEaveY-rise*overhang/half;
 const ridgeY=wallEaveY+rise,frontZ=depth*.5+overhang,rearZ=-depth*.5-overhang;
 const V=(x,y,z,u=0,v=0)=>({x,y,z,u,v});
 const pL=V(-reach,edgeY,frontZ),pR=V(reach,edgeY,frontZ);
 const pLb=V(-reach,edgeY,rearZ),pRb=V(reach,edgeY,rearZ);
 const top=V(0,ridgeY,frontZ),topB=V(0,ridgeY,rearZ);
 const low=p=>V(p.x,p.y-thickness,p.z,p.u,p.v);
 const roofFaces=[
  ...quad(pL,top,topB,pLb),
  ...quad(top,pR,pRb,topB)
 ];
 const soffitFaces=[
  ...quad(low(pLb),low(topB),low(top),low(pL)),
  ...quad(low(topB),low(pRb),low(pR),low(top))
 ];
 const fasciaFaces=[
  ...quad(pL,pLb,low(pLb),low(pL)),
  ...quad(pR,low(pR),low(pRb),pRb),
  ...quad(pL,low(pL),low(top),top),
  ...quad(top,low(top),low(pR),pR),
  ...quad(pLb,topB,low(topB),low(pLb)),
  ...quad(topB,pRb,low(pRb),low(topB))
 ];
 const triangles=[...roofFaces,...soffitFaces,...fasciaFaces];
 if(triangles.some(face=>face.some(p=>!finite(p))))return null;
 return {roofFaces,soffitFaces,fasciaFaces,width,depth,rise,
  eaveY:edgeY,ridgeY,frontZ,rearZ,
  minX:-reach,maxX:reach,
  maxOverhang:overhang,
  triangles:triangles.length,closed:true};
}
