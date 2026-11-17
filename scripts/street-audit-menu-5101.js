// Milovice RP 5.101: compact mobile audit navigation (UI only).
// Retains all source review URLs. Does not touch scene geometry, camera
// placement, map provenance or the underlying review data.
export const STREET_AUDIT_SECTIONS=Object.freeze([
 {id:'streets',title:'Ulice a fotografie',icon:'🏘️'},
 {id:'sidewalks',title:'Chodníky',icon:'🚶'},
 {id:'water',title:'Voda',icon:'💧'},
 {id:'forests',title:'Lesy',icon:'🌲'},
 {id:'sports',title:'Sportoviště',icon:'🏟️'},
 {id:'playgrounds',title:'Dětská hřiště',icon:'🛝'},
 {id:'lighting',title:'Osvětlení',icon:'💡'}
]);
export function streetAuditCategory(id=''){
 const name=String(id||'');
 if(name.startsWith('lit-'))return 'lighting';
 if(name.startsWith('pitch-'))return 'sports';
 if(name.startsWith('play-'))return 'playgrounds';
 if(name.startsWith('forest-'))return 'forests';
 if(name.startsWith('water-'))return 'water';
 if(name.includes('sidewalk-'))return 'sidewalks';
 return 'streets';
}
export function shortStreetAuditLabel(label,id){
 let text=String(label||'').trim();
 const category=streetAuditCategory(id);
 if(category==='lighting')text=text.replace(/\s*·\s*OSM lit=yes.*$/i,'');
 if(category==='sports')text=text.replace(/\s*·\s*OSM model.*$/i,'');
 if(category==='playgrounds')text=text.replace(/\s*·\s*3D model.*$/i,'');
 if(category==='forests')text=text.replace(/\s*·\s*technická kamera.*$/i,'');
 if(category==='water')text=text.replace(/\s*\((?:TECHNICKÁ kamera|NENÍ foto).*$/i,'');
 // Photo provenance stays in the title/underlying link, not silently lost.
 return text||'Kontrolní pohled';
}
function linkId(a,doc){
 try{return new URL(a.getAttribute('href'),doc.baseURI)
  .searchParams.get('streetAudit')||''}
 catch(_){return ''}
}
export function mountStreetAuditMenu(panel,{activeId='',label='',mobile=false}={}){
 if(!panel||typeof panel.querySelector!=='function')return null;
 const doc=panel.ownerDocument,nav=panel.querySelector('nav'),
  toggle=panel.querySelector('#street-audit-toggle'),
  name=panel.querySelector('#street-audit-label');
 if(!nav||!toggle||!name||!doc)return null;
 if(nav.dataset.grouped==='yes')return panel.__streetMenuState||null;
 const sourceLinks=[...nav.querySelectorAll('a[href]')];
 const known=STREET_AUDIT_SECTIONS.map(section=>({
  ...section,links:sourceLinks.filter(a=>streetAuditCategory(linkId(a,doc))===section.id)
 }));
 const chosen=sourceLinks.find(a=>linkId(a,doc)===activeId);
 const selectedGroup=streetAuditCategory(activeId);
 nav.replaceChildren();
 nav.dataset.grouped='yes';
 nav.id='street-audit-nav';
 nav.setAttribute('aria-label','Kontrolní pohledy podle tématu');
 const allButton=doc.createElement('button');
 allButton.type='button';
 allButton.id='street-audit-show-all';
 allButton.className='street-audit-all';
 allButton.textContent='Zobrazit všechny sekce';
 nav.append(allButton);
 const details=[];
 for(const section of known){
  if(!section.links.length)continue;
  const group=doc.createElement('details');
  group.className='street-audit-group';
  group.dataset.category=section.id;
  const heading=doc.createElement('summary');
  heading.textContent=section.icon+' '+section.title+' ('+section.links.length+')';
  group.append(heading);
  const items=doc.createElement('div');
  items.className='street-audit-links';
  for(const a of section.links){
   a.title=a.textContent.trim();
   const id=linkId(a,doc);
   a.dataset.auditId=id;
   if(id===activeId){
    a.classList.add('selected');
    a.setAttribute('aria-current','page');
   }
   items.append(a);
  }
  group.append(items);
  group.open=section.id===selectedGroup;
  nav.append(group);
  details.push(group);
 }
 const quick=doc.createElement('div');
 quick.id='street-audit-quicklinks';
 quick.setAttribute('aria-label','Další pohledy ve stejné kategorii');
 if(chosen){
  const categoryLinks=known.find(x=>x.id===selectedGroup)?.links||[];
  const where=categoryLinks.indexOf(chosen);
  const nearest=categoryLinks
   .map((a,i)=>({a,i,dist:Math.abs(i-where)}))
   .filter(item=>item.a!==chosen)
   .sort((a,b)=>a.dist-b.dist||a.i-b.i)
   .slice(0,2)
   .sort((a,b)=>a.i-b.i);
  for(const {a} of nearest){
   const chip=a.cloneNode(true);
   chip.classList.remove('selected');
   chip.removeAttribute('aria-current');
   chip.className='street-audit-chip';
   chip.textContent=shortStreetAuditLabel(a.textContent,linkId(a,doc));
   quick.append(chip);
  }
 }
 // The compact state keeps a readable current location and up to 2 links.
 name.title=String(label||name.textContent||'');
 name.textContent=shortStreetAuditLabel(label||name.textContent,activeId);
 name.insertAdjacentElement('afterend',quick);
 const state={
  version:'5.101',activeId,category:selectedGroup,sourceLinks:sourceLinks.length,
  sections:details.length,quickLinks:quick.children.length,
  get expanded(){return !panel.classList.contains('audit-compact')},
  get openSections(){return details.filter(d=>d.open).map(d=>d.dataset.category)}
 };
 const selected=details.find(d=>d.dataset.category===selectedGroup);
 let showAll=false;
 allButton.addEventListener('click',()=>{
  showAll=!showAll;
  for(const d of details)d.open=showAll||d===selected;
  allButton.textContent=showAll?'Sbalit ostatní sekce':'Zobrazit všechny sekce';
  allButton.setAttribute('aria-expanded',String(showAll));
 });
 for(const group of details){
  group.addEventListener('toggle',()=>{
   if(!group.open||showAll)return;
   for(const other of details)if(other!==group)other.open=false;
  });
 }
 const setExpanded=expanded=>{
  panel.classList.toggle('audit-compact',!expanded);
  toggle.setAttribute('aria-expanded',String(expanded));
  toggle.setAttribute('aria-controls','street-audit-nav');
  toggle.textContent=expanded?'Sbalit nabídku':'Zobrazit kategorie';
  // Never open the full long review-link list by default on a phone.
  panel.scrollTop=0;
 };
 toggle.addEventListener('click',()=>setExpanded(!state.expanded));
 setExpanded(!mobile);
 panel.__streetMenuState=state;
 return state;
}
