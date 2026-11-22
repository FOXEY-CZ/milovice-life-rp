import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inspectItalskaBodyPair5260 as inspect,
 ITALSKA_BODY_ENVELOPE_5260 as C} from './osm-italska-body-envelope-5260.js';

const car=(id,x,z,heading=0,type=0,length=4.45)=>({
 id,italskaEncounter5259:true,driven:false,parked:false,
 service:null,type,carLength5257:length,
 g:{position:{x,z},rotation:{y:heading}}
});
const lead=car(1,0,0,0,0,4.45);
const separated=inspect(lead,car(2,0,4.9,0,1,4.15));
assert.equal(separated.ready,true);
assert(!separated.bodyOverlap);
assert(!separated.bufferedOverlap);
assert(Math.abs(separated.centerDistanceMetres-4.9)<1e-9);
assert(Math.abs(separated.bodyGapMetres-(4.9-(4.45+4.15)/2-.08))<1e-6);
assert(separated.bufferedGapMetres<separated.bodyGapMetres);
assert.equal(separated.trueMeshPenetrationVerified,false);
assert.equal(separated.sweptBetweenFramesVerified,false);
const overlapping=inspect(lead,car(2,0,4,0,1,4.15));
assert(overlapping.bodyOverlap,'Longitudinal bumpers intersect even if centers are 4m apart');
assert(overlapping.bodyGapMetres<-.3);
assert(overlapping.bufferedOverlap);
const touching=inspect(lead,car(2,0,4.38,0,1,4.15));
assert(Math.abs(touching.bodyGapMetres)<.00001);
assert(touching.bufferedOverlap,'10cm clearance must catch a touching pair');
const perpendicular=inspect(lead,car(2,4.5,0,Math.PI/2,1,4.15));
assert(perpendicular.bodyGapMetres>0,'Perpendicular lane arms are measured by heading');
const crossing=inspect(lead,car(2,0,0,Math.PI/2,1,4.15));
assert(crossing.bodyOverlap);
const diagonal=inspect(lead,car(2,5,5,Math.PI/4,1,4.15));
assert(diagonal.bodyGapMetres>0);
assert(!inspect(lead,car(2,0,4,NaN,1)).ready);
const bus=car(3,0,4,0,7);bus.service='432';
assert(!inspect(lead,bus).ready,'Do not claim long-bus procedural bounds');
const unrelated=car(3,0,4);unrelated.italskaEncounter5259=false;
assert(!inspect(lead,unrelated).ready,'Only the opt-in mapped pair may be audited');
const translated=inspect(car(1,200000,-300000,0,0,4.45),
 car(2,200000,-300000+4.9,0,1,4.15));
assert(Math.abs(translated.bodyGapMetres-separated.bodyGapMetres)<1e-8);
assert.equal(C.bumperAllowanceMetres,.08);
assert.equal(C.extraBufferMetres,.10);
assert(C.mirrorWidthStandardMetres>2.08&&C.mirrorWidthStandardMetres<2.09);

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const models=readFileSync(new URL('./world-models.js',import.meta.url),'utf8');
for(const token of [
 'osm-italska-body-envelope-5260.js?v=526000',
 'inspectItalskaBodyPair5260(lead,follow)',
 'window.__miloviceItalskaBodyEnvelopeRuntime5260=()=>',
 'bodyEnvelope5260:',
 'const BUILD_ID=\'20261122-rakouska-upper-windows-526400\''
])assert(html.includes(token),'Missing 5.260 live model integration: '+token);
assert(models.includes('const length=[4.45,4.15,4.75,4.28,4.62,4.86,5.08,4.34][variant]'));
assert(models.includes('side*width*.56'));
console.log('PASS 5.260: model-source mirrors, body lengths, rotated polygon gaps, overlapping bumpers and opt-in runtime only');
