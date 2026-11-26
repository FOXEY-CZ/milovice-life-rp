// Inspect exact runtime GLB bytes, not a legal clearance or visual logo audit.
import {createHash} from 'node:crypto';
import {writeFileSync,openSync,fstatSync,readSync,closeSync} from 'node:fs';
import assert from 'node:assert/strict';
const showcase='https://raw.githubusercontent.com/trebeljahr/quaternius-showcase/0128ca510d653bb04d6d1e4885bd8890b5050b4f/public/glb/';
const garage='https://raw.githubusercontent.com/bennibeni/garage/5c26fd4bac37080cd55f8064c59de4b14b489ddd/public/models/';
const entries=[
 ['casualMan',showcase+'modular_men/Casual.glb',785308],
 ['casualWoman',showcase+'modular_women/Casual.glb',804896],
 ['suitMan',showcase+'modular_men/Suit.glb',857732],
 ['broadleaf',showcase+'nature_pack/CommonTree_3.glb',null],
 ['birch',showcase+'nature_pack/BirchTree_2.glb',null],
 ['spectralGT','https://raw.githubusercontent.com/JaronKBragg7337/spectral-gt-rs/34499c501908818a2b08e589a7aecf963343cee7/spectral_gt_rs_game_ready.glb',4688844],
 ['citySUV',garage+'quaternius-suv.glb',181608],
 ['cityCar',garage+'quaternius-car.glb',174320],
 ['citySport',garage+'quaternius-sport.glb',175100]
];
// Observed in successful preview run 45742322194; byte identity only, not rights approval.
const observed=Object.freeze({
  "casualMan": {
    "bytes": 785308,
    "sha256": "dc2d86e50075e372df870bb60cee46c56033cc2ecb28722523caab93ab1d0111"
  },
  "casualWoman": {
    "bytes": 804896,
    "sha256": "522cd442880c6769bdf079f1a2161a1aaffe78b32f1de64fb990644b2e327fea"
  },
  "suitMan": {
    "bytes": 857732,
    "sha256": "a9896c1468fadbd24a89a2f86eecd8d47ae5ec6b3ef267b2194dc3b8bb9fb3d0"
  },
  "broadleaf": {
    "bytes": 89340,
    "sha256": "01ce29544f56c7f1d0828fe8268b45ff3d75a4612b067ac3707c9bfb11a02f7f"
  },
  "birch": {
    "bytes": 90348,
    "sha256": "165aac1b43f009cd7b8145242c86f5b189917281324d272eafde312cd09d16c8"
  },
  "spectralGT": {
    "bytes": 4688844,
    "sha256": "e7b7f0d9de0c3bc3897c8134b1ceae5631b1da2690d336df18c3ea82e7238c73"
  },
  "citySUV": {
    "bytes": 181608,
    "sha256": "1a9ce2bba813dca5005abab09715b01b8b5f4a9c48d7260463afdfeb876aa8b6"
  },
  "cityCar": {
    "bytes": 174320,
    "sha256": "e5f5fa41c4434383b20287725c0e9d757cbd0f059eedc342ec265d32a195fe39"
  },
  "citySport": {
    "bytes": 175100,
    "sha256": "bbb1c718d2aaf5f4344e9fb2cd66d8332a998a515b09ddd4dfa14698d787124e"
  }
});
const sha256=b=>createHash('sha256').update(b).digest('hex');
function inspect(bytes){
 assert(bytes.length>=20&&bytes.readUInt32LE(0)===0x46546c67,'GLB magic');
 assert.equal(bytes.readUInt32LE(4),2,'GLB version');
 assert.equal(bytes.readUInt32LE(8),bytes.length,'declared length');
 let json,bin=null;
 for(let p=12;p<bytes.length;){
  assert(p+8<=bytes.length,'chunk header');
  const n=bytes.readUInt32LE(p),kind=bytes.readUInt32LE(p+4);
  assert(n%4===0&&p+8+n<=bytes.length,'chunk bounds');
  const part=bytes.subarray(p+8,p+8+n);
  if(p===12)assert.equal(kind,0x4e4f534a,'first chunk must be JSON');
  if(kind===0x4e4f534a){assert(!json,'duplicate JSON');json=JSON.parse(part.toString('utf8'));}
  if(kind===0x004e4942){assert(bin===null,'duplicate BIN');bin=part;}
  p+=8+n;
 }
 assert.equal(json?.asset?.version,'2.0');
 const external=[];
 for(const [kind,objects] of [['buffer',json.buffers||[]],['image',json.images||[]]])for(const [i,item] of objects.entries())if(typeof item.uri==='string'&&!item.uri.startsWith('data:'))external.push({kind,index:i,uri:item.uri});
 const images=(json.images||[]).map((im,i)=>{
  let hash=null;
  if(Number.isInteger(im.bufferView)){
   const v=json.bufferViews?.[im.bufferView];assert(v,'image bufferView');
   if(v.buffer===0&&bin&& !json.buffers?.[0]?.uri){
    const start=v.byteOffset||0,end=start+v.byteLength;
    assert(Number.isSafeInteger(start)&&Number.isSafeInteger(end)&&start>=0&&end<=bin.length&&end>start,'image bounds');
    hash=sha256(bin.subarray(start,end));
   }
  }
  return {index:i,name:im.name||null,mimeType:im.mimeType||null,embedded:im.bufferView!==undefined||im.uri?.startsWith('data:')===true,sha256:hash};
 });
 return {bytes:bytes.length,sha256:sha256(bytes),asset:json.asset,extensionsUsed:json.extensionsUsed||[],external,images,materials:(json.materials||[]).map(m=>m.name||null),meshes:(json.meshes||[]).length,animations:(json.animations||[]).map(a=>a.name||null)};
}
function selfTest(){
 const json=Buffer.from(JSON.stringify({asset:{version:'2.0'},buffers:[{byteLength:4}],bufferViews:[{buffer:0,byteLength:4}],images:[{bufferView:0,mimeType:'image/png'},{uri:'other.png'}]}));
 const pad=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
 const h=Buffer.alloc(20);h.writeUInt32LE(0x46546c67);h.writeUInt32LE(2,4);h.writeUInt32LE(20+pad.length+12,8);h.writeUInt32LE(pad.length,12);h.writeUInt32LE(0x4e4f534a,16);
 const bin=Buffer.alloc(12);bin.writeUInt32LE(4);bin.writeUInt32LE(0x004e4942,4);bin.writeUInt32LE(123,8);
 const bytes=Buffer.concat([h,pad,bin]);const result=inspect(bytes);
 assert.equal(result.images[0].sha256,sha256(bin.subarray(8)));assert.equal(result.external[0].uri,'other.png');
 assert.throws(()=>inspect(bytes.subarray(0,-1)));console.log('PASS GLB audit parser self-test');
}
async function audit(output){
 const report={schema:1,review:'pending',models:[]};
 for(const [id,url,expectedBytes] of entries){
  try{
   const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(30000)});
   assert(r.ok,'HTTP '+r.status);
   const limit=32*1024*1024;let size=0;const chunks=[];
   for await(const chunk of r.body){size+=chunk.byteLength;assert(size<=limit,'asset exceeds audit size limit');chunks.push(Buffer.from(chunk));}
   const result=inspect(Buffer.concat(chunks));
   const pin=observed[id];assert(pin,'missing observed baseline');
   report.models.push({id,url,expectedBytes:pin.bytes,sizeMatches:result.bytes===pin.bytes,hashMatches:result.sha256===pin.sha256,declaredLicense:'CC0-1.0',review:'pending',...result});
  }catch(e){report.models.push({id,url,review:'pending',error:String(e)});}
 }
 writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 for(const m of report.models)console.log(JSON.stringify({id:m.id,bytes:m.bytes,sha256:m.sha256,images:m.images?.length,external:m.external?.length,sizeMatches:m.sizeMatches,hashMatches:m.hashMatches,error:m.error}));
 if(report.models.some(m=>m.error||m.sizeMatches!==true||m.hashMatches!==true||m.external?.length))process.exitCode=1;
}
// The pinned garage license names original Brotli-compressed GLBs.
async function compareCars(output){
 const {brotliDecompressSync}=await import('node:zlib');
 const originals={
  cityCar:'d35173c8-6078-4367-8f87-b1f2599f0bb7',
  citySport:'34db1344-31cc-49ac-bc46-c055f68e39ca',
  citySUV:'e5fbf2ee-5c9e-47d5-8ab6-80cacd463baa'
 };
 const results=[];
 for(const [id,file] of Object.entries(originals)){
  const url='https://static.poly.pizza/'+file+'.glb.br';
  try{
   const r=await fetch(url,{signal:AbortSignal.timeout(30000),redirect:'error'});
   if(!r.ok){results.push({id,url,status:'unavailable',httpStatus:r.status,matches:null});continue;}
   const chunks=[];let size=0;
   for await(const chunk of r.body){size+=chunk.byteLength;assert(size<=32*1024*1024,'source too large');chunks.push(Buffer.from(chunk));}
   const raw=Buffer.concat(chunks);
   const bytes=raw.length>=4&&raw.readUInt32LE(0)===0x46546c67?raw:brotliDecompressSync(raw,{maxOutputLength:32*1024*1024});
   const result=inspect(bytes),pin=observed[id];
   const matches=result.sha256===pin.sha256&&result.bytes===pin.bytes;
   results.push({id,url,bytes:result.bytes,sha256:result.sha256,status:matches?'match':'mismatch',matches});
  }catch(e){results.push({id,url,status:'unverified',error:String(e),matches:null});}
 }
 writeFileSync(output,JSON.stringify({review:'pending',results},null,2)+'\n',{flag:'wx'});
 for(const result of results)console.log(JSON.stringify(result));
 if(results.some(r=>r.matches!==true))process.exitCode=1;
}
// Compare legitimately obtained local GLBs without fetching or uploading asset bytes.
async function compareLocalCars(output,files){
 const {brotliDecompressSync}=await import('node:zlib');
 const ids=['cityCar','citySport','citySUV'],limit=32*1024*1024;
 assert.equal(files.length,ids.length,'Provide car, sport and SUV files in that order');
 const results=[];
 for(const [i,id] of ids.entries()){
  let fd;
  try{
   fd=openSync(files[i],'r');
   const stat=fstatSync(fd);
   assert(stat.isFile()&&stat.size>0&&stat.size<=limit,'Not a regular file within size limit');
   const raw=Buffer.alloc(stat.size);
   let pos=0;
   while(pos<raw.length){const count=readSync(fd,raw,pos,raw.length-pos,null);assert(count>0,'Unexpected end of file');pos+=count;}
   assert.equal(readSync(fd,Buffer.alloc(1),0,1,null),0,'File changed while reading');
   const bytes=raw.length>=4&&raw.readUInt32LE(0)===0x46546c67?raw:brotliDecompressSync(raw,{maxOutputLength:limit});
   const result=inspect(bytes),pin=observed[id];
   const matches=result.bytes===pin.bytes&&result.sha256===pin.sha256;
   results.push({id,bytes:result.bytes,sha256:result.sha256,status:matches?'match':'mismatch',matches});
  }catch(error){results.push({id,status:'unverified',error:String(error.code||error.name),matches:null});}
  finally{if(fd!==undefined)closeSync(fd);}
 }
 // Deliberately omit local paths and source file contents from the report.
 writeFileSync(output,JSON.stringify({review:'pending',scope:'local byte identity only; source origin not authenticated',results},null,2)+'\n',{flag:'wx'});
 for(const result of results)console.log(JSON.stringify(result));
 if(results.some(r=>r.matches!==true))process.exitCode=1;
}
// Compare the actual exported runtime registries to the pinned audit list.
// Imports use the exact npm Three.js revision in the game. No model is downloaded by importing.
async function checkRuntime(output){
 const [{HUMAN_ASSETS},{TREE_ASSETS},{LICENSED_VEHICLES}]=await Promise.all([
  import('./human-assets.js'),import('./nature-assets.js'),import('./vehicle-assets.js')
 ]);
 const runtime=[
  ...Object.entries(HUMAN_ASSETS).map(([id,a])=>({id,url:a.url,bytes:a.bytes,license:a.license,category:'human'})),
  ...Object.entries(TREE_ASSETS).map(([id,url])=>({id,url,bytes:null,license:null,category:'tree'})),
  ...Object.entries(LICENSED_VEHICLES).map(([id,a])=>({id,url:a.uri,bytes:a.fileBytes,license:a.license,category:'vehicle'}))
 ];
 const issues=[],auditIds=new Set(),runtimeIds=new Set(),runtimeUrls=new Set();
 const auditMap=new Map();
 for(const [id,url,bytes] of entries){
  if(auditIds.has(id))issues.push('Duplicate audit id: '+id);
  auditIds.add(id);auditMap.set(id,{url,bytes});
  if(!observed[id])issues.push('Missing observed hash: '+id);
  if(bytes!==null&&observed[id]?.bytes!==bytes)issues.push('Audit size baseline mismatch: '+id);
 }
 for(const id of Object.keys(observed))if(!auditIds.has(id))issues.push('Orphan observed hash: '+id);
 for(const a of runtime){
  if(runtimeIds.has(a.id))issues.push('Duplicate runtime id: '+a.id);
  if(runtimeUrls.has(a.url))issues.push('Duplicate runtime URL: '+a.url);
  runtimeIds.add(a.id);runtimeUrls.add(a.url);
  const pin=auditMap.get(a.id);
  if(!pin){issues.push('Unaudited runtime model: '+a.id);continue;}
  if(a.url!==pin.url)issues.push('URL mismatch: '+a.id);
  if(a.bytes!==pin.bytes)issues.push('Declared size mismatch: '+a.id);
  if(a.category!=='tree'&&a.license!=='CC0-1.0')issues.push('License declaration changed: '+a.id);
 }
 for(const id of auditIds)if(!runtimeIds.has(id))issues.push('Audit entry not in runtime registry: '+id);
 const report={schema:1,review:'pending',runtime,auditCount:entries.length,issues};
 writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({runtime:runtime.length,audit:entries.length,issues}));
 if(issues.length)process.exitCode=1;
}

const [mode,out,...files]=process.argv.slice(2);
if(mode==='--self-test')selfTest();
else if(mode==='--audit'&&out)await audit(out);
else if(mode==='--compare-cars'&&out)await compareCars(out);
else if(mode==='--check-runtime'&&out)await checkRuntime(out);
else if(mode==='--compare-local-cars'&&out)await compareLocalCars(out,files);
else throw Error('Use --self-test, --audit, --compare-cars, --check-runtime or --compare-local-cars <new-json-path> [car sport SUV]');
