/** 5.261 — visual-only, source-locked existing Kaštanová sett carriageways.
 * Two original Mladá OSM ways (8878402 and 1107814416) explicitly carry
 * surface=sett. No photo documents stone size, tint, repairs or kerbs.
 * Never move/expand road geometry or extrapolate into untagged Rakouská.
 */
export const KASTANOVA_SOURCE_SETTS_5261=Object.freeze({
 regionId:'mlada',surface:'sett',name:'Kaštanová',
 material:'kastanova-source-setts-5261',textureTileMetres:2.8,
 roadWidthSurveyed:false,stoneSizePhotoMeasured:false,
 ways:Object.freeze([
  Object.freeze({id:'8878402',nodes:2,hash:'c200434c',length:23.321}),
  Object.freeze({id:'1107814416',nodes:13,hash:'c2f5c3c7',length:455.265})
 ])
});
const fmt=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const fingerprint=g=>{
 let h=2166136261;
 for(const ch of g.map(fmt).join(';')){
  h^=ch.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const metres=geo=>{
 const scaleX=111320*Math.cos(50.226*Math.PI/180);
 return geo.slice(1).reduce((sum,p,i)=>sum+
  Math.hypot((p.lon-geo[i].lon)*scaleX,
   (p.lat-geo[i].lat)*111320),0);
};
export function planKastanovaSourceSetts5261({regionId,way}={}){
 const c=KASTANOVA_SOURCE_SETTS_5261;
 const expected=c.ways.find(w=>w.id===String(way?.id));
 if(regionId!==c.regionId||!expected||way?.type!=='way'||
  !way.tags||Object.keys(way.tags).length!==4||
  way.tags.highway!=='residential'||way.tags.maxspeed!=='30'||
  way.tags.name!==c.name||way.tags.surface!==c.surface||
  !Array.isArray(way.geometry)||way.geometry.length!==expected.nodes||
  way.geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  fingerprint(way.geometry)!==expected.hash)return null;
 const length=metres(way.geometry);
 if(Math.abs(length-expected.length)>.025)return null;
 return {version:'5.261',sourceWayId:expected.id,
  sourceGeometryHash:expected.hash,originalNodes:expected.nodes,
  originalLengthMetres:+length.toFixed(3),
  sourceMaterialTag:'sett',material:c.material,
  worldAlignedTexture:true,textureTileMetres:c.textureTileMetres,
  originalGPSUnchanged:true,modelRoadWidthUnchanged:true,
  modelRoadHeightUnchanged:true,modelRoadCollidersUnchanged:true,
  originalVehicleGraphUnchanged:true,
  modelStoneSizeEstimated:true,modelStoneColourEstimated:true,
  photoVerified:false,newRoads:0,newFootways:0,newCrossings:0};
}
