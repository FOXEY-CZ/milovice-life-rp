import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {chromium} from 'playwright-core';
const groups={central:['old','mlada'],west:['vrutice','westlink'],north:['centerlink','bozidar']};
const ids=groups[process.env.REGION_GROUP],out=process.env.RUNNER_TEMP;
assert.ok(ids&&out);
const allowed=new Set([
 'IRONFIELD','IRONFIELD • STATION','432 • IRONFIELD','DOWNTOWN / CITY HALL','SENTINEL ROAD','AMUSEMENT PARK',
 'LIBRARY HILL SCHOOL','SILVERMOON INN','CYCLEHUB','432','432 IRONFIELD','CT 432','S22 IRONFIELD','CROSSTRANSIT TICKETS','P',
 'BRAYMART','VALUENEST','VENDOA','GRAINWELL MARKET','DAWNRIDGE SCHOOL','IRONFIELD HEALTH CENTER','MOSSWOOD PRESCHOOL',
 'GROCERIES','BAKERY','JEWELRY','CLOTHING','FLORIST','HAIR SALON','RESTAURANT','BISTRO','HEALTH CENTER','SCHOOL','PHARMACY','CAFE','SHOP','BUSINESS'
]);
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
try{
 for(const id of ids){
  const page=await browser.newPage({viewport:{width:1280,height:760}});
  const evidence={region:id,scope:'detached Canvas2D text calls, not visible mesh or pixel proof',errors:[]};
  page.on('pageerror',e=>evidence.errors.push(String(e)));
  await page.addInitScript(()=>{
   const seen=new Map();let overflow=false;
   for(const method of ['fillText','strokeText']){
    const original=CanvasRenderingContext2D.prototype[method];
    CanvasRenderingContext2D.prototype[method]=function(...args){
     if(!this.canvas.isConnected){
      const text=String(args[0]),record={text,width:this.canvas.width,height:this.canvas.height,method};
      const key=JSON.stringify(record);
      if(seen.has(key))seen.get(key).count++;
      else if(seen.size<1000)seen.set(key,{...record,count:1});
      else overflow=true;
     }
     return Reflect.apply(original,this,args);
    };
   }
   window.__releaseSignCapture=()=>({records:[...seen.values()],overflow});
  });
  try{
   await page.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>window.__miloviceStarted===true,null,{timeout:60000});
   await page.locator('[data-spawn="walking"]').waitFor({state:'visible',timeout:90000});
   await page.waitForFunction(()=>document.querySelectorAll('#rp-area-select option').length===6,null,{timeout:30000});
   await page.locator('#rp-area-select').selectOption(id);
   await page.locator('[data-spawn="walking"]').click();
   await page.waitForFunction(region=>window.__miloviceAreasLoaded?.includes(region)&&document.getElementById('rp-spawn')?.hidden,id,{timeout:90000});
   await page.waitForTimeout(6500);
   const capture=await page.evaluate(()=>window.__releaseSignCapture());
   evidence.records=capture.records;evidence.overflow=capture.overflow;
   evidence.unknown=capture.records.filter(r=>!allowed.has(r.text.normalize('NFC').trim().toUpperCase()));
   assert.equal(capture.overflow,false);
   for(const expected of ['IRONFIELD • STATION','SENTINEL ROAD','432 • IRONFIELD'])assert.ok(capture.records.some(r=>r.text===expected),'Missing startup sign '+expected);
   assert.deepEqual(evidence.unknown,[],'Unreviewed detached canvas text');
   assert.deepEqual(evidence.errors,[]);
   evidence.result='pass';
  }catch(error){evidence.result='fail';evidence.failure=String(error);}
  finally{writeFileSync(join(out,'world-signage-'+id+'.json'),JSON.stringify(evidence,null,2));console.log('WORLD SIGNAGE',JSON.stringify(evidence));results.push(evidence);await page.close();}
 }
}finally{await browser.close();}
assert.ok(results.every(r=>r.result==='pass'),'World signage evidence failed');
