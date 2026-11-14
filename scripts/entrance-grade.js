// Milovice RP 5.45 — shared terrain-based door threshold contract.
// The foundation is levelled to the HIGHEST point of the OSM footprint;
// a doorway must instead follow the local approach in front of that door.
// This is a visual-grade approximation, not evidence of surveyed stairs or
// a pedestrian paving slab at every OSM entrance.
import {facadePoint} from './facade-anchors.js';

export const ENTRANCE_SURFACE_RISE=.08;  // 8 cm: avoids both floating and sunken panels
export const ENTRANCE_APPROACH_OFFSET=.55; // sample OUTSIDE the polygon, not its center

export function planGroundedEntrance(frame,{terrainAt,baseHeight,topY,
 along=0,approachOffset=ENTRANCE_APPROACH_OFFSET,
 surfaceRise=ENTRANCE_SURFACE_RISE,minDoorHeight=1.65}={}){
 if(!frame||typeof terrainAt!=='function'||![
  baseHeight,topY,along,approachOffset,surfaceRise,minDoorHeight,
  frame.len,frame.nx,frame.nz
 ].every(Number.isFinite)||frame.len<=0||approachOffset<.06||
 approachOffset>2.5||surfaceRise<0||surfaceRise>.15||
 minDoorHeight<1.1||minDoorHeight>3)return null;
 const point=facadePoint(frame,along,approachOffset);
 if(!point)return null;
 const groundY=terrainAt(point.x,point.z);
 if(!Number.isFinite(groundY))return null;
 // The rendering uses an 8cm visual surface correction. 13cm raised
 // mapped footpaths remain within 5cm of the door, with no long step.
 const floorY=groundY+surfaceRise;
 if(topY-floorY<minDoorHeight)return null;
 const centerY=(topY+floorY)*.5,doorHeight=topY-floorY;
 return {
  floorY,topY,centerY,doorHeight,groundY,approachX:point.x,
  approachZ:point.z,approachOffset,baseHeight,surfaceRise,
  legacyBottomY:baseHeight+.02,
  formerGap:baseHeight+.02-floorY,
  maxGroundStep:floorY-groundY,
  // Hero wall starts at levelled foundation; the actual timber and sill
  // may continue below it to real terrain. The wall hole is clamped to the
  // shell while the door remains continuous to the ground.
  wallHoleBottom:Math.max(.01,floorY-baseHeight),
  wallHoleTop:topY-baseHeight
 };
}
export function doorwayWallHole(grounded,doorWidth){
 if(!grounded||!Number.isFinite(doorWidth)||doorWidth<=0||
  grounded.wallHoleTop-grounded.wallHoleBottom<.65)return null;
 return {y:grounded.wallHoleBottom,
  h:grounded.wallHoleTop-grounded.wallHoleBottom,w:doorWidth};
}
