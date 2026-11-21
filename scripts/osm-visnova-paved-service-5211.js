/** Milovice RP 5.211 — unify the modeled surface of two already mapped
 * Višňová-area service roads explicitly tagged surface=paving_stones.
 * Reuses the shared 5.204 paving material, without inventing a street,
 * kerb, bay, footway, pole, fence, driveway or right-of-way restriction.
 * OSM documents only the surface TYPE: tint/pattern is not photo verified.
 */
export const VISNOVA_PAVED_SERVICE_5211=Object.freeze({
 region:'mlada',material:'visnova-tagged-paving-stones',
 ways:Object.freeze([
  Object.freeze({id:'1050191982',hash:'530a91e2',nodes:6}),
  Object.freeze({id:'1100829870',hash:'b3fbb8cb',nodes:5})
 ]),
 sourceSurface:'paving_stones',modelColourPhotoVerified:false
});
function fingerprint(geo){
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
}
export function planVisnovaPavedService5211(regionId,way){
 const cfg=VISNOVA_PAVED_SERVICE_5211;
 if(regionId!==cfg.region)return null;
 const source=cfg.ways.find(x=>x.id===String(way?.id));
 if(!source)return null;
 const t=way.tags||{},g=way.geometry;
 if(t.highway!=='service'||t.surface!==cfg.sourceSurface||
  t.lit!=='yes'||Object.keys(t).some(k=>
   !['highway','surface','lit'].includes(k))||
  !Array.isArray(g)||g.length!==source.nodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  fingerprint(g)!==source.hash)return null;
 return {version:'5.211',sourceOSMId:source.id,geometryHash:source.hash,
  sourceSegments:g.length-1,material:cfg.material,sourceTag:t.surface,
  modelTintNotPhotoVerified:true,originalGPSUnchanged:true,
  originalRoadWidthUnchanged:true,originalTrafficUnchanged:true,
  newRoads:0,newFootways:0,newParking:0,newCrossings:0,
  newRoadsideObjects:0,newColliders:0};
}
