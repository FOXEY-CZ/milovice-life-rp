/** 5.173 — evidence inventory, not newly built street assets.
 * Enumerates original OSM street furniture/footways around the verified
 * Topolova 614–618 block. Radius is an AUDIT heuristic, not a claim of
 * photographed position, game rendering or accessible pedestrian routing.
 */
export const TOPOLOVA_STREET_AUDIT_5173=Object.freeze({
 region:'mlada',roadId:'8618275',
 houses:Object.freeze(['61979151','61979152','61979144','61979139','61979145']),
 establishedPedestrianWays:Object.freeze(['1316882860','1316882852',
  '1316882854','1316882853','1314665579']),
 radiusMetres:60
});
const valid=p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon);
const toXY=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 y:p.lat*111320});
function distancePointSegment(p,a,b){
 const q=toXY(p),u=toXY(a),v=toXY(b);
 const dx=v.x-u.x,dy=v.y-u.y;
 const f=(dx*dx+dy*dy)>0?Math.max(0,Math.min(1,
  ((q.x-u.x)*dx+(q.y-u.y)*dy)/(dx*dx+dy*dy))):0;
 return Math.hypot(q.x-u.x-f*dx,q.y-u.y-f*dy);
}
function wayDistance(geom,road){
 let d=Infinity;
 for(const p of geom)for(let i=1;i<road.length;i++)
  d=Math.min(d,distancePointSegment(p,road[i-1],road[i]));
 return d;
}
const isPedestrian=w=>w.tags?.highway==='footway'||
 w.tags?.highway==='path'||w.tags?.highway==='pedestrian'||
 w.tags?.highway==='steps';
const isRoad=w=>['residential','service','living_street','tertiary',
 'unclassified'].includes(w.tags?.highway);
export function auditTopolovaStreet5173({regionId,elements,rowPlan}={}){
 const cfg=TOPOLOVA_STREET_AUDIT_5173;
 if(regionId!==cfg.region||!Array.isArray(elements)||
  rowPlan?.version!=='5.155'||
  JSON.stringify(rowPlan.sourceOSMIds)!==JSON.stringify(cfg.houses))return null;
 const ways=elements.filter(w=>Array.isArray(w.geometry)&&
  w.geometry.length>=2&&w.geometry.every(valid));
 const roads=ways.filter(w=>String(w.id)===cfg.roadId&&
  w.tags?.highway==='residential'&&w.tags?.name==='Topolová');
 if(roads.length!==1)return null;
 const road=roads[0].geometry;
 const records=ways.filter(w=>String(w.id)!==cfg.roadId)
  .filter(w=>isPedestrian(w)||isRoad(w)||w.tags?.highway==='crossing')
  .map(w=>({id:String(w.id),kind:w.tags.highway,
   footway:w.tags.footway||null,surface:w.tags.surface||null,
   lit:w.tags.lit||null,access:w.tags.access||null,
   crossing:w.tags.crossing||null,
   distanceMetres:+wayDistance(w.geometry,road).toFixed(2),
   sourceGPSNodeCount:w.geometry.length,
   previouslyReferenced:cfg.establishedPedestrianWays.includes(String(w.id))}))
  .filter(w=>w.distanceMetres<=cfg.radiusMetres)
  .sort((a,b)=>a.distanceMetres-b.distanceMetres||
   a.id.localeCompare(b.id));
 const pedestrian=records.filter(r=>['footway','path','pedestrian','steps'].includes(r.kind));
 const previouslyReferenced=pedestrian.filter(r=>r.previouslyReferenced);
 const toReview=pedestrian.filter(r=>!r.previouslyReferenced);
 return {version:'5.173',regionId,sourceRoadId:cfg.roadId,
  originalRoadNodes:road.length,searchRadiusMetres:cfg.radiusMetres,
  records,nearbyPedestrianWays:pedestrian.length,
  previouslyReferencedPedestrianWays:previouslyReferenced.map(x=>x.id),
  additionalPedestrianWaysForReview:toReview.map(x=>x.id),
  photosVerifiedByThisAudit:0,newGeometry:0,newRoads:0,
  newFootways:0,newCrossings:0,newLights:0,newTrees:0,
  sourceDataMutated:false,
  caveat:'Geometric proximity is not physical connectivity, photo evidence or permission to construct.'};
}
