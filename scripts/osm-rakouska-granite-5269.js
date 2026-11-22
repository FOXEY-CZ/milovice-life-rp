/** Milovice RP 5.269 — 2025 municipal-source granite-sett road surface
 * near the ORIGINAL junction of Rakouská and Pod Lesem, Mladá.
 * Evidence: Milovice council minutes 42/2025, p.4 (12 Nov 2025):
 * https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=19018&id_org=9519
 * The meeting describes granite setts at the road excavation location.
 * It does NOT survey the exact stone boundaries, kerbs or road width.
 * The 12m visual reach along each original OSM arm is a MODEL ESTIMATE.
 * No added roads, crossing paint, collision or navigation geometry.
 */
export const RAKOUSKA_GRANITE_5269=Object.freeze({
 region:'mlada',jGPS:'50.2244708,14.8721468',modelArmMetres:12,
 visualMaterial:'kastanova-source-setts-5261',
 source:'https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=19018&id_org=9519',
 sourceDate:'2025-11-12',
 ways:Object.freeze([
  Object.freeze({id:'8590288',hash:'7486fd8b',nodes:19,metres:917.64,
   junction:9,nearEdges:Object.freeze([9,10]),
   tags:Object.freeze({highway:'residential',lit:'yes',maxspeed:'30',name:'Rakouská'})}),
  Object.freeze({id:'8590287',hash:'2da4a507',nodes:5,metres:159.65,
   junction:2,nearEdges:Object.freeze([2,3]),
   tags:Object.freeze({highway:'residential',name:'Pod Lesem'})})
 ])
});
const fmt=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const fingerprint=g=>{
 let h=2166136261;
 for(const c of g.map(fmt).join(';'))for(const letter of c){
  h^=letter.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const project=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const metres=g=>g.slice(1).reduce((sum,p,i)=>{
 const a=project(g[i]),b=project(p);
 return sum+Math.hypot(a.x-b.x,a.z-b.z);
},0);
const exactTags=(actual,expected)=>!!actual&&
 Object.keys(actual).length===Object.keys(expected).length&&
 Object.entries(expected).every(([k,v])=>actual[k]===v);
export function planRakouskaGranite5269({regionId,ways}={}){
 const S=RAKOUSKA_GRANITE_5269;
 if(regionId!==S.region||!Array.isArray(ways))return null;
 const matches=[];
 for(const spec of S.ways){
  const group=ways.filter(w=>String(w?.id)===spec.id);
  if(group.length!==1)return null;
  const way=group[0],g=way.geometry;
  if(!Array.isArray(g)||g.length!==spec.nodes||
   !g.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
   !exactTags(way.tags,spec.tags)||fingerprint(g)!==spec.hash||
   Math.abs(metres(g)-spec.metres)>.08||
   fmt(g[spec.junction])!==S.jGPS)return null;
  matches.push({spec,way});
 }
 const junction=matches[0].way.geometry[matches[0].spec.junction];
 if(fmt(junction)!==fmt(matches[1].way.geometry[matches[1].spec.junction]))
  return null;
 const edges=[];
 for(const {spec,way} of matches){
  for(const index of spec.nearEdges){
   const a=project(way.geometry[index-1]),b=project(way.geometry[index]);
   const length=Math.hypot(b.x-a.x,b.z-a.z);
   if(!(length>S.modelArmMetres*2))return null;
   edges.push({sourceWayId:spec.id,edgeEndIndex:index,
    graniteAt:spec.junction===index?'end':'start',
    originalEdgeMetres:+length.toFixed(3)});
  }
 }
 return {version:'5.269',source:S.source,sourceDate:S.sourceDate,
  sourceIDs:S.ways.map(w=>w.id),sourceHashes:S.ways.map(w=>w.hash),
  junctionGPS:{...junction},originalRoadEdges:edges.length,edges,
  patchMetresPerArm:S.modelArmMetres,
  totalModelSettMetres:edges.length*S.modelArmMetres,
  visualMaterial:S.visualMaterial,reusesExistingTexture:true,
  councilEvidenceForGraniteAtSite:true,
  originalOSMHasSurfaceTag:false,
  exactStoneExtentSurveyed:false,photoSurveyed:false,
  originalGPSUnchanged:true,roadWidthsUnchanged:true,
  carriagewayHeightUnchanged:true,originalNavigationUnchanged:true,
  newRoads:0,newFootways:0,newKerbs:0,newZebras:0,
  newCrossings:0,newColliders:0,newMaterials:0,newTextures:0};
}
export function splitRakouskaGranite5269({plan,wayId,edgeEndIndex,a,b}={}){
 if(plan?.version!=='5.269'||!a||!b||!Number.isInteger(edgeEndIndex))return null;
 const e=plan.edges.find(x=>x.sourceWayId===String(wayId)&&
  x.edgeEndIndex===edgeEndIndex);
 if(!e)return null;
 const az=a.z??a.y,bz=b.z??b.y,len=Math.hypot(b.x-a.x,bz-az);
 if(![a.x,az,b.x,bz].every(Number.isFinite)||
  Math.abs(len-e.originalEdgeMetres)>.08||
  len<=plan.patchMetresPerArm*2)return null;
 const t=plan.patchMetresPerArm/len;
 const point=u=>({x:a.x+(b.x-a.x)*u,y:az+(bz-az)*u});
 const from={x:a.x,y:az},to={x:b.x,y:bz};
 if(e.graniteAt==='start'){
  const cut=point(t);
  return [{a:from,b:cut,granite:true},{a:cut,b:to,granite:false}];
 }
 const cut=point(1-t);
 return [{a:from,b:cut,granite:false},{a:cut,b:to,granite:true}];
}
