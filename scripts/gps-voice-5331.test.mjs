import assert from 'node:assert/strict';
import {createGpsVoice5331 as create,gpsVoiceText5331 as phrase} from './gps-voice-5331.js';
assert.equal(phrase('right',81),'Za 80 metrů: odboč doprava.');
assert.equal(phrase('left',3),'Nyní: odboč doleva.');
assert.equal(phrase('arrival'),'Dosažena blízkost cíle.');
assert.equal(phrase('reverse',20),'Za 20 metrů: změna směru trasy.');
assert.equal(phrase('bad',20),null);assert.equal(phrase('left',NaN),null);
class U{constructor(text){this.text=text;}}
let voices=[{lang:'cs-CZ',localService:false},{lang:'en-US',localService:true}],spoken=[],cancelled=0;
const synth={getVoices:()=>voices,speak:u=>spoken.push(u),cancel:()=>cancelled++,speaking:false,pending:false};
const v=create(synth,U);assert.equal(v.play('left',20),'fallback');assert.equal(spoken.length,0);
voices.push({lang:'cs-CZ',localService:true});
assert.equal(v.play('right',20),'spoken');assert.equal(spoken[0].voice,voices[2]);assert.equal(v.play('left',20),'busy');
spoken[0].onend();assert.equal(v.play('arrival'),'spoken');v.cancel();assert.equal(cancelled,1);
spoken[1].onend();assert.equal(v.stats().busy,false);
synth.speaking=true;assert.equal(v.play('left',20),'busy');v.cancel();assert.equal(cancelled,1);
synth.speaking=false;assert.equal(v.play('left',20),'spoken');spoken[2].onerror({error:'test'});assert.equal(v.stats().error,'test');
assert.equal(v.stats().count,3);assert.equal(create(null,null).play('arrival'),'fallback');
console.log('PASS 5.331 local Czech voice, phrases, fallback, busy and cancellation');
