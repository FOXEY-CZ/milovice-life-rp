// Milovice RP 5.93: verify all new review cameras against original OSM
// highway vertices, not freehand latitude/longitude or invented panoramas.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=html.indexOf('const rpStreetAuditViews={');
const end=html.indexOf('\nconst rpStreetAuditView=',start);
assert(start>0&&end>start,'Find actual game camera configuration');
const config=runInNewContext(html.slice(start,end)+'\nrpStreetAuditViews;');
const required=[
 ['tyrsova-west-593','westlink','202373467','Tyršova'],
 ['ostravska-north-593','centerlink','1463667018','Ostravská'],
 ['bozidar-kratka-593','bozidar','38900193','Krátká']
];
const cosine=Math.cos(50.226*Math.PI/180);
const xy=p=>({x:(p.lon-14.889)*111320*cosine,z:-(p.lat-50.226)*111320});
const angular=(a,b)=>Math.min(Math.abs(a-b),360-Math.abs(a-b));
for(const [key,region,wayId,name] of required){
 const cam=config[key];
 assert(cam, 'Public audit entry missing '+key);
 assert(cam.technical&&cam.streetLevel&&cam.estimatedHeading,
  'Remote street view must explicitly reject photographic provenance');
 assert.equal(cam.publicPhotoCamera,undefined);
 assert.equal(cam.regionId,region);
 assert.equal(cam.osmRoadId,wayId);
 assert(cam.source.endsWith('/way/'+wayId),'Road source must link to real OSM way');
 const osm=JSON.parse(readFileSync(
  new URL('../data/regions/'+region+'.json',import.meta.url),'utf8'));
 const road=osm.elements.find(e=>String(e.id)===wayId);
 assert(road&&road.tags?.highway&&road.tags.name===name,
  'Camera road ID/name must exist in the exact regional source');
 const p=xy({lat:cam.camera.lat,lon:cam.camera.lon});
 let best=null;
 for(let i=1;i<road.geometry.length;i++){
  const a=xy(road.geometry[i-1]),b=xy(road.geometry[i]);
  const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
  if(den<1)continue;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/den));
  const distance=Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);
  const heading=(Math.atan2(dx,-dz)*180/Math.PI+360)%360;
  const diff=Math.min(angular(heading,cam.heading),
   angular((heading+180)%360,cam.heading));
  if(!best||distance<best.distance)best={distance,diff};
 }
 assert(best&&best.distance<.35,
  key+' camera is not on the mapped OSM road segment');
 assert(best.diff<2.0,
  key+' compass bearing must follow the actual OSM segment');
 assert(html.includes('streetAudit='+key),
  key+' requires a clickable built-in audit link');
 console.log(key+': '+name+' (way '+wayId+') – OSM offset '+
  best.distance.toFixed(3)+' m; axis error '+best.diff.toFixed(2)+'°');
}
assert(html.includes('const cx=rpAuditCameraWorld?.x??(walking?px:x)'),
 'Audits in another city region must stream data around CAMERA, not spawn player');
assert(html.includes('osmSetActive(true);maybeStreamCityAreas();'),
 'Remote region must start loading on initial OSM boot, not after the player drives there');
assert(html.includes('const auditTarget=rpStreetAuditView?.regionId?'),
 'The intended source region must be preferred over overlapping map files');
assert(html.includes('const candidate=auditTarget||nearby.find('),
 'Overlap of Mladá, Vrutice and Westlink must not delay a selected audit camera');
assert.equal(required.length,3);
console.log('PASS remote regional cameras: exact OSM road and heading, honest audit, region stream');
