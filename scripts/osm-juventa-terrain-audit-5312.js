// 5.312 preparation: independent terrain audit; never modifies the school or DEM.
// Compare both regional grids because terrainAt uses the first loaded matching grid.
import {insideElevationGrid,sampleElevationGrid} from './terrain-elevation.js';
import {planJuventaSchoolShell5306} from './osm-juventa-school-shell-5306.js';
const round=v=>Math.round(v*1000)/1000;
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),z:-(p.lat-50.226)*111320});
export function auditJuventaTerrain5312(input,{oldGrid,regionalGrids}={}){
 if(!planJuventaSchoolShell5306(input)||!Number.isFinite(oldGrid?.base)||
 !Array.isArray(regionalGrids)||regionalGrids.length!==2)return null;
 const grids=['mlada','westlink'].map(id=>regionalGrids.find(g=>g?.region===id));
 if(grids.some(g=>!g||!Number.isFinite(g.base)||!Number.isFinite(g.step)||g.step<=0||
 !Number.isInteger(g.nx)||!Number.isInteger(g.nz)||g.nx<2||g.nz<2||
 g.values?.length!==g.nx*g.nz))return null;
 const points=input.geometry.slice(0,-1).map(xy),samples=[];
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length],steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/3));
  for(let j=0;j<=steps;j++)samples.push({edge:i,x:a.x+(b.x-a.x)*j/steps,z:a.z+(b.z-a.z)*j/steps});
 }
 const candidate=points.slice(47,53);
 const camera=xy({lat:50.22681,lon:14.866101});
 const all=[...samples,...candidate,camera];
 if(all.some(p=>insideElevationGrid(oldGrid,p.x,p.z))||grids.some(g=>all.some(p=>!insideElevationGrid(g,p.x,p.z))))return null;
 const audits=grids.map(g=>{
  const elevation=p=>sampleElevationGrid(g,p.x,p.z,oldGrid)+oldGrid.base;
  const levels=samples.map(elevation),local=candidate.slice(0,5).map(elevation);
  const highest=Math.max(...levels),lowest=Math.min(...levels),foundation=highest+.10;
  const vals=[...levels,...local,elevation(camera)];
  if(vals.some(v=>!Number.isFinite(v)))return null;
  return {region:g.region,gridStep:g.step,perimeterSamples:samples.length,
   minElevation:round(lowest),maxElevation:round(highest),perimeterRelief:round(highest-lowest),
   highestEdge:samples[levels.indexOf(highest)].edge,modelFoundationElevation:round(foundation),
   candidateMinElevation:round(Math.min(...local)),candidateMaxElevation:round(Math.max(...local)),
   foundationAboveCandidateRange:[round(foundation-Math.max(...local)),round(foundation-Math.min(...local))],
   candidateNodeElevations:local.map(round),cameraElevation:round(elevation(camera))};
 });
 if(audits.some(a=>!a))return null;
 const discrepancy=Math.max(...audits[0].candidateNodeElevations.map((n,i)=>Math.abs(n-audits[1].candidateNodeElevations[i])));
 return {sourceOSMId:'53865836',sourceHash:'be655146',audits,
  candidateNodeIndices:[47,48,49,50,51],maxCandidateGridDiscrepancy:round(discrepancy),
  gridSource:'ČÚZK DMR 4G; 20m regional game resampling',
  absoluteDatumOfSectionVerified:false,entrancePositionVerified:false,
  foundationIsCurrentModelPolicy:true,readyForGeometry:false,newGeometry:0,newColliders:0};
}
