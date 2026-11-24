/** 5.291 — model-only correction of an untagged road width near Armádní C13/C14.
 * OSM documents the road and separate footway, NOT the true carriageway width.
 * The old 7.8m procedural road hid 32m of that real mapped footway.
 * Do not invent paths, markings, parking spaces, kerbs or road coordinates.
 */
export const ARMADNI_SIDEWALK_5291=Object.freeze({
 region:'mlada',roadId:'1373371687',roadNodes:2,roadHash:'4027f3bb',
 footwayId:'1468803914',footwayNodes:4,footwayHash:'a0c94c44',
 defaultModelWidth:7.8,newModelWidth:5.0,surveyedWidth:false
});
const hash=g=>{let h=2166136261;for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')};
const point=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),z:-(p.lat-50.226)*111320});
const length=g=>g.slice(1).reduce((sum,p,i)=>{const a=point(g[i]),b=point(p);return sum+Math.hypot(a.x-b.x,a.z-b.z)},0);
const matches=(w,id,n,h,t)=>String(w?.id)===id&&w?.type==='way'&&
 Array.isArray(w.geometry)&&w.geometry.length===n&&
 w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))&&
 w.tags&&Object.keys(w.tags).length===Object.keys(t).length&&
 Object.entries(t).every(([k,v])=>w.tags[k]===v)&&hash(w.geometry)===h;
export function planArmadniSidewalkWidth5291({regionId,road,footway,baseWidth}={}){
 const c=ARMADNI_SIDEWALK_5291;
 if(regionId!==c.region||baseWidth!==c.defaultModelWidth||
 !matches(road,c.roadId,c.roadNodes,c.roadHash,{highway:'residential',lit:'30'})||
 !matches(footway,c.footwayId,c.footwayNodes,c.footwayHash,{highway:'footway'}))return null;
 const roadMetres=length(road.geometry),walkMetres=length(footway.geometry);
 if(roadMetres<40||roadMetres>40.6||walkMetres<93.8||walkMetres>94.6)return null;
 return Object.freeze({
  version:'5.291',sourceRoadOSMId:c.roadId,sourceFootwayOSMId:c.footwayId,
  roadHash:c.roadHash,footwayHash:c.footwayHash,
  originalRoadLengthMetres:+roadMetres.toFixed(3),
  originalFootwayLengthMetres:+walkMetres.toFixed(3),
  previousModelWidthMetres:c.defaultModelWidth,modelWidthMetres:c.newModelWidth,
  surveyedWidth:false,estimatedModelCorrection:true,
  originalGPSUnchanged:true,originalRoadCentrelineUnchanged:true,
  safePedestrianClippingReused:true,newFootways:0,newRoads:0,
  newCrossings:0,newZebras:0,newParking:0,newKerbs:0,newColliders:0
 });
}
