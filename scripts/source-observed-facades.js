// 5.52: Školská 220/1 photographed on 2024-05-30 (ŠJů, CC BY 4.0).
// Only TWO street-facing OSM walls are observed. Dimensions approximate.
// Match wall midpoint and source-camera normal, never arbitrary OSM vertex index.
export const SKOLSKA_FRONT_PHOTO='https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg';
const eye={x:(14.8822619-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(50.2290672-50.226)*111320};
const photoProfiles={
 '118487980':[
  {x:-462.22,z:-346.94,length:12.60,groundWindows:3},
  {x:-469.57,z:-353.86,length:8.12,groundWindows:1}
 ]
};
export function planSourceObservedFacade(id,frame){
 const profiles=photoProfiles[String(id)];
 if(!profiles||!frame||![frame.mx,frame.mz,frame.len,
  frame.nx,frame.nz].every(Number.isFinite))return null;
 const dx=eye.x-frame.mx,dz=eye.z-frame.mz;
 const d=Math.hypot(dx,dz);
 if(d<.1||(dx*frame.nx+dz*frame.nz)/d<.20)return null;
 const found=profiles.find(v=>Math.hypot(v.x-frame.mx,v.z-frame.mz)<.85&&
  Math.abs(v.length-frame.len)<.40);
 if(!found)return null;
 return {groundWindows:found.groundWindows,
  source:SKOLSKA_FRONT_PHOTO,
  approximated:true,verifiedRear:false,
  side:{rows:[found.groundWindows],windowWidth:1.18,
   windowHeight:1.34,doorAt:'none',shutters:false}};
}
