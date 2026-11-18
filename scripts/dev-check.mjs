// Milovice RP W1: focused Node unit-test runner for a selected workstream.
// No extra dependencies; full cross-project validation stays in GitHub Actions.
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=dirname(fileURLToPath(import.meta.url));
const packs=Object.freeze({
 sportovni:[
  'osm-topolova-mapped-walkers-5162.test.mjs',
  'osm-topolova-estimated-facades-5161.test.mjs',
  'osm-topolova-continuous-hip-5160.test.mjs',
  'osm-topolova-drawing-614615-5159.test.mjs',
  'osm-topolova-short-facades-5158.test.mjs',
  'osm-topolova-photo-646-5157.test.mjs',
  'osm-topolova-photo-646-5156.test.mjs',
  'osm-topolova-panel-row-5155.test.mjs',
  'osm-slunicko-west-elevation-5154.test.mjs',
  'osm-slunicko-storeys-5153.test.mjs',
  'osm-sportovni-basketball-5142.test.mjs',
  'osm-sportovni-tennis-5150.test.mjs',
  'osm-milten-photo-corridor-5151.test.mjs',
  'osm-prubezna-photo-frontages-5144.test.mjs',
  'osm-sportovni-hall-5145.test.mjs',
  'osm-sportovni-photo-northwalk-5146.test.mjs',
  'osm-zebra-v7-5152.test.mjs',
  'osm-sportovni-topolova-zebra-5147.test.mjs',
  'osm-topolova-residential-5148.test.mjs',
  'osm-topolova-masonry-5149.test.mjs',
  'osm-sportovni-estate-walk-5141.test.mjs',
  'osm-sportovni-ruian-panels-5140.test.mjs',
  'osm-sportovni-sidewalk-5139.test.mjs',
  'osm-prubezna-bends-5138.test.mjs',
  'osm-prubezna-links-5137.test.mjs'
 ],
 prubezna:[
  'osm-prubezna-photo-frontages-5144.test.mjs',
  'osm-sportovni-hall-5145.test.mjs',
  'osm-sportovni-photo-northwalk-5146.test.mjs',
  'osm-zebra-v7-5152.test.mjs',
  'osm-sportovni-topolova-zebra-5147.test.mjs',
  'osm-topolova-residential-5148.test.mjs',
  'osm-topolova-masonry-5149.test.mjs',
  'osm-prubezna-renovation-5134.test.mjs',
  'osm-prubezna-road-5135.test.mjs',
  'osm-prubezna-links-5137.test.mjs',
  'osm-prubezna-bends-5138.test.mjs',
  'osm-sportovni-sidewalk-5139.test.mjs'
 ],
 budovy:[
  'facade-anchors.test.mjs',
  'facade-perimeter.test.mjs',
  'entrance-grade.test.mjs',
  'building-roof-topology.test.mjs',
  'osm-ruian-party-walls-5133.test.mjs'
 ],
 nadrazi:[
  'station-forecourt-pass.test.mjs',
  'station-roof-geometry.test.mjs',
  'station-platform-canopy.test.mjs',
  'station-photo-parking.test.mjs'
 ]
});
const requested=process.argv.slice(2);
const usage=()=>console.log(
 'Pouziti: node scripts/dev-check.mjs <'+Object.keys(packs).join('|')+'>\n'+
 'Sady:\n'+Object.entries(packs).map(([k,v])=>'  '+k+' ('+v.length+' unit testu)').join('\n')+
 '\nVolby: --list, --help\nPro WebGL test je nutny Chromium + lokalni HTTP server.'
);
if(requested.length===1&&['--list','--help'].includes(requested[0])){
 usage();
}else if(requested.length===1&&Object.hasOwn(packs,requested[0])){
 const pack=requested[0],list=packs[pack];
 console.log('Milovice RP / '+pack+' — '+list.length+' cilenych unit testu');
 let ok=0;
 for(const name of list){
  const path=join(scriptDir,name);
  if(!existsSync(path)){
   console.error('CHYBI TEST:',name);
   process.exitCode=1;break;
  }
  console.log('\n>>> '+name);
  const result=spawnSync(process.execPath,[path],{cwd:join(scriptDir,'..'),
   stdio:'inherit',env:process.env});
  if(result.error||result.status!==0){
   console.error('SELHAL:',name,result.error?.message||result.signal||result.status);
   process.exitCode=1;break;
  }
  ok++;
 }
 console.log('\nHotovo: '+ok+'/'+list.length+' testu pro oblast '+pack+
  (process.exitCode?' (NEUSPESNE)':' (USPESNE)'));
}else{
 usage();
 console.error('Neznamy nebo chybejici nazev oblasti.');
 process.exitCode=2;
}
