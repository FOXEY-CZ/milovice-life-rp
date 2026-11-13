import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseApprovedArchitectureManifest,loadApprovedArchitecture,mergeApprovedWithLocal,
 prepareReviewBatch,APPROVED_ARCHITECTURE_SCHEMA} from './architecture-manifest.js';
import {normalizeArchitectureCards} from './street-architecture.js';
const exported={schema:'milovice-rp-street-architecture-v1',buildings:{
 '118487963':{stage:'verified',source:'https://commons.wikimedia.org/wiki/File%3AExample.jpg',
  notes:'Confirmed the physical building dimensions from a licensed source.',
  floors:'2',height:'6.9',facadeColor:'#cdc5b6',roofKind:'gable'},
 '118487980':{stage:'modeling',source:'https://commons.wikimedia.org/',notes:'unverified',floors:'1'}
}};
const batch=prepareReviewBatch(exported);
assert.equal(batch.schema,'milovice-rp-architecture-review-batch-v1');
assert.equal(batch.reviewRequired,true);
assert.deepEqual(Object.keys(batch.buildings),['118487963']);
assert(!batch.buildings['118487963'].review,'Editor export does not self-approve sources');
const card={...batch.buildings['118487963'],review:{
 approved:true,reviewer:'Architectural reviewer',summary:'Checked photographs, OSM identity and storey dimensions',
 reviewedAt:'2026-11-13T10:00:00Z'}};
const manifest={schema:APPROVED_ARCHITECTURE_SCHEMA,buildings:{'118487963':card}};
const approved=parseApprovedArchitectureManifest(manifest);
assert.equal(approved.size,1);
assert.equal(approved.get('118487963').height,6.9);
assert.throws(()=>parseApprovedArchitectureManifest({...manifest,buildings:{'118487963':{...card,review:null}}}),/review/);
assert.throws(()=>parseApprovedArchitectureManifest({...manifest,buildings:{'118487963':{...card,source:'javascript:alert(1)',review:card.review}}}),/validated/);
const local=normalizeArchitectureCards({'118487963':{
 stage:'verified',notes:'New local front facade, based on second licensed image',source:'https://commons.wikimedia.org/wiki/File%3AAnother.jpg',
 facadeColor:'#fcf3e1',facades:{S:{status:'seen',source:'https://commons.wikimedia.org/wiki/File%3AAnother.jpg',
  notes:'A second viewpoint confirms two windows',layout:{rows:'2,3',doorAt:'left'}}}
},'118487966':{...card,facadeColor:'#aaaaaa'}});
const merged=mergeApprovedWithLocal(approved,local);
assert.equal(merged.publishedCount,1);
assert.equal(merged.localCount,2);
assert.equal(merged.localOnly,1);
assert.equal(merged.cards.get('118487963').height,6.9,'local partial card cannot erase published height');
assert.equal(merged.cards.get('118487963').facadeColor,'#fcf3e1');
assert.deepEqual(merged.cards.get('118487963').facades.S.rows,[2,3]);
assert.equal(merged.sources.get('118487963'),'published+local');
assert.equal(merged.sources.get('118487966'),'local');
const loaded=await loadApprovedArchitecture({fetcher:async()=>({ok:true,json:async()=>manifest})});
assert.equal(loaded.cards.size,1);
assert.equal((await loadApprovedArchitecture({fetcher:async()=>{throw Error('offline')}})).cards.size,0);
const actual=JSON.parse(readFileSync('data/architecture/verified-buildings.json','utf8'));
assert.equal(actual.schema,APPROVED_ARCHITECTURE_SCHEMA);
const actualReviewed=parseApprovedArchitectureManifest(actual);
const availableIds=new Set();
for(const file of ['data/milovice-osm.json','data/regions/mlada.json',
 'data/regions/benatecka-vrutice.json','data/regions/bozi-dar.json']){
 try{
  const data=JSON.parse(readFileSync(file,'utf8'));
  for(const way of data.elements||[])if(way.tags?.building)availableIds.add(String(way.id));
 }catch(err){if(err.code!=='ENOENT')throw err}
}
for(const id of actualReviewed.keys())assert(availableIds.has(id),'Approved OSM building does not exist: '+id);
console.log('Published architecture manifest OK:',actualReviewed.size,
 'real reviewed buildings; partial local overlays, review batch and unavailable-network fallback verified');
