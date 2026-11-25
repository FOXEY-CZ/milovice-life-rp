// User-selected game waypoint: accept only finite coordinates on loaded DEM.
import {insideElevationGrid} from './terrain-elevation.js';
export function createCustomWaypoint5325(point,grids=[]){
 const lat=point?.lat,lon=point?.lng;
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180||!Array.isArray(grids))return null;
 const x=(lon-14.889)*111320*Math.cos(50.226*Math.PI/180),z=(50.226-lat)*111320;
 if(!grids.some(grid=>grid&&insideElevationGrid(grid,x,z)))return null;
 return {name:'📍 Vlastní bod',gps:[lat,lon],custom:true,entranceVerified:false};
}
