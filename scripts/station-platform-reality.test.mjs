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
assert(frontend.includes("stationUpperSideWindowsRemoved"));
assert(frontend.includes("stationCafeMapOnly=true"));
assert(frontend.includes("kind:'cafe-indoor-approximate'"));
assert(!frontend.includes("Nádraží Milovice · Nádražka"));
assert(frontend.includes("name:'🚉 Nádraží Milovice'"));
