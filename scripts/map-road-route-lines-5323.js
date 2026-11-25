// 5.323: Leaflet multi-polyline of already audited route legs.
// Preserve each individual segment; never bridge gaps or extend to a building.
export function roadRouteMapLines5323(route,audit,toLatLng){
 if(route?.status!=='ready'||audit?.valid!==true||!Array.isArray(route.legs)||
 audit.legCount!==route.legs.length||typeof toLatLng!=='function')return [];
 const lines=[];
 for(const leg of route.legs){
  if(![leg?.a?.x,leg?.a?.y,leg?.b?.x,leg?.b?.y].every(Number.isFinite))return [];
  const line=[toLatLng(leg.a.x,leg.a.y),toLatLng(leg.b.x,leg.b.y)];
  if(line.some(p=>!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)||Math.abs(p[0])>90||Math.abs(p[1])>180))return [];
  lines.push(line);
 }
 return lines;
}
