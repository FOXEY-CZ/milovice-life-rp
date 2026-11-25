// 5.331 — local Czech speech only; caller can fall back to original tones.
export function gpsVoiceText5331(kind,distance){
 if(kind==='arrival')return 'Dosažena blízkost cíle.';
 if(!Number.isFinite(distance)||distance<0)return null;
 const prefix=distance<=5?'Nyní: ':'Za '+Math.max(5,Math.round(distance/5)*5)+' metrů: ';
 const phrases={left:'odboč doleva.',right:'odboč doprava.',reverse:'změna směru trasy.','road-end':'konec silniční trasy.'};
 return Object.hasOwn(phrases,kind)?prefix+phrases[kind]:null;
}
export function createGpsVoice5331(synth,Utterance){
 let active=null,count=0,last=null,error=null;
 const localVoice=()=>{try{return synth?.getVoices?.().find(v=>v.localService===true&&/^cs(?:[-_]|$)/i.test(v.lang))??null;}catch{return null;}};
 function cancel(){
  if(!active)return;
  active=null;
  try{synth.cancel();}catch(e){error=String(e?.message??e);}
 }
 function play(kind,distance){
  const message=gpsVoiceText5331(kind,distance),voice=localVoice();
  if(!message||!voice||typeof Utterance!=='function'||typeof synth?.speak!=='function')return 'fallback';
  if(active||synth.speaking||synth.pending)return 'busy';
  try{
   const u=new Utterance(message);u.voice=voice;u.lang='cs-CZ';u.rate=1;u.volume=.65;
   active=u;
   u.onend=()=>{if(active===u)active=null;};
   u.onerror=e=>{if(active===u){active=null;error=String(e?.error??'speech-error');}};
   synth.speak(u);count++;last=kind;return 'spoken';
  }catch(e){active=null;error=String(e?.message??e);return 'fallback';}
 }
 return {play,cancel,stats:()=>({available:!!localVoice()&&typeof Utterance==='function',busy:!!active,count,last,error})};
}
