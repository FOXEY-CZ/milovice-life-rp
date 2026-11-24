/** 5.297: correct the EXISTING estimated swing model, not its real equipment.
 * The old four vertical legs stood 0.72m away from the top bar.
 * Use the SAME four parts as an A-frame, with each foot at local DEM height
 * and both ends of the leg connecting to a common level crossbar.
 * Same eleven box instances, same materials, no additional equipment or collider.
 * visualBatch convention: [worldX,groundRelativeY,worldZ,sx,sy,sz,yaw,pitch,roll].
 */
export function planPlaygroundSwingFrame5297(p,terrainAt){
 if(p?.type!=='swing'||![p.x,p.z,p.yaw].every(Number.isFinite)||
  typeof terrainAt!=='function')return null;
 const c=Math.cos(p.yaw),s=Math.sin(p.yaw);
 const world=(u,v)=>({x:p.x+u*c+v*s,z:p.z-u*s+v*c});
 const ground=(u,v)=>{const q=world(u,v);return terrainAt(q.x,q.z)};
 const base=ground(0,0);
 if(!Number.isFinite(base))return null;
 const frame=[],seat=[],chain=[];
 const add=(out,u,v,absoluteY,sx,sy,sz,pitch=0)=>{
  const q=world(u,v),g=terrainAt(q.x,q.z);
  if(!Number.isFinite(g))return false;
  out.push([q.x,absoluteY-g,q.z,sx,sy,sz,p.yaw,pitch,0]);return true;
 };
 const bar=base+2.50;
 for(const u of [-1.4,1.4])for(const v of [-.72,.72]){
  const foot=ground(u,v),height=bar-foot;
  if(!Number.isFinite(foot)||height<1.3||height>3.8)return null;
  if(!add(frame,u,v/2,(foot+bar)/2,.12,Math.hypot(height,v),.12,
   Math.atan2(-v,height)))return null;
 }
 if(!add(frame,0,0,bar,3.1,.14,.14))return null;
 for(const u of [-.65,.65]){
  if(!add(seat,u,0,base+.92,.82,.12,.42))return null;
  for(const du of [-.31,.31])
   if(!add(chain,u+du,0,base+1.70,.045,1.52,.045))return null;
 }
 return {frame,seat,chain,barHeight:bar,partCount:11,estimated:true};
}
