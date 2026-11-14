/**
 * Milovice RP 5.63 — user-supplied PHOTOGRAPHIC evidence of a whole garage court.
 *
 * Source: Mapy.com panorama, 17 May 2022, 10 user-provided screenshots.
 * Copyright shown in screenshots: Seznam.cz, a.s. / Cyclomedia Technology B.V.
 * The source screenshots are for REFERENCE, not redistributed, embedded or
 * baked into game textures. All mesh colours and textures are original.
 *
 * Distinct image facts: brown vertical-ribbed garage doors; thin off-white
 * dividing piers; low continuous dark-brown flat roof/coping; two garage
 * rows with the doors facing a gravel/dirt central court; natural green
 * perimeter with trees and a wire-fence gate. Door numerals 1..17 are
 * visible in the source but individual numerals are NOT assigned to OSM
 * way IDs: no authoritative ID ↔ door number relation has been established.
 *
 * Photos are dated 2022, NOT a claim of current 2026 condition.
 * OSM supplies the original world coordinates and exact 17 way IDs.
 */
export const PHOTO_GARAGE_COURT={
  area:'north Nádražní / V zahrádkách garage rows',
  photoDate:'2022-05-17',
  origin:'user-provided Mapy.com panoramas in conversation',
  photographerCredit:'© Seznam.cz, a.s. / Cyclomedia Technology B.V.',
  licenseUsage:'reference-only: do not embed or redistribute images',
  photographicFacts:[
    'two facing rows','numbered brown corrugated steel doors',
    'light off-white dividing pillars','low dark-brown flat roof cap',
    'gravel-dirt court','green perimeter with wire fence'
  ],
  geometrySource:'OpenStreetMap way footprints, © OSM contributors',
  exactGarageNumberToOsmIdVerified:false,
  presentDay2026Verified:false,
  originalTexturesOnly:true,
  ids:Object.freeze([
    194679587,194679590,194679596,194679600,194679625,194679639,
    194679673,194679677,194679695,194679698,194679708,194679715,
    194679719,194679741,194679745,194679758,194679763
  ])
};
const ID_SET=new Set(PHOTO_GARAGE_COURT.ids);
export function isPhotoGarageWay(id){return ID_SET.has(Number(id));}
function worldPolygon(geom){
 if(!Array.isArray(geom))return [];
 const p=geom.map(q=>({x:Number(q.x),z:Number(q.z??q.y)}));
 if(p.some(q=>!Number.isFinite(q.x)||!Number.isFinite(q.z)))return [];
 if(p.length>3&&Math.hypot(p[0].x-p.at(-1).x,p[0].z-p.at(-1).z)<.05)p.pop();
 return p.length===4?p:[];
}
function signedArea(p){
 return p.reduce((sum,a,i)=>{
  const b=p[(i+1)%p.length];
  return sum+a.x*b.z-b.x*a.z;
 },0)*.5;
}
function mean(points){return {x:points.reduce((v,p)=>v+p.x,0)/points.length,
 z:points.reduce((v,p)=>v+p.z,0)/points.length};}
function segment(a,b,sign,i){
 const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
 return {a,b,index:i,len,center:{x:(a.x+b.x)*.5,z:(a.z+b.z)*.5},
  normal:{x:sign*dz/len,z:-sign*dx/len}};
}
/** Produces only a WHOLE COURT, never maps 2022 photographs onto arbitrary
 * other garages just because they have building=garage in OSM.
 * @param {Array<{id:number,points:{x:number,z:number}[],building:string}>} ways
 */
