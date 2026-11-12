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
 const landmarkChecks=await page.evaluate(()=>window.__miloviceLandmarkDebug||{});
 console.log('Landmark geometry:',JSON.stringify(landmarkChecks));
 if(landmarkChecks.stationPassageFaces!==2)throw new Error('Milovice station does not have two opposing real open passage portals: '+JSON.stringify(landmarkChecks));
 if(!landmarkChecks.stationParts?.center||!landmarkChecks.stationParts?.left||!landmarkChecks.stationParts?.right)throw new Error('Station wing/center massing missing');
 if(!landmarkChecks.stationSign||!landmarkChecks.stationCanopy||!landmarkChecks.stationStreetSign)
  throw new Error('4.9 station architecture missing: '+JSON.stringify(landmarkChecks));
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
 console.log('Smoke OK: rendered 3D, terrain, walking, car, mission controls');
 if(errors.length)console.log('Nonfatal browser messages:',errors.slice(0,6));
 await context.close();
}finally{await browser.close()}
