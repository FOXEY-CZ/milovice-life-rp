// 5.300: a mapped athletics footprint is not evidence of a painted border.
const targets=Object.freeze({
 '1472419115':{athletics:'shot_put',nodes:21,hash:'80b8c82f'},
 '1472419120':{athletics:'long_jump',nodes:5,hash:'6f18862d'}
});
export function inspectAthleticsOutline5300(way){
 const c=targets[String(way?.id)],t=way?.tags,g=way?.geometry;
 if(!c||t?.leisure!=='pitch'||t?.sport!=='athletics'||t?.athletics!==c.athletics||
    !Array.isArray(g)||g.length!==c.nodes||g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon)))return null;
 let h=2166136261;
 for(const ch of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';'))h=Math.imul(h^ch.charCodeAt(0),16777619);
 if((h>>>0).toString(16).padStart(8,'0')!==c.hash)return null;
 return {id:String(way.id),athletics:c.athletics,sourceHash:c.hash,suppressGenericOutline:true,sourceGeometryPreserved:true};
}
