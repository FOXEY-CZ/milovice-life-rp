/** 5.229 original mapped pedestrian side branches by Lesní / Armádní.
 * Four untagged-surface segments, zero invented routes or crossings.
 * The source OSM crossing is marked; never invent or repaint zebra bars.
 */
export const LESNI_NORTH_BRANCHES_5229=Object.freeze({
 region:'mlada',material:'visnova-footway-model',
 main:Object.freeze({id:'1460019794',nodes:4,segments:3,hash:'e14dd8e8',
  meters:49.803,tags:Object.freeze({highway:'footway',footway:'sidewalk'})}),
 spur:Object.freeze({id:'1460019793',nodes:2,segments:1,hash:'800597e1',
  meters:34.433,tags:Object.freeze({highway:'footway'})}),
 crossing:Object.freeze({id:'1057549995',nodes:3,segments:2,hash:'5409dbf7',
  meters:9.413,tags:Object.freeze({highway:'footway',footway:'crossing',
   lit:'yes',crossing:'marked','crossing:markings':'yes'})}),
 continuation:Object.freeze({id:'1057549996',nodes:5,segments:4,hash:'53198096',
  meters:41.608,tags:Object.freeze({highway:'footway',footway:'sidewalk',
   lit:'yes'})}),
 branchMainNode:1,
 neutralSegments:4,neutralMeters:84.236,
 networkSegments:10,networkMeters:135.257,
 photoVerifiedSurface:false
});
const gps=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{let h=2166136261;
 for(const c of g.map(gps).join(';')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return(h>>>0).toString(16).padStart(8,'0')
};
const length=g=>{let s=0;
 for(let i=1;i<g.length;i++){const a=g[i-1],b=g[i],d=Math.hypot(
  (b.lon-a.lon)*111320*Math.cos(50.226*Math.PI/180),
  (b.lat-a.lat)*111320);
  if(!(d>.3&&d<250))return NaN;s+=d;
 }return s
};
const exactTags=(got,expected)=>Boolean(got)&&
 Object.keys(got).length===Object.keys(expected).length&&
 Object.entries(expected).every(([k,v])=>got[k]===v);
export function planLesniNorthBranches5229(regionId,ways){
 const c=LESNI_NORTH_BRANCHES_5229;
 if(regionId!==c.region||!Array.isArray(ways))return null;
 const specs=[c.main,c.spur,c.crossing,c.continuation],items=[];
 for(const spec of specs){
  const matches=ways.filter(w=>String(w?.id)===spec.id);
  if(matches.length!==1)return null;
  const w=matches[0],g=w.geometry;
  if(!Array.isArray(g)||g.length!==spec.nodes||
    g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
    hash(g)!==spec.hash||Math.abs(length(g)-spec.meters)>.12||
    !exactTags(w.tags,spec.tags))return null;
  items.push(g);
 }
 const [main,spur,crossing,continuation]=items;
 if(gps(spur[0])!==gps(main[c.branchMainNode])||
    gps(main.at(-1))!==gps(crossing.at(-1))||
    gps(main.at(-1))!==gps(continuation[0]))return null;
 if(Math.abs(specs.reduce((s,p)=>s+p.meters,0)-c.networkMeters)>.001)return null;
 return {
  version:'5.229',sourceWayIds:specs.map(x=>x.id),
  sourceHashes:specs.map(x=>x.hash),
  neutralFootwayIds:[c.main.id,c.spur.id],
  neutralSourceSegments:c.neutralSegments,
  neutralOriginalMeters:c.neutralMeters,
  neutralMaterial:c.material,
  connectedOriginalSegments:c.networkSegments,
  connectedOriginalMeters:c.networkMeters,
  spurJoinGPS:gps(spur[0]),
  pedestrianCrossingJoinGPS:gps(main.at(-1)),
  crossingSourceId:c.crossing.id,crossingSourceMarkings:'yes',
  oldContinuationId:c.continuation.id,
  originalGPSPreserved:true,sourceSurfaceUntagged:true,
  modelAppearanceOnly:true,realAppearanceNotPhotoVerified:true,
  sourceCrossingRetained:true,
  newFootways:0,newCrossings:0,newZebras:0,newRoads:0,
  newColliders:0,newBuildings:0,newKerbs:0,newEntrances:0,
  newStreetFurniture:0
 };
}
