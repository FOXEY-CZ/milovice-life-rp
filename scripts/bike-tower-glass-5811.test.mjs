// Milovice RP 5.81.1: visually lighter glass and SILVER support from the
// user's 17 May 2022 panorama and independent 30 May 2024 ŠJů photograph.
// Critically: no new street furniture, no moved road/sidewalk, no new tower.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planBikeTowerSteelwork} from './bike-tower-interior.js';
import {planUpperBiketowerSign} from './bike-tower-photo-sign.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const interior=readFileSync(new URL('bike-tower-interior.js',import.meta.url),'utf8');
assert(html.includes("const BUILD_ID='20261115-photo-2023-two-paved-parking-banks-58114'"));
const begin=html.indexOf('function miloviceBikeTower(pts,base){');
const end=html.indexOf('// 5.1.2',begin);
assert(begin>0&&end>begin);
const tower=html.slice(begin,end);
assert(tower.includes('const visibleHeight=11.4,segments=16;'));
assert(tower.includes('rad=Math.max(3.2,Math.min(4.1,rad));'));
assert(tower.includes("color:0x9aabad,metalness:.35,roughness:.56"));
assert(tower.includes("color:0x3e4b50,metalness:.42,roughness:.62"));
assert(tower.includes("new THREE.MeshStandardMaterial({color:0xc4dce1,metalness:.05,roughness:.27,transparent:true,opacity:.20,side:THREE.DoubleSide,depthWrite:false})"));
assert(tower.includes("color:0x8c9c9f,roughness:.76,metalness:.22"));
assert(interior.includes('new THREE.MeshLambertMaterial({color:0xa5b3b5})'));
assert(tower.includes("glassAppearancePass:'5811-silver-2022-2024-photo'"));
assert(tower.includes('towerGlazingOpacity:.20,photoGeometryUnchanged:true'));
assert(tower.includes('externalFootprintUnchanged:true,preciseBeamMeasurements:false'));
assert(tower.includes('addedStreetFurniture:0'));
assert(tower.includes("miloviceBikeTower(pts,baseHeight)===null")===false);
assert(html.includes("miloviceBikeTower(pts,baseHeight)"));
assert(html.includes("stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})"));
assert(html.includes("stationPhotoForecourt.create(elements)"));
assert(html.includes("stationTicketMachines.create(elements)"));
assert(html.includes("if(active&&osmReady&&!rpAuditCameraWorld)rpShowSpawnPicker()"));
assert(html.includes("from './scripts/bike-tower-photo-sign.js?v=5810'"));
const plan=planBikeTowerSteelwork({radius:3.8,height:11.4,wayId:1011197691});
assert.equal(plan.valid,true);
assert.equal(plan.beams.length,52);
assert.equal(plan.renderBudget,1);
assert(plan.beams.every(b=>[b.a,b.b].every(p=>Math.hypot(p.x,p.z)<3.8)));
assert.equal(planUpperBiketowerSign({radius:3.8,height:11.4,nx:1,nz:0}).drawCalls,1);
console.log('5.81.1 silver Bike Tower photo appearance PASS: old geometry and parking unchanged, 52 steelwork beams, one sign draw call');
