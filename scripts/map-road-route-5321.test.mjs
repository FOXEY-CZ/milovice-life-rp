import assert from 'node:assert/strict';
import {routePublicRoads5321 as route} from './map-road-route-5321.js';
const pt=(x,y)=>({x,y});
const key=p=>Math.round(p.x*3)+','+Math.round(p.y*3);
const a=pt(0,0),b=pt(100,0),c=pt(100,100),d=pt(0,100);
const seg=(a,b,oneway,osmId)=>({a,b,len:Math.hypot(b.x-a.x,b.y-a.y),oneway,osmId});
const s=[seg(a,b,1,1),seg(b,c,1,2),seg(c,d,1,3),seg(d,a,1,4)];
function graph(segments){const g=new Map();for(const e of segments)for(const direction of [1,-1]){
 if(direction===1&&e.oneway===-1||direction===-1&&e.oneway===1)continue;
 const k=key(direction===1?e.a:e.b);if(!g.has(k))g.set(k,[]);g.get(k).push({segment:e,direction});
 }return g;}
const g=graph(s);
let r=route(s,g,pt(20,0),pt(80,0));assert.equal(r.status,'ready');assert.equal(r.distanceMetres,60);assert.equal(r.legs.length,1);
r=route(s,g,pt(80,0),pt(20,0));assert.equal(r.status,'ready');assert.equal(r.distanceMetres,340);assert.deepEqual(r.legs.map(x=>x.osmId),['1','2','3','4','1']);
assert.equal(route([s[0]],graph([s[0]]),pt(80,0),pt(20,0)).status,'no-route');
r=route(s,g,pt(20,5),pt(105,80));assert.equal(r.status,'ready');assert.equal(r.distanceMetres,160);assert.equal(r.startOffset,5);assert.equal(r.targetOffset,5);
assert.equal(r.newLinks,0);assert.equal(r.entranceVerified,false);
assert.equal(route(s,g,pt(-100,0),b).status,'off-road');
assert.equal(route(s,g,a,pt(1000,1000)).status,'destination-off-road');
const disconnected=[s[0],seg(pt(300,0),pt(400,0),0,5)];
assert.equal(route(disconnected,graph(disconnected),pt(20,0),pt(350,0)).status,'no-route');
assert.equal(route(s,g,null,b),null);
const reverse=[seg(a,b,-1,9)];
assert.equal(route(reverse,graph(reverse),pt(80,0),pt(20,0)).distanceMetres,60);
assert.equal(route(reverse,graph(reverse),pt(20,0),pt(80,0)).status,'no-route');
console.log('PASS 5.321 directed roads, partial segments, no invented links or wrong-way shortcuts');
