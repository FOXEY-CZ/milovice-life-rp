/**
 * Milovice RP 5.138 – original OSM road-bend seams on the Průběžná
 * and Sportovní estate grid. Asphalt ribbon segments are rectangular;
 * their INNER corners sometimes leave tiny triangular holes.
 *
 * Exactly SIX source roads in Mladá are verified against every OSM
 * coordinate using a deterministic fingerprint. Seal only an interior
 * bend, at the same road width and elevation as the existing strips.
 * Nothing changes the road centrelines, drive graph, collisions,
 * one-way direction, pedestrian surfaces or street fixtures.
 */
export const PRUBEZNA_BENDS_5138=Object.freeze({
 regionId:'mlada',rootRoadId:'83076189',
 sources:Object.freeze([
  Object.freeze({id:'83076186',name:'Sportovní',vertices:16,hash:'0b8d70e2',oneway:'yes'}),
  Object.freeze({id:'200820420',name:'Průběžná',vertices:4,hash:'9b439a32'}),
  Object.freeze({id:'200820424',name:'Sportovní',vertices:4,hash:'480fc248'}),
  Object.freeze({id:'200820425',name:'Sportovní',vertices:5,hash:'bcd6b57e'}),
  Object.freeze({id:'200820426',name:'Průběžná',vertices:6,hash:'84c9d5eb'}),
  Object.freeze({id:'200820427',name:'Sportovní',vertices:6,hash:'ab3d3750'})
 ])
});
const X=p=>p?.x,Z=p=>p?.z??p?.y;
function coordsHash(geometry){
 const value=geometry.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 let hash=2166136261;
 for(const char of value){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)}
 return (hash>>>0).toString(16).padStart(8,'0');
}
function validWay(way,expected){
 const t=way?.tags||{},geo=way?.geometry;
 return String(way?.id)===expected.id &&
  t.highway==='residential'&&t.name===expected.name&&
  (expected.oneway?t.oneway===expected.oneway:!t.oneway)&&
  (!t.surface||t.surface==='asphalt')&&
  t.access!=='private'&&t.access!=='no'&&
  Array.isArray(geo)&&geo.length===expected.vertices&&
  geo.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))&&
  coordsHash(geo)===expected.hash;
}
export function planPrubeznaStreetBendSeals({
 regionId,ways,widths,toWorld,maxWedges=40
}={}){
 if(regionId!=='mlada'||!Array.isArray(ways)||
  !(widths instanceof Map)||typeof toWorld!=='function'||
  !Number.isInteger(maxWedges)||maxWedges<0||maxWedges>100)return null;
 const sourceWays=[];
 const wedges=[],streetCounts={Průběžná:0,Sportovní:0};
 let ignoredStraight=0,ignoredSharp=0,ignoredShort=0,eligibleSourceVertices=0;
 for(const expected of PRUBEZNA_BENDS_5138.sources){
  const sameId=ways.filter(w=>String(w?.id)===expected.id);
  if(sameId.length!==1||!validWay(sameId[0],expected))return null;
  const way=sameId[0],width=widths.get(expected.id);
  if(!Number.isFinite(width)||width<3||width>10)return null;
  const points=way.geometry.map(toWorld);
  if(!points.every(p=>Number.isFinite(X(p))&&Number.isFinite(Z(p))))return null;
  sourceWays.push({id:expected.id,name:expected.name,vertexCount:points.length,
   originalOSMHash:expected.hash,modelWidth:width,oneway:way.tags.oneway||null});
  for(let i=1;i<points.length-1&&wedges.length<maxWedges;i++){
   const a=points[i-1],v=points[i],b=points[i+1];
   const inX=X(v)-X(a),inZ=Z(v)-Z(a),
    outX=X(b)-X(v),outZ=Z(b)-Z(v),
    l1=Math.hypot(inX,inZ),l2=Math.hypot(outX,outZ);
   eligibleSourceVertices++;
   if(l1<2.4||l2<2.4||l1>800||l2>800){ignoredShort++;continue}
   const ux=inX/l1,uz=inZ/l1,vx=outX/l2,vz=outZ/l2;
   const cross=ux*vz-uz*vx,dot=ux*vx+uz*vz;
   if(Math.abs(cross)<.14||dot>.985){ignoredStraight++;continue}
   if(dot<-.2){ignoredSharp++;continue}
   const half=width*.5,side=cross>0?-1:1;
   const center={x:X(v),z:Z(v)},
    prev={x:center.x-side*uz*half,z:center.z+side*ux*half},
    next={x:center.x-side*vz*half,z:center.z+side*vx*half},
    area=.5*half*half*Math.abs(cross);
   if(area<.08||area>13){ignoredSharp++;continue}
   wedges.push({
    sourceWayId:expected.id,street:expected.name,sourceVertexIndex:i,
    sourceGPS:way.geometry[i],width,sourceSurface:way.tags.surface||null,
    a:prev,b:next,c:center,areaSquareMeters:+area.toFixed(3),
    existingRoadWidthOnly:true,newRoadSegment:false
   });
   streetCounts[expected.name]++;
  }
 }
 return {
  version:'5.138',sourceRegionId:regionId,
  sourceRoadIds:sourceWays.map(w=>w.id),sourceWays,
  sourceWayCount:sourceWays.length,sourceVerticesVisited:eligibleSourceVertices,
  sourceMainStreetId:PRUBEZNA_BENDS_5138.rootRoadId,
  wedges,plannedBendSeals:wedges.length,byStreet:streetCounts,
  ignoredStraight,ignoredSharp,ignoredShort,
  modelCornerAreaSquareMeters:+wedges.reduce((s,w)=>s+w.areaSquareMeters,0).toFixed(2),
  renderedBendSeals:0,queuedStandaloneMeshes:0,
  sameRoadWidths:true,originalGPSVerticesPreserved:true,
  originalOneWayPreserved:true,originalDrivingGraphPreserved:true,
  noNewRoadCentrelines:true,addedRoads:0,addedColliders:0,
  addedSidewalks:0,addedCrossings:0,addedParkingSpaces:0,addedStreetLamps:0,
  exactRealKerbShapeSurveyed:false
 };
}
