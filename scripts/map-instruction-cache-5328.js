// 5.328 candidate: bounded single-entry cache and measured instruction CPU time.
// Caller must replace route/audit objects when their contents change.
export function createInstructionCache5328(compute,clock=()=>performance.now()){
 if(typeof compute!=='function'||typeof clock!=='function')throw new TypeError('Invalid instruction cache dependencies');
 let entry=null,computations=0,hits=0,resets=0,timed=0,totalMs=0,maxMs=0;
 const clear=()=>{if(entry){entry=null;resets++;}};
 function update(route,audit,player){
  const x=player?.x,y=player?.y;
  if(route?.status!=='ready'||audit?.valid!==true||!Number.isFinite(x)||!Number.isFinite(y)){
   clear();return null;
  }
  if(entry&&entry.route===route&&entry.audit===audit&&entry.x===x&&entry.y===y){
   hits++;return entry.value;
  }
  clear();
  const start=clock(),value=compute(route,audit,{x,y}),duration=clock()-start;
  computations++;
  if(Number.isFinite(duration)&&duration>=0){timed++;totalMs+=duration;maxMs=Math.max(maxMs,duration);}
  entry={route,audit,x,y,value:value==null?null:Object.freeze({...value})};
  return entry.value;
 }
 return {update,clear,stats:()=>({computations,hits,resets,timed,totalMs,maxMs,meanMs:timed?totalMs/timed:0,retainedEntries:entry?1:0})};
}
