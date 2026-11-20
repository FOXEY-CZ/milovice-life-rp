/** Milovice RP 5.187: modelled paint micrograin on exactly two EXISTING
 * Topolova OSM zebra footways. No new crossing geometry, location or bars.
 * Texture weathering is game art, NOT an observation from photographs.
 */
export const TOPOLOVA_ZEBRA_PAINT_5187=Object.freeze({
 region:'mlada',
 sourceWayHashes:Object.freeze({
  '1316882853':'dcb5d34e',
  '1316882854':'0e127baa'
 }),
 tileSize:64,
 photoVerifiedWear:false
});
const hashGeometry=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
export function planTopolovaZebraPaint5187(regionId,way){
 const cfg=TOPOLOVA_ZEBRA_PAINT_5187,id=String(way?.id);
 const expected=cfg.sourceWayHashes[id];
 if(regionId!==cfg.region||!expected||way?.tags?.highway!=='footway'||
  way.tags.footway!=='crossing'||way.tags.crossing!=='zebra'||
  way.tags.surface!=='asphalt'||way.tags['crossing:island']!=='no'||
  ['private','no','customers'].includes(way.tags.access)||
  !Array.isArray(way.geometry)||way.geometry.length!==3||
  way.geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hashGeometry(way.geometry)!==expected)return null;
 return {version:'5.187',sourceWayId:id,sourceGeometryHash:expected,
  sourceZebra:true,textureArtworkOnly:true,wearPhotoVerified:false,
  sourceGeometryChanged:false,newStripePieces:0,newRoads:0,
  newCrossings:0,newColliders:0};
}
export function makeTopolovaZebraPaintPixels5187(size=64){
 if(size!==TOPOLOVA_ZEBRA_PAINT_5187.tileSize)return null;
 const data=new Uint8Array(size*size*4);
 // Warm off-white modelled paint, gently varied at sub-decimetre scale.
 // A deterministic seed prevents material flashes on every new loading.
 let s=0x5187a1f3;
 const random=()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return s>>>0;};
 for(let i=0;i<size*size;i++){
  const r=random(),n=(r%15)-7,scuff=((r>>>16)%37===0)?-12:0;
  const p=i*4;
  data[p]=Math.max(0,Math.min(255,245+n+scuff));
  data[p+1]=Math.max(0,Math.min(255,233+n+scuff));
  data[p+2]=Math.max(0,Math.min(255,210+n+scuff));
  data[p+3]=255;
 }
 return {width:size,height:size,data,byteCount:data.length,
  visualVariationPhotoVerified:false};
}
