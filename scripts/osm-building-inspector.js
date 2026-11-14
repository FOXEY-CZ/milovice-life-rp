// Milovice RP 5.62 — tap-to-identify OSM building from exact drawn footprint.
// Inspection only: never changes, approves or deletes scene geometry.
// No THREE dependency, cheap enough on a single tap even with streamed areas.
const CROSS=(ax,az,bx,bz)=>ax*bz-az*bx;
const valid=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z);
const finite3=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.z);
function insidePolygon(x,z,polygon){
 let inside=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];
  if((a.z>z)!==(b.z>z)&&x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)inside=!inside;
 }
 return inside;
}
function normalisePolygon(points){
 if(!Array.isArray(points)||points.length<3||points.some(p=>!valid(p)))return [];
 const p=points.slice();
 if(Math.hypot(p[0].x-p.at(-1).x,p[0].z-p.at(-1).z)<.15)p.pop();
 return p.length>=3?p:[];
}
/** Pass world-space coordinates. Caller decides whether the rendered
 * object has enough photographic evidence; an OSM type is only metadata.
 *
 * @returns {null|{id, tags, hit:{x,y,z},distance,face,...}}
 */
export function identifyOsmBuildingFromRay({origin,direction,buildings,maxDistance=180}={}){
 if(!finite3(origin)||!finite3(direction)||!Array.isArray(buildings)||
    !Number.isFinite(maxDistance)||maxDistance<1)return null;
 const magnitude=Math.hypot(direction.x,direction.y,direction.z);
 if(magnitude<.01)return null;
 const d={x:direction.x/magnitude,y:direction.y/magnitude,z:direction.z/magnitude};
 let best=null,nearest=maxDistance;
 for(const b of buildings){
  if(!b||!Number.isSafeInteger(Number(b.id))||!Number.isFinite(b.base)||
      !Number.isFinite(b.height)||b.height<1)continue;
  const points=normalisePolygon(b.points);
  if(!points.length)continue;
  const minY=b.base-.5,maxY=b.base+b.height+3.6;
  // First hit of any vertical facade from the camera. Robust to OSM
  // clockwise / anticlockwise winding and shared garage party walls.
  for(let j=0;j<points.length;j++){
   const a=points[j],end=points[(j+1)%points.length];
   const ex=end.x-a.x,ez=end.z-a.z;
   const det=CROSS(d.x,d.z,ex,ez);
   if(Math.abs(det)<1e-9)continue;
   const ax=a.x-origin.x,az=a.z-origin.z;
   const t=CROSS(ax,az,ex,ez)/det;
   const u=CROSS(ax,az,d.x,d.z)/det;
   if(t<.02||t>nearest||u<-.00001||u>1.00001)continue;
   const y=origin.y+d.y*t;
   if(y<minY||y>maxY)continue;
   nearest=t;
   best={id:Number(b.id),tags:b.tags||{},hit:{x:origin.x+d.x*t,y,z:origin.z+d.z*t},
    distance:t,face:'facade',edge:j,
    photographicApproval:b.photographicApproval===true};
  }
  // Roof/top hit for steep camera-down angles: only when ray intersects
  // an actual mapped building polygon, not its rectangular bounding box.
  if(d.y<-.001){
   const planeY=b.base+b.height+1.8;
   const t=(planeY-origin.y)/d.y;
   if(t>=.02&&t<nearest){
    const x=origin.x+d.x*t,z=origin.z+d.z*t;
    if(insidePolygon(x,z,points)){
     nearest=t;
     best={id:Number(b.id),tags:b.tags||{},hit:{x,y:planeY,z},
      distance:t,face:'roof-approx',edge:null,
      photographicApproval:b.photographicApproval===true};
    }
   }
  }
 }
 return best;
}
export function osmInspectorWorldToGPS(hit){
 if(!valid(hit))return null;
 const latitude=50.226-hit.z/111320;
 const longitude=14.889+hit.x/(111320*Math.cos(50.226*Math.PI/180));
 return {lat:latitude,lon:longitude};
}
export function formatOsmInspectorResult(result){
 if(!result)return null;
 const gps=osmInspectorWorldToGPS(result.hit);
 if(!gps)return null;
 const id=Number(result.id);
 const type=String(result.tags?.building||'yes');
 const name=String(result.tags?.name||'').slice(0,100);
 return {id,type,name,
  point:gps,osmUrl:'https://www.openstreetmap.org/way/'+encodeURIComponent(String(id)),
  face:result.face,
  note:'OSM typ a 3D vzhled NENÍ fotograficky ověřený'};
}
