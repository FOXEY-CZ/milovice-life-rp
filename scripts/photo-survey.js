// Milovice RP 5.11 - local photo geometry tools. Zero network access.
// Facade quad corners are TL,TR,BR,BL, expressed in relative image coordinates.
// The image is NEVER included in geometry exports or the game's asset bundle.
const finite=n=>typeof n==='number'&&Number.isFinite(n);
export function projectFacade(quad,u,v){
 if(!Array.isArray(quad)||quad.length!==4||quad.some(p=>!Array.isArray(p)||p.length!==2||!p.every(finite)))return null;
 const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=quad;
 const dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3;
 let g=0,h=0;
 if(Math.abs(dx3)+Math.abs(dy3)>1e-10){
  const det=dx1*dy2-dx2*dy1;if(Math.abs(det)<1e-10)return null;
  g=(dx3*dy2-dx2*dy3)/det;h=(dx1*dy3-dx3*dy1)/det;
 }
 const a=x1-x0+g*x1,b=x3-x0+h*x3,d=y1-y0+g*y1,e=y3-y0+h*y3;
 const div=g*u+h*v+1;
 if(Math.abs(div)<1e-9)return null;
 return [(a*u+b*v+x0)/div,(d*u+e*v+y0)/div];
}
export function imagePointToFacade(quad,x,y){
 const p00=projectFacade(quad,0,0),p10=projectFacade(quad,1,0),p01=projectFacade(quad,0,1),p11=projectFacade(quad,1,1);
 if(!p00||!p10||!p01||!p11)return null;
 // General 3x3 homography inverse using the corner inputs.
 const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=quad;
 const dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3;
 let g=0,h=0;
 if(Math.abs(dx3)+Math.abs(dy3)>1e-10){
  const det=dx1*dy2-dx2*dy1;if(Math.abs(det)<1e-10)return null;
  g=(dx3*dy2-dx2*dy3)/det;h=(dx1*dy3-dx3*dy1)/det;
 }
 const a=x1-x0+g*x1,b=x3-x0+h*x3,c=x0,d=y1-y0+g*y1,e=y3-y0+h*y3,f=y0;
 const A=e-f*h,B=c*h-b,C=b*f-c*e;
 const D=f*g-d,E=a-c*g,F=c*d-a*f;
 const G=d*h-e*g,H=b*g-a*h,I=a*e-b*d;
 const den=G*x+H*y+I;if(Math.abs(den)<1e-10)return null;
 const u=(A*x+B*y+C)/den,v=(D*x+E*y+F)/den;
 return Number.isFinite(u)&&Number.isFinite(v)?[u,v]:null;
}
export function normalizePhotoRectangle(quad,box,type='window'){
 if(!['window','door'].includes(type)||!box||![box.x,box.y,box.w,box.h].every(finite))return null;
 if(box.w<.007||box.h<.007)return null;
 const corners=[[box.x,box.y],[box.x+box.w,box.y],[box.x+box.w,box.y+box.h],[box.x,box.y+box.h]];
 const points=corners.map(p=>imagePointToFacade(quad,...p));
 if(points.some(p=>!p))return null;
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);
 const w=Math.max(...xs)-x,h=Math.max(...ys)-y;
 // Reject anything outside the actual user-calibrated facade instead of
 // silently letting the building acquire windows from the sky/next house.
 if(x<-.008||y<-.008||x+w>1.008||y+h>1.008||w<.018||h<.025)return null;
 return {type,x:+Math.max(0,x).toFixed(5),y:+Math.max(0,y).toFixed(5),
  w:+Math.min(w,1-Math.max(0,x)).toFixed(5),h:+Math.min(h,1-Math.max(0,y)).toFixed(5)};
}
const luminance=(data,index)=>.2126*data[index]+.7152*data[index+1]+.0722*data[index+2];
// A deterministic, tiny on-device vision *candidate* detector for dark
// rectangular regions. The user must review; windows are not inferred facts.
export function proposeDarkWindowRects(imageData,quad,{width=180,height=120,max=28}={}){
 const {data,width:iw,height:ih}=imageData||{};
 if(!data||!iw||!ih||data.length<iw*ih*4||!Array.isArray(quad)||quad.length!==4)return [];
 if(width<30||height<30||width*height>100000)return [];
 const lum=new Uint8Array(width*height),values=[];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const p=projectFacade(quad,(x+.5)/width,(y+.5)/height);
  if(!p)return [];
  const xx=Math.max(0,Math.min(iw-1,Math.round(p[0]*(iw-1))));
  const yy=Math.max(0,Math.min(ih-1,Math.round(p[1]*(ih-1))));
  const l=luminance(data,4*(yy*iw+xx));
  lum[y*width+x]=l;values.push(l);
 }
 values.sort((a,b)=>a-b);
 const median=values[Math.floor(values.length*.5)];
 // A global threshold is intentionally conservative; heavily textured facades
 // often return zero proposals rather than hallucinated precise detections.
 const threshold=Math.max(24,median-38),visited=new Uint8Array(lum.length),results=[];
 for(let y=2;y<height-2;y++)for(let x=2;x<width-2;x++){
  const start=y*width+x;
  if(visited[start]||lum[start]>=threshold)continue;
  const stack=[start];visited[start]=1;
  let left=x,right=x,top=y,bottom=y,area=0;
  while(stack.length){
   const idx=stack.pop(),px=idx%width,py=(idx/width)|0;
   left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);area++;
   for(const n of [idx-1,idx+1,idx-width,idx+width]){
    const nx=n%width,ny=(n/width)|0;
    if(n<0||n>=lum.length||nx<1||nx>=width-1||ny<1||ny>=height-1||visited[n]||lum[n]>=threshold)continue;
    visited[n]=1;stack.push(n);
   }
  }
  const rw=right-left+1,rh=bottom-top+1;
  if(rw<width*.028||rh<height*.055||rw>width*.28||rh>height*.42||
    area<rw*rh*.48||rw/rh<.42||rw/rh>2.6||
    left<3||right>width-4||top<3||bottom>height-4)continue;
  results.push({type:'window',x:+(left/width).toFixed(5),y:+(top/height).toFixed(5),
   w:+(rw/width).toFixed(5),h:+(rh/height).toFixed(5),candidate:true});
 }
 return results.sort((a,b)=>a.y-b.y||a.x-b.x).slice(0,max);
}
export function validatePhotoOpenings(items,{max=42}={}){
 if(!Array.isArray(items)||items.length>max)return null;
 const clean=[];
 for(const x of items){
  if(!x||!['window','door'].includes(x.type)||![x.x,x.y,x.w,x.h].every(finite)||
    x.x<0||x.y<0||x.w<.018||x.h<.025||x.x+x.w>1.0001||x.y+x.h>1.0001)return null;
  if(x.type==='door'&&clean.some(p=>p.type==='door'))return null;
  const candidate={type:x.type,x:+x.x.toFixed(5),y:+x.y.toFixed(5),
   w:+x.w.toFixed(5),h:+x.h.toFixed(5)};
  if(clean.some(p=>Math.abs(p.x-candidate.x)<.005&&Math.abs(p.y-candidate.y)<.005))return null;
  clean.push(candidate);
 }
 return clean;
}
