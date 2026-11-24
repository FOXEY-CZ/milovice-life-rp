/** Terrain-aware visual repair of existing estimated slide models. No additional parts or equipment. */
export function planPlaygroundSlideFrame5298(p,terrainAt){
 if(p?.type!=='slide'||![p.x,p.z,p.yaw].every(Number.isFinite)||typeof terrainAt!=='function')return null;
 const c=Math.cos(p.yaw),s=Math.sin(p.yaw);
 const world=(u,v)=>({x:p.x+u*c+v*s,z:p.z-u*s+v*c});
 const ground=(u,v)=>{const q=world(u,v);return terrainAt(q.x,q.z)};
 const base=ground(-1.14,0),end=ground(2.48,0);
 if(!Number.isFinite(base)||!Number.isFinite(end))return null;
 const frame=[],seat=[],plastic=[],slide=[];
 const add=(out,u,v,y,sx,sy,sz,roll=0)=>{
  const q=world(u,v),g=terrainAt(q.x,q.z);
  if(![g,y,sx,sy,sz,roll].every(Number.isFinite)||Math.min(sx,sy,sz)<=0)return false;
  out.push([q.x,y-g,q.z,sx,sy,sz,p.yaw,0,roll]);return true;
 };
 const deck=base+1.57,top=deck+.075,bottom=deck-.075;
 for(const u of [-1.68,-.60])for(const v of [-.55,.55]){
  const foot=ground(u,v),h=bottom-foot;
  if(!Number.isFinite(h)||h<.7||h>2.4||!add(frame,u,v,(bottom+foot)/2,.13,h,.13))return null;
 }
 if(!add(seat,-1.14,0,deck,1.40,.15,1.28))return null;
 for(const v of [-.61,.61])if(!add(plastic,-1.14,v,top+.275,1.42,.64,.09))return null;
 // Grounded access rails: their top ends meet the existing platform edge.
 const stairFrom=-2.42,stairTo=-1.84;
 const stairFeet=[ground(stairFrom,-.4575),ground(stairFrom,.4575)];
 const stairBase=Math.max(...stairFeet);
 if(!stairFeet.every(Number.isFinite)||top-stairBase<.7||top-stairBase>2.4)return null;
 for(const [i,v] of [-.4575,.4575].entries()){
  const foot=stairFeet[i],h=top-foot,dx=stairTo-stairFrom;
  if(h<.7||h>2.4||!add(frame,(stairFrom+stairTo)/2,v,(foot+top)/2,.08,Math.hypot(h,dx),.08,-Math.atan2(dx,h)))return null;
 }
 for(const t of [.25,.5,.75]){
  const u=stairFrom+(stairTo-stairFrom)*t;
  // A level tread crosses both rails; differing foot heights must remain bounded.
  if(Math.abs(stairFeet[0]-stairFeet[1])*(1-t)>.08)return null;
  const y=(stairFeet[0]+stairFeet[1])/2*(1-t)+top*t;
  if(!add(seat,u,0,y,.30,.12,.98))return null;
 }
 const startU=-.44,endU=2.48,dx=endU-startU;
 const startY=top-.055,endY=end+.15,dy=endY-startY;
 if(dy>-.65||dy< -2.5)return null;
 const roll=Math.atan2(dy,dx),length=Math.hypot(dx,dy);
 for(let i=0;i<=12;i++){
  const t=i/12,u=startU+dx*t,y=startY+dy*t;
  for(const v of [-.49,0,.49]){
   const g=ground(u,v);
   if(!Number.isFinite(g)||g>y-.08)return null;
  }
 }
 const midU=(startU+endU)/2,midY=(startY+endY)/2;
 if(!add(slide,midU,0,midY,length,.12,.98,roll))return null;
 for(const v of [-.53,.53])if(!add(plastic,midU,v,midY+.11,length,.18,.10,roll))return null;
 return {frame,seat,plastic,slide,partCount:15,estimated:true,deckTop:top,startU,endU,startY,endY};
}
