// Pure DEM height sampling, extracted without changing interpolation or fallback order.
export function insideElevationGrid(grid,x,z){
 const minX=grid.minX??grid.min,minZ=grid.minZ??grid.min;
 const nx=grid.nx??grid.n,nz=grid.nz??grid.n;
 return x>=minX&&z>=minZ&&x<=minX+(nx-1)*grid.step&&z<=minZ+(nz-1)*grid.step;
}
export function sampleElevationGrid(grid,x,z,terrainGrid=null){
 const minX=grid.minX??grid.min,minZ=grid.minZ??grid.min;
 const nx=grid.nx??grid.n,nz=grid.nz??grid.n;
 const fx=Math.max(0,Math.min(nx-1.00001,(x-minX)/grid.step));
 const fz=Math.max(0,Math.min(nz-1.00001,(z-minZ)/grid.step));
 const ix=Math.floor(fx),iz=Math.floor(fz),tx=fx-ix,tz=fz-iz;
 const i=iz*nx+ix,values=grid.values;
 const a=values[i],b=values[i+1],c=values[i+nx],d=values[i+nx+1];
 // Triangle interpolation matches the actual ground mesh vertices.
 const v=tx+tz<=1?a+tx*(b-a)+tz*(c-a):d+(1-tx)*(c-d)+(1-tz)*(b-d);
 return v*.1+(terrainGrid&&grid!==terrainGrid?(grid.base-terrainGrid.base):0);
}
export function resolveTerrainHeight(x,z,terrainGrid,cityRegionGrids){
 if(terrainGrid&&insideElevationGrid(terrainGrid,x,z))return sampleElevationGrid(terrainGrid,x,z,terrainGrid);
 for(const grid of cityRegionGrids)if(insideElevationGrid(grid,x,z))return sampleElevationGrid(grid,x,z,terrainGrid);
 // Unloaded areas cannot be assigned invented hills: keep their ground at
 // the last official old-town DEM edge until the next region is streamed in.
 if(terrainGrid)return sampleElevationGrid(terrainGrid,x,z,terrainGrid);
 return 0;
}
