// Milovice RP 5.8 — same-origin street editor -> game architecture bridge.
// Uses only user-authored structured geometry hints; no scraping or image inference.
export const STREET_STORAGE_KEY='milovice_rp_street_editor_v1';
export const STREET_EXPORT_SCHEMA='milovice-rp-street-architecture-v1';
const HEX=/^#[0-9a-fA-F]{6}$/;
const safeNumber=(v,min,max,integer=false)=>{
 if(v===null||v===undefined||String(v).trim()==='')return null;
 const n=Number(v);
 if(!Number.isFinite(n)||n<min||n>max||(integer&&!Number.isInteger(n)))return null;
 return n;
};
const safeColor=v=>typeof v==='string'&&HEX.test(v)?v.toLowerCase():null;
function allowedUrl(src){
 if(typeof src!=='string'||src.length>2048)return false;
 try{const url=new URL(src);return ['http:','https:'].includes(url.protocol)&&!!url.hostname}
 catch{return false}
}
export function normalizeArchitectureCards(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return new Map();
 const result=new Map();
 for(const [id,card] of Object.entries(raw)){
  if(!/^[1-9]\d{0,18}$/.test(id)||!card||typeof card!=='object')continue;
  // Local draft cards must never silently affect production-like gameplay.
  if(card.stage!=='verified'||!allowedUrl(card.source)||typeof card.notes!=='string'||!card.notes.trim())continue;
  const floors=safeNumber(card.floors,1,16,true);
  const height=safeNumber(card.height,2.5,60);
  const facadeColor=safeColor(card.facadeColor);
  const roofColor=safeColor(card.roofColor);
  const roofKind=['gable','hip','flat'].includes(card.roofKind)?card.roofKind:null;
  const windowsPerWall=safeNumber(card.windowsPerWall,1,12,true);
  // Free-text facade/window descriptions remain notes only. Geometry must be
  // driven by explicit numeric inputs, not guessed from unstructured text.
  if([floors,height,facadeColor,roofColor,roofKind,windowsPerWall].every(x=>x===null))continue;
  result.set(id,{id,stage:'verified',floors,height,facadeColor,roofColor,roofKind,windowsPerWall,
    source:card.source,notes:card.notes.trim()});
 }
 return result;
}
export function loadLocalArchitectureCards(storage){
 try{return normalizeArchitectureCards(JSON.parse(storage.getItem(STREET_STORAGE_KEY)||'{}'))}
 catch{return new Map()}
}
export function architecturePreviewDiagnostics(cards){
 return {verifiedCards:cards.size,ids:[...cards.keys()].slice(0,12)};
}
