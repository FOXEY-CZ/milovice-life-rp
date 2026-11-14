// Milovice RP 5.34: lightweight, deterministic material micro-detail.
// No photo pixels or invented architectural features. Pixel patterns are
// abstract finish/grain only and multiply the approved facade base colours.
// Pure synthesizer runs in Node CI and the same RGBA array uploads once to GPU.
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
function hash(x,y,seed){
 let n=Math.imul(x+123,374761393)^Math.imul(y+913,668265263)^seed;
 n=Math.imul(n^(n>>>13),1274126177);
 return ((n^(n>>>16))>>>0)/4294967296;
}
function periodicNoise(x,y,size,grid,seed){
 const xx=x*grid/size,yy=y*grid/size;
 const xi=Math.floor(xx),yi=Math.floor(yy);
 const sx=xx-xi,sy=yy-yi,u=sx*sx*(3-2*sx),v=sy*sy*(3-2*sy);
 const h=(a,b)=>hash((a+grid)%grid,(b+grid)%grid,seed);
 const top=h(xi,yi)*(1-u)+h(xi+1,yi)*u;
 const low=h(xi,yi+1)*(1-u)+h(xi+1,yi+1)*u;
 return top*(1-v)+low*v;
}
export function synthesizeFacadePixels(kind='stucco',size=128){
 if(!['stucco','plinth','glass'].includes(kind)||
  !Number.isInteger(size)||size<32||size>256)return null;
 const out=new Uint8Array(size*size*4);
 const seed=kind==='stucco'?1579:kind==='plinth'?4771:2887;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const a=periodicNoise(x,y,size,8,seed);
  const b=periodicNoise(x,y,size,32,seed+11);
  const fine=hash(x,y,seed+29);
  let r,g,bl;
  if(kind==='stucco'){
   const v=clamp(Math.round(243+(a-.5)*14+(b-.5)*15+(fine-.5)*12),209,255);
   r=v;g=v;bl=v;
  }else if(kind==='plinth'){
   const aggregate=clamp(Math.round(235+(a-.5)*20+(b-.5)*18+(fine-.5)*23),190,255);
   r=aggregate;g=aggregate;bl=aggregate;
  }else{
   // Gentle broad sky reflection and a soft offset ribbon, not a painted
   // silhouette of a made-up interior or fake window.
   const u=x/size,v=y/size;
   const ribbon=Math.exp(-Math.pow((u-(.22+v*.25))/.11,2));
   const vertical=(Math.cos(u*Math.PI*2)*.5+.5);
   const tone=clamp(194+ribbon*48+vertical*10+15*(1-v)+(b-.5)*9,174,255);
   r=Math.round(clamp(tone*.96,0,255));
   g=Math.round(clamp(tone,0,255));
   bl=Math.round(clamp(tone*1.02,0,255));
  }
  const at=(y*size+x)*4;
  out[at]=r;out[at+1]=g;out[at+2]=bl;out[at+3]=255;
 }
 return out;
}
export function makeSharedFacadeSurfaceMaps(THREE,{size=128}={}){
 if(!THREE?.DataTexture||!THREE?.RepeatWrapping||!THREE?.RGBAFormat)
  throw Error('Three.js DataTexture is required');
 const make=(kind,ru,rv)=>{
  const texture=new THREE.DataTexture(synthesizeFacadePixels(kind,size),size,size,
   THREE.RGBAFormat,THREE.UnsignedByteType);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(ru,rv);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.generateMipmaps=true;texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.needsUpdate=true;
  return texture;
 };
 return {
  stucco:make('stucco',.58,.85),
  plinth:make('plinth',1,1),
  glass:make('glass',1,1)
 };
}
