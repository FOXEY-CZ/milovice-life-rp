// Milovice RP 5.25 — photograph-informed railway PLATFORM canopy.
// The steel canopy in Aug 2025 photos is dark green with a ribbed underside,
// forked steel supports and transverse beams, NOT red wood from the old model.
// OSM fixes the station perimeter; the exact canopy spans are approximations.
export const REAL_PLATFORM_CANOPY_REFERENCE={
 id:'milovice-platform-canopy-2025',
 stationWayId:'53865956',
 photo:'https://commons.wikimedia.org/wiki/File:N%C3%A1dra%C5%BE%C3%AD_Milovice,_2025_03.jpg',
 photoDate:'2025-08-20',author:'Doronenko',license:'CC BY-SA 4.0',
 corroborating:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD_(01).jpg',
 observed:['dark green steel roof underside','repeated transverse ribs',
  'steel vertical posts','curving fork support arms','platform paving and warning strip'],
 accuracy:'Colors and support type observed; span, spacing, elevation and exact beam offsets approximate.'
};
function valid(n){return Number.isFinite(n)}
export function planPhotoPlatformCanopy({x,z,ux,uz,nx,nz,base,length}={}){
 if(![x,z,ux,uz,nx,nz,base,length].every(valid)||length<5||length>80)return null;
 const norm=Math.hypot(ux,uz),normal=Math.hypot(nx,nz);
 if(norm<.9||normal<.9)return null;
 const alongX=ux/norm,alongZ=uz/norm,acrossX=nx/normal,acrossZ=nz/normal;
 const yaw=Math.atan2(-alongZ,alongX);
 const crossYaw=Math.atan2(-acrossZ,acrossX);
 const cover=Math.min(23,Math.max(8,length*.75));
 const posts=Math.max(4,Math.min(7,Math.ceil(cover/4.9)+1));
 const ribCount=Math.max(12,Math.ceil(cover/.82));
 const pieces=[],braces=[];
 const pos=(s,t,h)=>({x:x+alongX*s+acrossX*t,y:base+h,z:z+alongZ*s+acrossZ*t});
 const box=(kind,s,t,h,w,ht,d,angle=yaw)=>{
  const p=pos(s,t,h);pieces.push({kind,x:p.x,y:p.y,z:p.z,w,h:ht,d,yaw:angle});
 };
 // One continuous flat metal sheet, slim green fascia and strongly marked ribs.
 box('stationCanopyGreen',0,2.70,3.51,cover,.11,4.42);
 box('stationCanopyUnder',0,2.70,3.42,cover,.085,4.33);
 for(const t of [.52,4.88])box('stationCanopyBeam',0,t,3.31,cover,.19,.16);
 for(let j=0;j<ribCount;j++){
  const s=-cover*.5+(j+.5)*cover/ribCount;
  box('stationCanopyRib',s,2.70,3.345,.075,.105,4.25);
 }
 for(let j=0;j<posts;j++){
  const s=-cover*.45+j*cover*.90/(posts-1);
  // Steel vertical post at the outer side of the existing station wall.
  box('stationCanopySteel',s,3.75,1.70,.18,3.36,.18);
  box('stationCanopyBeam',s,2.70,3.26,4.24,.13,.17,crossYaw);
  for(const sign of [-1,1]){
   const origin=pos(s,3.75,2.56),end=pos(s+sign*.83,3.75,3.32);
   braces.push({from:origin,to:end});
  }
 }
 return {source:REAL_PLATFORM_CANOPY_REFERENCE.id,stationWayId:REAL_PLATFORM_CANOPY_REFERENCE.stationWayId,
  boxes:pieces,braces,cover,posts,ribCount,approximateSpacing:true,
  darkGreen:true,railAccessOpen:true};
}
// Build the diagonal forks in one instanced draw, not 2 meshes per support.
export function installCanopyBraces(THREE,layer,plan){
 if(!plan?.braces?.length||!layer)return 0;
 const geometry=new THREE.BoxGeometry(.12,1,.12);
 const material=new THREE.MeshLambertMaterial({color:0x255c47});
 const mesh=new THREE.InstancedMesh(geometry,material,plan.braces.length);
 const worldUp=new THREE.Vector3(0,1,0),dummy=new THREE.Object3D();
 plan.braces.forEach(({from,to},i)=>{
  const a=new THREE.Vector3(from.x,from.y,from.z);
  const b=new THREE.Vector3(to.x,to.y,to.z);
  const dir=b.clone().sub(a),len=dir.length();
  dummy.position.copy(a).add(b).multiplyScalar(.5);
  dummy.quaternion.setFromUnitVectors(worldUp,dir.normalize());
  dummy.scale.set(1,len,1);dummy.updateMatrix();
  mesh.setMatrixAt(i,dummy.matrix);
 });
 mesh.instanceMatrix.needsUpdate=true;
 mesh.computeBoundingSphere();
 mesh.userData.lodDetail=true;
 mesh.userData.lodX=plan.boxes[0].x;mesh.userData.lodZ=plan.boxes[0].z;
 mesh.name='Milovice_2025_GreenSteelCanopyForks';
 layer.add(mesh);
 return 1;
}
