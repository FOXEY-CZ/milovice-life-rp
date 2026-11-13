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
 const selected=await page.evaluate(()=>window.__miloviceEditor.chosenId);
 assert(selected>0,'clicking a house did not open the inspector');
 assert((await page.locator('#mapy').getAttribute('href')).includes('mapy.com/cs/zakladni'));
 assert((await page.locator('#mapillary').getAttribute('href')).includes('mapillary.com/app/'));
 assert((await page.locator('#osm').getAttribute('href')).endsWith('/way/'+selected));
 await page.locator('#stage').selectOption('verified');
 await page.locator('#notes').fill('Ověřeno pouze pro test editoru, ne ve skutečnosti.');
 await page.locator('#source').fill('https://commons.wikimedia.org/');
 await page.locator('#inspector button[type=submit]').click();
 assert((await page.locator('#message').innerText()).includes('Karta uložena'),'Save did not work');
 assert(await page.evaluate(()=>window.__miloviceEditor.cards)>0);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__miloviceEditor?.loaded===true,null,{timeout:45000});
 await page.evaluate(id=>window.__miloviceEditor.openBuilding(id),selected);
 assert.equal(await page.locator('#stage').inputValue(),'verified','local progress not persisted');
 await page.locator('#district').selectOption('mlada');
 await page.waitForFunction(()=>window.__miloviceEditor?.currentDistrict==='mlada'&&
  window.__miloviceEditor?.buildings>100,null,{timeout:45000});
 if(errors.length)throw Error(errors.slice(0,5).join('\n'));
 console.log('Street editor OK: OSM houses, street inventory, panorama URLs, edit/save, reload, Mladá district.',stats);
}finally{await browser.close()}
