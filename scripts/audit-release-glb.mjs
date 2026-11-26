// Inspect exact runtime GLB bytes, not a legal clearance or visual logo audit.
import {createHash} from 'node:crypto';
import {writeFileSync} from 'node:fs';
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
const [mode,out]=process.argv.slice(2);
if(mode==='--self-test')selfTest();
else if(mode==='--audit'&&out)await audit(out);
else throw Error('Use --self-test or --audit <new-json-path>');