export function planPhotographedGarageCourt(ways=[]){
 const rows=(Array.isArray(ways)?ways:[]).filter(w=>isPhotoGarageWay(w?.id))
  .map(w=>({id:Number(w.id),building:w.building,p:worldPolygon(w.points)}))
  .filter(w=>['garage','garages'].includes(w.building)&&w.p.length===4&&
    Math.abs(signedArea(w.p))>9&&Math.abs(signedArea(w.p))<35)
  .map(w=>({...w,c:mean(w.p),sign:Math.sign(signedArea(w.p))}));
 if(rows.length!==PHOTO_GARAGE_COURT.ids.length||
    new Set(rows.map(w=>w.id)).size!==PHOTO_GARAGE_COURT.ids.length)
  return {valid:false,reason:'needs-complete-17-osm-ways',fronts:[],court:null};
 const byX=rows.slice().sort((a,b)=>a.c.x-b.c.x);
 // Exactly two photographed rows: find the large unmapped gap BETWEEN
 // their OSM centres, not imaginary per-garage facade directions.
 const gaps=byX.slice(1).map((e,i)=>({
  gap:e.c.x-byX[i].c.x,index:i
 })).sort((a,b)=>b.gap-a.gap);
 const separator=gaps[0];
 if(!separator||separator.gap<9)return {
  valid:false,reason:'paired-rows-not-found',fronts:[],court:null};
 const west=byX.slice(0,separator.index+1),east=byX.slice(separator.index+1);
 if(west.length<6||east.length<6)return {
  valid:false,reason:'asymmetric-garage-rows',fronts:[],court:null};
 const westCenter=mean(west.map(w=>w.c)),eastCenter=mean(east.map(w=>w.c));
 const pairVector={x:eastCenter.x-westCenter.x,z:eastCenter.z-westCenter.z};
 const pairLen=Math.hypot(pairVector.x,pairVector.z);
 if(pairLen<12||pairLen>37)return {
  valid:false,reason:'unreasonable-court-width',fronts:[],court:null};
 const fronts=[];
 for(const w of rows){
  const opposite=w.c.x<eastCenter.x-3?eastCenter:westCenter;
  const target={x:opposite.x-w.c.x,z:opposite.z-w.c.z};
  const tLen=Math.hypot(target.x,target.z)||1;
  const edges=w.p.map((p,i)=>segment(p,w.p[(i+1)%4],w.sign,i))
   .filter(e=>e.len>=2.2&&e.len<=3.7);
  edges.sort((a,b)=>{
   const score=e=>(e.normal.x*target.x+e.normal.z*target.z)/tLen;
   return score(b)-score(a);
  });
  const best=edges[0],score=best?
   (best.normal.x*target.x+best.normal.z*target.z)/tLen:-1;
  if(!best||score<.90)return {
   valid:false,reason:'missing-opposing-short-facade',fronts:[],court:null};
  fronts.push({id:w.id,edge:best.index,a:best.a,b:best.b,
   center:best.center,width:best.len,normal:best.normal,row:w.c.x<westCenter.x+4?'west':'east',
   score,photoObservedStyle:true,
   exactDoorNumberUnknown:true});
 }
 const westFront=fronts.filter(f=>f.normal.x>.9),
       eastFront=fronts.filter(f=>f.normal.x<-.9);
 if(westFront.length<6||eastFront.length<6)return {
  valid:false,reason:'facades-not-facing-inwards',fronts:[],court:null};
 const leftBoundary=Math.max(...westFront.map(f=>f.center.x));
 const rightBoundary=Math.min(...eastFront.map(f=>f.center.x));
 const leftMin=Math.min(...westFront.flatMap(f=>[f.a.z,f.b.z]));
 const leftMax=Math.max(...westFront.flatMap(f=>[f.a.z,f.b.z]));
 const rightMin=Math.min(...eastFront.flatMap(f=>[f.a.z,f.b.z]));
 const rightMax=Math.max(...eastFront.flatMap(f=>[f.a.z,f.b.z]));
 const zMin=Math.max(leftMin,rightMin),zMax=Math.min(leftMax,rightMax);
 if(rightBoundary-leftBoundary<7||zMax-zMin<12)return {
  valid:false,reason:'no-shared-open-court',fronts:[],court:null};
 const court={xMin:leftBoundary+.18,xMax:rightBoundary-.18,
  zMin:zMin+.10,zMax:zMax-.10,
  surface:'photographed-grey-tan-gravel-court',
  extentEstimated:true};
 return {valid:true,reason:null,fronts,
  court,photoDate:PHOTO_GARAGE_COURT.photoDate,
  shapePhotographed:true,geometryFromOsm:true,
  individualDoorNumberMapping:false,
  source:PHOTO_GARAGE_COURT,
  rows:{west:westFront.length,east:eastFront.length}};
}