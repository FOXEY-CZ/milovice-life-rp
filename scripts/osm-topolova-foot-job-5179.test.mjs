import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeTopolovaFootJob5179,advanceTopolovaFootJob5179}
 from './osm-topolova-foot-job-5179.js';
import {createTopolovaFootBeacon5188} from './osm-topolova-foot-beacon-5188.js';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaMappedWalkers5162} from './osm-topolova-mapped-walkers-5162.js';
import {planTopolovaPromenade5163} from './osm-topolova-promenade-5163.js';
import {planTopolovaConnectedWalk5164} from './osm-topolova-connected-5164.js';
import {planTopolovaZebraLoop5165} from './osm-topolova-zebra-loop-5165.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const buildings=elements.filter(e=>e.tags?.building&&e.geometry);
const ways=elements.filter(e=>e.tags?.highway&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways:buildings});
const shortWalkPlan=planTopolovaMappedWalkers5162({regionId:'mlada',rowPlan,ways});
const promenadePlan=planTopolovaPromenade5163({regionId:'mlada',rowPlan,shortWalkPlan,ways});
const connectedPlan=planTopolovaConnectedWalk5164({regionId:'mlada',rowPlan,shortWalkPlan,promenadePlan,ways});
const loop=planTopolovaZebraLoop5165({regionId:'mlada',connectedPlan,promenadePlan,ways});
assert(loop,'source-locked OSM loop is a precondition for this job');
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const plan=makeTopolovaFootJob5179(loop,world);
assert(plan);
assert.equal(plan.sourceWayId,'1314665579');
assert.equal(plan.rewardCZK,80);
assert.equal(plan.roadCrossingsRequired,0);
assert.equal(plan.streetAssetsAdded,0);
assert.equal(plan.simulatedDelivery,true);
assert.equal(plan.checkpoints.length,3);
assert(plan.routeLengthMetres>102&&plan.routeLengthMetres<103);
assert(Math.hypot(plan.checkpoints[0].x-plan.checkpoints[1].x,
 plan.checkpoints[0].z-plan.checkpoints[1].z)>40);
assert(Math.hypot(plan.checkpoints[1].x-plan.checkpoints[2].x,
 plan.checkpoints[1].z-plan.checkpoints[2].z)>40);
assert.equal(makeTopolovaFootJob5179({...loop,version:'wrong'},world),null);
assert.equal(makeTopolovaFootJob5179({...loop,sourceWayIds:['x']},world),null);
const job={...plan,next:0},start=plan.checkpoints[0];
const blocked=advanceTopolovaFootJob5179(job,start,false);
assert.equal(blocked.arrived,false);
assert.equal(blocked.next,0);
assert.equal(blocked.pausedInVehicle,true);
const distant=advanceTopolovaFootJob5179(job,{x:start.x+15,z:start.z},true);
assert.equal(distant.arrived,false);
assert.equal(distant.next,0);
const arrived=advanceTopolovaFootJob5179(job,start,true);
assert.equal(arrived.next,1);
assert.equal(arrived.complete,false);
job.next=1;
assert.equal(advanceTopolovaFootJob5179(job,plan.checkpoints[1],true).next,2);
job.next=2;
const finish=advanceTopolovaFootJob5179(job,plan.checkpoints[2],true);
assert.equal(finish.next,3);
assert.equal(finish.complete,true);
assert.equal(advanceTopolovaFootJob5179({...job,next:3},start,true),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const snippet of [
 "from './scripts/osm-topolova-foot-job-5179.js?v=517900'",
 'id="topolova-foot-job-start"',
 'id="topolova-foot-job-hud"',
 'function rpStartTopolovaFootJob5179(){',
 'function rpEndTopolovaFootJob5179(){',
 'advanceTopolovaFootJob5179(job,{x:px,z:pz},walking)',
 "window.__miloviceTopolovaFootJobRuntime5179=()=>"
])assert(html.includes(snippet),'missing live integration '+snippet);
// 5.188: actual reusable TWO-mesh in-world mission indicator.
const vec=()=>({x:0,y:0,z:0,set(x,y,z){this.x=x;this.y=y;this.z=z;}});
const ThreeMock={
 DoubleSide:2,
 Group:class {constructor(){this.children=[];this.userData={};this.position=vec();this.visible=true;}add(o){this.children.push(o);o.parent=this;}},
 Mesh:class {constructor(g,m){this.geometry=g;this.material=m;this.position=vec();this.rotation={x:0,y:0};this.scale={setScalar(n){this.value=n}};}},
 TorusGeometry:class {constructor(...args){this.args=args}},
 OctahedronGeometry:class {constructor(...args){this.args=args}},
 MeshBasicMaterial:class {constructor(opts){this.options=opts}}
};
const beaconLayer=new ThreeMock.Group();
const terrainAt=(x,z)=>50+Math.sin(x*.01)+Math.cos(z*.01);
const beacon=createTopolovaFootBeacon5188(ThreeMock,{layer:beaconLayer,terrainAt});
assert(beacon);
assert.equal(beacon.inspect().active,false);
assert.equal(beacon.inspect().actualSceneObjects,2);
assert.equal(beacon.inspect().physicalStreetObjectsAdded,0);
assert.equal(beaconLayer.children.length,1);
const beaconMeshes=[...beacon.group.children];
const newJob={...plan,next:0};
assert.equal(beacon.update(newJob,1.5),true);
assert.equal(beacon.inspect().checkpoint,1);
assert.equal(beacon.inspect().visibleAfterLOD,true);
assert.equal(beacon.inspect().world.x,plan.checkpoints[0].x);
assert.equal(beacon.inspect().world.z,plan.checkpoints[0].z);
assert(Math.abs(beacon.inspect().world.y-terrainAt(start.x,start.z)-.06)<.000001);
newJob.next=1;
assert.equal(beacon.update(newJob,2.3),true);
assert.equal(beacon.inspect().checkpoint,2);
assert.equal(beacon.inspect().world.x,plan.checkpoints[1].x);
beaconLayer.visible=false;
assert.equal(beacon.inspect().visibleAfterLOD,false);
beaconLayer.visible=true;
assert.equal(beacon.update({...newJob,sourceWayId:'fake'},3),false);
assert.equal(beacon.inspect().active,false);
assert.equal(beacon.update({...newJob,next:3},3),false);
assert.equal(beacon.update(newJob,4),true);
assert.equal(beacon.update(null,4),false);
assert.equal(beacon.inspect().active,false);
assert.deepEqual(beacon.group.children,beaconMeshes);
assert.equal(beaconLayer.children.length,1,'repeated jobs must not grow draw calls');
for(const snippet of [
 "from './scripts/osm-topolova-foot-beacon-5188.js?v=518800'",
 'createTopolovaFootBeacon5188(THREE,{',
 'topolovaFootBeacon5188?.update(topolovaFootJob5179,elapsed)',
 'window.__miloviceTopolovaFootBeacon5188=()=>',

])assert(html.includes(snippet),'missing live 5.188 beacon integration: '+snippet);
console.log('PASS 5.188: one temporary 3D waypoint from original sidewalk, two reusable meshes, reset and completion hide it');
console.log('PASS 5.179: 3 source-locked foot checkpoints, vehicle pauses, 80 Kč only on third arrival, no new physical street assets');
