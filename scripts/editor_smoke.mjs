// Milovice RP street architecture editor regression: actual OSM inventory,
// source links and persisted cards. Does not modify any live game state.
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];
 page.on('pageerror',err=>errors.push(String(err.stack||err)));
 await page.goto('http://127.0.0.1:8080/editor.html',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__miloviceEditor?.loaded===true,null,{timeout:45000});
 const stats=await page.evaluate(()=>({count:window.__miloviceEditor.buildings,
  streets:window.__miloviceEditor.streets,district:window.__miloviceEditor.currentDistrict}));
 assert(stats.count>500,'old-town OSM houses are missing');
 assert(stats.streets>3,'street-by-street sorting missing');
 assert.equal(stats.district,'old');
 await page.locator('#buildings [data-building]').first().click();
 // Use a known mapped residential house for the end-to-end 3D bridge test.
 await page.evaluate(()=>window.__miloviceEditor.openBuilding(118487963));
 const selected=await page.evaluate(()=>window.__miloviceEditor.chosenId);
 assert(selected>0,'clicking a house did not open the inspector');
 assert((await page.locator('#mapy').getAttribute('href')).includes('mapy.com/cs/zakladni'));
 assert((await page.locator('#mapillary').getAttribute('href')).includes('mapillary.com/app/'));
 assert((await page.locator('#osm').getAttribute('href')).endsWith('/way/'+selected));
 await page.locator('#stage').selectOption('verified');
 await page.locator('#facadeColor').fill('#b2a090');
 await page.locator('#roofColor').fill('#79513c');
 await page.locator('#roofKind').selectOption('gable');
 await page.locator('#windowsPerWall').fill('4');
 await page.locator('#height').fill('7.2');
 await page.locator('#notes').fill('Ověřeno pouze pro test editoru, ne ve skutečnosti.');
 await page.locator('#source').fill('https://commons.wikimedia.org/');
 await page.locator('#inspector button[type=submit]').click();
 assert((await page.locator('#message').innerText()).includes('Karta uložena'),'Save did not work');
 assert(await page.evaluate(()=>window.__miloviceEditor.cards)>0);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__miloviceEditor?.loaded===true,null,{timeout:45000});
 await page.evaluate(id=>window.__miloviceEditor.openBuilding(id),selected);
 assert.equal(await page.locator('#stage').inputValue(),'verified','local progress not persisted');
 assert.equal(await page.locator('#facadeColor').inputValue(),'#b2a090');
 assert.equal(await page.locator('#roofKind').inputValue(),'gable');
 const bridge=await page.evaluate(async()=>{
  const mod=await import('./scripts/street-architecture.js?v=580');
  return [...mod.loadLocalArchitectureCards(localStorage)].map(([id,data])=>({id,color:data.facadeColor,height:data.height,roof:data.roofKind}));
 });
 assert(bridge.some(x=>x.id===String(selected)&&x.color==='#b2a090'&&x.height===7.2&&x.roof==='gable'),
  'Editor verified card did not become loadable 3D architecture input');
 await page.locator('#district').selectOption('mlada');
 await page.waitForFunction(()=>window.__miloviceEditor?.currentDistrict==='mlada'&&
  window.__miloviceEditor?.buildings>100,null,{timeout:45000});
 // The production game must consume the stored verified card from exactly
 // the same browser origin and apply it to the matching OSM house geometry.
 await page.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__miloviceArchitectureBridge?.appliedIds.includes('118487963'),
   null,{timeout:55000});
 const applied=await page.evaluate(()=>({
  bridge:window.__miloviceArchitectureBridge,hero:window.__miloviceHeroArchitecture
 }));
 if(!(applied.bridge.loadedVerified>=1&&applied.bridge.applied>=1&&applied.hero?.verifiedOverrides>=1))
  throw Error('Verified local architecture was not applied to actual 3D world: '+JSON.stringify(applied));
 if(errors.length)throw Error(errors.slice(0,5).join('\n'));
 console.log('Street editor OK: OSM streets, reference URLs, persistence, Mladá + verified-card 3D model bridge.',JSON.stringify({stats,applied}));
}finally{await browser.close()}
