/** Milovice RP 5.272 — two inside-bend asphalt ribbon joins on original
 * Pod Lesem OSM way 128087258 near Armádní. This is a MODEL of an existing
 * street corner's visual continuity, not a survey of real kerb geometry.
 * No new road, junction arm, sidewalk, collision, navigation edge or marking.
 */
export const POD_LESEM_BENDS_5272=Object.freeze({
 region:'mlada',roadId:'128087258',roadHash:'6e14ec02',roadNodes:4,
 approachId:'83076185',approachHash:'63325626',approachNodes:4,
 armadniId:'1331897690',armadniHash:'197dbea8',armadniNodes:4,
 originalJoin:'50.2281938,14.8721431',
 armadniJoin:'50.2286371,14.8727931',
 mappedRoadWidthMetres:6,source:'https://www.openstreetmap.org/way/128087258',
 dimensionsSurveyed:false
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const ch of g.map(key).join(';')){
  h^=ch.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const exact=(t,e)=>t&&Object.keys(t).length===Object.keys(e).length&&
 Object.entries(e).every(([k,v])=>t[k]===v);
const toWorld=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function planPodLesemBends5272({regionId,ways,widths}={}){
 const S=POD_LESEM_BENDS_5272;
 if(regionId!==S.region||!Array.isArray(ways)||!(widths instanceof Map))
  return null;
 const unique=id=>{
  const found=ways.filter(w=>String(w?.id)===id);
  return found.length===1?found[0]:null;
 };
 const road=unique(S.roadId),approach=unique(S.approachId),
  armadni=unique(S.armadniId);
 if(!road||!approach||!armadni)return null;
 for(const [w,n,h] of [[road,S.roadNodes,S.roadHash],
  [approach,S.approachNodes,S.approachHash],
  [armadni,S.armadniNodes,S.armadniHash]]){
  if(w.type!=='way'||!Array.isArray(w.geometry)||w.geometry.length!==n||
   !w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
   hash(w.geometry)!==h)return null;
 }
 if(!exact(road.tags,{highway:'residential',lane_markings:'no',
   motor_vehicle:'no',name:'Pod Lesem',surface:'asphalt',width:'6'})||
  !exact(approach.tags,{highway:'residential',maxspeed:'30',
   name:'Pod Lesem'})||
  !exact(armadni.tags,{highway:'residential',lanes:'2',lit:'yes',
   maxspeed:'50',name:'Armádní',surface:'asphalt'})||
  key(road.geometry[0])!==S.originalJoin||
  key(approach.geometry.at(-1))!==S.originalJoin||
  key(road.geometry.at(-1))!==S.armadniJoin||
  key(armadni.geometry[1])!==S.armadniJoin||
  widths.get(S.roadId)!==S.mappedRoadWidthMetres)return null;
 const pts=road.geometry.map(toWorld),half=S.mappedRoadWidthMetres/2;
 const wedges=[];
 for(let i=1;i<pts.length-1;i++){
  const a=pts[i-1],c=pts[i],b=pts[i+1];
  const dx=c.x-a.x,dz=c.z-a.z,ex=b.x-c.x,ez=b.z-c.z;
  const inLen=Math.hypot(dx,dz),outLen=Math.hypot(ex,ez);
  if(inLen<4||outLen<4||inLen>800||outLen>800)return null;
  const ux=dx/inLen,uz=dz/inLen,vx=ex/outLen,vz=ez/outLen;
  const cross=ux*vz-uz*vx,dot=ux*vx+uz*vz;
  // The source has two moderate bends. Refuse a changed or hairpin road.
  if(cross>=-.09||cross<=-.25||dot<.96)return null;
  const side=cross>0?-1:1;
  const aEdge={x:c.x-side*uz*half,z:c.z+side*ux*half};
  const bEdge={x:c.x-side*vz*half,z:c.z+side*vx*half};
  const area=.5*half*half*Math.abs(cross);
  if(area<.38||area>1.2||
   Math.abs(distance(aEdge,c)-half)>.00001||
   Math.abs(distance(bEdge,c)-half)>.00001)return null;
  wedges.push({sourceRoadId:S.roadId,sourceVertexIndex:i,
   a:aEdge,b:bEdge,c:{...c},areaSquareMeters:+area.toFixed(4),
   sourceWidthMetres:S.mappedRoadWidthMetres,
   geometryEstimated:true});
 }
 if(wedges.length!==2)return null;
 return {version:'5.272',sourceRoadId:S.roadId,approachRoadId:S.approachId,
  armadniRoadId:S.armadniId,roadHash:S.roadHash,
  existingOSMNodes:road.geometry.length,existingRoadWidthMetres:6,
  originalApproachJoin:S.originalJoin,originalArmadniJoin:S.armadniJoin,
  wedgeCount:wedges.length,
  modelWedgeAreaSquareMeters:+wedges.reduce((n,w)=>n+w.areaSquareMeters,0).toFixed(4),
  wedges,source:S.source,modelNotPhotoSurveyed:true,
  originalGPSUnchanged:true,originalRoadMaterialUnchanged:true,
  originalTrafficUnchanged:true,newRoads:0,newFootways:0,
  newKerbs:0,newColliders:0,newMaterials:0,newCrossingMarks:0};
}
