import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {REAL_PLATFORM_CANOPY_REFERENCE,planPhotoPlatformCanopy} from './station-platform-reality.js';

assert.equal(REAL_PLATFORM_CANOPY_REFERENCE.stationWayId,'53865956');
assert.equal(REAL_PLATFORM_CANOPY_REFERENCE.photoDate,'2025-08-20');
assert.equal(REAL_PLATFORM_CANOPY_REFERENCE.license,'CC BY-SA 4.0');
assert(REAL_PLATFORM_CANOPY_REFERENCE.observed.some(v=>v.includes('green')));
assert.equal(planPhotoPlatformCanopy({x:0,z:0,ux:1,uz:0,nx:0,nz:1,base:0,length:0}),null);
const p=planPhotoPlatformCanopy({x:-499,z:-345,ux:.6,uz:.8,nx:-.8,nz:.6,base:194.5,length:22});
assert(p,'A real station face must produce a canopy plan');
assert(p.darkGreen&&p.railAccessOpen&&p.approximateSpacing);
assert(p.posts>=4&&p.posts<=7);
assert(p.ribCount>=12);
assert.equal(p.braces.length,p.posts*2);
assert.equal(p.boxes.filter(x=>x.kind==='stationCanopySteel').length,p.posts);
assert.equal(p.boxes.filter(x=>x.kind==='stationCanopyRib').length,p.ribCount);
assert.deepEqual([...new Set(p.boxes.map(x=>x.kind))].sort(),
 ['stationCanopyBeam','stationCanopyGreen','stationCanopyRib','stationCanopySteel','stationCanopyUnder'].sort());
for(const b of p.boxes)assert([b.x,b.y,b.z,b.w,b.h,b.d,b.yaw].every(Number.isFinite));
for(const brace of p.braces){
 assert(brace.from.y<brace.to.y);
 assert(Math.hypot(brace.to.x-brace.from.x,brace.to.z-brace.from.z)<2);
}
const canopyLength=p.boxes.find(b=>b.kind==='stationCanopyGreen').w;
assert(canopyLength>10&&canopyLength<=23);
assert.equal(p.boxes.some(b=>b.kind==='stationTimber'),false);
console.log('5.25 station photo canopy validated',JSON.stringify({roofRibs:p.ribCount,posts:p.posts,braceInstances:p.braces.length,boxParts:p.boxes.length,drawTypes:5,span:canopyLength}));

// v5.27.1: the photographic station building has RED ROOF TILES, while the
// separate platform canopy remains dark-green steel from 2025 Commons images.
const stationHtml=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(stationHtml.includes('const stationRoofMaterial=new THREE.MeshStandardMaterial({color:0xffffff,map:roofTileMap'));
assert(!stationHtml.includes('stationRoofMaterial=new THREE.MeshStandardMaterial({color:0xffffff,map:citySurfaceKit.standingSeam'));
assert(stationHtml.includes("stationRoofSurface='red-tile-photo-informed'"));

// v5.27.2 photo-faithful facade safety: the long station faces may keep the
// earlier arched-window study but the two UNSURVEYED side end caps cannot
// automatically receive decorative windows or an imaginary cafe frontage.
const frontend=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(frontend.includes("stationUnverifiedSideWindowsRemoved"));
assert(frontend.includes("if(along<.70)"));
assert(frontend.includes("stationUpperArtificialCutWindows=0"));
assert(frontend.includes("stationUpperFacadeAccuracy='photo-informed-not-surveyed'"));
assert(frontend.includes("stationCentralRoofType='hip'"));
assert(frontend.includes('planFootprintPitchedRoof({'));
assert(frontend.includes("kind:roofKind,eaveY:base+toHeight+.08,rise:roofRise"));
assert(frontend.includes("mode:'footprint-constrained',axisShared:true"));
assert(!frontend.includes('function stationHippedTowerRoof('));
assert(!frontend.includes('function stationGabledRoof('));
assert(!frontend.includes('new THREE.Mesh(gg,stationWalls)'));
assert(frontend.includes('const middle=Math.min(5.5,Math.max(4.15,(max-min)*.12))'));
assert(!frontend.includes("for(let i=0;i<center.length;i++){"));
assert(frontend.includes("2.65,.57"));
assert(frontend.includes("stationCafeMapOnly=true"));
assert(frontend.includes("kind:'cafe-indoor-approximate'"));
assert(!frontend.includes("Nádraží Milovice · Nádražka"));
assert(frontend.includes("name:'🚉 Nádraží Milovice'"));

// v5.27.3: User screenshots showed an erroneous GREEN CANOPY next to the
// bike tower / on the wrong side of the station. Do not spawn its panels,
// metal uprights, transverse beams or fake pavement; a source photo of the
// other-side rail platform is NOT evidence for the wrong-side location.
const currentStationPage=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(currentStationPage.includes('stationSideAwningRemoved=true'));
assert(currentStationPage.includes('stationCanopyPosts=0'));
assert(currentStationPage.includes('stationCanopyBraces=0'));
assert(currentStationPage.includes('stationUnverifiedSidePavingRemoved=true'));
assert(!currentStationPage.includes('planPhotoPlatformCanopy('));
assert(!currentStationPage.includes('installCanopyBraces('));
assert(!currentStationPage.includes("archPart('stationPaving',r.mx+nx*2.65"));
assert(currentStationPage.includes("stationBoard('Milovice'"));
assert(currentStationPage.includes('stationPassagePortals'));

// 5.28.2b: The station-specific gable builder was removed to fix giant
// overhanging roofs. Penny's retail roof must never call that deleted function.
const pennyHTML=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(!pennyHTML.includes('stationGabledRoof('),
 'Deleted stationGabledRoof builder referenced by a non-station supermarket');
assert(pennyHTML.includes("tags.name==='Penny'&&tags.shop==='supermarket'?miloviceGableRoof("));
