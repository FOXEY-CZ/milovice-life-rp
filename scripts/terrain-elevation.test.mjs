import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {insideElevationGrid,sampleElevationGrid,resolveTerrainHeight} from './terrain-elevation.js';
const close=(a,b,tol=1e-9)=>assert(Math.abs(a-b)<=tol,'Expected '+a+' ~= '+b);
const old={min:0,n:2,step:10,base:100,values:[0,10,20,40]};
const region={minX:10,minZ:0,nx:2,nz:2,step:10,base:105,values:[0,10,20,40]};
assert(insideElevationGrid(old,0,0));
assert(insideElevationGrid(old,10,10));
assert(!insideElevationGrid(old,-.1,0));
assert(!insideElevationGrid(region,20.1,10));
close(sampleElevationGrid(old,2,3),.8);
close(sampleElevationGrid(old,8,7),2.7);
close(sampleElevationGrid(region,12,3,old),5.8);
close(resolveTerrainHeight(0,0,null,[]),0);
close(resolveTerrainHeight(5,5,old,[region]),1.5);
close(resolveTerrainHeight(10,0,old,[region]),sampleElevationGrid(old,10,0,old));
close(resolveTerrainHeight(12,3,old,[region]),5.8);
close(resolveTerrainHeight(100,100,old,[region]),sampleElevationGrid(old,100,100,old));
close(resolveTerrainHeight(12,3,null,[region]),.8);
const main=JSON.parse(readFileSync(new URL('../data/milovice-terrain.json',import.meta.url),'utf8'));
const mlada=JSON.parse(readFileSync(new URL('../data/regions/terrain-mlada.json',import.meta.url),'utf8'));
for(const grid of [main,mlada]){
 const nx=grid.nx??grid.n,nz=grid.nz??grid.n,minX=grid.minX??grid.min,minZ=grid.minZ??grid.min;
 for(const [ix,iz] of [[0,0],[1,1],[Math.floor(nx/2),Math.floor(nz/2)],[nx-2,nz-2]]){
  const x=minX+ix*grid.step,z=minZ+iz*grid.step;
  assert(insideElevationGrid(grid,x,z));
  close(sampleElevationGrid(grid,x,z,main),grid.values[iz*nx+ix]*.1+(grid===main?0:grid.base-main.base),1e-8);
 }
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes("from './scripts/terrain-elevation.js?v=1'"));
assert(html.includes('return resolveTerrainHeight(x,z,terrainGrid,cityRegionGrids)'));
console.log('PASS terrain elevation: triangle interpolation, overlap priority, edge fallback, regional base and real DEM vertices');
