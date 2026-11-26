import assert from 'node:assert/strict';
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
