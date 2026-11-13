// Browser smoke test: validate actual 3D startup, terrain, spawn picker and job HUD.
// Runs against the checked-out game served locally on port 8080.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,
 args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
try{
 const context=await browser.newContext({viewport:{width:1280,height:760},deviceScaleFactor:1});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(String(error.stack||error)));
 page.on('console',message=>{if(message.type()==='error')errors.push('console: '+message.text())});
 await page.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__miloviceStarted===true,{timeout:45000});
 await page.waitForFunction(()=>{
  const el=document.getElementById('rp-spawn');
  return el&&!el.hidden;
 },{timeout:45000});
 const gfx=await page.evaluate(()=>window.__miloviceGraphics2||null);
 if(!gfx?.active||gfx.albedoTiles!==8||gfx.contactShadow!==true||
    !gfx.surfaceMaterials||Object.values(gfx.surfaceMaterials).some(v=>v!==true))
  throw new Error('Graphics 2.0 materials did not initialize correctly: '+JSON.stringify(gfx));
 console.log('5.2.0 shared city surfaces:',JSON.stringify(gfx.surfaceMaterials));
 if(!(await page.locator('#build-label').innerText()).includes('vehicles-534'))
  throw new Error('5.3.0 build identifier missing');
 const sidewalkCheck=await page.evaluate(()=>window.__miloviceSidewalkDebug||null);
 if(!sidewalkCheck||sidewalkCheck.legacyUnderRoadBands!==0||
    !(sidewalkCheck.separatedSidewalks>15))
  throw new Error('5.2.1 sidewalk bands must flank roadway, never cover it: '+JSON.stringify(sidewalkCheck));
 console.log('5.2.1 sidewalk road-edge diagnostics:',JSON.stringify(sidewalkCheck));
 // The imported character library starts asynchronously and may fall back safely
 // when a third-party CDN fails; verify the status and UI without blocking game startup.
 const humans=await page.evaluate(()=>window.__miloviceHumans||null);
 if(!humans||!['auto','on','off'].includes(humans.mode)||
    !(await page.locator('#rp-human-select').count()))
  throw new Error('5.3.0 rigged GLB character subsystem missing: '+JSON.stringify(humans));
 console.log('5.3.0 Quaternius character assets:',JSON.stringify(humans));
 console.log('5.3.0 GLB bone names:',JSON.stringify(humans.bones||[])); 
 // Require genuine external meshes, a valid humanoid skeleton, and moving bones.
 await page.waitForFunction(()=>window.__miloviceHumans?.playerReady===true,
    null,{timeout:30000});
 const animated=await page.evaluate(()=>window.__miloviceHumans);
 if(!(animated.heightMeters>=1.65&&animated.heightMeters<=2.2))throw new Error('5.3.2 the character is still giant or floating; height='+animated.heightMeters+' originalGLBScale='+JSON.stringify(animated.originalGLBScale));
 if(animated.armsDown!==true)throw new Error('5.3.2 human is still T-posed: '+JSON.stringify(animated));
  if(Math.abs(animated.facingCorrectionRadians-Math.PI)>.0001)
   throw new Error('5.3.3 import needs +Z to -Z heading correction: '+JSON.stringify(animated));
 console.log('5.3.2 normalized humanoid standing height:',animated.heightMeters,'m, source scale',animated.originalGLBScale);
 if(animated.bones?.length<35||animated.runtimeSkeletalWalk!==true)
  throw new Error('5.3.0 loaded human has no usable locomotion skeleton: '+JSON.stringify(animated));
 console.log('5.3.0 working skeletal walk from Quaternius bones:',JSON.stringify({
  bones:animated.bones.length,runtimeSkeletalWalk:animated.runtimeSkeletalWalk
 }));
 // Existing roadside vegetation must actually be replaced with imported GLB,
 // not just be a hidden loader or another spherical procedurally generated tree.
 await page.waitForFunction(()=>['ready','fallback'].includes(window.__miloviceNatureGLB?.state),
   null,{timeout:30000});
 const nature=await page.evaluate(()=>window.__miloviceNatureGLB);
 console.log('5.3.0 real tree assets:',JSON.stringify(nature));
 // The new phone-default GLB car is small and has an independently verifiable CC0 source.
 const mobileCar=await page.evaluate(async()=>{
  const {LICENSED_VEHICLES}=await import('./scripts/vehicle-assets.js?v=531');
  const asset=LICENSED_VEHICLES.cityCar;
  if(!asset)return null;
  const response=await fetch(asset.uri,{mode:'cors'});
  return {ok:response.ok,status:response.status,license:asset.license,bytes:asset.fileBytes};
 });
 if(!mobileCar?.ok||mobileCar.license!=='CC0-1.0'||mobileCar.bytes>300000)
  throw new Error('5.3.0 lightweight mobile GLB car cannot be fetched: '+JSON.stringify(mobileCar));
 console.log('5.3.0 mobile CC0 car successfully fetched:',JSON.stringify(mobileCar));

 if(!(await page.locator('#rp-model-select').locator('option[value="auto"]').innerText()).includes('PC i mobil'))throw new Error('New mobile vehicle quality mode absent');
 if(nature.state!=='ready'||nature.instances<3||nature.loaded.length<1)
  throw new Error('Near-station GLB tree replacement did not materialize: '+JSON.stringify(nature));

 const landmarkChecks=await page.evaluate(()=>window.__miloviceLandmarkDebug||{});
 console.log('Landmark geometry:',JSON.stringify(landmarkChecks));
 if(landmarkChecks.stationPassageFaces!==2)throw new Error('Milovice station does not have two opposing real open passage portals: '+JSON.stringify(landmarkChecks));
 if(!landmarkChecks.stationParts?.center||!landmarkChecks.stationParts?.left||!landmarkChecks.stationParts?.right)throw new Error('Station wing/center massing missing');
 if(!landmarkChecks.stationSign||!landmarkChecks.stationCanopy||!landmarkChecks.stationStreetSign)
  throw new Error('4.9 station architecture missing: '+JSON.stringify(landmarkChecks));
 if(!landmarkChecks.stationForecourt||!landmarkChecks.stationStreetEntrance)
  throw new Error('5.1.1 station forecourt/entry missing: '+JSON.stringify(landmarkChecks));
 if(landmarkChecks.stationFacadeWindows<8||!landmarkChecks.stationPassagePaving)
  throw new Error('5.1.4 station facade windows or passage paving missing: '+JSON.stringify(landmarkChecks));
 if(landmarkChecks.stationSidewalkConnected!==true||landmarkChecks.stationFootwayId!==549346217||
    landmarkChecks.stationAccessConnectorSegments!==4||!(landmarkChecks.stationAccessDistance>0&&landmarkChecks.stationAccessDistance<28))
  throw new Error('5.1.5 station pedestrian access must connect OSM footway 549346217 to both passage exits: '+JSON.stringify(landmarkChecks));
 if(landmarkChecks.platformTactileStrips<3||landmarkChecks.platformEdgeMeters<30)
  throw new Error('5.1.3 mapped station platform tactile edging missing: '+JSON.stringify(landmarkChecks));
 const diagnostics=await page.evaluate(()=>({rail:window.__miloviceRailDebug,models:window.__miloviceModelDebug,range:window.__miloviceDrawDistance}));
 console.log('5.0 models and train:',JSON.stringify(diagnostics));
 if(diagnostics.rail?.loaded!==true||diagnostics.rail?.cars!==3)throw new Error('Three-coach rail traffic missing');
 if(diagnostics.models?.humans!==30||diagnostics.models?.articulatedBuses<1||!diagnostics.models?.playerHuman)throw new Error('Human/vehicle population missing');
 if(diagnostics.range!==620)throw new Error('Default Milovice draw distance not applied');
 const terrain=await page.locator('#terrain-status').innerText();
 console.log('Loaded terrain:',terrain);
 if(!terrain.includes('ČÚZK DMR 4G'))throw new Error('Official DEM did not load');
 const status=await page.locator('#status').innerText();console.log('World status:',status);
 await mkdir('browser-artifacts',{recursive:true});
 await page.locator('[data-spawn="walking"]').click();
 if((await page.locator('#mode').innerText())!=='Pěšky')throw new Error('Walking spawn did not work');
 await page.screenshot({path:'browser-artifacts/milovice-realistic-city.png'});
 await page.locator('#maplaunch').click();
 await page.waitForSelector('.milovice-player-marker .milovice-player-arrow',{timeout:25000});
 if(!(await page.locator('#mapfollow').isVisible()))throw new Error('Full-map recenter missing');
 console.log('Full map marker: OK');
 await page.screenshot({path:'browser-artifacts/milovice-full-map.png'});
 await page.locator('#closemap').click();
 await page.locator('#rp-vehicles').click();
 await page.locator('[data-spawn="sedan"]').click();
 if(!(await page.locator('#mode').innerText()).includes('Řidič auta'))throw new Error('Car spawn did not work');
 if(await page.locator('#doors').isVisible())throw new Error('Bus-only door button visible during car free roam');
 await page.locator('#rp-vehicles').click();
 await page.locator('#rp-model-select').selectOption('on');
 await page.locator('#rp-spawn-close').click();
 await page.waitForFunction(()=>window.__miloviceGLBDebug?.state==='ready'||window.__miloviceGLBDebug?.state==='fallback',null,{timeout:45000});
 const assetStats=await page.evaluate(()=>window.__miloviceGLBDebug);
 console.log('5.1.1 CC0 GLB diagnostics:',JSON.stringify(assetStats));
 if(assetStats.state!=='ready')throw new Error('Licensed high-resolution GLB failed to load: '+JSON.stringify(assetStats));
 await page.waitForFunction(()=>window.__miloviceGLBDebug?.active===true,null,{timeout:12000});
 await page.screenshot({path:'browser-artifacts/milovice-real-glb-vehicle.png'});
 await page.locator('#rp-vehicles').click();
 await page.locator('[data-spawn="suv"]').click();
 await page.waitForFunction(()=>['ready','fallback'].includes(window.__miloviceGLBDebug?.models?.citySUV),null,{timeout:45000});
 const suvState=await page.evaluate(()=>window.__miloviceGLBDebug);
 console.log('5.1.1 second CC0 GLB SUV:',JSON.stringify(suvState));
 if(suvState.models.citySUV!=='ready')throw new Error('Licensed SUV GLB unavailable: '+JSON.stringify(suvState));
 await page.waitForFunction(()=>window.__miloviceGLBDebug?.activeModel==='citySUV'&&window.__miloviceGLBDebug?.active===true,null,{timeout:12000});
 await page.screenshot({path:'browser-artifacts/milovice-cc0-suv.png'});
 await page.locator('#rp-jobs').click();
 await page.locator('#rp-job-start').click();
 const stopCount=await page.evaluate(()=>window.__miloviceTransitStops);
 if(stopCount!==3)throw new Error('Waiting pedestrians/stops not spawned: '+stopCount);
 if(!(await page.locator('#mode').innerText()).includes('Autobusová směna'))throw new Error('Job did not start');
 if(!(await page.locator('#doors').isVisible()))throw new Error('Job door button missing');
 await page.locator('#rp-vehicles').click();
 await page.locator('#rp-area-select').selectOption('mlada');
 await page.locator('[data-spawn="walking"]').click();
 await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada'),null,{timeout:105000});
 const mladaStats=await page.evaluate(()=>window.__miloviceAreaStats);
 console.log('Mladá streamed:',JSON.stringify(mladaStats));
 if(mladaStats?.landscape<5)throw new Error('Missing mapped Mladá parks/forest/grass: '+JSON.stringify(mladaStats));
 const commerce=await page.evaluate(()=>window.__miloviceCommerceDebug);
 console.log('5.1.2 surveyed shop storefronts:',JSON.stringify(commerce));
 if(!commerce?.names?.some(n=>n==='Billa')||!commerce.names.includes('Tesco')||!commerce.names.includes('Penny'))
  throw new Error('Named OSM supermarkets failed to render facades in Mladá: '+JSON.stringify(commerce));
 await page.screenshot({path:'browser-artifacts/milovice-mlada.png'});
 await page.locator('#rp-vehicles').click();
 await page.locator('#rp-area-select').selectOption('bozidar');
 await page.locator('[data-spawn="walking"]').click();
 await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('bozidar'),null,{timeout:105000});
 console.log('Boží Dar streamed:',JSON.stringify(await page.evaluate(()=>window.__miloviceAreaStats)));
 await page.screenshot({path:'browser-artifacts/milovice-bozidar.png'});
 await page.locator('#rp-vehicles').click();
 await page.locator('#rp-distance-select').selectOption('1000');
 if(await page.evaluate(()=>window.__miloviceDrawDistance)!==1000)throw new Error('Distance selector failed');
 await page.locator('#rp-distance-select').selectOption('620');
 await page.locator('#rp-graphics-select').selectOption('realistic');
 await page.waitForTimeout(1800);
 if(!(await page.locator('#rp-graphics-select').inputValue()).includes('realistic'))throw new Error('Quality preset selection failed');
 await page.screenshot({path:'browser-artifacts/milovice-graphics-shadows.png'});
 await page.locator('#rp-graphics-select').selectOption('balanced');
 await page.locator('#rp-spawn-close').click();
 console.log('Graphics: balanced and dynamic-shadow mode both rendered');
 // Mobile screenshot regression: don't let the giant diagnostics box hide the city.
 await page.setViewportSize({width:390,height:820});
 await page.waitForTimeout(300);
 const hudWidth=await page.locator('#hud').evaluate(el=>el.getBoundingClientRect().width);
 if(hudWidth>250)throw new Error('Mobile HUD is still oversized: '+hudWidth);
 if(!(await page.locator('#rp-hud-toggle').isVisible()))throw new Error('Mobile HUD info toggle missing');
 await page.locator('#rp-hud-toggle').click();
 if(!(await page.locator('#hud').evaluate(el=>el.classList.contains('rp-open'))))
  throw new Error('Mobile HUD could not expand');
 await page.locator('#rp-hud-toggle').click();
 if(await page.locator('#hud').evaluate(el=>el.classList.contains('rp-open')))
  throw new Error('Mobile HUD could not collapse');
 console.log('5.1.4 mobile compact HUD and toggle: OK');

 // Validate analog speed curve independent of screen / GPU performance.
 const curve=await page.evaluate(async()=>{
  const {pedestrianSpeed}=await import('./scripts/analog-controls.js?v=532a');
  return [0,.12,.35,.6,.75,1].map(x=>[x,pedestrianSpeed(x)]);
 });
 if(curve[0][1]!==0||curve[1][1]!==0||!(curve[2][1]>0&&curve[2][1]<curve[3][1]&&
      curve[3][1]<curve[4][1]&&curve[4][1]<curve[5][1]&&curve[5][1]>=5.49))
  throw new Error('5.3.2 joystick intensity curve is not continuous monotonic walk→run: '+JSON.stringify(curve));
 console.log('5.3.2 graded joystick curve:',JSON.stringify(curve));
 // Genuine touch-device layout: verify stick, then physically move it through the
 // walking and running zones. This caught the former T-pose/giant-model regression.
 const mobileContext=await browser.newContext({viewport:{width:390,height:820},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const mobile=await mobileContext.newPage();
 const mobileErrors=[];mobile.on('pageerror',e=>mobileErrors.push(String(e)));
 await mobile.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded',timeout:30000});
 await mobile.waitForFunction(()=>window.__miloviceStarted===true,{timeout:45000});
 await mobile.waitForFunction(()=>!document.getElementById('rp-spawn').hidden,{timeout:45000});
 await mobile.locator('[data-spawn="walking"]').click();
 await mobile.locator('#rp-joystick').waitFor({state:'visible',timeout:12000});
 if(await mobile.locator('#controls button[data-key="KeyW"]').isVisible())
  throw new Error('Touch D-pad should be hidden while virtual joystick is active');
 const bounds=await mobile.locator('#rp-joystick').boundingBox();
 const cx=bounds.x+bounds.width*.5,cy=bounds.y+bounds.height*.5,rad=Math.min(bounds.width,bounds.height)*.33;
 await mobile.mouse.move(cx,cy);await mobile.mouse.down();
 await mobile.mouse.move(cx,cy-rad*.44);
 await mobile.waitForTimeout(650);
 const slow=await mobile.evaluate(()=>window.__miloviceMovementDebug);
 if(!(slow.speed>.1&&slow.speed<3.1&&slow.stick.magnitude>.3&&!slow.running&&slow.facingDot>.93))
  throw new Error('Partial joystick deflection did not produce walking: '+JSON.stringify(slow));
 await mobile.mouse.move(cx,cy-rad*.99);await mobile.waitForTimeout(800);
 const fast=await mobile.evaluate(()=>window.__miloviceMovementDebug);
 if(!(fast.speed>3.1&&fast.running&&fast.speed>slow.speed&&fast.facingDot>.93))
  throw new Error('Full joystick deflection did not produce running: '+JSON.stringify({slow,fast}));
 // Moving the thumb behind the center must make the character turn around,
 // not play forward locomotion while the face points backwards.
 // The on-screen control layout changes as the touch D-pad collapses.
 // Re-read the CURRENT thumbstick bounds instead of reusing stale coordinates.
 const reverseBounds=await mobile.locator('#rp-joystick').boundingBox();
 const revX=reverseBounds.x+reverseBounds.width*.5;
 const revY=reverseBounds.y+reverseBounds.height*.5;
 const revRadius=Math.min(reverseBounds.width,reverseBounds.height)*.33;
 await mobile.mouse.move(revX,revY);await mobile.waitForTimeout(90);
 await mobile.mouse.move(revX,revY+revRadius*.9);await mobile.waitForTimeout(720);
 const backward=await mobile.evaluate(()=>window.__miloviceMovementDebug);
 const reverseDot=slow.travel.x*backward.travel.x+slow.travel.z*backward.travel.z;
 if(!(backward.speed>.5&&backward.facingDot>.93&&backward.stick.y<-.5&&reverseDot<-.93))
  throw new Error('5.3.3 backward joystick must truly reverse travel and keep facing forward: '+
   JSON.stringify({backward,slowTravel:slow.travel,reverseDot,reverseBounds}));
 await mobile.screenshot({path:'browser-artifacts/milovice-facing-backward.png'});
 await mobile.mouse.up();await mobile.waitForTimeout(460);
 const released=await mobile.evaluate(()=>window.__miloviceMovementDebug);
 if(released.stick.magnitude!==0||released.speed>.08)
  throw new Error('Joystick failed to stop when thumb released: '+JSON.stringify(released));
 console.log('5.3.3 joystick + GLB front alignment verified:',JSON.stringify({walk:slow.speed,run:fast.speed,forwardDot:slow.facingDot,runDot:fast.facingDot,reverseDot:backward.facingDot,released:released.speed}));
 // 5.3.4: verify each *real* imported GLB has its authored +Z nose
 // rotated into the game's -Z forward axis. Don't change the driving physics:
 // Quaternius source axes vary from the hand-built cars and spectral coupe.
 const vehicleOrientations=await mobile.evaluate(async()=>{
  const [{makeVehicleAssetManager,LICENSED_VEHICLES},THREE]=await Promise.all([
   import('./scripts/vehicle-assets.js?v=534'),import('three')
  ]);
  const manager=makeVehicleAssetManager(THREE);
  const results=[];
  for(const key of ['cityCar','citySUV','citySport','spectralGT']){
   const mesh=await manager.load(key);
   if(!mesh){results.push({key,available:false});continue}
   const axis=LICENSED_VEHICLES[key].frontAxis;
   const originalFront=new THREE.Vector3(axis==='+X'?1:axis==='-X'?-1:0,0,axis==='+Z'?1:axis==='-Z'?-1:0);
   mesh.updateMatrixWorld(true);
   const front=originalFront.applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()));
   const dot=front.dot(new THREE.Vector3(0,0,-1));
   results.push({key,available:true,axis,dot,
    correction:mesh.userData.miloviceFrontCorrection,
    measuredLength:new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3()).z});
  }
  return results;
 });
 if(vehicleOrientations.some(v=>!v.available||v.dot<.98||v.measuredLength<3.5||v.measuredLength>5.5))
  throw new Error('5.3.4 vehicle GLB nose must align with driving direction: '+JSON.stringify(vehicleOrientations));
 console.log('5.3.4 verified real GLB vehicle orientations:',JSON.stringify(vehicleOrientations));
 await mobile.screenshot({path:'browser-artifacts/milovice-analog-joystick.png'});
 if(mobileErrors.length)throw new Error('Mobile JavaScript errors: '+mobileErrors.slice(0,3).join(' | '));
 await mobileContext.close();
 console.log('Smoke OK: rendered 3D, terrain, walking, car, mission controls');
 if(errors.length)console.log('Nonfatal browser messages:',errors.slice(0,6));
 await context.close();
}finally{await browser.close()}
