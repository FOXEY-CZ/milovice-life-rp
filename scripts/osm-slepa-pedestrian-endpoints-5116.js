// Milovice RP 5.116 — close only the missing outside-corner wedge
// between TWO separately mapped OSM pedestrian ways sharing an exact node.
// Do not build paths from proximity or join actual street intersections.
// Position and walking path topology come from OSM, width is game-estimated.
const APPROVED=new Set(['mlada','vrutice']);
const KINDS=new Set(['footway','path','steps','cycleway','pedestrian']);
const X=p=>p?.x,Z=p=>p?.z??p?.y;
const finite=p=>Number.isFinite(X(p))&&Number.isFinite(Z(p));
const key=p=>Math.round(X(p)*50)+','+Math.round(Z(p)*50); // 2cm
const gap=(a,b)=>Math.hypot(X(a)-X(b),Z(a)-Z(b));
const noAccess=t=>['private','no','customers'].includes(t?.access);
const protectedWay=t=>t?.footway==='crossing'||t?.bridge==='yes'||
 t?.tunnel==='yes'||t?.indoor==='yes'||t?.area==='yes'||noAccess(t);
export function planSlepaPedestrianEndpointSeams(ways,{
 regionId,widths,anchor,radius=280,maxSeams=35,
 carriageways,buildings,photoAllowed=()=>true
}={}){
 const out={version:'5.116',regionId,anchorSource:'Armádní OSM way/800846496',
  sourceWayPairs:[],seams:[],candidateJunctions:0,
  rejectedBranch:0,rejectedCrossing:0,rejectedMaterial:0,
  rejectedGeometry:0,rejectedCarriageway:0,rejectedBuilding:0,
  rejectedPhoto:0,duplicateIds:0,
  originalOSMPointsUnchanged:true,newWalkways:0,
  newCrossings:0,inferredConnectionNodes:0,
  estimatedStripWidths:true};
 if(!APPROVED.has(regionId)||!Array.isArray(ways)||
  !(widths instanceof Map)||!finite(anchor)||
  !carriageways?.isClear||!buildings?.isClear||
  typeof photoAllowed!=='function'||radius<50||radius>400||
  !Number.isInteger(maxSeams)||maxSeams<0||maxSeams>100)return out;
 // Include ALL mapped highway nodes when identifying a degree-2
 // connection. This protects crossing branches even if tagged differently.
 const nodes=new Map(),seen=new Set();
 const source=ways.slice().sort((a,b)=>
  String(a?.id).localeCompare(String(b?.id),'en',{numeric:true}));
 const append=(node,record)=>{
  const k=key(node);
  if(!nodes.has(k))nodes.set(k,[]);
  nodes.get(k).push(record);
 };
 for(const way of source){
  const id=String(way?.id??''),pts=way?.points,tags=way?.tags||{};
  if(!id||seen.has(id)){out.duplicateIds++;continue;}
  seen.add(id);
  if(!Array.isArray(pts)||pts.length<2||pts.length>180||
   !pts.every(finite))continue;
  for(let i=0;i<pts.length-1;i++){
   const a=pts[i],b=pts[i+1],length=gap(a,b);
   if(length<.15||length>900)continue;
   const base={id,tags,length};
   append(a,{...base,at:a,other:b,atEndpoint:i===0});
   append(b,{...base,at:b,other:a,atEndpoint:i===pts.length-2});
  }
 }
 const sorted=[...nodes.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
 for(const [,items] of sorted){
  if(out.seams.length>=maxSeams)break;
  if(items.length!==2){if(items.length>2)out.rejectedBranch++;continue;}
  const [one,two]=items;
  if(one.id===two.id||!one.atEndpoint||!two.atEndpoint||
   gap(one.at,two.at)>.035)continue;
  const center={x:(X(one.at)+X(two.at))*.5,
   z:(Z(one.at)+Z(two.at))*.5};
  if(gap(center,anchor)>radius)continue;
  out.candidateJunctions++;
  const t1=one.tags,t2=two.tags;
  if(!KINDS.has(t1.highway)||!KINDS.has(t2.highway)||
   t1.highway!=='footway'||t2.highway!=='footway'||
   protectedWay(t1)||protectedWay(t2)){
   out.rejectedCrossing++;continue;
  }
  // Do not claim paving materials agree if OSM recorded two types.
  const surface1=String(t1.surface||'').trim().toLowerCase();
  const surface2=String(t2.surface||'').trim().toLowerCase();
  if(surface1!==surface2){out.rejectedMaterial++;continue;}
  const w1=widths.get(one.id),w2=widths.get(two.id);
  if(!Number.isFinite(w1)||!Number.isFinite(w2)||
   w1<.9||w1>3||Math.abs(w1-w2)>.03||
   one.length<2.2||two.length<2.2){
   out.rejectedGeometry++;continue;
  }
  // Orient the first path as incoming and the second as outgoing.
  const ux=(X(one.at)-X(one.other))/one.length,
   uz=(Z(one.at)-Z(one.other))/one.length,
   vx=(X(two.other)-X(two.at))/two.length,
   vz=(Z(two.other)-Z(two.at))/two.length,
   cross=ux*vz-uz*vx,dot=ux*vx+uz*vz;
  if(Math.abs(cross)<.15||dot<-.35||dot>.985){
   out.rejectedGeometry++;continue;
  }
  const side=cross>0?-1:1,half=(w1+w2)*.25;
  const a={x:center.x-side*uz*half,z:center.z+side*ux*half};
  const b={x:center.x-side*vz*half,z:center.z+side*vx*half};
  const centroid={x:(a.x+b.x+center.x)/3,
   z:(a.z+b.z+center.z)/3};
  const area=.5*half*half*Math.abs(cross);
  if(area<.06||area>2.8){out.rejectedGeometry++;continue;}
  const sample=[a,b,center,centroid];
  if(!sample.every(p=>carriageways.isClear(p.x,p.z,.075,.08))){
   out.rejectedCarriageway++;continue;
  }
  if(!sample.every(p=>buildings.isClear(p.x,p.z,.14))){
   out.rejectedBuilding++;continue;
  }
  if(!sample.every(p=>photoAllowed(p.x,p.z))){
   out.rejectedPhoto++;continue;
  }
  const pair=[one.id,two.id].sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
  out.sourceWayPairs.push(pair);
  out.seams.push({wayIds:pair,node:center,a,b,c:center,
   width:w1,materialSource:surface1||null,
   areaSquareMeters:+area.toFixed(3),
   originalSharedNode:true,notACrossing:true});
 }
 return out;
}
