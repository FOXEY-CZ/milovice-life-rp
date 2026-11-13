// Milovice RP Graphics 2.0 — original procedural surface library.
// Designed for browser/mobile: 7 shared 256px tiles, no HTTP asset requests,
// no new per-frame allocations and no copyright-controlled photo textures.
// Geometry/locations remain from OSM/DMR, not inferred by these textures.
export function makeCitySurfaceKit(THREE){
 const makeRng=seed=>()=>{
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  return seed/4294967296;
 };
 function tile(draw,seed){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const rand=makeRng(seed);
  draw(ctx,rand);
  const tex=new THREE.CanvasTexture(canvas);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.colorSpace=THREE.SRGBColorSpace;
  tex.anisotropy=4;
  tex.generateMipmaps=true;
  return tex;
 }
 function grain(ctx,rnd,base,spread){
  const data=ctx.createImageData(256,256),d=data.data;
  for(let i=0;i<d.length;i+=4){
   const n=(rnd()-.5)*spread;
   for(let j=0;j<3;j++)d[i+j]=Math.max(0,Math.min(255,base[j]+n));
   d[i+3]=255;
  }
  ctx.putImageData(data,0,0);
 }
 const asphalt=tile((g,r)=>{
  grain(g,r,[79,83,85],29);
  // Fine embedded aggregate: more credible at both ground and vehicle heights.
  for(let i=0;i<8500;i++){
   const p=r()>.60?208:25,alpha=.035+r()*.16;
   g.fillStyle='rgba('+p+','+p+','+p+','+alpha+')';
   g.fillRect(r()*256,r()*256,.4+r()*1.9,.4+r()*1.4);
  }
  for(let i=0;i<23;i++){
   const x=r()*256,y=r()*256;
   g.strokeStyle='rgba(38,39,40,'+(.035+r()*.08)+')';
   g.lineWidth=.55+r()*.8;g.beginPath();g.moveTo(x,y);
   g.lineTo(x+2+r()*11,y-2+r()*4);g.lineTo(x+7+r()*13,y+2+r()*8);g.stroke();
  }
 },10701);
 const paving=tile((g,r)=>{
  grain(g,r,[194,191,182],15);
  const stepY=46,stepX=65;
  for(let row=0;row<8;row++){
   const y=row*stepY-12,offset=row%2?stepX*.5:0;
   for(let col=-1;col<6;col++){
    const x=col*stepX+offset;
    g.fillStyle='rgba(55,54,52,.28)';g.fillRect(x,y,stepX+1,2.0);g.fillRect(x,y,1.6,stepY+1);
    g.fillStyle=r()>.46?'rgba(247,244,236,.15)':'rgba(103,104,99,.055)';
    g.fillRect(x+2,y+3,stepX-4,stepY-5);
    g.fillStyle='rgba(240,235,224,.22)';g.fillRect(x+2,y+2,stepX-4,.9);
   }
  }
  for(let i=0;i<2800;i++){
   const value=r()>.5?54:242;
   g.fillStyle='rgba('+value+','+value+','+value+','+(.015+r()*.065)+')';
   g.fillRect(r()*256,r()*256,1+r()*2,1+r()*2);
  }
 },1582);
 const grass=tile((g,r)=>{
  grain(g,r,[102,133,79],47);
  for(let i=0;i<170;i++){
   const x=r()*256,y=r()*256,size=4+r()*20;
   g.fillStyle=r()>.5?'rgba(186,176,94,.065)':'rgba(29,73,39,.085)';
   g.beginPath();g.ellipse(x,y,size,2+r()*7,r()*6,0,Math.PI*2);g.fill();
  }
  for(let i=0;i<6500;i++){
   const x=r()*256,y=r()*256;
   g.strokeStyle=r()>.5?'rgba(202,190,128,.14)':'rgba(26,70,34,.21)';
   g.lineWidth=.5;g.beginPath();g.moveTo(x,y);g.lineTo(x+(r()-.5)*2,y-1-r()*4);g.stroke();
  }
 },30061);
 const stucco=tile((g,r)=>{
  grain(g,r,[246,242,230],14);
  // Very light plaster pores, fine horizontal trowel marks, subtle old stains.
  for(let i=0;i<8200;i++){
   const x=r()*256,y=r()*256;
   g.fillStyle=r()>.5?'rgba(83,77,67,.048)':'rgba(255,255,255,.06)';
   g.fillRect(x,y,.6+r()*1.5,.5+r()*2);
  }
  for(let i=0;i<38;i++){
   const y=r()*256;
   g.fillStyle='rgba(90,84,76,'+(.012+r()*.016)+')';g.fillRect(r()*256,y,12+r()*93,.45+r()*.7);
  }
 },7942);
 const platform=tile((g,r)=>{
  grain(g,r,[184,179,168],18);
  for(let row=0;row<5;row++)for(let col=0;col<5;col++){
   let x=col*64+(row%2)*32-32,y=row*64-19;
   g.fillStyle='rgba(68,66,59,.25)';g.fillRect(x,y,66,2);g.fillRect(x,y,1.5,66);
   g.fillStyle='rgba(243,238,221,.12)';g.fillRect(x+2,y+2,62,1);
  }
  for(let i=0;i<3800;i++){
   const x=r()*256,y=r()*256,v=r()>.4?242:58;
   g.fillStyle='rgba('+v+','+v+','+v+','+(.025+r()*.12)+')';
   g.fillRect(x,y,.5+r()*2,.5+r()*1.5);
  }
 },18574);
 const glass=tile((g,r)=>{
  const gradient=g.createLinearGradient(0,0,125,256);
  gradient.addColorStop(0,'#a5cbd5');
  gradient.addColorStop(.21,'#6e9cad');
  gradient.addColorStop(.46,'#355568');
  gradient.addColorStop(.66,'#233c4a');
  gradient.addColorStop(1,'#213440');
  g.fillStyle=gradient;g.fillRect(0,0,256,256);
  g.fillStyle='rgba(240,250,251,.32)';g.beginPath();
  g.moveTo(24,0);g.lineTo(79,0);g.lineTo(200,256);g.lineTo(160,256);g.closePath();g.fill();
  g.fillStyle='rgba(240,248,250,.10)';g.beginPath();
  g.moveTo(150,0);g.lineTo(175,0);g.lineTo(251,256);g.lineTo(219,256);g.closePath();g.fill();
  g.fillStyle='rgba(30,45,51,.22)';g.fillRect(0,225,256,31);
  for(let i=0;i<18;i++){
   const x=r()*256,y=190+r()*60;
   g.fillStyle='rgba(193,212,219,.025)';g.fillRect(x,y,1+r()*5,1+r()*19);
  }
 },117);
 const ballast=tile((g,r)=>{
  grain(g,r,[104,101,94],32);
  for(let i=0;i<4300;i++){
   const x=r()*256,y=r()*256,w=1+r()*5,h=1+r()*3;
   const v=70+r()*80|0;g.fillStyle='rgba('+v+','+(v-2)+','+(v-5)+','+(.12+r()*.55)+')';
   g.beginPath();g.ellipse(x,y,w,h,r()*Math.PI,0,Math.PI*2);g.fill();
  }
 },19918);
 const standingSeam=tile((g,r)=>{
  grain(g,r,[151,69,55],14);
  for(let x=0;x<256;x+=26){
   g.fillStyle='rgba(49,19,20,.40)';g.fillRect(x,0,3,256);
   g.fillStyle='rgba(240,138,109,.27)';g.fillRect(x+4,0,2,256);
   g.fillStyle='rgba(93,35,35,.10)';g.fillRect(x+18,0,2,256);
  }
  for(let i=0;i<900;i++){
   g.fillStyle='rgba(47,29,27,.065)';
   g.fillRect(r()*256,r()*256,1+r()*2,1+r()*6);
  }
 },664);
 return {asphalt,paving,grass,stucco,platform,glass,ballast,standingSeam};
}
export function makeContactShadow(THREE){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
 const c=canvas.getContext('2d');
 const grad=c.createRadialGradient(64,64,6,64,64,62);
 grad.addColorStop(0,'rgba(18,24,29,.42)');
 grad.addColorStop(.55,'rgba(19,26,29,.23)');
 grad.addColorStop(1,'rgba(18,24,28,0)');
 c.fillStyle=grad;c.fillRect(0,0,128,128);
 const map=new THREE.CanvasTexture(canvas);
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.68),
  new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));
 mesh.rotation.x=-Math.PI/2;mesh.renderOrder=3;mesh.frustumCulled=false;
 return mesh;
}
