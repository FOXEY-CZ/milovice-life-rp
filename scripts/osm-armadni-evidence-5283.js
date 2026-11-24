/** 5.283: Armádní original-source review, never an as-built facade claim.
 * STAKO C15/C16 is a PROJECT VISUALIZATION, not a real-world photograph.
 * Do not copy third-party pictures into assets or invent balcony coordinates.
 */
export const ARMADNI_EVIDENCE_5283=Object.freeze({
 project:{houses:['890','891'],assignments:Object.freeze({C15:'890',C16:'891'}),kind:'project-concept-only',
  title:'STAKO C15/C16 — projektová vizualizace, ne fotografie',
  url:'https://www.stakohk.cz/MILOVICE-Bydleni-v-zeleniBD-C-15-a-C-16.html'},
 westProject:{houses:['886','887'],assignments:Object.freeze({C14:'886',C13:'887'}),
  kind:'developer-project-description',url:'https://www.bydleni-milovice.cz/filosofie/',
  title:'Projekt C13/C14: předzahrádky v přízemí, balkony ve vyšších podlažích do 12 m²',
  addressesUrl:'https://www.finmag.cz/obchodni-rejstrik/zivnostensky-rejstrik/47539801-ites-spol-s-r-o',
  exactBalconyLocationVerified:false,facadePhotoVerified:false,
  colorsAndBandOnlyEstimated:true},
 city:{title:'Město Milovice — zápis rady 29/2024: BD C15 = č.p. 890, BD C16 = č.p. 891',
  url:'https://milovice.hlasenirozhlasu.cz/files/milovice/attachments/249858/Anonymizovany-Zapis-z-jednani-29-2024-2547.pdf'},
 houses:[
  {house:'886',osmId:'1164238465',ruian:'119003791',
   note:'Dům C14 = Armádní 886 podle adresného provozního registru. Oficiální projekt C13/C14 potvrzuje balkony vyšších podlaží (do 12 m²), nikoli jejich přesné polohy. Verze 5.289: PROVIZORNÍ dvoubarevná 3D fasáda, ne fotometricky ověřené barvy ani fasádní otvory.',
   url:'https://reality.idnes.cz/detail/prodej/byt/milovice-armadni/6ad32c2feb13dfe0ed01b097/'},
  {house:'887',osmId:'1164238466',ruian:'119001071',
   note:'Dům C13 = Armádní 887 podle adresného provozního registru. Oficiální projekt C13/C14 potvrzuje balkony vyšších podlaží (do 12 m²), ale ne jejich přesné souřadnice. Verze 5.289: PROVIZORNÍ dvoubarevná 3D fasáda, nikoli fotografie skutečného domu.',url:null},
  {house:'891',osmId:'1047406190',ruian:'107125749',
   note:'BD C16 = č.p. 891. Nová adresní realitní fotogalerie ukazuje hotovou světlou horní fasádu, tmavé přízemí a balkony. Jde o skutečné fotky, bez GPS/azimutu jednotlivých snímků; 5.285 orientačně přiřadila třípatrový balkonový sloupec k jižní OSM hraně 6 podle blízké parkovací komunikace na východě, nejde o zaměřenou polohu. Starý smazaný inzerát se nepoužívá.',
   url:'https://jirisimon.cz/milovice/'},
  {house:'890',osmId:'1047406191',ruian:'107124980',
   note:'BD C15 = č.p. 890 doloženo zápisem 29/2024. Adresný inzerát ze dne 25. 5. 2022 potvrzuje byt 1+kk s předzahrádkou a terasou 13 m². Model 5.288 má PROVIZORNÍ dvoubarevný povrch odvozený od sousední C16/891, nikoli ověřenou fotografii 890. Nedokládá počet teras v domě, polohu, hranu fasády ani stavební rozměry.',
   groundFloorTerraceEvidence:Object.freeze({sourceType:'address-specific-listing',areaSquareMetres:13,advertisedOn:'2022-05-25',exactPlacementVerified:false,allUnitTerracesVerified:false,geometryAdded:false}),
   url:'https://www.bezrealitky.cz/nemovitosti-byty-domy/719934-nabidka-pronajem-bytu-armadni-milovice'}
 ]
});
export function armadniEvidenceView5283(search=''){
 const id=new URLSearchParams(search).get('streetAudit');
 return ['armadni-houses-east-5282','armadni-houses-west-5282','armadni-891-south-balconies-5285'].includes(id)?id:null;
}
// Three pre-existing technical views, with local search parameters preserved.
export function armadniEvidenceNavigation5285(search=''){
 const current=armadniEvidenceView5283(search);
 if(!current)return [];
 const options=[
  ['armadni-houses-east-5282','890/891 — celý blok'],
  ['armadni-houses-west-5282','886/887 — celý blok'],
  ['armadni-891-south-balconies-5285','891 — detail balkonů']
 ];
 return options.map(([id,label])=>{
  const params=new URLSearchParams(search);
  params.set('streetAudit',id);
  return {id,label,href:'?'+params.toString(),current:id===current};
 });
}
export function mountArmadniEvidence5283(doc,search=''){
 const id=armadniEvidenceView5283(search);
 if(!id||!doc?.body||!doc?.createElement||!doc?.getElementById)return null;
 let panel=doc.getElementById('armadni-evidence-5283');if(panel)return panel;
 panel=doc.createElement('details');panel.id='armadni-evidence-5283';
 panel.style.cssText='position:fixed;right:10px;bottom:12px;z-index:9000;max-width:min(360px,92vw);max-height:70vh;overflow:auto;background:rgba(11,24,36,.95);color:#eef4f9;border:1px solid #9db5c4;border-radius:10px;padding:9px 12px;font:12px/1.5 system-ui,sans-serif';
 const title=doc.createElement('summary');title.textContent='📷 Armádní — zdroje a nejistoty';title.style.cssText='cursor:pointer;font-weight:700';panel.append(title);
 const p=s=>{const el=doc.createElement('p');el.textContent=s;el.style.margin='8px 0';panel.append(el)};
 const a=(s,u)=>{const el=doc.createElement('a');el.textContent=s;el.href=u;el.target='_blank';el.rel='noopener noreferrer';el.style.cssText='display:block;color:#9ddaff;margin:5px 0';panel.append(el)};
 const links=armadniEvidenceNavigation5285(search);
 const nav=doc.createElement('nav');
 nav.style.cssText='display:flex;flex-wrap:wrap;gap:5px;margin:8px 0 10px';
 for(const link of links){
  const el=doc.createElement(link.current?'span':'a');
  el.textContent=link.label;
  if(!link.current){el.href=link.href;el.title='Zobrazit technickou kameru';}
  else el.setAttribute?.('aria-current','page');
  el.style.cssText='display:inline-block;border:1px solid #7394a7;border-radius:6px;padding:4px 6px;color:'+
   (link.current?'#ffffff':'#9ddaff')+';background:'+
   (link.current?'#315469':'#172e3d')+';text-decoration:none';
  nav.append(el);
 }
 panel.append(nav);
 const east=id==='armadni-houses-east-5282'||id==='armadni-891-south-balconies-5285';
 p('RÚIAN půdorysy a 4 podlaží jsou ověřené. Okna na domech jsou modelový odhad, ne fotografie.');
 for(const house of east?['890','891']:['886','887']){
  const h=ARMADNI_EVIDENCE_5283.houses.find(h=>h.house===house);
  p('Armádní '+house+': '+h.note);if(h.url)a('Otevřít zdroj k č. '+house,h.url);
 }
 if(east){
  p('Městský zápis 29/2024 jednoznačně uvádí C15 = č.p. 890 a C16 = č.p. 891. STAKO je projektová vizualizace, nikoli skutečná fotografie; přesné umístění balkonů stále nebylo zaměřeno.');
  a(ARMADNI_EVIDENCE_5283.project.title,ARMADNI_EVIDENCE_5283.project.url);
  a(ARMADNI_EVIDENCE_5283.city.title,ARMADNI_EVIDENCE_5283.city.url);
 }
 if(east){
  p('5.285: u č.p. 891 byly přidány 3 modelové balkony na pravděpodobnou jižní fasádu podle fotografie a východní OSM komunikace. Orientace je odvozená, jejich přesná poloha není zaměřena. Průsvitné dveře mají modelový krycí podklad proti prosvítání starých oken; žádný fyzický otvor ve zdi.');
  p('Armádní 890: jedna 13m² přízemní terasa je doložená adresným inzerátem, ale není známa její poloha ani počet dalších teras. Proto nevznikla žádná nová modelová terasa, přístupová cesta ani kolize.');
  p('5.288: Armádní 890 má PROVIZORNÍ dvoubarevný povrch navazující na sousední 891: společný projekt C15/C16 je potvrzen, barevnost a výška tmavého pásu 890 nikoli. Nejde o fotoověřenou fasádu ani kopii STAKO vizualizace.');
 }else{
  p('5.289: Armádní 886 = projekt C14, Armádní 887 = projekt C13. Developer potvrzuje předzahrádky u přízemních bytů a balkony ostatních bytů až 12 m², ne však přesné souřadnice jednotlivých balkonů. Dvě fasádní barevné vrstvy na každé budově jsou PROVIZORNÍ, barevnost a dělicí pás nejsou fotograficky zaměřené. Nevznikají nové balkony, dveře, terasy, parkování ani kolize.');
  a(ARMADNI_EVIDENCE_5283.westProject.title,ARMADNI_EVIDENCE_5283.westProject.url);
  a('Adresné přiřazení C14=886 a C13=887 (ITES / obchodní registr)',ARMADNI_EVIDENCE_5283.westProject.addressesUrl);
 }
 p('Původní RÚIAN stěny, střechy, chodníky, kolize a ostatní budovy zůstávají nedotčené.');
 doc.body.append(panel);return panel;
}
