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
 roofColor:'#7b413b',roofKind:'gable',windowsPerWall:4,facades:{},
 source:normal.source,notes:normal.notes
});
const local=loadLocalArchitectureCards({getItem:k=>k===STREET_STORAGE_KEY?JSON.stringify({'118487963':normal}):null});
assert.equal(local.size,1);
assert.equal(loadLocalArchitectureCards({getItem:()=>'{broken'}).size,0);
assert.equal(normalizeArchitectureCards({}).size,0);
const verifiedSide={
 stage:'verified',source:'',notes:'',
 facades:{N:{status:'seen',source:'https://commons.wikimedia.org/wiki/Example',
  notes:'two windows and one door on north side',
  layout:{rows:'2,3',doorAt:'left',windowWidth:'1.15',wallColor:'#a99887'}},
  S:{status:'unreviewed',source:'https://commons.wikimedia.org/',notes:'draft',
   layout:{rows:'12'}},
  E:{status:'seen',source:'javascript:alert(1)',notes:'not trusted',
   layout:{rows:'3'}}
 }};
const sideCards=normalizeArchitectureCards({'118487971':verifiedSide});
assert.equal(sideCards.size,1,'individual verified facade may be modeled without global facade info');
assert.deepEqual(sideCards.get('118487971').facades.N.rows,[2,3]);
assert.equal(Object.keys(sideCards.get('118487971').facades).length,1,'unreviewed/unsafe faces never enter geometry');
assert(!normalizeArchitectureCards({'118487971':{...verifiedSide,stage:'modeling'}}).size,
 'unapproved local house must not be rendered');
console.log('Street architecture input validation OK: evidence, dimensions, safe enums, colours and local persistence');
