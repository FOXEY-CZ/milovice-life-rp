// Milovice RP 5.13 — reviewed architecture shared by all visitors.
// Unreviewed editor drafts are NEVER copied to the public database. A reviewed
// repo JSON file is the only globally published source of building revisions.
import {normalizeArchitectureCards} from './street-architecture.js';

export const APPROVED_ARCHITECTURE_SCHEMA='milovice-rp-approved-buildings-v1';
export const PUBLIC_ARCHITECTURE_URL='./data/architecture/verified-buildings.json?v=5130';
const fields=['floors','height','facadeColor','roofColor','roofKind','windowsPerWall'];
export function parseApprovedArchitectureManifest(raw){
 if(!raw||typeof raw!=='object'||raw.schema!==APPROVED_ARCHITECTURE_SCHEMA||
    !raw.buildings||typeof raw.buildings!=='object'||Array.isArray(raw.buildings))
  throw Error('Wrong verified city architecture manifest format');
 const all=new Map();
 for(const [id,entry] of Object.entries(raw.buildings)){
  if(!/^[1-9]\d{0,18}$/.test(id)||!entry||typeof entry!=='object')
   throw Error('Invalid OSM way ID in approved architecture');
  const approval=entry.review;
  if(approval?.approved!==true||
    typeof approval.reviewer!=='string'||approval.reviewer.trim().length<2||
    typeof approval.summary!=='string'||approval.summary.trim().length<12||
    !Number.isFinite(Date.parse(approval.reviewedAt))||
    typeof approval.reviewedAt!=='string'||!/^20\d{2}-\d\d-\d\dT/.test(approval.reviewedAt))
   throw Error('Shared building '+id+' lacks a documented manual review');
  const card=normalizeArchitectureCards({[id]:entry}).get(id);
  if(!card)throw Error('Shared building '+id+' has no validated geometry and evidence');
  all.set(id,card);
 }
 return all;
}
export async function loadApprovedArchitecture({fetcher=fetch,url=PUBLIC_ARCHITECTURE_URL}={}){
 try{
  const response=await fetcher(url,{cache:'no-store'});
  if(!response.ok)throw Error('Architecture manifest HTTP '+response.status);
  const json=await response.json();
  return {cards:parseApprovedArchitectureManifest(json),error:null};
 }catch(error){
  // Never prevent loading the game because a network/manifest error occurred.
  return {cards:new Map(),error:String(error?.message||error)};
 }
}
// Combine published geometry with the current browser's local verified edits.
// Local edits are temporary preview overlays and never mutate the public JSON.
// A local partial facade edit must not erase published data for other faces.
export function mergeApprovedWithLocal(published,local){
 const cards=new Map(published),sources=new Map([...published.keys()].map(id=>[id,'published']));
 for(const [id,override] of local){
  const base=cards.get(id);
  if(!base){cards.set(id,override);sources.set(id,'local');continue}
  const merged={...base,facades:{...(base.facades||{}),...(override.facades||{})}};
  for(const field of fields)if(override[field]!==null&&override[field]!==undefined)
   merged[field]=override[field];
  for(const field of ['source','notes'])if(override[field])merged[field]=override[field];
  cards.set(id,merged);sources.set(id,'published+local');
 }
 return {cards,sources,publishedCount:published.size,localCount:local.size,
  localOnly:[...local.keys()].filter(k=>!published.has(k)).length};
}
export function prepareReviewBatch(exportData){
 if(!exportData||exportData.schema!=='milovice-rp-street-architecture-v1'||
    !exportData.buildings||typeof exportData.buildings!=='object')
  throw Error('This is not a Street Editor architecture export');
 const verified=normalizeArchitectureCards(exportData.buildings);
 const proposed={};
 for(const [id] of verified)proposed[id]=exportData.buildings[id];
 return {schema:'milovice-rp-architecture-review-batch-v1',
  exportedAt:new Date().toISOString(),reviewRequired:true,
  description:'Unreviewed proposal. NOT a production city manifest. Inspect sources before merging.',
  buildings:proposed};
}
