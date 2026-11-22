/* Milovice RP 5.283. Reference links, NOT photo approval or game assets.
   STAKO C15/C16 is a PROJECT VISUALIZATION, not an as-built photo. */
export const ARMADNI_EVIDENCE_5283=Object.freeze({
 project:Object.freeze({houses:['890','891'],kind:'project-concept-only',
  title:'STAKO — C15/C16, projektová vizualizace (nikoliv skutečná fotografie)',
  url:'https://www.stakohk.cz/MILOVICE-Bydleni-v-zeleniBD-C-15-a-C-16.html'}),
 city:Object.freeze({title:'Zápis města Milovice 29/2024 — C15/C16 jako dvojice',
  url:'https://milovice.hlasenirozhlasu.cz/files/milovice/attachments/249858/Anonymizovany-Zapis-z-jednani-29-2024-2547.pdf'}),
 houses:Object.freeze([
  Object.freeze({house:'886',osmId:'1164238465',ruian:'119003791',
   note:'Inzerát uvádí balkon, ne však jeho fasádní stranu ani pozici.',
   link:'https://reality.idnes.cz/detail/prodej/byt/milovice-armadni/6ad32c2feb13dfe0ed01b097/'}),
  Object.freeze({house:'887',osmId:'1164238466',ruian:'119001071',
   note:'Zatím bez jednoznačně přiřazené exteriérové fotografie.',link:null}),
  Object.freeze({house:'891',osmId:'1047406190',ruian:'107125749',
   note:'Pár C15/C16 a inzerát s teráskou; přesná fasáda neověřena.',
   link:'https://reality.mesec.cz/pronajem/byty/byty-1-kk/milovice/pronajem-bytu-1-kk-a-garsoniery-33-m2-armadni-3899440.html'}),
  Object.freeze({house:'890',osmId:'1047406191',ruian:'107124980',
   note:'Pár C15/C16, nabídka s terasou; přesná fasáda neověřena.',
   link:'https://www.bezrealitky.cz/nemovitosti-byty-domy/719934-nabidka-pronajem-bytu-armadni-milovice'})
 ])
});
export function armadniEvidenceView5283(search=''){
 const q=new URLSearchParams(search).get('streetAudit');
 return q==='armadni-houses-east-5282'||q==='armadni-houses-west-5282'?q:null;
}
export function mountArmadniEvidence5283(doc,search=''){
 const view=armadniEvidenceView5283(search);
 if(!view||!doc?.body||!doc?.createElement||!doc?.getElementById)return null;
 const old=doc.getElementById('armadni-evidence-5283');if(old)return old;
 const panel=doc.createElement('details');panel.id='armadni-evidence-5283';
 panel.style.cssText='position:fixed;right:10px;bottom:12px;z-index:9000;max-width:min(360px,92vw);max-height:70vh;overflow:auto;background:rgba(11,24,36,.95);color:#eef4f9;border:1px solid #9db5c4;border-radius:10px;padding:9px 12px;font:12px/1.5 system-ui,sans-serif';
 const heading=doc.createElement('summary');heading.textContent='📷 Armádní — zdroje a nejistoty';heading.style.cssText='cursor:pointer;font-weight:700';panel.append(heading);
 const paragraph=t=>{const p=doc.createElement('p');p.textContent=t;p.style.margin='7px 0';panel.append(p)};
 const link=(t,u)=>{const a=doc.createElement('a');a.textContent=t;a.href=u;a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='display:block;color:#9ddaff;margin:5px 0';panel.append(a)};
 const east=view==='armadni-houses-east-5282';
 paragraph('Podklady pro Armádní '+(east?'890 a 891':'886 a 887')+'. RÚIAN podlaží a půdorys jsou ověřené; 360 oken ze hry jsou modelový odhad, nikoliv skutečně zaměřená okna.');
 for(const name of east?['890','891']:['886','887']){
  const h=ARMADNI_EVIDENCE_5283.houses.find(h=>h.house===name);
  paragraph('Č. '+name+': '+h.note);if(h.link)link('Otevřít zdroj pro č. '+name,h.link);
 }
 if(east){
  paragraph('STAKO ukazuje návrh C15/C16, nikoliv exteriérovou fotografii. Bez georeference nevíme, který objekt je C15 nebo C16 ani na které hraně mají balkony.');
  link(ARMADNI_EVIDENCE_5283.project.title,ARMADNI_EVIDENCE_5283.project.url);
  link(ARMADNI_EVIDENCE_5283.city.title,ARMADNI_EVIDENCE_5283.city.url);
 }
 paragraph('Žádné cizí fotografie nejsou vložené do assetů. Tato verze nemění budovy, balkony, silnice, podlahy, okna ani kolize.');
 doc.body.append(panel);return panel;
}
