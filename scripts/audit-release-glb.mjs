// Inspect exact runtime GLB bytes, not a legal clearance or visual logo audit.
import {createHash} from 'node:crypto';
import {writeFileSync,readFileSync} from 'node:fs';
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
   report.models.push({id,url,expectedBytes,sizeMatches:expectedBytes===null?null:result.bytes===expectedBytes,declaredLicense:'CC0-1.0',review:'pending',...result});
  }catch(e){report.models.push({id,url,review:'pending',error:String(e)});}
 }
 writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 for(const m of report.models)console.log(JSON.stringify({id:m.id,bytes:m.bytes,sha256:m.sha256,images:m.images?.length,external:m.external?.length,sizeMatches:m.sizeMatches,error:m.error}));
 if(report.models.some(m=>m.error||m.sizeMatches===false||m.external?.length))process.exitCode=1;
}
const [mode,out]=process.argv.slice(2);
if(mode==='--self-test')selfTest();
else if(mode==='--audit'&&out)await audit(out);
else throw Error('Use --self-test or --audit <new-json-path>');
