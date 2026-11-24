// Municipality: council minutes 14/2025, p.21, UR-226-14/25.
export const JUVENTA_TURF_5301=Object.freeze({id:'1472419116',nodes:6,hash:'e5044ba5',material:'pitchTurf',source:'https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=17955&id_org=9519',venue:'https://hriste.mesto-milovice.cz/hriste-u-zs-juventa'});
export function inspectJuventaTurf5301(way){
 const c=JUVENTA_TURF_5301,t=way?.tags,g=way?.geometry;
 if(String(way?.id)!==c.id||t?.leisure!=='pitch'||t?.sport!=='soccer'||t.surface!==undefined||
    !Array.isArray(g)||g.length!==c.nodes||g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon)))return null;
 let h=2166136261;
 for(const ch of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';'))h=Math.imul(h^ch.charCodeAt(0),16777619);
 if((h>>>0).toString(16).padStart(8,'0')!==c.hash)return null;
 return {sourceOSMId:c.id,sourceHash:c.hash,material:c.material,sourceSurface:'artificial',associationInferred:true,modelTintEstimated:true,sourceGeometryPreserved:true,newEquipment:0,newMaterials:0};
}
