import assert from 'node:assert/strict';
import {createCustomWaypoint5325 as pick} from './map-custom-waypoint-5325.js';
const old={min:-100,n:21,step:10},region={minX:200,minZ:100,nx:11,nz:11,step:10};
const gps=(x,z)=>({lat:50.226-z/111320,lng:14.889+x/(111320*Math.cos(50.226*Math.PI/180))});
assert.deepEqual(pick(gps(0,0),[old]),{name:'📍 Vlastní bod',gps:[50.226,14.889],custom:true,entranceVerified:false});
assert.equal(pick(gps(250,150),[null,old,region])?.custom,true);
for(const p of [null,{},gps(150,0),gps(10000,0),{lat:NaN,lng:14.889},{lat:50.226,lng:Infinity},{lat:91,lng:14.889}])assert.equal(pick(p,[old,region]),null);
assert.equal(pick(gps(0,0),[]),null);
console.log('PASS 5.325 custom waypoint loaded terrain and invalid coordinates');
