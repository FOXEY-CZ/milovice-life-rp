import assert from 'node:assert/strict';

// Chromium touchscreen emulation, not physical Android/iOS or measured device FPS.
export async function runReleaseMobileScenario(page,base,evidence={}){
 evidence.steps=[];
 const step=(name,info={})=>evidence.steps.push({name,...info});
 const touch=await page.context().newCDPSession(page);
 const send=(type,points=[])=>touch.send('Input.dispatchTouchEvent',{type,touchPoints:points});
 const point=(x,y)=>({x,y,id:1});
 const box=async locator=>{const b=await locator.boundingBox();assert.ok(b,'Touchable control has no bounding box');return b;};
 async function hold(locator,fn,offset=0){
  const b=await box(locator),x=b.x+b.width/2,y=b.y+b.height/2;
  const startY=y-Math.min(b.width,b.height)*.33*offset;
  const hit=await locator.evaluate((el,p)=>{const target=document.elementFromPoint(p.x,p.y);return {ok:!!target&&el.contains(target),target:target?.id||target?.tagName||null};},{x,y:startY});
  step('touch hit test',{control:await locator.getAttribute('id'),...hit});
  assert.ok(hit.ok,'Control is covered or outside viewport: '+JSON.stringify(hit));
  await send('touchStart',[point(x,startY)]);
  try{await fn({b,x,y});}
  catch(error){
   evidence.touchFailure=await page.evaluate(()=>({movement:window.__miloviceMovementDebug,stick:document.getElementById('rp-joystick')?.getAttribute('aria-valuenow'),events:window.__releaseTouchEvents,viewport:{width:innerWidth,height:innerHeight}}));
   throw error;
  }finally{await send('touchEnd');}
 }
 try{
  await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.__miloviceStarted===true,null,{timeout:60000});
  assert.equal(await page.evaluate(()=>matchMedia('(pointer:coarse)').matches),true);
  const walking=page.locator('[data-spawn="walking"]');
  await walking.waitFor({state:'visible',timeout:90000});
  await walking.tap();
  await page.waitForFunction(()=>document.getElementById('mode')?.textContent==='Pěšky',null,{timeout:30000});
  const stick=page.locator('#rp-joystick');
  await stick.waitFor({state:'visible',timeout:30000});
  assert.equal(await page.locator('[data-key="KeyW"]').isHidden(),true);
  step('mobile walking controls');
  await page.waitForTimeout(1500);
  await page.evaluate(()=>{window.__releaseTouchEvents=[];for(const type of ['pointerdown','pointermove','pointerup','pointercancel','gotpointercapture','lostpointercapture'])document.addEventListener(type,e=>{if(window.__releaseTouchEvents.length<80)window.__releaseTouchEvents.push({type,target:e.target?.id||e.target?.tagName,pointerType:e.pointerType,x:e.clientX,y:e.clientY});},true);});
  await hold(stick,async({b,x,y})=>{
   const radius=Math.min(b.width,b.height)*.33;
   await page.waitForFunction(()=>{const d=window.__miloviceMovementDebug;return d?.stick.magnitude>.25&&d.stick.magnitude<.69;},null,{timeout:10000});
   step('analog input received',{magnitude:await page.evaluate(()=>window.__miloviceMovementDebug.stick.magnitude)});
   await page.waitForFunction(()=>{const d=window.__miloviceMovementDebug;return d?.stick.magnitude>.25&&d.stick.magnitude<.69&&d.active&&!d.running;},null,{timeout:15000});
   step('analog walk',{speed:await page.evaluate(()=>window.__miloviceMovementDebug.speed)});
   await send('touchMove',[point(x,y-radius*.95)]);
   await page.waitForFunction(()=>{const d=window.__miloviceMovementDebug;return d?.stick.magnitude>.8&&d.running;},null,{timeout:15000});
   step('analog run',{speed:await page.evaluate(()=>window.__miloviceMovementDebug.speed)});
  },.45);
  await page.waitForFunction(()=>{const d=window.__miloviceMovementDebug;return d?.stick.magnitude===0&&d.speed===0;},null,{timeout:10000});
  step('released joystick stops movement');
  await page.locator('#maplaunch').tap();
  await page.locator('#osmmap .leaflet-control-attribution').waitFor({state:'visible',timeout:30000});
  assert.match(await page.locator('#osmmap .leaflet-control-attribution').innerText(),/OpenStreetMap/);
  assert.equal(await page.locator('#osmmap .leaflet-tile').count(),0);
  await page.locator('#closemap').tap();
  step('mobile map open and close');
  await page.locator('#rp-vehicles').tap();
  await page.locator('[data-spawn="sedan"]').tap();
  await page.waitForFunction(()=>document.getElementById('mode')?.textContent==='Řidič auta'&&!!window.__miloviceVehicleDebug?.activeCarId,null,{timeout:30000});
  assert.equal(await stick.isHidden(),true);
  const gas=page.locator('[data-key="KeyW"]');
  await gas.waitFor({state:'visible',timeout:10000});
  await hold(gas,async()=>{
   await page.waitForFunction(()=>Number(document.getElementById('speed')?.textContent)>0,null,{timeout:15000});
   step('touch gas accelerates',{speedKmh:Number(await page.locator('#speed').textContent())});
  });
  await page.locator('#horn').tap();
  step('horn control tapped',{audibilityVerified:false});
  await page.waitForTimeout(2000);
  return evidence;
 }finally{await touch.detach();}
}
