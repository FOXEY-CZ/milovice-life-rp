import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const viewport of [{width:1280,height:760},{width:390,height:844},{width:320,height:568}]){
  const page=await browser.newPage({viewport});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  const response=await page.goto('http://127.0.0.1:8080/credits.html',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200);
  assert.equal(await page.locator('h1').textContent(),'Credits & Licenses');
  assert.equal(await page.locator('main section').count(),6);
  assert.equal(await page.locator('a[href="./"]').getAttribute('href'),'./');
  assert(await page.locator('a[href="https://www.openstreetmap.org/copyright"]').isVisible());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No horizontal scrolling');
  assert.equal(await page.locator('a[href="./"]').evaluate(e=>e.getBoundingClientRect().height>=44),true);
  assert.deepEqual(errors,[]);
  await page.close();
 }
 console.log('PASS credits page desktop and narrow mobile layout, attribution, navigation and no JS errors');
}finally{await browser.close();}
