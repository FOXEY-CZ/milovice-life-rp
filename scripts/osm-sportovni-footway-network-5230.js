/** Milovice RP 5.230 — original OSM pedestrian chain connecting Sportovní
 * to a pre-existing residential road and service lane. Three genuine
 * source footways have NO surface tags; render neutral game appearance.
 * The roadway joins are original GPS points, NOT invented crossings.
 */
export const SPORTOVNI_FOOTWAY_NETWORK_5230=Object.freeze({
 region:'mlada',material:'visnova-footway-model',
 main:Object.freeze({id:'1037952219',nodes:6,segments:5,hash:'f4a36b91',
  meters:32.250,tags:Object.freeze({highway:'footway'})}),
 northern:Object.freeze({id:'1352859039',nodes:8,segments:7,hash:'bba90a45',
  meters:51.972,tags:Object.freeze({highway:'footway'})}),
 southern:Object.freeze({id:'1460019771',nodes:2,segments:1,hash:'8859fb77',
  meters:27.076,tags:Object.freeze({highway:'footway'})}),
 sportovni:Object.freeze({id:'1331897633',nodes:6,hash:'2aad369b',
  tags:Object.freeze({highway:'residential',name:'Sportovní'})}),
 residential:Object.freeze({id:'1037952217',nodes:9,hash:'23bea099',
  tags:Object.freeze({highway:'residential'})}),
 service:Object.freeze({id:'1037952218',nodes:2,hash:'509ff15f',
  tags:Object.freeze({highway:'service'})}),
 networkSegments:13,networkMeters:111.298,
 photoVerifiedSurface:false
});
const gps=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{let h=2166136261;for(const c of g.map(gps).join(';')){
 h^=c.charCodeAt(0);h=Math.imul(h,16777619)
}return(h>>>0).toString(16).padStart(8,'0')};
const length=g=>{let sum=0;
 for(let i=1;i<g.length;i++){
  const a=g[i-1],b=g[i],d=Math.hypot(
   (b.lon-a.lon)*111320*Math.cos(50.226*Math.PI/180),
   (b.lat-a.lat)*111320);
  if(!(d>.3&&d<300))return NaN;
  sum+=d;
 }return sum;
};
const exact=(t,template)=>Boolean(t)&&
 Object.keys(t).length===Object.keys(template).length&&
 Object.entries(template).every(([k,v])=>t[k]===v);
export function planSportovniFootwayNetwork5230(regionId,ways){
 const c=SPORTOVNI_FOOTWAY_NETWORK_5230;
 if(regionId!==c.region||!Array.isArray(ways))return null;
 const specs=[c.main,c.northern,c.southern,c.sportovni,c.residential,c.service],g=[];
 for(const spec of specs){
  const found=ways.filter(w=>String(w?.id)===spec.id);
  if(found.length!==1)return null;
  const w=found[0],pts=w.geometry;
  if(!Array.isArray(pts)||pts.length!==spec.nodes||
   pts.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   hash(pts)!==spec.hash||!exact(w.tags,spec.tags)||
   (Number.isFinite(spec.meters)&&Math.abs(length(pts)-spec.meters)>.12))
    return null;
  g.push(pts);
 }
 const [main,north,south,sport,street,service]=g;
 if(gps(north.at(-1))!==gps(main[1])||
    gps(south[0])!==gps(main[3])||
    gps(north[0])!==gps(sport[3])||
    gps(south.at(-1))!==gps(street[3])||
    gps(main.at(-1))!==gps(service[0]))return null;
 const sourceMetres=[c.main,c.northern,c.southern].reduce((s,v)=>s+v.meters,0);
 if(Math.abs(sourceMetres-c.networkMeters)>.001)return null;
 return {
  version:'5.230',sourceWayIds:specs.slice(0,3).map(v=>v.id),
  sourceHashes:specs.slice(0,3).map(v=>v.hash),
  sourceRoadIds:specs.slice(3).map(v=>v.id),
  sourceRoadHashes:specs.slice(3).map(v=>v.hash),
  neutralFootwayIds:specs.slice(0,3).map(v=>v.id),
  neutralMaterial:c.material,sourceSegments:c.networkSegments,
  sourceFootwayMeters:c.networkMeters,
  originalNorthToMainGPS:gps(main[1]),
  originalSouthToMainGPS:gps(main[3]),
  originalSportovniJoinGPS:gps(north[0]),
  originalResidentialJoinGPS:gps(south.at(-1)),
  originalServiceJoinGPS:gps(main.at(-1)),
  originalGeometryPreserved:true,originalSurfaceUnknown:true,
  modelVisualOnly:true,photoSurfaceVerified:false,
  roadJunctionsAreNotMappedCrosswalks:true,
  newFootways:0,newCrossings:0,newZebraStripes:0,newRoads:0,
  newColliders:0,newBuildings:0,newKerbs:0,newEntrances:0,
  newStreetFurniture:0,newVehicleRules:0
 };
}
