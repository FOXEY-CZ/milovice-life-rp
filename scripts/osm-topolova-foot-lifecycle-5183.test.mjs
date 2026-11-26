import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const spawnStart=html.indexOf('async function rpSelectSpawn(kind){');
const spawnEnd=html.indexOf('function rpJobStops(){',spawnStart);
const resetStart=html.indexOf('function reset(){');
const resetEnd=html.indexOf('function updateUI(){',resetStart);
const begin=html.indexOf('function rpStartTopolovaFootJob5179(){');
const marker=html.indexOf('window.__miloviceTopolovaFootJobLifecycle5183=()=>');
assert(spawnStart>=0&&spawnEnd>spawnStart);
assert(resetStart>=0&&resetEnd>resetStart);
assert(begin>=0&&marker>begin);
const spawn=html.slice(spawnStart,spawnEnd);
const reset=html.slice(resetStart,resetEnd);
assert.match(spawn,/rpCloseOverlays\(\);rpClearGameplayStops\(\);open=false;speed=0;cam=0;busJob=null;\s*\/\/ 5\.183:[^\n]+\n topolovaFootJob5179=null;topolovaFootBeacon5188\?\.update\(null,elapsed\);pass=0;/);
assert.match(reset,/busJob=null;topolovaFootJob5179=null;topolovaFootBeacon5188\?\.update\(null,elapsed\);walkCam=0;/);
assert(spawn.indexOf('topolovaFootJob5179=null;')<
 spawn.indexOf('if(kind===\'walking\')'));
assert(reset.indexOf('topolovaFootJob5179=null;')<
 reset.indexOf('updateUI();'));
assert.match(html,/resetCancelsWithoutReward:true,spawnCancelsWithoutReward:true/);
// Completion remains the only place where a foot-job reward is credited.
assert.equal(html.split('money+=job.rewardCZK;').length-1,1);
assert.equal((spawn.match(/money\s*[+]=/g)||[]).length,0);
assert.equal((reset.match(/money\s*[+]=/g)||[]).length,0);
console.log('PASS 5.183: reset and district/vehicle spawn cancel active pedestrian mission without a payout');

const jobStart=html.slice(begin,html.indexOf('function rpEndTopolovaFootJob5179(){',begin));
assert.ok(jobStart.includes("streetDisplayName('Topolová')"),'Use fictional street label in player mission message');
assert.doesNotMatch(jobStart,/chodníku Topolové/);
console.log('PASS fictional pedestrian delivery start label');
