import assert from 'node:assert/strict';
import {LANDMARK_NAMES,STREET_NAMES} from './fictional-identity.js';
export const releaseRegions=Object.freeze([
 ['old','Old Town'],['mlada','Maple Heights'],['vrutice','Westwood'],
 ['westlink','Betweenwoods'],['centerlink','Northlink'],['bozidar','Cloudridge']
]);

// Fresh page per district. Use the public spawn UI, not developer teleport hooks.
export async function runReleaseRegionScenario(page,base,id,evidence={}){
 const expected=releaseRegions.find(([key])=>key===id);
 assert.ok(expected,'Unknown release region '+id);
 evidence.region=id;evidence.steps=[];
 const step=(name,data={})=>evidence.steps.push({name,...data});
 await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__miloviceStarted===true,null,{timeout:60000});
 const select=page.locator('#rp-area-select');
 await page.locator('[data-spawn="walking"]').waitFor({state:'visible',timeout:90000});
 await page.waitForFunction(()=>document.querySelectorAll('#rp-area-select option').length>=6,null,{timeout:30000});
 const options=await select.locator('option').evaluateAll(nodes=>nodes.map(n=>[n.value,n.textContent.trim()]));
 assert.deepEqual(options,releaseRegions,'Public district labels or developer-only options changed');
 step('fictional district labels verified',{label:expected[1]});
 await select.selectOption(id);
 await page.locator('[data-spawn="walking"]').click();
 await page.waitForFunction(region=>window.__miloviceAreasLoaded?.includes(region)&&document.getElementById('rp-spawn')?.hidden&&document.getElementById('mode')?.textContent==='Pěšky',id,{timeout:90000});
 await page.waitForTimeout(6500);
 step('district loaded and walking spawn',{loaded:await page.evaluate(()=>window.__miloviceAreasLoaded)});
 await page.locator('#maplaunch').click();
 await page.locator('#osmmap .leaflet-control-attribution').waitFor({state:'visible',timeout:30000});
 assert.match(await page.locator('#osmmap .leaflet-control-attribution').innerText(),/OpenStreetMap/);
 assert.equal(await page.locator('#osmmap .leaflet-tile').count(),0);
 assert.equal(await page.locator('#mapfollow-camera').isHidden(),true);
 step('fictional map and attribution visible');
 // Compare the actual public option text and rendered map labels, not just the source registry.
 const goals=page.locator('#map-goal-5319');
 await page.waitForFunction(()=>document.querySelectorAll('#map-goal-5319 option').length===15,null,{timeout:30000});
 const goalOptions=await goals.locator('option').evaluateAll(nodes=>nodes.map(n=>({value:n.value,text:n.textContent.trim()})));
 assert.equal(goalOptions[0].value,'');
 assert.deepEqual(goalOptions.slice(1).map(o=>o.text).sort(),Object.values(LANDMARK_NAMES).sort(),'Public GPS destinations');
 assert.equal(new Set(goalOptions.map(o=>o.value)).size,15);
 const knownStreets=new Set(Object.values(STREET_NAMES));
 await page.locator('#osmmap .leaflet-control-zoom-in').click();
 await page.waitForFunction(()=>window.__ironfieldMap5336?.().labelsVisible===true,null,{timeout:15000});
 const mapState=await page.evaluate(()=>window.__ironfieldMap5336());
 assert.ok(mapState.attached&&mapState.names.length>0);
 assert.ok(mapState.names.every(name=>knownStreets.has(name)),'Unexpected map street label');
 const labels=page.locator('#osmmap .rp-ironfield-street');
 await labels.first().waitFor({state:'attached',timeout:15000});
 const rendered=await labels.allTextContents();
 assert.ok(rendered.length>0&&rendered.every(name=>knownStreets.has(name.trim())),'Unexpected rendered street label');
 const station=goalOptions.find(o=>o.text==='🚉 Ironfield Station');
 assert.ok(station);
 await goals.selectOption(station.value);
 await page.waitForFunction(()=>document.getElementById('map-guidance-name-5319')?.textContent==='🚉 Ironfield Station',null,{timeout:15000});
 assert.equal(await page.locator('#map-guidance-5319').isHidden(),false);
 await page.locator('#map-goal-clear-5319').click();
 assert.equal(await goals.inputValue(),'');
 assert.equal(await page.locator('#map-guidance-5319').isHidden(),true);
 step('fictional GPS options, rendered street labels and navigation HUD',{destinations:goalOptions.length-1,streetLabels:rendered.length,goal:station.text});

 await page.locator('#closemap').click();
 if(id==='mlada'){
  // Exercise the real public job menu; do not move the player with debug hooks.
  await page.waitForFunction(()=>!!window.__miloviceTopolovaLoopPlan,null,{timeout:30000});
  const moneyBefore=await page.locator('#money').textContent();
  await page.locator('#rp-jobs').click();
  await page.locator('#topolova-foot-job-start').click();
  await page.waitForFunction(()=>window.__miloviceTopolovaFootJobLifecycle5183?.().active===true,null,{timeout:10000});
  const message=await page.locator('#status').textContent();
  assert.match(message,/Silver Avenue/);
  assert.doesNotMatch(message,/Topolov/i);
  await page.locator('#rp-jobs').click();
  await page.locator('#topolova-foot-job-end').click();
  assert.equal(await page.evaluate(()=>window.__miloviceTopolovaFootJobLifecycle5183().active),false);
  assert.equal(await page.locator('#money').textContent(),moneyBefore);
  step('fictional pedestrian delivery label and cancellation',{message,rewardUnchanged:true});
 }
 return evidence;
}
