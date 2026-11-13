// Milovice RP 5.10: deterministic facade-to-geometry contract.
// Nothing is inferred from external photographs. Only explicitly verified
// numeric details for an individually documented side can change the model.
const DIRECTIONS=['N','E','S','W'];
const HEX=/^#[0-9a-f]{6}$/i;
const allowed=(s)=>{try{const v=new URL(s);return ['http:','https:'].includes(v.protocol)&&!!v.hostname}catch{return false}};
const number=(v,min,max)=>{
 if(v===null||v===undefined||String(v).trim()==='')return null;
 const n=Number(v);
 return Number.isFinite(n)&&n>=min&&n<=max?n:null;
};
export function normalizeFacadeLayout(raw){
 if(!raw||typeof raw!=='object'||raw.status!=='seen'||
   typeof raw.source!=='string'||raw.source.length>2048||!allowed(raw.source)||
   typeof raw.notes!=='string'||!raw.notes.trim())return null;
 const v=raw.layout;
 if(!v||typeof v!=='object')return null;
 // Explicit floor-by-floor visible window counts. "0" means no windows.
 // Reject incomplete/ambiguous content rather than silently interpolating.
 let rows=null;
 if(typeof v.rows==='string'&&v.rows.trim()){
  const parts=v.rows.split(',').map(x=>x.trim());
  if(parts.length>6||parts.some(p=>!/^\d{1,2}$/.test(p)))return null;
  const ns=parts.map(Number);
  if(ns.some(n=>n>12))return null;
  rows=ns;
 }
 const windowWidth=number(v.windowWidth,.4,2.8);
 const windowHeight=number(v.windowHeight,.45,2.6);
 const doorWidth=number(v.doorWidth,.72,2.4);
 const doorAt=['auto','none','left','center','right'].includes(v.doorAt)?v.doorAt:null;
 const wallColor=typeof v.wallColor==='string'&&HEX.test(v.wallColor)?v.wallColor.toLowerCase():null;
 const shutters=v.shutters==='yes'?true:v.shutters==='no'?false:null;
 if(rows===null&&windowWidth===null&&windowHeight===null&&doorAt===null&&doorWidth===null&&wallColor===null&&shutters===null)return null;
 return {rows,windowWidth,windowHeight,doorAt,doorWidth,wallColor,shutters,
  source:raw.source,notes:raw.notes.trim()};
}
export function normalizeVerifiedFacades(raw){
 const output={};
 if(!raw||typeof raw!=='object')return output;
 for(const direction of DIRECTIONS){
  const layout=normalizeFacadeLayout(raw[direction]);
  if(layout)output[direction]=layout;
 }
 return output;
}
// The editor and game receive OSM vertices in opposite handedness:
// editor = [latitude,longitude]; game = [east meters,south meters].
// This classifier selects the longest actual wall for each cardinal side,
// as the editor does. A short chamfer won't steal the selected facade.
export function selectFacadeEdges(points){
 if(!Array.isArray(points)||points.length<3)return new Map();
 const p=points.slice();
 const last=p.at(-1),first=p[0];
 if(Math.hypot(last.x-first.x,last.y-first.y)<.10)p.pop();
 const cx=p.reduce((v,a)=>v+a.x,0)/p.length,cz=p.reduce((v,a)=>v+a.y,0)/p.length;
 const longest=new Map();
 for(let i=0;i<p.length;i++){
  const a=p[i],b=p[(i+1)%p.length],len=Math.hypot(b.x-a.x,b.y-a.y);
  if(len<2.35)continue;
  const dx=(a.x+b.x)*.5-cx,dz=(a.y+b.y)*.5-cz;
  // x east, y south. Dominant axis matches 4-direction editor bearing.
  const id=Math.abs(dx)>=Math.abs(dz)?(dx>=0?'E':'W'):(dz>=0?'S':'N');
  if(!longest.has(id)||longest.get(id).length<len)longest.set(id,{index:i,length:len});
 }
 return new Map([...longest].map(([id,v])=>[v.index,id]));
}
export function planFaceOpenings({length,height,levels,side=null,legacyWindows=3,autoEntrance=false}={}){
 if(!Number.isFinite(length)||length<3||!Number.isFinite(height)||height<2.5)return {windows:[],door:null};
 const doorSetting=side?.doorAt;
 const hasDoor=doorSetting==='none'?false:(doorSetting&&doorSetting!=='auto'?true:autoEntrance);
 const doorWidth=Math.min(side?.doorWidth??1.21,Math.max(.76,length-1));
 const doorCenter=doorSetting==='left'?Math.max(1.0,length*.22):
  doorSetting==='right'?Math.min(length-1.0,length*.78):length*.5;
 const door=hasDoor&&length>=4.6?{x:doorCenter,y:.13,w:doorWidth,h:2.27}:null;
 const windowWidth=side?.windowWidth??1.52,windowHeight=side?.windowHeight??1.26;
 const maxLevels=Math.min(6,Math.max(1,Math.floor(levels||1)));
 const windows=[];
 for(let floor=0;floor<maxLevels;floor++){
  const bottom=.98+floor*3.05;
  if(bottom+windowHeight>=height-.34)continue;
  const count=side?.rows?(side.rows[floor]??0):legacyWindows;
  if(!Number.isInteger(count)||count<0||count>12)continue;
  for(let i=0;i<count;i++){
   const x=(i+.5)*length/count;
   const w=Math.min(windowWidth,length/count*.70);
   if(w<.4||x-w*.5<.52||x+w*.5>length-.52)continue;
   if(door&&floor===0&&Math.abs(x-door.x)<(w+door.w)*.5+.20)continue;
   windows.push({x,y:bottom,w,h:windowHeight,floor});
  }
 }
 return {windows,door};
}
