/** 5.283: Armádní original-source review, never an as-built facade claim.
 * STAKO C15/C16 is a PROJECT VISUALIZATION, not a real-world photograph.
 * Do not copy third-party pictures into assets or invent balcony coordinates.
 */
export const ARMADNI_EVIDENCE_5283=Object.freeze({
 project:{houses:['890','891'],assignments:Object.freeze({C15:'890',C16:'891'}),kind:'project-concept-only',
  title:'STAKO C15/C16 — projektová vizualizace, ne fotografie',
  url:'https://www.stakohk.cz/MILOVICE-Bydleni-v-zeleniBD-C-15-a-C-16.html'},
 city:{title:'Město Milovice — zápis rady 29/2024: BD C15 = č.p. 890, BD C16 = č.p. 891',
  url:'https://milovice.hlasenirozhlasu.cz/files/milovice/attachments/249858/Anonymizovany-Zapis-z-jednani-29-2024-2547.pdf'},
 houses:[
  {house:'886',osmId:'1164238465',ruian:'119003791',
   note:'Inzerce uvádí balkon, nikoli jeho polohu či fasádní stranu.',
   url:'https://reality.idnes.cz/detail/prodej/byt/milovice-armadni/6ad32c2feb13dfe0ed01b097/'},
  {house:'887',osmId:'1164238466',ruian:'119001071',
   note:'Bez jednoznačně přiřazené fotografie exteriéru.',url:null},
  {house:'891',osmId:'1047406190',ruian:'107125749',
   note:'BD C16 = č.p. 891. Nová adresní realitní fotogalerie ukazuje hotovou světlou horní fasádu, tmavé přízemí a balkony. Jde o skutečné fotky, bez GPS/azimutu jednotlivých snímků; 5.285 orientačně přiřadila třípatrový balkonový sloupec k jižní OSM hraně 6 podle blízké parkovací komunikace na východě, nejde o zaměřenou polohu. Starý smazaný inzerát se nepoužívá.',
   url:'https://jirisimon.cz/milovice/'},
  {house:'890',osmId:'1047406191',ruian:'107124980',
   note:'BD C15 = č.p. 890 doloženo zápisem 29/2024. Text inzerátu uvádí předzahrádku s terasou, nikoli její fasádní hranu.',
   url:'https://www.bezrealitky.cz/nemovitosti-byty-domy/719934-nabidka-pronajem-bytu-armadni-milovice'}
 ]
});
export function armadniEvidenceView5283(search=''){
 const id=new URLSearchParams(search).get('streetAudit');
 return ['armadni-houses-east-5282','armadni-houses-west-5282','armadni-891-south-balconies-5285'].includes(id)?id:null;
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
 p('5.285: u č.p. 891 byly přidány 3 modelové balkony na pravděpodobnou jižní fasádu podle fotografie a východní OSM ulice. Orientace je odvozená, jejich přesná poloha není zaměřena. Původní stěny, okna, střechy, chodníky, kolize a ostatní budovy zůstávají nedotčené.');
 doc.body.append(panel);return panel;
}
