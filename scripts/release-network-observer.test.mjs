import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {observeReleaseNetwork} from './release-network-observer.mjs';
const page=new EventEmitter(),observer=observeReleaseNetwork(page);
const req=(url,previous=null,error=null)=>({url:()=>url,method:()=> 'GET',resourceType:()=> 'fetch',redirectedFrom:()=>previous,failure:()=>error?{errorText:error}:null});
const a=req('https://example.test/a'),b=req('https://example.test/b',a),c=req('https://example.test/c',null,'net::ERR_FAILED'),d=req('https://example.test/d');
for(const [r,status] of [[a,302],[b,404]]){page.emit('request',r);page.emit('response',{request:()=>r,status:()=>status});page.emit('requestfinished',r);}
page.emit('request',c);page.emit('requestfailed',c);page.emit('request',d);
const output=observer.stop();
assert.deepEqual(output.summary,{requests:4,httpErrors:1,failed:1,pending:1,redirects:1});
assert.equal(output.records[1].redirectFrom,1);
assert.equal(output.records[2].failure,'net::ERR_FAILED');
assert.equal(output.records[3].status,null);
page.emit('request',req('https://example.test/after-stop'));
assert.equal(observer.snapshot().summary.requests,4);
console.log('PASS response/redirect/failure observer self-test');
