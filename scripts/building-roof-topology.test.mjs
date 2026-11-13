import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planBuildingRoofTopology} from './building-roof-topology.js';
const p=(x,z)=>({x,z});
const rectangle=[p(0,0),p(12,0),p(12,8),p(0,8)];
const L=[p(0,0),p(12,0),p(12,4),p(6,4),p(6,10),p(0,10)];
const T=[p(0,0),p(14,0),p(14,4),p(9,4),p(9,12),p(5,12),p(5,4),p(0,4)];
const U=[p(0,0),p(14,0),p(14,12),p(10,12),p(10,4),p(4,4),p(4,12),p(0,12)];
for(const [name,polygon,expected,area] of [
 ['rectangle',rectangle,1,96],['L',L,2,84],
 ['T',T,2,88],['U',U,3,120]
]){
 for(const ring of [polygon,[...polygon].reverse(),[...polygon,polygon[0]]]){
  const model=planBuildingRoofTopology(ring);
  assert.equal(model.ok,true,name);
  assert.equal(model.partitionable,true,name+' must tile');
  assert.equal(model.volumeCount,expected,name+' mass count');
  assert(Math.abs(model.originalArea-area)<1e-5,name+' original area');
  assert(model.relativeAreaError<1e-7,name+' complete coverage');
  assert.equal(model.edges.length,polygon.length,name+' original wall edges');
  assert.equal(model.documentedPassages,0);
  assert(model.edges.every(e=>e.policy==='exterior-wall'));
  assert(model.geometryOnly&&!model.topologyApproved,
   'A rectangle or concave OSM shape never certifies an actual roof style');
  assert(model.volumes.every(v=>v.proposedRoofKind===null));
  assert(model.junctions.length>=expected-1,name+' shared roof mass seams');
  const areaSum=model.volumes.reduce((n,v)=>n+v.area,0);
  assert(Math.abs(areaSum-area)<1e-5,name+' disjoint rectangle union');
 }
}
const rotate=pt=>{
 const a=.53,c=Math.cos(a),s=Math.sin(a);
 return {x:200+c*pt.x-s*pt.z,z:75+s*pt.x+c*pt.z}
};
for(const polygon of [rectangle,L,T,U]){
 const model=planBuildingRoofTopology(polygon.map(rotate));
 assert(model.ok&&model.partitionable);
 assert.equal(model.relativeAreaError<1e-6,true,'Rotated topology must be area-safe');
}
const notPass=planBuildingRoofTopology(U);
assert.equal(notPass.documentedPassages,0,
 'A U-shaped notch is exterior, NOT automatically an open public passage');
assert(notPass.edges.some(e=>e.concaveAdjacent));
const checked=planBuildingRoofTopology(U,{passages:[
 {edgeIndex:4,type:'passage',source:'https://commons.wikimedia.org/wiki/SomeEvidence'}
]});
assert.equal(checked.documentedPassages,1);
assert.equal(checked.edges[4].policy,'documented-passage');
assert(checked.edges.filter(x=>x.policy==='exterior-wall').length===U.length-1);
const unknownPass=planBuildingRoofTopology(U,{passages:[{edgeIndex:4,type:'passage'}]});
assert(!unknownPass.ok&&unknownPass.reason==='invalid-passage-evidence');
assert(!planBuildingRoofTopology(U,{passages:[{edgeIndex:77,type:'passage',source:'https://example.com/'}]}).ok);
const changed=[p(0,0),p(12,0),p(11,8),p(0,8)];
const skew=planBuildingRoofTopology(changed);
assert(skew.ok&&!skew.partitionable&&skew.geometryOnly,
 'A distorted OSM quadrilateral must be safely rejected, never forced into a fake rectangle');
const bow=[p(0,0),p(10,10),p(10,0),p(0,10)];
assert(!planBuildingRoofTopology(bow).ok,'Self-intersections are invalid');
const profile={
 approved:true,source:'https://commons.wikimedia.org/wiki/File:Verified.jpg',
 parts:[{id:'mass-1',kind:'hip',rise:1.8},
  {id:'mass-2',kind:'gable',rise:1.4}],
 joins:[{from:'mass-1',to:'mass-2',kind:'valley'}]
};
const approved=planBuildingRoofTopology(L,{roofProfile:profile});
assert(approved.ok&&approved.partitionable&&approved.topologyApproved);
assert(approved.needsMeshAssembly);
assert.deepEqual(approved.volumes.map(v=>v.proposedRoofKind),['hip','gable']);
assert.equal(approved.junctions[0].approvedConnection,'valley');
const incomplete=planBuildingRoofTopology(L,{roofProfile:{...profile,joins:[]}});
assert(!incomplete.topologyApproved&&incomplete.geometryOnly);
assert.equal(incomplete.missingJunctionPlans,1);
assert.equal(incomplete.junctions[0].approvedConnection,null);
const invalidJoin=planBuildingRoofTopology(L,{roofProfile:{
 ...profile,joins:[{from:'mass-1',to:'mass-2',kind:'imaginary'}]
}});
assert(!invalidJoin.topologyApproved);
const wrongMasses=planBuildingRoofTopology(L,{roofProfile:{
 ...profile,parts:[{id:'mass-2',kind:'hip',rise:1.8},
  {id:'mass-1',kind:'gable',rise:1.4}]
}});
assert(!wrongMasses.topologyApproved,'Do not swap two unique photographed roof masses');
const unapproved=planBuildingRoofTopology(L,{roofProfile:{...profile,approved:false}});
assert(!unapproved.topologyApproved,'Unreviewed metadata is not trusted');
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const buildings=osm.elements.filter(x=>x.tags?.building&&x.geometry?.length>=3);
assert.equal(buildings.length,684);
const longitudeMetres=111320*Math.cos(50.226*Math.PI/180);
const summary={audited:0,partitionable:0,complexPartitionable:0,
 needsNonOrthogonalReview:0,reentrantEdges:0,generatedImaginaryPassages:0};
for(const b of buildings){
 const ring=b.geometry.map(g=>({x:(g.lon-14.889)*longitudeMetres,
  z:-(g.lat-50.226)*111320}));
 const result=planBuildingRoofTopology(ring);
 summary.audited++;
 if(result.partitionable){
  summary.partitionable++;
  if(result.volumeCount>1)summary.complexPartitionable++;
  assert(result.relativeAreaError<.02);
  assert(result.volumes.every(v=>v.proposedRoofKind===null));
 }else summary.needsNonOrthogonalReview++;
 if(result.ok){
  summary.reentrantEdges+=result.edges.filter(e=>e.concaveAdjacent).length;
  summary.generatedImaginaryPassages+=result.documentedPassages;
 }
}
assert(summary.partitionable>100,'Real city contains many orthogonal roof candidates');
assert(summary.needsNonOrthogonalReview>0,
 'No building should be blindly flattened if its OSM perimeter is skewed');
assert.equal(summary.generatedImaginaryPassages,0);
console.log('Roof System 3.0: rectangular, L/T/U, rotated, reversed, explicit passage, evidence review PASS');
console.log(JSON.stringify(summary,null,2));
