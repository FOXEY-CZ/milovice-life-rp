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
 const faces=await page.evaluate(()=>({
  count:window.__miloviceEditor.facades,selected:window.__miloviceEditor.currentFace
 }));
 assert(faces.count>=3&&faces.selected,'Facade inspector must offer independent wall views');
 const firstFace=faces.selected;
 // Mapillary API mock: no developer account or real provider imagery required
 // for a reproducible test of the official API metadata flow.
 await page.locator('#imagery-scan-house').click();
 assert((await page.locator('#imagery-status').innerText()).includes('Mapillary CLIENT token'),
  'No-token fallback should be explicit');
 const facePlan=await page.evaluate(()=>window.__miloviceEditor.facePlan);
 assert(facePlan?.middle,'The selected facade has no geolocation');
 const a=facePlan.cardinal*Math.PI/180,lat=facePlan.middle[0],lon=facePlan.middle[1];
 const syntheticLat=lat+Math.cos(a)*20/111320;
 const syntheticLon=lon+Math.sin(a)*20/(111320*Math.cos(lat*Math.PI/180));
 const syntheticHeading=(facePlan.cardinal+180)%360;
 let fakeCalls=0;
 await page.route('https://graph.mapillary.com/images?**',async route=>{
  fakeCalls++;
  const request=route.request();
  assert.equal(request.headers()['authorization'],'OAuth TEST_CLIENT_PUBLIC_TOKEN');
  assert(!request.url().includes('TEST_CLIENT_PUBLIC_TOKEN'),'Never put API token in URL');
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
   data:[{id:'991123456788',computed_geometry:{coordinates:[syntheticLon,syntheticLat]},
    computed_compass_angle:syntheticHeading,camera_type:'perspective',
    creator:{username:'Test Photographer'},captured_at:1750000000000}],
   paging:{}
  })});
 });
 await page.locator('#mapillary-client-token').fill('TEST_CLIENT_PUBLIC_TOKEN');
 await page.locator('#imagery-scan-house').click();
 await page.waitForFunction(()=>window.__miloviceEditor.imageryCount>0,null,{timeout:20000});
 assert(fakeCalls>=1,'Official Graph API was not requested');
 assert((await page.locator('#imagery-summary').innerText()).includes('1/1 domů'),
  'Candidate source coverage not calculated');
 assert.equal(await page.locator('#face-status').inputValue(),'unreviewed',
  'A matching GPS+compass candidate must NEVER automatically mark a facade as seen');
 await page.locator('#imagery-gallery button').first().click();
 assert((await page.locator('#face-source').inputValue()).includes('pKey=991123456788'),
  'Candidate image URL cannot be assigned to the building record');
 assert.equal(await page.locator('#face-status').inputValue(),'unreviewed');
 assert.equal(await page.evaluate(()=>window.__miloviceImageryDiscovery.noStoredToken),true);
 await page.locator('#face-status').selectOption('seen');
 await page.locator('#face-rows').fill('2,3');
 await page.locator('#face-window-width').fill('1.15');
 await page.locator('#face-window-height').fill('1.25');
 await page.locator('#face-door').selectOption('right');
 await page.locator('#face-door-width').fill('1.04');
 await page.locator('#face-wall-color').fill('#d3b39c');
 await page.locator('#face-shutters').selectOption('yes');
 await page.locator('#face-source').fill('https://commons.wikimedia.org/');
 await page.locator('#face-note').fill('Test reference only, not a verified Milovice photo');
 const allFaces=page.locator('#facade-switches button[data-facade]');
 assert(await allFaces.count()>=3,'Facade switches are not usable');
 await allFaces.nth(1).click();
 await page.locator('#facade-switches button[data-facade="'+firstFace+'"]').click();
 assert.equal(await page.locator('#face-status').inputValue(),'seen','Facade review was not stored on switch');
 assert.equal(await page.locator('#face-rows').inputValue(),'2,3','Per-floor window counts not saved');
 assert.equal(await page.locator('#face-door').inputValue(),'right','Facade entrance position not saved');
 assert.equal(await page.locator('#face-wall-color').inputValue(),'#d3b39c','Side-specific wall paint not saved');
 assert((await page.locator('#face-progress').innerText()).includes('1/'),'Review progress missing');
 await page.locator('#pano-open').click();
 assert((await page.locator('#pano-message').innerText()).includes('API klíč'),'No-key panorama fallback unavailable');
 // Photo-to-3D: draw a locally generated synthetic OWNED reference image.
 // Never copy real provider panoramas to CI, local storage or game assets.
 const photoLoaded=await page.evaluate(async()=>{
  const c=document.createElement('canvas');c.width=600;c.height=400;
  const g=c.getContext('2d');
  g.fillStyle='#d5c1ab';g.fillRect(0,0,600,400);
  g.fillStyle='#425e75';g.fillRect(98,118,76,80);g.fillRect(406,118,72,80);
  g.fillStyle='#75513d';g.fillRect(310,279,82,100);
  const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));
  await window.__milovicePhotoSurvey.loadForTest(new File([blob],'synthetic-owned-test.png',{type:'image/png'}));
  return window.__milovicePhotoSurvey.metrics;
 });
 assert(photoLoaded.image&&photoLoaded.digest,'Local synthetic photo was not opened or fingerprinted');
 const pic=page.locator('#photo-canvas');
 await pic.scrollIntoViewIfNeeded();
 let rect=await pic.boundingBox();
 const tap=async(x,y)=>page.mouse.click(rect.x+rect.width*x,rect.y+rect.height*y);
 // Four facade corners: TL -> TR -> BR -> BL.
 for(const p of [[.08,.06],[.92,.06],[.92,.95],[.08,.95]])await tap(...p);
 assert.equal(await page.evaluate(()=>window.__milovicePhotoSurvey.metrics.quad),4);
 async function drawAnnotation(tool,from,to){
  await page.locator('[data-photo-mode="'+tool+'"]').click();
  await pic.scrollIntoViewIfNeeded();rect=await pic.boundingBox();
  await page.mouse.move(rect.x+rect.width*from[0],rect.y+rect.height*from[1]);
  await page.mouse.down();await page.mouse.move(rect.x+rect.width*to[0],rect.y+rect.height*to[1],{steps:5});
  await page.mouse.up();
 }
 await drawAnnotation('window',[.15,.30],[.29,.49]);
 await drawAnnotation('window',[.69,.30],[.80,.49]);
 await drawAnnotation('door',[.53,.70],[.67,.94]);
 assert.equal(await page.evaluate(()=>window.__milovicePhotoSurvey.metrics.boxes),3);
 await page.locator('#photo-rights').check();
 await page.locator('#photo-confirm').click();
 assert((await page.locator('#photo-status').innerText()).includes('Potvrzeno'),'Photo annotation confirmation failed');
 const proof=await page.evaluate(id=>{
  const card=JSON.parse(localStorage.getItem('milovice_rp_street_editor_v1'))[String(id)];
  return card?.facades?.[Object.keys(card.facades).find(x=>card.facades[x].layout?.photoConfirmed)];
 },selected);
 assert(proof?.layout?.openings?.length===3&&proof?.photoEvidence?.rightsConfirmed,
  'Photo geometry was not retained as authorized coordinates');
 assert(!JSON.stringify(proof).includes('data:image'),'Image data must NOT be stored in building card');
 await page.locator('#next').click();
 assert.notEqual(await page.evaluate(()=>window.__miloviceEditor.chosenId),selected,
   'Next house re-selected the same building');
 await page.evaluate(id=>window.__miloviceEditor.openBuilding(id),selected);
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
 const formValidity=await page.locator('#inspector').evaluate(form=>({
  valid:form.checkValidity(),
  invalid:[...form.elements].filter(el=>el.willValidate&&!el.checkValidity())
   .map(el=>({id:el.id,value:el.value,message:el.validationMessage}))
 }));
 if(!formValidity.valid)throw Error('Facade survey HTML form invalid: '+JSON.stringify(formValidity));
 await page.locator('#inspector button[type=submit]').click();
 assert((await page.locator('#message').innerText()).includes('Karta uložena'),'Save did not work');
 assert(await page.evaluate(()=>window.__miloviceEditor.cards)>0);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__miloviceEditor?.loaded===true,null,{timeout:45000});
 await page.evaluate(id=>window.__miloviceEditor.openBuilding(id),selected);
 assert.equal(await page.locator('#stage').inputValue(),'verified','local progress not persisted');
 assert.equal(await page.locator('#face-status').inputValue(),'seen','Per-facade review not persisted');
 assert.equal(await page.locator('#face-rows').inputValue(),'2,3','Per-floor geometry not persisted');
 await page.waitForFunction(()=>window.__miloviceEditor?.publishedCount===0,null,{timeout:12000});
 assert.equal(await page.evaluate(()=>window.__miloviceEditor.reviewCandidateCount),1,
  'A locally verified house should be eligible for a human-reviewed batch');
 const exportWait=page.waitForEvent('download');
 await page.locator('#review-export').click();
 const downloaded=await exportWait;
 assert.equal(downloaded.suggestedFilename(),'milovice-architecture-for-review.json',
  'The review batch must be an explicit downloadable JSON');
 assert((await page.locator('#photo-status').innerText()).includes('3 potvrzených otvorů'),
  'Local photograph annotations were not preserved after reload');
 assert.equal(await page.locator('#facadeColor').inputValue(),'#b2a090');
 assert.equal(await page.locator('#roofKind').inputValue(),'gable');
 const bridge=await page.evaluate(async()=>{
  const mod=await import('./scripts/street-architecture.js?v=5110');
  return [...mod.loadLocalArchitectureCards(localStorage)].map(([id,data])=>
   ({id,color:data.facadeColor,height:data.height,roof:data.roofKind,facades:data.facades}));
 });
 assert(bridge.some(x=>x.id===String(selected)&&x.color==='#b2a090'&&x.height===7.2&&x.roof==='gable'&&
  x.facades?.[firstFace]?.rows?.join(',')==='2,3'&&
  x.facades[firstFace].openings?.length===3&&
  x.facades[firstFace].photoEvidence?.kind==='local-owned-photo'),
  'Editor per-facade layout did not become loadable verified 3D geometry input');
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
 assert(applied.bridge?.publishedVerified===0&&applied.bridge?.previewVerified===1&&
   applied.bridge?.sourceMap?.['118487963']==='local',
  'Personal editor draft must not be mislabelled as a publicly published house');
 if(!(applied.bridge.loadedVerified>=1&&applied.bridge.loadedFacadeLayouts>=1&&
      applied.bridge.applied>=1&&applied.hero?.verifiedOverrides>=1&&applied.hero?.verifiedFaces>=1&&
      applied.hero.photoMappedFaces>=1&&applied.hero.photoMappedWindows>=2&&
      applied.hero.faceAudits.some(f=>f.id===String(selected)&&f.side===firstFace&&
       f.wallColor==='#d3b39c'&&f.photoMapped&&f.windows===2&&f.windowPositions.length===2)))
  throw Error('Verified individual facade geometry was not applied to the correct 3D house wall: '+
   JSON.stringify({applied,firstFace}));
 // Simulate publishing a manually reviewed house: mock the checked-in JSON on
 // a clean browser (no localStorage), not a fake review in the public repo.
 await page.evaluate(()=>localStorage.clear());
 const publishedRecord={
  stage:'verified',source:'https://commons.wikimedia.org/wiki/File:Licensed_test_reference.jpg',
  notes:'Human-reviewed building geometry from the original permitted reference',
  floors:'2',height:'7.2',facadeColor:'#d0bfa8',
  facades:{S:{status:'seen',source:'https://commons.wikimedia.org/wiki/File:Licensed_test_reference.jpg',
   notes:'Source checked against the correct OSM building and facade orientation',
   layout:{rows:'2,3',doorAt:'left',windowWidth:'1.1',wallColor:'#d0bfa8'}}},
  review:{approved:true,reviewer:'Smoke test reviewer',
   summary:'Checked referenced OSM way, facade side and licensed photograph',
   reviewedAt:'2026-11-13T12:00:00Z'}
 };
 await page.route('**/data/architecture/verified-buildings.json?*',route=>route.fulfill({
  status:200,contentType:'application/json',
  body:JSON.stringify({schema:'milovice-rp-approved-buildings-v1',
   buildings:{'118487963':publishedRecord}})
 }));
 await page.reload({waitUntil:'domcontentloaded',timeout:40000});
 await page.waitForFunction(()=>window.__miloviceArchitectureBridge?.appliedIds.includes('118487963')&&
  window.__miloviceArchitectureBridge.publishedVerified===1,null,{timeout:60000});
 const published=await page.evaluate(()=>({
  bridge:window.__miloviceArchitectureBridge,hero:window.__miloviceHeroArchitecture
 }));
 assert(published.bridge.previewVerified===0&&published.bridge.localOnly===0&&
  published.bridge.sourceMap['118487963']==='published'&&
  published.hero.verifiedFaces>=1&&published.hero.verifiedOverrides>=1,
  'Source-reviewed public architecture failed to load and render in a fresh browser: '+
   JSON.stringify(published));
 if(errors.length)throw Error(errors.slice(0,5).join('\n'));
 console.log('Street editor and public architecture OK:',JSON.stringify({
  local:applied.bridge,published:published.bridge,
  publicFacade:published.hero.faceAudits.find(f=>f.id==='118487963')}));

}finally{await browser.close()}
