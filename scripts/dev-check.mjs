// Milovice RP W1: focused Node unit-test runner for a selected workstream.
// No extra dependencies; full cross-project validation stays in GitHub Actions.
import {spawnSync} from 'node:child_process';
import {existsSync,readdirSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=dirname(fileURLToPath(import.meta.url));
const discovered=readdirSync(scriptDir).filter(name=>/(?:\.test|-test)\.mjs$/.test(name)).sort();
const packs=Object.freeze({
 all:discovered,
 juventa:discovered.filter(name=>/^osm-juventa-/.test(name)),
 sportovni:[
  'osm-lesni-courtyard-lawns-5231.test.mjs',
  'osm-sportovni-footway-network-5230.test.mjs',
  'osm-lesni-north-branches-5229.test.mjs',
  'osm-visnova-long-sidewalk-5228.test.mjs',
  'osm-lesni-east-link-5227.test.mjs',
  'osm-lesni-footway-branches-5226.test.mjs',
  'osm-lesni-walk-chain-5225.test.mjs',
  'osm-lesni-paved-service-spur-5224.test.mjs',
  'osm-lesni-paved-living-street-5223.test.mjs',
  'osm-lesni-courtyard-blocks-5222.test.mjs',
  'osm-visnova-north-block-5221.test.mjs',
  'osm-visnova-estate-pavers-5220.test.mjs',
  'osm-visnova-seven-floor-row-5219.test.mjs',
  'osm-visnova-garden-lawns-5218.test.mjs',
  'osm-visnova-tagged-colors-5217.test.mjs',
  'osm-visnova-refuge-5216.test.mjs',
  'osm-visnova-continuous-walker-5215.test.mjs',
  'osm-visnova-east-walker-5214.test.mjs',
  'osm-visnova-sidewalk-walker-5213.test.mjs',
  'osm-visnova-east-lawns-5212.test.mjs',
  'osm-visnova-paved-service-5211.test.mjs',
  'osm-visnova-paver-corners-5205.test.mjs',
  'osm-visnova-tagged-pavers-5204.test.mjs',
  'osm-visnova-parking-map-5203.test.mjs',
  'osm-visnova-parking-house-5202.test.mjs',
  'osm-visnova-district-5201.test.mjs',
  'osm-visnova-lawn-detail-5200.test.mjs',
  'osm-visnova-mapped-walks-5199.test.mjs',
  'osm-visnova-eight-floor-5198.test.mjs',
  'osm-visnova-neighbor-5197.test.mjs',
  'osm-visnova-service-edge-5195.test.mjs',
  'osm-visnova-end-facades-5193.test.mjs',
  'osm-visnova-residential-5192.test.mjs',
  'osm-armadni-refuge-island-5190.test.mjs',
  'osm-topolova-entry-survey-5170.test.mjs',
  'osm-topolova-end-gables-5169.test.mjs',
  'osm-topolova-north-encounter-5168.test.mjs',
  'osm-topolova-encounter-5167.test.mjs',
  'osm-topolova-priority-5166.test.mjs',
  'osm-topolova-zebra-loop-5165.test.mjs',
  'osm-topolova-connected-5164.test.mjs',
  'osm-topolova-promenade-5163.test.mjs',
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
 italska:[
  'osm-italska-junction-conflict-5258.test.mjs',
  'osm-italska-strip-wheel-height-5257.test.mjs',
  'osm-italska-rendered-strip-safety-5256.test.mjs',
  'osm-italska-junction-smoothing-5255.test.mjs',
  'osm-italska-turn-envelope-5254.test.mjs',
  'osm-italska-car-clearance-5254.test.mjs',
  'osm-italska-narrow-npc-5253.test.mjs',
  'osm-italska-road-sidewalk-5252.test.mjs',
  'osm-rakouska-north-photo-5251.test.mjs',
  'osm-italska-photo-sightlines-5250.test.mjs',
  'osm-italska-vojen-zatisi-5249.test.mjs',
  'osm-ambient-road-clearance-5247.test.mjs',
  'osm-ambient-continuity-5246.test.mjs',
  'osm-ambient-building-clearance-5245.test.mjs',
  'osm-ambient-reuse-5244.test.mjs',
  'osm-mapped-ambient-walkers-5243.test.mjs',
  'osm-italska-west-residence-5242.test.mjs',
  'osm-traffic-continuity-5241.test.mjs',
  'osm-traffic-access-5240.test.mjs',
  'osm-italska-west-block-5239.test.mjs',
  'osm-italska-tower-5238.test.mjs',
  'osm-italska-apartments-5235.test.mjs',
  'osm-italska-walkers-5234.test.mjs',
  'osm-italska-walk-chain-5233.test.mjs',
  'osm-italska-flat-roof-5232.test.mjs'
 ],
 budovy:[
  'osm-italska-flat-roof-5232.test.mjs',
  'facade-anchors.test.mjs',
  'facade-perimeter.test.mjs',
  'entrance-grade.test.mjs',
  'building-roof-topology.test.mjs',
  'osm-ruian-party-walls-5133.test.mjs'
 ],
 nadrazi:[
  'osm-station-platform-edging-5248.test.mjs',
  'station-forecourt-pass.test.mjs',
  'station-roof-geometry.test.mjs',
  'station-platform-canopy.test.mjs',
  'station-photo-parking.test.mjs'
 ]
});
const requested=process.argv.slice(2).map(x=>x==='--all'?'all':x);
const usage=()=>console.log(
 'Pouziti: node scripts/dev-check.mjs <'+Object.keys(packs).join('|')+'>\n'+
 'Sady:\n'+Object.entries(packs).map(([k,v])=>'  '+k+' ('+v.length+' unit testu)').join('\n')+
 '\nVolby: --list, --help, --all (vsechny nalezene unit testy)\nPro WebGL test je nutny Chromium + lokalni HTTP server.'
);
if(requested.length===1&&['--list','--help'].includes(requested[0])){
 usage();
}else if(requested.length===1&&Object.hasOwn(packs,requested[0])){
 const pack=requested[0],list=packs[pack];
 console.log('Milovice RP / '+pack+' — '+list.length+' cilenych unit testu');
 let ok=0;
 const failed=[];
 for(const name of list){
  const path=join(scriptDir,name);
  if(!existsSync(path)){
   console.error('CHYBI TEST:',name);
   process.exitCode=1;failed.push(name);if(pack==='all')continue;break;
  }
  console.log('\n>>> '+name);
  const result=spawnSync(process.execPath,[path],{cwd:join(scriptDir,'..'),
   stdio:'inherit',env:process.env,timeout:90000,killSignal:'SIGKILL'});
  if(result.error||result.status!==0){
   console.error('SELHAL:',name,result.error?.message||result.signal||result.status);
   process.exitCode=1;failed.push(name);if(pack==='all')continue;break;
  }
  ok++;
 }
 if(failed.length)console.error('Selhane testy:',failed.join(', '));
 console.log('\nHotovo: '+ok+'/'+list.length+' testu pro oblast '+pack+
  (process.exitCode?' (NEUSPESNE)':' (USPESNE)'));
}else{
 usage();
 console.error('Neznamy nebo chybejici nazev oblasti.');
 process.exitCode=2;
}
