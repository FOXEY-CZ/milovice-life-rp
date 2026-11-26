import assert from 'node:assert/strict';

// Run against a fresh staged player page with network observer attached before navigation.
// This records control interactions, not audibility or offline speech guarantees.
export async function runReleaseGameplayScenario(page,base,evidence={}){
 const step=(name,detail={})=>{(evidence.steps??=[]).push({name,...detail});};
 await page.addInitScript(()=>{
  window.__releaseVehicleStatusHistory=[];
  const capture=()=>{
   const value=document.getElementById('rp-model-status')?.textContent;
   const history=window.__releaseVehicleStatusHistory;
   if(value&&history.at(-1)!==value&&history.length<100)history.push(value);
  };
  new MutationObserver(capture).observe(document,{subtree:true,childList:true,characterData:true});
 });
 await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__miloviceStarted===true,null,{timeout:60000});
 await page.locator('[data-spawn="sedan"]').waitFor({state:'visible',timeout:90000});
 await page.locator('[data-spawn="sedan"]').click();
 await page.waitForFunction(()=>document.getElementById('mode')?.textContent==='Řidič auta'&&!!window.__miloviceVehicleDebug?.activeCarId,null,{timeout:30000});
 await page.waitForTimeout(6500);
 step('sedan spawn and LOD wait');
 const labels=await page.evaluate(()=>[...window.__releaseVehicleStatusHistory,document.getElementById('rp-model-status')?.textContent].filter(Boolean));
 assert.ok(labels.length,'No vehicle HUD status observed');
 for(const label of labels)assert.doesNotMatch(label,/Quaternius|Spectral GT|CC0|cityCar|citySUV|citySport|spectralGT/i);
 step('vehicle HUD source-name screen',{labels});

 await page.locator('#horn').click();
 step('horn control clicked',{audibilityVerified:false});
 await page.locator('#maplaunch').click();
 await page.locator('#osmmap .leaflet-control-attribution').waitFor({state:'visible',timeout:30000});
 assert.match(await page.locator('#osmmap .leaflet-control-attribution').innerText(),/OpenStreetMap/);
 await page.locator('#gps-sound-5330').click();
 await page.waitForFunction(()=>window.__miloviceGpsSound5330?.().enabled===true,null,{timeout:10000});
 const audio=await page.evaluate(()=>window.__miloviceGpsSound5330());
 assert.equal(audio.context,'running');
 step('GPS audio enabled',{context:audio.context});
 await page.locator('#gps-voice-5331').click();
 const voice=await page.evaluate(()=>window.__miloviceGpsVoice5331());
 assert.equal(voice.selected,true);
 step('local Czech voice selected',{available:voice.available,spoken:voice.count});
 const goal=page.locator('#map-goal-5319');
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('#map-goal-5319 option')).some(o=>o.value&&!o.disabled),null,{timeout:30000});
 const value=await goal.locator('option').evaluateAll(options=>options.find(o=>o.value&&!o.disabled)?.value);
 assert.ok(value,'No selectable GPS target');
 await goal.selectOption(value);
 await page.locator('#closemap').click();
 await page.locator('#map-guidance-5319').waitFor({state:'visible',timeout:30000});
 // Movement is verified independently of whether a navigation cue happens.
 try{
  await page.keyboard.down('w');
  await page.waitForFunction(()=>Number(document.getElementById('speed')?.textContent)>0,null,{timeout:15000});
  step('vehicle accelerated',{speedKmh:Number(await page.locator('#speed').textContent())});
  await page.waitForTimeout(3000);
 }finally{await page.keyboard.up('w');}
 const end=await page.evaluate(()=>({sound:window.__miloviceGpsSound5330(),voice:window.__miloviceGpsVoice5331()}));
 step('GPS cue observation',{toneOrSpeechCount:end.sound.count,spokenCount:end.voice.count,cueObserved:end.sound.count>0});
 await page.locator('#maplaunch').click();
 await page.locator('#gps-sound-5330').click();
 await page.waitForFunction(()=>window.__miloviceGpsSound5330?.().enabled===false,null,{timeout:10000});
 await page.locator('#gps-voice-5331').click();
 assert.equal(await page.locator('#gps-voice-5331').getAttribute('aria-pressed'),'false');
 step('audio controls disabled');
 await page.locator('#closemap').click();
 return evidence;
}
