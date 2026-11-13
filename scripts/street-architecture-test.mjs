import assert from 'node:assert/strict';
import {normalizeArchitectureCards,loadLocalArchitectureCards,STREET_STORAGE_KEY} from './street-architecture.js';
const normal={stage:'verified',source:'https://commons.wikimedia.org/wiki/Test',notes:'Measured from licensed photographs',
 floors:'2',height:'7.2',facadeColor:'#AABBCC',roofColor:'#7b413b',roofKind:'gable',windowsPerWall:'4'};
const cards=normalizeArchitectureCards({
 118487963:normal,
 118487966:{...normal,stage:'modeling'},
 118487965:{...normal,source:'javascript:alert(1)'},
 118487977:{...normal,notes:''},
  bad:{...normal},
  118487980:{...normal,facadeColor:'red',height:'9000',floors:'-1',roofKind:'fantasy',windowsPerWall:'100',roofColor:'#12345z'}
});
assert.equal(cards.size,1);
assert.deepEqual(cards.get('118487963'),{
 id:'118487963',stage:'verified',floors:2,height:7.2,facadeColor:'#aabbcc',
 roofColor:'#7b413b',roofKind:'gable',windowsPerWall:4,
 source:normal.source,notes:normal.notes
});
const local=loadLocalArchitectureCards({getItem:k=>k===STREET_STORAGE_KEY?JSON.stringify({'118487963':normal}):null});
assert.equal(local.size,1);
assert.equal(loadLocalArchitectureCards({getItem:()=>'{broken'}).size,0);
assert.equal(normalizeArchitectureCards({}).size,0);
console.log('Street architecture input validation OK: evidence, dimensions, safe enums, colours and local persistence');
