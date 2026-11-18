// UI regression on real Chromium: the screenshot complaint was a mobile
// navigation panel consuming almost the whole game screen after expansion.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader']
});
try{
 await mkdir('browser-artifacts',{recursive:true});
 for(const view of [
  {id:'lit-italska-5100',cat:'lighting',quick:1,
   mobile:true,width:393,height:852},
  {id:'forest-mlada-597',cat:'forests',quick:1,
   mobile:true,width:393,height:852},
  {id:'estate-mlada-5105',cat:'streets',quick:2,
   mobile:true,width:393,height:852},
  {id:'slepa-houses-5112',cat:'streets',quick:2,
   mobile:true,width:393,height:852},
  {id:'road-slepa-5108',cat:'streets',quick:2,
   mobile:true,width:393,height:852},
  {id:'play-mlada-5103',cat:'playgrounds',quick:1,
   mobile:true,width:393,height:852},
  {id:'pionyru-forward',cat:'streets',quick:2,
   mobile:true,width:393,height:852},
  {id:'lit-italska-5100',cat:'lighting',quick:1,
   mobile:false,width:1280,height:760}
 ]){
  const page=await browser.newPage({viewport:{
   width:view.width,height:view.height},deviceScaleFactor:1,
   isMobile:view.mobile,hasTouch:view.mobile});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e.stack||e)));
  await page.goto('http://127.0.0.1:8080/?v=511200&streetAudit='+view.id,
   {waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForSelector('#street-audit-nav details',{
   state:'attached',timeout:30000}); // Mobile nav is intentionally hidden until tapped.
  const initial=await page.evaluate(()=>({
   compact:document.querySelector('#street-block-audit')
    .classList.contains('audit-compact'),
   category:window.__miloviceStreetAuditMenu?.category,
   openSections:document.querySelectorAll('#street-audit-nav details[open]').length,
   allLinks:document.querySelectorAll('#street-audit-nav a').length,
   search:document.getElementById('street-audit-search')?.placeholder,
   categories:document.querySelectorAll('#street-audit-nav details').length,
   current:document.querySelectorAll('#street-audit-nav a[aria-current="page"]').length,
   quick:document.querySelectorAll('#street-audit-quicklinks a').length,
   label:document.getElementById('street-audit-label')?.textContent,
   panelHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height,
   menu:window.__miloviceStreetAuditMenu
  }));
  assert.equal(initial.compact,view.mobile);
  assert.equal(initial.category,view.cat);
  assert.equal(initial.openSections,view.mobile?0:1,
   'Mobile must not load all 21 street links open');
  assert(initial.allLinks>=46,'Expanded camera catalog must remain accessible');
  assert.equal(initial.categories,7);
  assert(initial.search?.includes('Hledat ulici'));
  assert.equal(initial.current,1);
  assert(await page.locator('#street-audit-exit').count()===1,
   'Visible X must exit technical camera mode');
  assert.equal(initial.quick,view.quick);
  assert(initial.label.length<90);
  assert(initial.panelHeight<view.height*.59);
  if(view.mobile){
   await page.click('#street-audit-toggle');
   // Open ONLY the chosen category; all 7 headings start closed.
   await page.click('#street-audit-nav details[data-category="'+view.cat+'"] summary');
  }
  // 5.136: find an OSM source camera by plain Czech text without accents.
  await page.locator('#street-audit-search').fill('prubezna');
  const filtered=await page.evaluate(()=>({
   count:document.querySelectorAll('#street-audit-nav a:not([hidden])').length,
   results:document.querySelectorAll('#street-audit-nav details:not([hidden])').length,
   status:document.getElementById('street-audit-search-count').textContent
  }));
  assert.equal(filtered.count,6,'All six mapped Průběžná / Sportovní cameras must match');
  assert.equal(filtered.results,1,'Search must hide empty categories');
  assert(filtered.status.includes('6 z '),'Accessible result count');
  await page.locator('#street-audit-search').fill('neexistujici-ulice');
  assert.equal(await page.locator('#street-audit-nav a:not([hidden])').count(),0);
  await page.locator('#street-audit-search').fill('');
  assert((await page.locator('#street-audit-nav a:not([hidden])').count())>=48,
   'Clearing search must restore all source cameras');
  if(view.mobile)await page.click('#street-audit-nav details[data-category="'+view.cat+'"] summary');
  const expanded=await page.evaluate(()=>({
   compact:document.querySelector('#street-block-audit')
    .classList.contains('audit-compact'),
   height:document.querySelector('#street-block-audit').getBoundingClientRect().height,
   navScroll:document.querySelector('#street-audit-nav').scrollHeight,
   navHeight:document.querySelector('#street-audit-nav').clientHeight,
   expanded:document.getElementById('street-audit-toggle')
    .getAttribute('aria-expanded'),
   selectedVisible:(()=>{
    const a=document.querySelector('#street-audit-nav a.selected');
    return a&&a.closest('details').open
   })()
  }));
  assert.equal(expanded.compact,false);
  assert.equal(expanded.expanded,'true');
  assert.equal(expanded.selectedVisible,true);
  assert(expanded.height<view.height*(view.mobile?.47:.59),
   'Expanded menu must preserve most of the 3D game scene');
  if(view.mobile){
   assert(await page.locator('#street-audit-status:visible').count()===0,
    'Street source details must be optional, not cover the game');
   await page.click('#street-audit-info-toggle');
   assert(await page.locator('#street-audit-camera-gps:visible').count()===1,
    'GPS must be available on demand');
   await page.click('#street-audit-info-toggle');
   assert(await page.locator('#street-audit-camera-gps:visible').count()===0);
  }
  if(view.mobile){
   await page.click('#street-audit-show-all');
   const open=await page.locator('#street-audit-nav details[open]').count();
   assert.equal(open,7,'Show all categories must actually expand each section');
   await page.click('#street-audit-show-all');
   const one=await page.locator('#street-audit-nav details[open]').count();
   assert.equal(one,1,'Collapse others retains only current section');
   await page.screenshot({path:'browser-artifacts/street-audit-menu-5101-'+view.id+'.png'});
   await page.click('#street-audit-toggle');
   assert(await page.locator('#street-block-audit.audit-compact').count()===1);
  }
  assert.deepEqual(errors,[],'Audit menu introduced a page error');
  console.log('PASS street menu 5.136 search',JSON.stringify({
   view:view.id,mobile:view.mobile,sections:initial.categories,
   quick:initial.quick,closedHeight:initial.panelHeight,
   expandedHeight:expanded.height,allLinks:initial.allLinks
  }));
  await page.close();
 }
}finally{await browser.close()}
