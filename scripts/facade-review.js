// Milovice RP Street Editor 1.1 — geographic facade inspection planner.
// OSM building polygons and mapped named road geometry only; zero image scraping.
const EARTH_METERS=111320;
const RAD=Math.PI/180;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function metricPoint(p,cosLat) {
 return {e:Number(p[1])*EARTH_METERS*cosLat,n:Number(p[0])*EARTH_METERS};
}
function nearestPointOnSegment(point,a,b,cosLat) {
 const q=metricPoint(point,cosLat),start=metricPoint(a,cosLat),end=metricPoint(b,cosLat);
 const de=end.e-start.e,dn=end.n-start.n,len2=de*de+dn*dn;
 const t=len2>1e-4?clamp(((q.e-start.e)*de+(q.n-start.n)*dn)/len2,0,1):0;
 const e=start.e+de*t,n=start.n+dn*t;
 return {position:[n/EARTH_METERS,e/(EARTH_METERS*cosLat)],
  distance:Math.hypot(q.e-e,q.n-n)};
}
export function planFacadeViews(building,roads,{maxViews=4,maxRoadDistance=95}={}) {
 if(!Array.isArray(building?.coords)||building.coords.length<3)return [];
 const vertices=building.coords.filter(v=>Array.isArray(v)&&v.length>=2&&v.every(Number.isFinite));
 if(vertices.length<3)return [];
 if(Math.hypot(vertices[0][0]-vertices.at(-1)[0],vertices[0][1]-vertices.at(-1)[1])<1e-7)vertices.pop();
 const meanLat=vertices.reduce((sum,p)=>sum+p[0],0)/vertices.length;
 const cosLat=Math.cos(meanLat*RAD);
 const centroid=[meanLat,vertices.reduce((sum,p)=>sum+p[1],0)/vertices.length];
 const groups=new Map();
 const directions=[['S',180,'Jižní'],['E',90,'Východní'],['N',0,'Severní'],['W',270,'Západní']];
 for(let i=0;i<vertices.length;i++){
  const a=vertices[i],b=vertices[(i+1)%vertices.length],ma=metricPoint(a,cosLat),mb=metricPoint(b,cosLat);
  const len=Math.hypot(ma.e-mb.e,ma.n-mb.n);
  if(!(len>=2.35&&len<160))continue;
  const middle=[(a[0]+b[0])*.5,(a[1]+b[1])*.5];
  const mx=metricPoint(middle,cosLat),mc=metricPoint(centroid,cosLat);
  // Approximate facade outward-facing cardinal direction from centroid.
  const bearing=(Math.atan2(mx.e-mc.e,mx.n-mc.n)/RAD+360)%360;
  const dir=directions.reduce((p,c)=>Math.abs(((bearing-c[1]+540)%360)-180)<Math.abs(((bearing-p[1]+540)%360)-180)?c:p,directions[0]);
  const previous=groups.get(dir[0]);
  if(!previous||previous.lengthMeters<len){
   groups.set(dir[0],{id:dir[0],title:dir[2]+' fasáda',edgeIndex:i,
    middle,buildingCenter:centroid,lengthMeters:len,cardinal:dir[1],street:building.street||''});
  }
 }
 const validRoads=(roads||[]).filter(r=>Array.isArray(r.coords)&&r.coords.length>=2);
 for(const side of groups.values()){
  let chosen=null;
  // Prefer the named street to which the house was assigned, but only if close.
  for(const r of validRoads){
   for(let i=1;i<r.coords.length;i++){
    const x=nearestPointOnSegment(side.middle,r.coords[i-1],r.coords[i],cosLat);
    const preferred=!!building.street&&r.name===building.street;
    const penalized=x.distance+(preferred?0:12);
    if(!chosen||penalized<chosen.score)chosen={...x,score:penalized,road:r.name||'bezejmenná'};
   }
  }
  if(chosen&&chosen.distance<=maxRoadDistance){
   side.viewpoint=chosen.position;
   side.roadDistance=Math.round(chosen.distance*10)/10;
   side.viewRoad=chosen.road;
  }else{
   side.viewpoint=null;side.roadDistance=null;side.viewRoad='';
  }
  const from=side.viewpoint||side.middle;
  const f=metricPoint(from,cosLat),t=metricPoint(side.middle,cosLat);
  side.yaw=((Math.atan2(t.e-f.e,t.n-f.n)+2*Math.PI)%(Math.PI*2));
 }
 // Human review sequence: nearest road-facing facade first.
 return [...groups.values()].sort((a,b)=>
  (a.roadDistance??9999)-(b.roadDistance??9999)||b.lengthMeters-a.lengthMeters
 ).slice(0,maxViews);
}
export function nextStreetHouse(houses,records,selectedId=null,street='*'){
 const pool=houses.filter(b=>street==='*'||b.street===street);
 if(!pool.length)return null;
 const at=pool.findIndex(b=>String(b.id)===String(selectedId));
 // Proceed forwards, wrapping around once. Never restart at the first item
 // after every single save — crucial for an actual street-by-street workflow.
 for(let n=1;n<=pool.length;n++){
  const b=pool[(at+n+pool.length)%pool.length];
  if(records[String(b.id)]?.stage!=='verified')return b;
 }
 return at<0?pool[0]:pool[(at+1)%pool.length];
}
