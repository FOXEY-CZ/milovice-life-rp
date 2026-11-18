/** Milovice RP 5.155: source-locked full five-house panel row Topolova 614–618.
 * The 618 OSM building:levels=1 is historically wrong. CSU RSO confirms
 * FIVE ABOVE-GROUND storeys for ALL 5, each 10 flats, loadbearing wall panels.
 * Use an EVIDENCE-GATED VIEW correction only, no OSM data mutation.
 */
export const TOPOLOVA_ROW_5155=Object.freeze({
 region:'mlada',modelStoreyHeight:3.05,
 correctedID:'61979145',correctedAddress:'Topolová 618',
 rows:Object.freeze([
  Object.freeze({address:614,osm:'61979151',ruian:'22968067',hash:'c28a14a4',levels:'5',
   csu:'https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=533453&hkodcis=43&idob=1003860982&kod=537501&kodcis=43&kodpol=nnnnnn'}),
  Object.freeze({address:615,osm:'61979152',ruian:'22968075',hash:'46937fbc',levels:'5',
   csu:'https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=533454&hkodcis=43&idob=1003860991&kod=537501&kodcis=43&kodpol=nnnnnn'}),
  Object.freeze({address:616,osm:'61979144',ruian:'22968083',hash:'ace63062',levels:'5',
   csu:'https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=533455&hkodcis=43&idob=1003861008&kod=537501&kodcis=43&kodpol=nnnnnn'}),
  Object.freeze({address:617,osm:'61979139',ruian:'22968091',hash:'43ca97b1',levels:'5',
   csu:'https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=533456&hkodcis=43&idob=1003861016&kod=537501&kodcis=43&kodpol=nnnnnn'}),
  Object.freeze({address:618,osm:'61979145',ruian:'22968105',hash:'b69a7ef6',levels:'1',
   csu:'https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=2173846&hkodcis=43&idob=1003861024&kod=537501&kodcis=43&kodpol=nnnnnn'})
 ])
});
const hash=geo=>{
 let h=2166136261;
 const text=geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16).padStart(8,'0');
};
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const unique=points=>points.slice(0,-1);
function commonEdge(a,b){
 const aa=unique(a.geometry),bb=unique(b.geometry);
 const edges=pts=>pts.map((p,i)=>[key(p),key(pts[(i+1)%pts.length])]);
 let matches=0;
 for(const [p,q] of edges(aa)){
  if(edges(bb).some(([r,s])=>(p===s&&q===r)||(p===r&&q===s)))
   matches++;
 }
 return matches;
}
export function planTopolovaPanelRow5155({regionId,ways}={}){
 const s=TOPOLOVA_ROW_5155;
 if(regionId!==s.region||!Array.isArray(ways))return null;
 const selected=[];
 for(const item of s.rows){
  const arr=ways.filter(w=>String(w?.id)===item.osm);
  if(arr.length!==1)return null;
  const w=arr[0],t=w.tags||{},g=w.geometry;
  if(t.building!=='residential'||t['building:levels']!==item.levels||
   t['building:flats']!=='10'||t['ref:ruian:building']!==item.ruian||
   t.source!=='cuzk:ruian'||t.height!==undefined||
   !Array.isArray(g)||g.length!==5||
   !g.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||
   key(g[0])!==key(g.at(-1))||hash(g)!==item.hash)return null;
  selected.push(w);
 }
 const walls=selected.slice(1).map((w,i)=>commonEdge(selected[i],w));
 if(!walls.every(c=>c===1))return null;
 const neighborSource=selected.slice(0,4).every(w=>w.tags['building:levels']==='5');
 if(!neighborSource)return null;
 return {
  version:'5.155',sourceOSMId:s.correctedID,sourceRUIANId:s.rows[4].ruian,
  originalOSMLevelTag:'1',visualAboveGroundLevels:5,
  sourceCSUAboveGroundLevels:5,allFiveCSUVerifiedAboveGround:true,
  sourceCSUPanelWalls:true,houseNumbers:s.rows.map(x=>x.address),
  sourceOSMIds:s.rows.map(x=>x.osm),sourceRUIANIds:s.rows.map(x=>x.ruian),
  czechStatisticalSources:s.rows.map(x=>x.csu),
  sourceOriginalGeometryHashes:s.rows.map(x=>x.hash),
  contiguousExactSharedPartyWalls:walls.length,
  originalFootprintVertices:5,
  modelStoreyHeight:s.modelStoreyHeight,
  visualHeightMeters:5*s.modelStoreyHeight,
  previousVisualHeightMeters:s.modelStoreyHeight,
  modelHeightNotSurveyed:true,flatRoofProfileModelEstimated:true,
  needsVirtualPartyWallLevelOverride:true,
  preserveOriginalOSMLevelTag:true,preserveOriginalGPS:true,
  visualCorrectedBuildings:1,
  newBuildings:0,newFootways:0,newRoads:0,newEntries:0,
  newParking:0,newTrees:0,newLamps:0,newColliders:0
 };
}
