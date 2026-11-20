/** Milovice RP 5.178 — deterministic low-memory grain for OSM clay
 * tennis courts. Model surface detail only, not photo texture or GPS data.
 * 64x64 RGBA = 16 KiB shared by every mapped leisure=pitch surface=clay.
 */
export function makeMappedClayGrain5178(size=64){
 if(!Number.isInteger(size)||size<8||size>128||
  (size&(size-1))!==0)return null;
 const bytes=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  // World-stable tiled speckles, zero Math.random and no dynamic GPU work.
  let h=(Math.imul(x+11,73856093)^Math.imul(y+17,19349663))>>>0;
  h^=h>>>13;h=Math.imul(h,1274126177)>>>0;h^=h>>>16;
  const grain=(h%35)-17;
  const fine=(((x*7+y*11)&7)-3);
  const base=Math.max(194,Math.min(255,233+grain+fine));
  const i=(y*size+x)*4;
  bytes[i]=base;
  bytes[i+1]=Math.max(0,base-3);
  bytes[i+2]=Math.max(0,base-6);
  bytes[i+3]=255;
 }
 return {version:'5.178',width:size,height:size,data:bytes,
  channels:4,bytes:bytes.byteLength,textureShared:true,
  sourceTagRequired:'leisure=pitch;surface=clay',
  proceduralModelNotPhoto:true,newPolygons:0,newMeshes:0};
}
