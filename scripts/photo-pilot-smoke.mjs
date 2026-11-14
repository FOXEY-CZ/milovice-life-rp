// Browser smoke: isolated photo pilot must never fetch remotely until user action.
// Mocked Panoramax STAC response; no real photo bytes are used by the test.
import {strict as assert} from 'node:assert';
import {chromium} from 'playwright-core';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,
 args:['--no-sandbox','--disable-dev-shm-usage']
});
try{
 const page=await browser.newPage({viewport:{width:1100,height:850}});
 let requests=0;
 const photoId='890b6268-7716-4e34-ada9-69985e6c1657';
 await page.route('https://api.panoramax.xyz/**',route=>{
  requests++;
  const url=new URL(route.request().url());
  assert.equal(url.pathname,'/api/search');
  assert.equal(url.searchParams.get('limit'),'30');
  return route.fulfill({status:200,contentType:'application/geo+json',body:JSON.stringify({
   // Deliberately omit 'type': federated Panoramax response in production.
   features:[{type:'Feature',id:photoId,geometry:{
    type:'Point',coordinates:[14.8824,50.2295]},
    properties:{datetime:'2024-05-30T11:00:00Z','view:azimuth':200}
   }]
  })});
 });
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:8080/photo-pilot.html',{waitUntil:'load'});
 assert.equal(await page.locator('h1').innerText(),'📸 Fotografický průzkum Milovic');
 assert.equal(requests,0,'Must not query external API merely by loading pilot');
 assert.equal(await page.locator('#find').isEnabled(),true);
 await page.locator('#find').click();
 await page.waitForFunction(()=>window.__milovicePhotoPilot?.candidates===1,{timeout:20000});
 assert.equal(requests,1,'Only one bounded query on explicit click');
 assert.match(await page.locator('#status').innerText(),/Hotovo: 1/);
 assert.equal(await page.locator('#photos article.result').count(),1);
 assert.equal(await page.locator('#photos a[href*="pic="]').count(),1);
 assert.equal(await page.locator('#photos img').count(),0,'No copies of photographs');
 const safe=await page.evaluate(()=>({
  debug:window.__milovicePhotoPilot,
  localEntries:Object.keys(localStorage).length,
  scriptUrls:[...document.querySelectorAll('script')].map(s=>s.src).filter(Boolean)
 }));
 assert.equal(safe.debug.readOnly,true);
 assert.equal(safe.debug.autoGameMutations,0);
 assert.equal(safe.debug.storedPictures,0);
 assert.equal(safe.localEntries,0);
 assert(!safe.scriptUrls.some(s=>s.includes('index.html')),'Must not load game into pilot');
 assert.equal(errors.length,0,'Pilot page JS errors: '+JSON.stringify(errors));
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/photo-pilot.png',fullPage:true});
 console.log('Photo pilot in-browser smoke PASS',JSON.stringify({requests,
  candidates:safe.debug.candidates,readOnly:true,localStorage:0,jsErrors:0}));
}finally{await browser.close()}
