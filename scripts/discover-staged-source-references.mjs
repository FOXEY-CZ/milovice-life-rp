// Conservative source-reference discovery in the actual player staging tree.
// Presence in source does not establish a network request, copied pixels or permission.
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,lstatSync,writeFileSync} from 'node:fs';
import {join,relative,sep} from 'node:path';

function category(host){
 if(/(^|\.)mapy\.(cz|com)$/.test(host))return 'mapy';
 if(/(^|\.)wikimedia\.org$/.test(host))return 'wikimedia';
 if(/(^|\.)google\.(com|cz)$/.test(host)||/(^|\.)googleusercontent\.com$/.test(host))return 'google';
 if(/(^|\.)openstreetmap\.org$/.test(host))return 'osm';
 if(/(^|\.)cuzk\.(?:gov\.)?cz$/.test(host))return 'cuzk';
 return 'other';
}
function scanText(path,source){
 const refs=[],embedded=[],textureHints=[];
 for(const [i,line] of source.split(/\r?\n/).entries()){
  for(const match of line.matchAll(/https?:\/\/[^\s"'\x60<>\\)\]}]+/g)){
   const raw=match[0].replace(/[.,;]+$/,'').replace(/&amp;/g,'&');
   let url;try{url=new URL(raw);}catch{continue;}
   const kind=category(url.hostname);
   // Hints only; even a comment or evidence variable can feed runtime.
   const hint=/(?:\b(?:fetch|loadAsync|loadTexture|src)\b|new\s+Image\b)/.test(line)?'possible-load':
    /^\s*(?:\/\/|\/\*|\*)/.test(line)?'comment':'source-reference';
   refs.push({path,line:i+1,url:raw,host:url.hostname,category:kind,hint});
  }
  for(const match of line.matchAll(/data:image\/([\w.+-]+)[;,]/gi))embedded.push({path,line:i+1,mime:'image/'+match[1].toLowerCase()});
  if(/\b(?:CanvasTexture|DataTexture|TextureLoader|ImageBitmapLoader|createImageBitmap|drawImage|toDataURL)\b/.test(line))textureHints.push({path,line:i+1});
 }
 return {refs,embedded,textureHints};
}
function scan(root){
 const report={schema:1,review:'pending',scope:'staged HTML, JS and published architecture manifest; literal URLs and image/texture hints only',filesScanned:0,refs:[],embedded:[],textureHints:[]};
 function walk(dir){
  for(const name of readdirSync(dir).sort()){
   const full=join(dir,name),path=relative(root,full).split(sep).join('/');
   const st=lstatSync(full);
   if(st.isSymbolicLink())throw Error('Unexpected symlink '+path);
   if(st.isDirectory()){walk(full);continue;}
   if(!st.isFile()||!(/\.(html|js)$/.test(path)||path==='data/architecture/verified-buildings.json'))continue;
   report.filesScanned++;
   const found=scanText(path,readFileSync(full,'utf8'));
   for(const k of ['refs','embedded','textureHints'])report[k].push(...found[k]);
  }
 }
 walk(root);
 const summary={filesScanned:report.filesScanned,referenceOccurrences:report.refs.length,uniqueUrls:new Set(report.refs.map(x=>x.url)).size,byCategory:{},byHost:{},embeddedImageHints:report.embedded.length,textureHintLines:report.textureHints.length};
 for(const ref of report.refs){summary.byCategory[ref.category]=(summary.byCategory[ref.category]||0)+1;summary.byHost[ref.host]=(summary.byHost[ref.host]||0)+1;}
 return {...report,summary};
}
function selfTest(){
 const found=scanText('scripts/sample.js',[
  '// photo https://commons.wikimedia.org/wiki/File:Example.jpg',
  "const x=fetch('https://mapy.com/cs/letecka?x=1&y=2');",
  "const y='https://mapy.com.evil.example/photo';",
  "const z='data:image/png;base64,abc'; const t=new THREE.CanvasTexture(canvas);"
 ].join('\n'));
 assert.equal(found.refs.length,3);
 assert.deepEqual(found.refs.map(x=>x.category),['wikimedia','mapy','other']);
 assert.equal(found.refs[0].hint,'comment');assert.equal(found.refs[1].hint,'possible-load');
 assert.equal(category('geoportal.cuzk.cz'),'cuzk');assert.equal(category('ags.cuzk.gov.cz'),'cuzk');assert.equal(category('cuzk.cz.example'),'other');
 assert.equal(found.embedded.length,1);assert.equal(found.textureHints.length,1);
 console.log('PASS staged source discovery self-test');
}
const [mode,root,output]=process.argv.slice(2);
if(mode==='--self-test')selfTest();
else if(mode==='--scan'&&root&&output){
 const report=scan(root);
 writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify(report.summary));
}else throw Error('Use --self-test or --scan <stage> <new-json>');
