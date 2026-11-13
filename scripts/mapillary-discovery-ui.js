// Milovice RP 5.12 — street-level imagery candidate browser.
// No API token or photograph pixels are saved to JSON, GitHub or localStorage.
// Only official Mapillary metadata; opening/visual verification is human-led.
import {fetchMapillaryImages,planStreetQueryBoxes,
 rankImagesForFacade,summarizeStreetCoverage} from './mapillary-discovery.js';
export function initImageryDiscovery({
 getBuildings,getRoads,getChosen,getFace,getFacades,getStreet,planFacadeViews,
 selectBuilding,onUseReference
}){
 const $=id=>document.getElementById(id),status=$('imagery-status'),gallery=$('imagery-gallery');
 const summary=$('imagery-summary'),tokenInput=$('mapillary-client-token');
 let images=[],scopeIds=new Set(),lastSummary=null,controller=null,scanCount=0;
 const cache=new Map();
 const label=(string)=>String(string??'');
 const readableDate=stamp=>{
  try{return stamp?new Date(stamp).toLocaleDateString('cs-CZ'):'datum neznámé'}
  catch{return 'datum neznámé'}
 };
 const setStatus=(message)=>status.textContent=message;
 const image=(src,alt)=>{
  const img=document.createElement('img');
  img.src=src;img.alt=alt;img.loading='lazy';img.referrerPolicy='no-referrer';
  img.style.cssText='width:96px;height:80px;object-fit:cover;border-radius:6px;flex-shrink:0';
  return img;
 };
 const link=(url,text)=>{
  const a=document.createElement('a');a.href=url;a.textContent=text;
  a.target='_blank';a.rel='noopener noreferrer';return a;
 };
 function cancel(reason){
  scanCount++;if(controller){controller.abort();controller=null}
  if(reason)setStatus(reason);
 }
 function clear(){
  cancel();images=[];scopeIds.clear();lastSummary=null;cache.clear();gallery.replaceChildren();
  summary.textContent='';
 }
 function buildGallery(){
  const building=getChosen(),face=getFace();gallery.replaceChildren();
  if(!building||!face)return;
  if(!images.length){
   gallery.textContent='Zatím nejsou načtená metadata snímků. Prohledávání nezaručuje pokrytí každé fasády.';
   return;
  }
  const candidates=rankImagesForFacade(face,images,{limit:6});
  const info=document.createElement('p');info.className='muted';
  info.textContent='Možné pohledy na '+face.title+': '+candidates.length+
   '. Shoda polohy a směru NENÍ potvrzením, že je dům na snímku vidět.';
  gallery.append(info);
  if(!candidates.length){
   const hint=document.createElement('p');hint.className='muted';
   hint.textContent='Pro tuto stranu se nenašel vhodně natočený snímek. Vyzkoušej druhou stranu nebo externí Mapy.com Panorama.';
   gallery.append(hint);return;
  }
  for(const candidate of candidates){
   const row=document.createElement('div');row.className='imagery-candidate';
   if(candidate.thumbnail)row.append(image(candidate.thumbnail,'Možný pouliční záběr od '+candidate.creator));
   const body=document.createElement('div');body.style.cssText='min-width:0;flex:1';
   const details=document.createElement('div');details.className='muted';
   details.textContent=candidate.distance+' m od fasády · '+readableDate(candidate.capturedAt)+
    ' · '+(candidate.pano?'360° panorama':candidate.headingDifference===null?
      'směr neznámý':'odchylka '+candidate.headingDifference+'°');
   const links=document.createElement('div');links.className='imagery-actions';
   links.append(link(candidate.url,'Prohlédnout snímek'));
   const action=document.createElement('button');action.type='button';action.textContent='Použít odkaz';
   action.title='Přidá referenci; NEoznačí fasádu za ověřenou';
   action.addEventListener('click',()=>{
    if(!getChosen()||!getFace())return;
    onUseReference({url:candidate.url,creator:candidate.creator,capturedAt:candidate.capturedAt,id:candidate.id});
    setStatus('Odkaz uložen jako možný zdroj. Nejprve otevři snímek, ověř správný dům a jeho skutečný vzhled. Fasáda zatím NENÍ ověřená.');
   });
   links.append(action);body.append(details,links);
   const credit=document.createElement('div');credit.className='imagery-credit';
   credit.append(document.createTextNode('Foto: '+candidate.creator+' · Mapillary · '),
    link('https://creativecommons.org/licenses/by-sa/4.0/','CC BY-SA 4.0'));
   body.append(credit);row.append(body);gallery.append(row);
  }
 }
 function showSummary(){
  if(!lastSummary){summary.textContent='';return}
  const n=lastSummary;
  summary.textContent='Nalezená metadata: '+images.length+' unikátních snímků · možný pohled na '+
   n.withCandidates+'/'+n.buildings.length+' domů · '+n.candidateFacades+'/'+
   n.totalFacades+' fasád (bez vizuální kontroly).';
  const unmatched=n.buildings.filter(x=>!x.candidateFacades).slice(0,8);
  $('imagery-missing').replaceChildren();
  if(unmatched.length){
   const caption=document.createElement('p');caption.className='muted';
   caption.textContent='Budovy bez vhodného kandidáta (ukázka):';
   $('imagery-missing').append(caption);
   for(const missing of unmatched){
    const button=document.createElement('button');button.type='button';
    button.textContent='OSM '+missing.id+' · '+label(missing.street);
    button.addEventListener('click',()=>selectBuilding(missing.id));
    $('imagery-missing').append(button);
   }
  }
 }
 function refresh(){
  buildGallery();
  if(lastSummary)showSummary();
 }
 async function scan(mode){
  const chosen=getChosen(),buildingList=getBuildings()||[];
  if(!chosen){setStatus('Nejdřív vyber některý dům v ulici.');return}
  const token=tokenInput.value.trim();
  if(!token){setStatus('Pro automatické vyhledání metadat je potřeba Mapillary CLIENT token. Odkazy do Mapy.com a Mapillary fungují bez něj.');return}
  const street=getStreet()==='*'?chosen.street:getStreet();
  const homes=mode==='street'?buildingList.filter(b=>b.street===street):[chosen];
  if(!homes.length){setStatus('Pro vybranou ulici nemáme půdorysy domů.');return}
  const tiles=planStreetQueryBoxes(homes);
  if(tiles===null){
   setStatus('Ulice je příliš rozsáhlá pro bezpečný počet API dotazů. Vyber menší oblast nebo jen konkrétní dům.');
   return;
  }
  cancel();const serial=scanCount;controller=new AbortController();
  const staged=new Map(),errors=[];let truncated=0;
  // Each tile is a small bbox; no city-wide scraping or unexpected hundreds
  // of network calls. The user explicitly starts the scan.
  setStatus('Procházím '+homes.length+' domů v oblasti '+street+' · '+tiles.length+
   ' malých dotazů do Mapillary…');
  for(let i=0;i<tiles.length;i++){
   if(serial!==scanCount)return;
   try{
    let data=cache.get(tiles[i].key);
    if(!data){
     data=await fetchMapillaryImages(tiles[i],token,{signal:controller.signal});
     cache.set(tiles[i].key,data);
    }
    for(const item of data.images)staged.set(item.id,item);
    if(data.morePages)truncated++;
    setStatus('Mapillary: '+(i+1)+'/'+tiles.length+' oblastí · '+staged.size+
     ' unikátních snímků. Prověřuji polohu a natočení…');
   }catch(error){
    if(error.name==='AbortError'||serial!==scanCount)return;
    errors.push(error.message);
    if(/HTTP 401|HTTP 403|HTTP 429/.test(error.message))break;
   }
  }
  if(serial!==scanCount)return;
  controller=null;images=[...staged.values()];scopeIds=new Set(homes.map(b=>String(b.id)));
  lastSummary=summarizeStreetCoverage(homes,getRoads(),images,planFacadeViews);
  showSummary();buildGallery();
  setStatus('Kontrola metadat dokončena. '+lastSummary.withCandidates+'/'+homes.length+
   ' budov má alespoň jeden možný pohled.'+
   (truncated?' '+truncated+' dotazů má další stránky: výsledky jsou neúplné.':'')+
   (errors.length?' Některé požadavky selhaly: '+errors[0]:'')+
   ' Skutečnou viditelnost fasád musíš ověřit otevřením snímků.');
 }
 $('imagery-scan-house').addEventListener('click',()=>void scan('house'));
 $('imagery-scan-street').addEventListener('click',()=>void scan('street'));
 $('imagery-cancel').addEventListener('click',()=>cancel('Hledání přerušeno.'));
 return {cancel,clear,refresh,scan,get count(){return images.length},
  get coveredHouses(){return lastSummary?.withCandidates??0},
  get totalHouses(){return lastSummary?.buildings.length??0},
  get matches(){return getFace()?rankImagesForFacade(getFace(),images):[]},
  get noStoredToken(){return !Object.keys(localStorage).some(k=>k.includes('mapillary-token'))}};
}
