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
  await page.goto('http://127.0.0.1:8080/?v=510100&streetAudit='+view.id,
   {waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForSelector('#street-audit-nav details',{timeout:30000});
  const initial=await page.evaluate(()=>({
   compact:document.querySelector('#street-block-audit')
    .classList.contains('audit-compact'),
   category:document.querySelector('#street-audit-nav details[open]')
    ?.dataset.category,
   allLinks:document.querySelectorAll('#street-audit-nav a').length,
   categories:document.querySelectorAll('#street-audit-nav details').length,
   current:document.querySelectorAll('#street-audit-nav a[aria-current="page"]').length,
   quick:document.querySelectorAll('#street-audit-quicklinks a').length,
   label:document.getElementById('street-audit-label')?.textContent,
   panelHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height,
   menu:window.__miloviceStreetAuditMenu
  }));
  assert.equal(initial.compact,view.mobile);
  assert.equal(initial.category,view.cat);
  assert.equal(initial.allLinks,28);
  assert.equal(initial.categories,6);
  assert.equal(initial.current,1);
  assert.equal(initial.quick,view.quick);
  assert(initial.label.length<90);
  assert(initial.panelHeight<view.height*.59);
  if(view.mobile)await page.click('#street-audit-toggle');
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
  assert(expanded.height<view.height*.59,
   'Expanded menu must not cover the entire game screen');
  if(view.mobile){
   await page.click('#street-audit-show-all');
   const open=await page.locator('#street-audit-nav details[open]').count();
   assert.equal(open,6,'Show all categories must actually expand each section');
   await page.click('#street-audit-show-all');
   const one=await page.locator('#street-audit-nav details[open]').count();
   assert.equal(one,1,'Collapse others retains only current section');
   await page.screenshot({path:'browser-artifacts/street-audit-menu-5101-'+view.id+'.png'});
   await page.click('#street-audit-toggle');
   assert(await page.locator('#street-block-audit.audit-compact').count()===1);
  }
  assert.deepEqual(errors,[],'Audit menu introduced a page error');
  console.log('PASS street menu 5.101',JSON.stringify({
   view:view.id,mobile:view.mobile,sections:initial.categories,
   quick:initial.quick,closedHeight:initial.panelHeight,
   expandedHeight:expanded.height,allLinks:initial.allLinks
  }));
  await page.close();
 }
}finally{await browser.close()}
