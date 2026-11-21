/** Milovice RP 5.247 — continuous conservative clearance of an ORIGINAL
 * mapped pedestrian centreline from the EXISTING carriageway index.
 * The legacy five-point tests can miss a thin crossing between samples.
 *
 * The road index exposes nearest distance minus mapped road half-width.
 * That clearance is 1-Lipschitz in world-space distance. Each midpoint
 * checks radius + HALF CELL length, proving that EVERY point in the
 * 0.7m-or-shorter cell clears the vehicle corridor (including cell ends).
 * No roads, GPS, footways or meshes are created or moved.
 */
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
export function mappedFootwayAvoidsRoads5247(a,b,carriageway,{
 radius=.25,buffer=.08,resolution=.7
}={}){
 if(!finite(a)||!finite(b)||typeof carriageway?.isClear!=='function'||
  ![radius,buffer,resolution].every(Number.isFinite)||
  radius<.2||radius>.8||buffer<.05||buffer>.6||
  resolution<.1||resolution>1.2)return false;
 const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
 if(!Number.isFinite(len)||len<.25||len>800)return false;
 const count=Math.ceil(len/resolution),halfCell=len/(2*count);
 const protectiveRadius=radius+halfCell;
 for(let i=0;i<count;i++){
  const t=(i+.5)/count;
  if(!carriageway.isClear(a.x+t*dx,a.y+t*dy,protectiveRadius,buffer))
   return false;
 }
 return true;
}
