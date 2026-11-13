// Milovice RP 5.11 - local photograph calibration and annotation UI.
// No photograph pixels leave the browser or enter localStorage/export JSON.
// User explicitly owns/has authorization for the image and confirms each layout.
import {projectFacade,imagePointToFacade,normalizePhotoRectangle,
 proposeDarkWindowRects,validatePhotoOpenings} from './photo-survey.js';

export function initPhotoSurvey({getSelection,saveEvidence}){
 const $=id=>document.getElementById(id);
 const file=$('photo-file'),canvas=$('photo-canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
 const status=$('photo-status'),tools=$('photo-tools'),rights=$('photo-rights');
 let img=null,digest='',quad=[],boxes=[],mode='corners',drag=null,fileName='';
 const msg=s=>status.textContent=s;
 const rounded=v=>+(Math.max(0,Math.min(1,v))).toFixed(5);
 const pt=(event)=>{
  const r=canvas.getBoundingClientRect();
  return [rounded((event.clientX-r.left)/r.width),rounded((event.clientY-r.top)/r.height)];
 };
 const currentOk=()=>{const sel=getSelection();return !!(sel?.buildingId&&sel?.faceId)};
 function drawShape(points,color,fill=''){
  ctx.beginPath();
  points.forEach((p,i)=>{if(!p)return;i?ctx.lineTo(p[0]*canvas.width,p[1]*canvas.height):
    ctx.moveTo(p[0]*canvas.width,p[1]*canvas.height)});
  ctx.closePath();
  if(fill){ctx.fillStyle=fill;ctx.fill()}
  ctx.strokeStyle=color;ctx.lineWidth=3;ctx.stroke();
 }
 function render(){
  if(!img)return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  if(quad.length>=2){
   ctx.beginPath();ctx.moveTo(quad[0][0]*canvas.width,quad[0][1]*canvas.height);
   for(let i=1;i<quad.length;i++)ctx.lineTo(quad[i][0]*canvas.width,quad[i][1]*canvas.height);
   if(quad.length===4)ctx.closePath();
   ctx.lineWidth=3;ctx.strokeStyle='#f9d977';ctx.stroke();
  }
  for(let i=0;i<quad.length;i++){
   ctx.beginPath();ctx.arc(quad[i][0]*canvas.width,quad[i][1]*canvas.height,6,0,Math.PI*2);
   ctx.fillStyle='#ffe48f';ctx.fill();ctx.fillStyle='#1b2630';
   ctx.font='bold 12px system-ui';ctx.fillText(String(i+1),quad[i][0]*canvas.width+9,quad[i][1]*canvas.height-8);
  }
  for(const item of boxes){
   const x=item.x,y=item.y,w=item.w,h=item.h;
   const points=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(p=>projectFacade(quad,...p));
   const color=item.candidate?'#ffb04c':item.type==='door'?'#71c7ff':'#57e8b2';
   if(points.every(Boolean))drawShape(points,color,'rgba(20,30,38,.13)');
  }
  if(drag&&quad.length===4){
   const [x,y]=drag.start,[xx,yy]=drag.end;
   const minX=Math.min(x,xx),minY=Math.min(y,yy),maxX=Math.max(x,xx),maxY=Math.max(y,yy);
   drawShape([[minX,minY],[maxX,minY],[maxX,maxY],[minX,maxY]],'#fff39f');
  }
  const mark=quad.length===4?'fasáda zaměřena':quad.length+'/4 rohy';
  $('photo-counter').textContent=mark+' • '+boxes.filter(b=>b.type==='window').length+' oken / '+
   boxes.filter(b=>b.type==='door').length+' dveří'+
   (boxes.some(b=>b.candidate)?' • oranžové = NEOVĚŘENÉ návrhy':'');
 }
 function setMode(next){
  mode=next;
  tools.querySelectorAll('[data-photo-mode]').forEach(b=>b.classList.toggle('active',b.dataset.photoMode===next));
  msg(next==='corners'?'Klepni postupně na levý horní, pravý horní, pravý dolní a levý dolní ROH CELÉ fasády.':
   next==='window'?'Táhni prstem/myší obdélník kolem jednoho okna.':
   'Táhni obdélník kolem jediných vstupních dveří.');
 }
 function clear(){
  if(img?.close)img.close();img=null;digest='';fileName='';quad=[];boxes=[];drag=null;
  file.value='';rights.checked=false;canvas.hidden=true;$('photo-counter').textContent='';
  msg('Vlož vlastní fotografii nebo snímek, k němuž máš právo.');
 }
 async function load(fileValue){
  clear();
  if(!currentOk()){msg('Nejdřív vyber dům a stranu fasády.');return}
  if(!fileValue||!/^image\//.test(fileValue.type)||fileValue.size>12*1024*1024){
   msg('Vyber obrázek JPG/PNG/WEBP do 12 MB.');return;
  }
  try{
   const bytes=await fileValue.arrayBuffer();
   const hash=await crypto.subtle.digest('SHA-256',bytes);
   digest=[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
   const blob=new Blob([bytes],{type:fileValue.type});
   img=await createImageBitmap(blob);
   if(img.width<160||img.height<120||img.width>12000||img.height>12000)throw Error('Nevhodné rozměry obrázku');
   canvas.width=Math.min(960,img.width);
   canvas.height=Math.max(120,Math.round(canvas.width*img.height/img.width));
   canvas.hidden=false;fileName=fileValue.name||'lokální fotografie';
   setMode('corners');render();
   msg('Fotografie načtená pouze v zařízení. Nejprve vyznač 4 rohy CELÉ fasády. Počet oken pak můžeš označit nebo navrhnout automaticky.');
  }catch(err){clear();msg('Fotografii nelze otevřít: '+err.message)}
 }
 file.addEventListener('change',()=>{const f=file.files?.[0];if(f)void load(f)});
 canvas.addEventListener('pointerdown',event=>{
  if(!img||!currentOk())return;
  const p=pt(event);
  if(mode==='corners'){
   if(quad.length===4){msg('Čtyři rohy už jsou nastavené. Zvol Okno nebo Dveře, případně Reset.');return}
   quad.push(p);if(quad.length===4){setMode('window');msg('Fasáda je vymezena. Zakresli otvory nebo nech nabídnout kandidáty.')}
   render();return;
  }
  if(quad.length!==4){msg('Nejdřív označ 4 rohy celé fasády.');return}
  drag={start:p,end:p};canvas.setPointerCapture(event.pointerId);render();
 });
 canvas.addEventListener('pointermove',event=>{if(!drag)return;drag.end=pt(event);render()});
 function finish(event){
  if(!drag||!img)return;
  drag.end=pt(event);
  const [sx,sy]=drag.start,[ex,ey]=drag.end;
  const rect={x:Math.min(sx,ex),y:Math.min(sy,ey),w:Math.abs(sx-ex),h:Math.abs(sy-ey)};
  drag=null;
  const candidate=normalizePhotoRectangle(quad,rect,mode==='door'?'door':'window');
  if(!candidate)msg('Obdélník není celý uvnitř vyznačené fasády nebo je příliš malý.');
  else{
   if(mode==='door')boxes=boxes.filter(b=>b.type!=='door');
   boxes.push(candidate);msg('Otvor zakreslen. Není ověřený, dokud nepotvrdíš anotace.');
  }
  render();
 }
 canvas.addEventListener('pointerup',finish);
 canvas.addEventListener('pointercancel',()=>{drag=null;render()});
 tools.addEventListener('click',event=>{
  const button=event.target.closest('[data-photo-mode]');if(button)setMode(button.dataset.photoMode);
 });
 $('photo-undo').addEventListener('click',()=>{
  if(boxes.length)boxes.pop();
  else if(quad.length)quad.pop();
  render();
 });
 $('photo-reset').addEventListener('click',()=>{
  quad=[];boxes=[];setMode('corners');render();
 });
 $('photo-analyze').addEventListener('click',()=>{
  if(!img||quad.length!==4){msg('Nejprve vlož fotografii a vyznač všechny čtyři rohy fasády.');return}
  const {data,width,height}=ctx.getImageData(0,0,canvas.width,canvas.height);
  // Remove overlay drawn by annotation UI before analyzing pixels.
  const scratch=document.createElement('canvas');scratch.width=width;scratch.height=height;
  const temp=scratch.getContext('2d',{willReadFrequently:true});
  temp.drawImage(img,0,0,width,height);
  const suggestions=proposeDarkWindowRects(temp.getImageData(0,0,width,height),quad);
  boxes=boxes.filter(b=>!b.candidate);
  const old=boxes.length;
  for(const b of suggestions){
   if(boxes.some(x=>Math.abs(x.x-b.x)<.035&&Math.abs(x.y-b.y)<.035))continue;
   boxes.push({...b,candidate:true});
  }
  render();msg('Automatická analýza nabídla '+(boxes.length-old)+' kandidátů. Oranžová označení mohou být stíny, plakáty či výlohy. Před potvrzením je zkontroluj; nesprávné označení odstraň/resetuj.');
 });
 $('photo-confirm').addEventListener('click',()=>{
  if(!currentOk()||!img||quad.length!==4){msg('Chybí fotografie, cílová fasáda nebo 4 rohy.');return}
  if(!rights.checked){msg('Pro uložení musíš potvrdit vlastní fotografii nebo oprávnění k jejímu použití.');return}
  if(!$('face-note').value.trim()){msg('Popiš v poznámce, co na fotografii skutečně vidíš.');return}
  // A suggestion is never silently promoted. Require a separate confirmation
  // gesture, then geometry is still gated by overall building verification.
  const approved=validatePhotoOpenings(boxes.map(({type,x,y,w,h})=>({type,x,y,w,h})));
  if(!approved?.length){msg('Označ alespoň jedno skutečné okno nebo dveře včetně celé fasády.');return}
  const choice=getSelection();
  const reference={kind:'local-owned-photo',sha256:digest,rightsConfirmed:true};
  saveEvidence(choice,{
   photoEvidence:reference,
   openings:approved,
   photoConfirmed:true,
   fileName
  });
  boxes=approved;render();
  msg('✅ Potvrzeno '+approved.length+' otvorů. Do JSON se ukládají jen souřadnice, hash a oprávnění — nikdy snímek. Ulož celou kartu jako ověřenou a obnov hru.');
 });
 function showSaved(face){
  // A saved annotation has no pixels; the user may reimport the same photo.
  const count=face?.layout?.photoConfirmed?face.layout?.openings?.length||0:0;
  if(count){
   msg('💾 U této fasády je uložených '+count+
    ' potvrzených otvorů. Fotografie není uložená; pro další úpravy ji znovu vlož. Pokud chceš pozice přepsat, celý snímek znovu vyznač.');
  }
 }
 return {clear,showSaved,loadForTest:load,get metrics(){return {quad:quad.length,boxes:boxes.length,digest:!!digest,image:!!img}}};
}
