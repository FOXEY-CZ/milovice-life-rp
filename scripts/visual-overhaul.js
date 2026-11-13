// Original Milovice RP Big Update 1 surface assets; no third-party or GTA textures.
export function makeMiloviceVisualKit(THREE){
 const rng=seed=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 function tile(seed,base,draw){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const g=canvas.getContext('2d'),r=rng(seed),im=g.createImageData(256,256);
  for(let i=0;i<im.data.length;i+=4){
   const n=(r()-.5)*base[3];
   for(let c=0;c<3;c++)im.data[i+c]=Math.max(0,Math.min(255,base[c]+n));
   im.data[i+3]=255;
  }
  g.putImageData(im,0,0);draw(g,r);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;
  t.wrapS=t.wrapT=THREE.RepeatWrapping;t.generateMipmaps=true;t.anisotropy=4;return t;
 }
 const dots=(g,r,count,dark,light)=>{
  for(let i=0;i<count;i++){
   const v=r()>.52?light:dark;
   g.fillStyle='rgba('+v+','+v+','+v+','+(.04+r()*.23)+')';
   g.fillRect(r()*256,r()*256,.4+r()*2,.4+r()*2);
  }
 };
 const asphalt=tile(47015,[65,70,71,36],(g,r)=>{
  dots(g,r,14000,15,216);
  for(let i=0;i<24;i++){
   let x=r()*256,y=r()*256;
   g.strokeStyle='rgba(16,20,20,'+(.09+r()*.11)+')';g.lineWidth=.5+r();
   g.beginPath();g.moveTo(x,y);for(let j=0;j<4;j++)g.lineTo(x+=(r()-.5)*13,y+=(r()-.5)*13);g.stroke();
  }
  for(let i=0;i<15;i++){
   g.fillStyle='rgba(31,36,35,.10)';
   g.beginPath();g.ellipse(r()*256,r()*256,6+r()*19,2+r()*11,r()*6,0,7);g.fill();
  }
 });
 const paving=tile(5091,[186,180,170,18],(g,r)=>{
  for(let y=-34,row=0;y<286;y+=38,row++)for(let x=-80;x<300;x+=76){
   const xx=x+(row%2)*38;
   g.fillStyle='rgba(43,45,43,.28)';g.fillRect(xx,y,78,2);g.fillRect(xx,y,2,39);
   g.fillStyle=r()>.5?'rgba(248,245,231,.16)':'rgba(91,83,75,.08)';
   g.fillRect(xx+3,y+3,71,31);
  }
  dots(g,r,3000,32,232);
 });
 const grass=tile(39003,[91,130,68,47],(g,r)=>{
  for(let i=0;i<300;i++){
   g.fillStyle=r()>.5?'rgba(230,208,110,.07)':'rgba(20,69,30,.13)';
   g.beginPath();g.ellipse(r()*256,r()*256,3+r()*20,2+r()*8,r()*6,0,7);g.fill();
  }
  for(let i=0;i<9500;i++){
   const x=r()*256,y=r()*256;
   g.strokeStyle=r()>.5?'rgba(220,198,105,.24)':'rgba(27,75,29,.34)';
   g.lineWidth=.5;g.beginPath();g.moveTo(x,y);g.lineTo(x+(r()-.5)*3,y-r()*5);g.stroke();
  }
 });
 const stucco=tile(8871,[238,233,220,21],(g,r)=>{
  dots(g,r,9300,52,247);
  for(let i=0;i<35;i++){
   g.fillStyle='rgba(81,73,68,'+(.025+r()*.035)+')';
   g.fillRect(r()*256,r()*256,12+r()*91,1+r()*1.2);
  }
 });
 const platform=tile(11709,[185,180,167,19],(g,r)=>{
  for(let y=0;y<256;y+=46)for(let x=-68;x<280;x+=65){
   const xx=x+((y/46|0)%2)*33;g.fillStyle='rgba(35,41,37,.28)';
   g.fillRect(xx,y,66,2);g.fillRect(xx,y,2,47);
  }
  dots(g,r,4200,45,241);
 });
 const glass=tile(3562,[45,85,105,25],(g,r)=>{
  const grad=g.createLinearGradient(0,0,256,256);
  grad.addColorStop(0,'#9fbfc9');grad.addColorStop(.4,'#568197');grad.addColorStop(.65,'#294657');grad.addColorStop(1,'#1b2e38');
  g.fillStyle=grad;g.fillRect(0,0,256,256);
  g.fillStyle='rgba(230,241,244,.24)';g.beginPath();
  g.moveTo(30,0);g.lineTo(77,0);g.lineTo(190,256);g.lineTo(154,256);g.closePath();g.fill();
 });
 const ballast=tile(48071,[101,96,90,35],(g,r)=>{
  for(let i=0;i<6800;i++){
   const x=r()*256,y=r()*256,v=64+r()*110|0;
   g.fillStyle='rgba('+v+','+(v-1)+','+(v-5)+','+(.14+r()*.6)+')';
   g.beginPath();g.ellipse(x,y,1+r()*4,1+r()*3,r()*6,0,7);g.fill();
  }
 });
 const standingSeam=tile(5812,[150,73,57,22],(g,r)=>{
  for(let x=0;x<256;x+=24){
   g.fillStyle='rgba(39,23,25,.40)';g.fillRect(x,0,3,256);
   g.fillStyle='rgba(249,162,124,.30)';g.fillRect(x+4,0,2,256);
  }
  dots(g,r,1200,38,202);
 });
 return {asphalt,paving,grass,stucco,platform,glass,ballast,standingSeam};
}
export function planMiloviceStreetProps(roads,limit=1350){
 const patches=[],drains=[],manholes=[],bollards=[];
 let seed=103213;const r=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const stride=Math.max(1,Math.ceil((roads||[]).length/1100));
 let tested=0;
 for(let k=0;k<roads.length;k+=stride){
  const road=roads[k];if(road.width<4.4||!road.points?.length)continue;
  for(let j=1;j<road.points.length;j++){
   if(tested++>limit)break;
   const a=road.points[j-1],b=road.points[j],dx=b.x-a.x,dz=b.y-a.y,len=Math.hypot(dx,dz);
   if(len<14||len>160)continue;
   const t=.23+r()*.54,x=a.x+dx*t,z=a.y+dz*t,nx=-dz/len,nz=dx/len,side=r()>.5?1:-1,yaw=Math.atan2(-dx,-dz);
   if(r()<.72)patches.push([x,.197,z,1.2+r()*1.6,.015,1.2+r()*2.4,yaw]);
   if(r()<.55)drains.push([x+side*nx*(road.width*.5-.34),.21,z+side*nz*(road.width*.5-.34),.45,.024,.72,yaw]);
   if(r()<.40)manholes.push([x,.216,z,.51,.021,.51,0]);
   if(road.kind==='residential'&&r()<.14)
    bollards.push([x+side*nx*(road.width*.5+1.7),.53,z+side*nz*(road.width*.5+1.7),.14,1.06,.14,0]);
  }
 }
 return {patches,drains,manholes,bollards};
}
export function makeVehicleContactShadows(THREE,parent,max=96){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
 const g=canvas.getContext('2d'),grad=g.createRadialGradient(64,64,9,64,64,63);
 grad.addColorStop(0,'rgba(12,17,18,.68)');grad.addColorStop(.58,'rgba(16,21,20,.4)');grad.addColorStop(1,'rgba(12,17,18,0)');
 g.fillStyle=grad;g.fillRect(0,0,128,128);
 const texture=new THREE.CanvasTexture(canvas);
 const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:.65,depthWrite:false});
 const geometry=new THREE.PlaneGeometry(1,1);geometry.rotateX(-Math.PI/2);
 const mesh=new THREE.InstancedMesh(geometry,material,max);
 mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.count=0;parent.add(mesh);
 const dummy=new THREE.Object3D();
 function update(cars,x,z,terrainAt){
  let count=0;
  for(const car of cars){
   if(count>=max)break;
   const p=car.g.position;
   if(!car.g.visible||Math.hypot(p.x-x,p.z-z)>215)continue;
   const isBus=car.type===7;
   dummy.position.set(p.x,terrainAt(p.x,p.z)+.237,p.z);
   dummy.rotation.set(0,car.g.rotation.y,0);
   dummy.scale.set(isBus?3.0:2.2,1,isBus?12.6:4.8);dummy.updateMatrix();
   mesh.setMatrixAt(count++,dummy.matrix);
  }
  mesh.count=count;if(count)mesh.instanceMatrix.needsUpdate=true;
  return count;
 }
 return {update,mesh};
}
