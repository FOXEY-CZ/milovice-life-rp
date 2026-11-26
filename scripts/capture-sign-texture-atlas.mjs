import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright-core';
const out=join(process.env.RUNNER_TEMP||'.','sign-atlas');mkdirSync(out,{recursive:false});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:760}});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.addInitScript(()=>{
  const byCanvas=new WeakMap(),records=[];let overflow=false;
  for(const method of ['fillText','strokeText']){
   const original=CanvasRenderingContext2D.prototype[method];
   CanvasRenderingContext2D.prototype[method]=function(...args){
    const value=Reflect.apply(original,this,args),c=this.canvas;
    if(!c.isConnected&&c.width>=128&&c.height>=32){
     let r=byCanvas.get(c);
     if(!r){
      if(records.length>=160){overflow=true;return value;}
      r={canvas:c,labels:new Set(),uploads:0};byCanvas.set(c,r);records.push(r);
     }
     if(r.labels.size<100)r.labels.add(String(args[0]));else overflow=true;
    }
    return value;
   };
  }
  for(const C of [window.WebGLRenderingContext,window.WebGL2RenderingContext]){
   if(!C)continue;
   for(const method of ['texImage2D','texSubImage2D']){
    // Own native methods only, avoiding wrapping inherited implementations twice.
    if(!Object.hasOwn(C.prototype,method))continue;
    const original=C.prototype[method];
    C.prototype[method]=function(...args){
     const result=Reflect.apply(original,this,args);
     for(const arg of args){
      if(!(arg instanceof HTMLCanvasElement))continue;
      const r=byCanvas.get(arg);if(r)r.uploads++;
     }
     return result;
    };
   }
  }
  window.__signAtlas=()=>{
   const result=[];
   for(const r of records){
    const c=r.canvas;if(c.isConnected)continue;
    if(c.width>2048||c.height>2048){overflow=true;continue;}
    result.push({width:c.width,height:c.height,labels:[...r.labels],uploads:r.uploads,png:c.toDataURL('image/png')});
   }
   return {result,overflow};
  };
 });
 await page.goto('http://127.0.0.1:8080/?forecourtAudit=bus',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__miloviceForecourtAuditRendered?.active===true,null,{timeout:120000});
 await page.waitForTimeout(6500);
 const snapshot=await page.evaluate(()=>window.__signAtlas());
 assert.equal(snapshot.overflow,false,'Capture limits exceeded');
 assert.deepEqual(errors,[]);
 assert.ok(snapshot.result.length>0,'No text canvases captured');
 const items=new Map();
 for(const r of snapshot.result){
  const bytes=Buffer.from(r.png.replace(/^data:image\/png;base64,/,''),'base64');
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  const hash=createHash('sha256').update(bytes).digest('hex');
  if(items.has(hash)){const existing=items.get(hash);existing.uploads+=r.uploads;existing.instances++;continue;}
  const filename='sign-'+String(items.size+1).padStart(3,'0')+'.png';
  writeFileSync(join(out,filename),bytes,{flag:'wx'});
  items.set(hash,{filename,hash,width:r.width,height:r.height,labels:r.labels,uploads:r.uploads,instances:1,png:r.png});
 }
 const list=[...items.values()];
 assert.ok(list.some(r=>r.uploads>0),'No text canvas observed in GPU upload calls');
 const sheets=[];
 for(let i=0;i<list.length;i+=12){
  const png=await page.evaluate(async rows=>{
   const c=document.createElement('canvas');c.width=1280;c.height=Math.ceil(rows.length/3)*380;
   const g=c.getContext('2d');g.fillStyle='#19242d';g.fillRect(0,0,c.width,c.height);
   for(const [j,row] of rows.entries()){
    const x=(j%3)*426,y=Math.floor(j/3)*380;
    const im=new Image();im.src=row.png;await im.decode();
    g.fillStyle='#fff';g.font='17px sans-serif';g.fillText(row.filename+' | '+row.width+'×'+row.height,x+12,y+23);
    g.fillStyle='#b8d7dc';g.font='14px sans-serif';g.fillText('WebGL upload calls: '+row.uploads,x+12,y+44);
    const scale=Math.min(400/im.width,315/im.height,2);
    g.fillStyle='#59636b';g.fillRect(x+12,y+55,400,315);
    g.drawImage(im,x+12+(400-im.width*scale)/2,y+55+(315-im.height*scale)/2,im.width*scale,im.height*scale);
   }
   return c.toDataURL('image/png');
  },list.slice(i,i+12));
  const filename='atlas-'+String(sheets.length+1).padStart(2,'0')+'.png';
  writeFileSync(join(out,filename),Buffer.from(png.split(',')[1],'base64'),{flag:'wx'});sheets.push(filename);
 }
 await page.screenshot({path:join(out,'station-bus-camera.png')});
 const build=await page.locator('#build-label').textContent();
 const report={build,scope:'developer forecourt bus camera, generated detached text canvases; upload call observed, not proof of draw or visibility; no legal review',unique:list.length,uploaded:list.filter(r=>r.uploads>0).length,sheets,records:list.map(({png,...r})=>r),errors};
 writeFileSync(join(out,'report.json'),JSON.stringify(report,null,2),{flag:'wx'});
 console.log('SIGN ATLAS',JSON.stringify(report));
}finally{await browser.close();}
