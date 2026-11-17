// Regression coverage for the 5.91 neighborhood-ahead region loader.
// Uses the real implementation extracted from index.html, with mocked
// requests; no network, screenshots or fabricated mapping data are required.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const begin=html.indexOf('let cityAreaAhead=null;');
const end=html.indexOf('async function rpLoadCityArea(id){',begin);
assert(begin>0&&end>begin,'Find the actual deployed prefetch implementation');
const source=html.slice(begin,end);
const streaming=html.slice(html.indexOf('function maybeStreamCityAreas(){'),
 html.indexOf('async function fetchMiloviceOSM(){'));
assert(streaming.includes('cityAreaAhead.id!==ahead.r.id'),
 'Turning away must discard speculative city assets');
assert(streaming.includes('OSM_VIEW+520'),
 'Warm-up must begin outside the normal region loading boundary');
assert(streaming.includes('OSM_VIEW+240'),
 'Do not narrow existing visible-region loading safety margin');

const requests=[];
let rejectNext=false;
const fakeFetch=async url=>{
 requests.push(url);
 if(rejectNext)return {ok:false,status:503};
 const terrain=url.includes('terrain-');
 return {ok:true,json:async()=>terrain?
  {nx:2,nz:2,values:[1,2,3,4],source:'ČÚZK DMR 4G'}:
  {elements:Array.from({length:12},(_,id)=>({id}))}};
};
const ctx=createContext({
 fetch:fakeFetch,window:{},loadedCityAreas:new Set(),loadingCityAreas:new Set(),
 Promise,Set,Array,Error,String
});
runInContext(source+`
globalThis.testPrefetch={
 warm:rpWarmCityArea,
 read:rpReadCityAreaData,
 ahead:()=>cityAreaAhead,
 clear:()=>{cityAreaAhead=null}
};`,ctx);
const a={id:'mlada',file:'mlada.json',terrain:'terrain-mlada.json'};
ctx.testPrefetch.warm(a);
ctx.testPrefetch.warm(a);
assert.equal(requests.length,2,'Repeated checks must not download OSM/DEM twice');
const ticket=ctx.testPrefetch.ahead();
assert.equal(ticket.id,'mlada');
const payload=await ticket.promise;
assert.equal(payload.osm.elements.length,12);
assert.equal(payload.dem.values.length,4);
await Promise.resolve();
assert.equal(ticket.ready,true,'Downloaded region becomes warm before hand-off');
assert.equal(ctx.window.__miloviceAreaPrefetch.state,'ready');
assert.equal(requests[0].includes('mlada.json'),true);
assert.equal(requests[1].includes('terrain-mlada.json'),true);

ctx.loadedCityAreas.add('loaded');
ctx.testPrefetch.warm({id:'loaded',file:'other.json',terrain:'terrain-other.json'});
assert.equal(ctx.testPrefetch.ahead(),ticket,'Do not prefetch loaded districts');
ctx.testPrefetch.clear();
ctx.loadingCityAreas.add('loading');
ctx.testPrefetch.warm({id:'loading',file:'other.json',terrain:'terrain-other.json'});
assert.equal(ctx.testPrefetch.ahead(),null,'Do not race a district currently loading');
ctx.loadingCityAreas.clear();

rejectNext=true;
const bad={id:'unavailable',file:'missing.json',terrain:'terrain-missing.json'};
ctx.testPrefetch.warm(bad);
const pending=ctx.testPrefetch.ahead().promise;
await assert.rejects(pending,/OSM HTTP 503/);
await Promise.resolve();
assert.equal(ctx.testPrefetch.ahead(),null,
 'Failed speculative download must release retained memory for a later retry');
assert.equal(ctx.window.__miloviceAreaPrefetch.state,'failed');
console.log('PASS city region prefetch: one OSM/DEM pair, reuse, bounds and recovery');
