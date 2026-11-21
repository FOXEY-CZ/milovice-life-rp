/** 5.227: ORIGINAL east Lesní/Armádní pedestrian link; no invented geometry. */
export const LESNI_EAST_LINK_5227=Object.freeze({
 region:'mlada',neutralMaterial:'visnova-footway-model',
 sidewalk:Object.freeze({id:'1057549996',nodes:5,hash:'53198096',meters:41.608,segments:4}),
 westCrossing:Object.freeze({id:'1057549995',nodes:3,hash:'5409dbf7',meters:9.413,
  crossing:'marked',markings:'yes'}),
 eastCrossing:Object.freeze({id:'1044078120',nodes:3,hash:'097b2218',meters:11.844,
  crossing:'uncontrolled',markings:'zebra',island:'yes'}),
 pavedContinuation:Object.freeze({id:'1314665579',nodes:18,hash:'476fa89b',meters:368.001}),
 photoVerified:false,actualSidewalkSurfaceKnown:false
});
const gps=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{let h=2166136261;for(const c of g.map(gps).join(';')){
 h^=c.charCodeAt(0);h=Math.imul(h,16777619);
}return(h>>>0).toString(16).padStart(8,'0')};
const length=g=>{let s=0;for(let i=1;i<g.length;i++){
 const a=g[i-1],b=g[i],dx=(b.lon-a.lon)*111320*Math.cos(50.226*Math.PI/180),
 dz=(b.lat-a.lat)*111320,d=Math.hypot(dx,dz);
 if(!(d>.3&&d<250))return NaN;s+=d;
}return s};
const exact=(a,b)=>a&&Object.keys(a).length===Object.keys(b).length&&
 Object.entries(b).every(([k,v])=>a[k]===v);
export function planLesniEastLink5227(regionId,ways){
 const c=LESNI_EAST_LINK_5227;
 if(regionId!==c.region||!Array.isArray(ways))return null;
 const specs=[c.sidewalk,c.westCrossing,c.eastCrossing,c.pavedContinuation];
 const expected=[
  {highway:'footway',footway:'sidewalk',lit:'yes'},
  {highway:'footway',footway:'crossing',lit:'yes',crossing:'marked','crossing:markings':'yes'},
  {highway:'footway',footway:'crossing',lit:'yes',crossing:'uncontrolled','crossing:markings':'zebra','crossing:island':'yes'},
  {highway:'footway',footway:'sidewalk',lit:'yes',surface:'paving_stones'}
 ];
 const found=[];
 for(let i=0;i<specs.length;i++){
  const spec=specs[i],items=ways.filter(w=>String(w?.id)===spec.id);
  if(items.length!==1)return null;
  const w=items[0],g=w.geometry;
  if(!Array.isArray(g)||g.length!==spec.nodes||
   g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   hash(g)!==spec.hash||Math.abs(length(g)-spec.meters)>.12||
   !exact(w.tags,expected[i]))return null;
  found.push(g);
 }
 const [side,west,east,paved]=found;
 const start=gps(side[0]),end=gps(side.at(-1));
 if(start!==gps(west.at(-1))||end!==gps(east.at(-1))||
  end!==gps(paved[0]))return null;
 return {version:'5.227',sourceWayIds:specs.map(x=>x.id),
  sourceHashes:specs.map(x=>x.hash),neutralFootwayId:c.sidewalk.id,
  neutralMaterial:c.neutralMaterial,originalSegments:c.sidewalk.segments,
  originalMeters:c.sidewalk.meters,westJunctionGPS:start,
  eastJunctionGPS:end,westCrossingMarkings:c.westCrossing.markings,
  eastCrossingMarkings:c.eastCrossing.markings,eastCrossingIsland:'yes',
  pavedContinuationSurface:'paving_stones',
  surfaceUntagged:true,appearanceOnly:true,sourceGeometryPreserved:true,
  addedFootways:0,addedCrossings:0,addedZebras:0,addedBuildings:0,
  addedColliders:0,addedStreetFurniture:0};
}
