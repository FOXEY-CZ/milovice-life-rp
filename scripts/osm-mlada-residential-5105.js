// Milovice RP 5.105 — source-bounded architectural cleanup for the real
// 4–5-floor apartment buildings surrounding the Mladá playground.
// This is an honest PROCEDURAL panel layout, NOT a photo-surveyed facade:
// OSM supplies real footprints, residential type and building:levels;
// OSM building:flats is only metadata and cannot prove window/door counts.
// Source anchor is OSM playground way 1468803906 in Mladá (5.103).
const PLAY_ANCHOR={x:-2252.6848978163475,z:-508.2592900001275,
 sourceOsmWayId:'1468803906'};
const LEVELS=new Set([4,5]);
const X=p=>p?.x,Z=p=>p?.z??p?.y;
function finitePoint(p){return Number.isFinite(X(p))&&Number.isFinite(Z(p))}
export function planMladaResidentialPanel({
 id,regionId,tags={},points=[],height,photoReviewed=false,
 approvedArchitecture=false
}={}){
 if(regionId!=='mlada'||tags.building!=='residential'||
  !Array.isArray(points)||points.length<4||points.length>100||
  !points.every(finitePoint)||!Number.isFinite(height)||
  photoReviewed||approvedArchitecture)return null;
 const floors=Number(tags['building:levels']);
 if(!LEVELS.has(floors)||String(tags['building:levels'])!==String(floors)||
  height<10||height>22)return null;
 const open=points.slice();
 if(Math.hypot(X(open[0])-X(open.at(-1)),Z(open[0])-Z(open.at(-1)))<.05)
  open.pop();
 if(open.length<3)return null;
 // Select the mapped buildings nearest to this exact public playground,
 // not every vaguely-labelled apartment elsewhere in Milovice.
 const near=Math.min(...open.map(p=>Math.hypot(X(p)-PLAY_ANCHOR.x,
  Z(p)-PLAY_ANCHOR.z)));
 if(near>112)return null;
 const flatsRaw=Number(tags['building:flats']);
 const flats=Number.isInteger(flatsRaw)&&flatsRaw>0&&flatsRaw<=250?
  flatsRaw:null;
 const floorHeight=height/floors;
 return {id:String(id),regionId,floors,flats,
  nearPlaygroundMeters:+near.toFixed(1),height,floorHeight,
  mappedLevels:true,mappedFlats:flats!==null,
  roofShapeChanged:false,footprintChanged:false,buildingCountChanged:false,
  inferredWindowSpacing:true,inferredPanelJoints:true,
  photographedFacade:false,sourcePlaygroundId:PLAY_ANCHOR.sourceOsmWayId};
}
export function planMladaPanelEdge(plan,length,baySpacing=3.2){
 if(!plan||!Number.isFinite(length)||length<.08||length>90||
  !Number.isFinite(baySpacing)||baySpacing<2.5||baySpacing>5)return null;
 const floorCourses=[];
 // Use the mapped building:levels, NOT the old single mid-wall seam.
 for(let k=1;k<plan.floors;k++)
  floorCourses.push({height:k*plan.floorHeight,thickness:.055});
 const bays=length<5?0:Math.min(24,Math.max(1,Math.floor(length/baySpacing)));
 const verticalSeams=[];
 // The actual window centre is j/(bays+1). Place joints HALFWAY
 // between those windows to avoid overlaying them. In contrast, the
 // former nested floor loop produced the very same joint 4–5 times.
 if(bays>=2){
  for(let j=1;j<bays;j++){
   const fraction=(j+.5)/(bays+1);
   verticalSeams.push({fraction,from:1.32,to:Math.max(1.5,plan.height-.36)});
  }
 }
 return {floorCourses,verticalSeams,windowBays:bays,
  uniqueVerticalJoints:verticalSeams.length,duplicatedFloorSeams:0};
}
export function panelDoorWindowConflict(doorEdgeIndex,edgeIndex,
 fraction,floors,windowFloor){
 // Existing panel-door model is centred on the mapped street-facing
 // edge. Never put a ground-floor window behind the doorway.
 return windowFloor===0&&Number.isInteger(doorEdgeIndex)&&
  doorEdgeIndex===edgeIndex&&Math.abs(fraction-.5)<.095&&floors>=4;
}
