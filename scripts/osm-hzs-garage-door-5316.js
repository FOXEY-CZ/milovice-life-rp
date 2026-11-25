// 5.316 independent preparation: original opaque visual garage door swatch.
// Reference: official HZS opening gallery photo 037 (11 February 2020),
// https://hzscr.gov.cz/hasicien/SCRIPT/ViewImage.aspx?docname=037.jpg&physid=1090352
// and public DotaceEU exterior photo. Red framing and glazed rows visible.
// 2 x 4 model panes, colors, dimensions and placement are estimates.
// No actual photo pixels, transparency, garage access or physics implied.
export function makeHZSGarageDoor5316(width=32,height=64){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<16||width>128||height<32||height>256)return null;
 const data=new Uint8Array(width*height*4);
 const colors={red:0xb52b2d,edge:0x8b2426,glass:0x43565d,reflection:0x62767c};
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const u=(x+.5)/width,v=(y+.5)/height;
  const frame=u<.075||u>.925||v<.20||v>.96||Math.abs(u-.5)<.028;
  const horizontal=[.39,.58,.77].some(t=>Math.abs(v-t)<.018);
  const color=frame||horizontal?(u<.035||u>.965?colors.edge:colors.red):u<.16?colors.reflection:colors.glass;
  data.set([(color>>16)&255,(color>>8)&255,color&255,255],(y*width+x)*4);
 }
 return {width,height,data,modelGlassRows:4,modelGlassColumns:2,photoPixels:0,exactPanelCountVerified:false,placementVerified:false,newColliders:0};
}

// The candidate edge is explicitly a model choice, not a verified facade.
// Three visible bays in published photographs do not establish total count.
import {planHZSShell5315} from './osm-hzs-facade-5315.js';
export function planHZSModelDoors5316(input,toWorld){
 if(!planHZSShell5315(input)||typeof toWorld!=='function')return null;
 const pts=input.geometry.slice(0,-1).map(toWorld).map(p=>({x:p?.x,z:p?.z??p?.y}));
 if(pts.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 const a=pts[3],b=pts[4],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
 if(length<13||length>15)return null;
 let area=0;for(let i=0;i<pts.length;i++){
  const p=pts[i],q=pts[(i+1)%pts.length];area+=(p.x-a.x)*(q.z-a.z)-(q.x-a.x)*(p.z-a.z);
 }
 if(Math.abs(area)<1)return null;
 const ux=dx/length,uz=dz/length,nx=Math.sign(area)*uz,nz=-Math.sign(area)*ux;
 const width=3.1,height=3.3,gap=.65,span=3*width+2*gap,start=(length-span)/2;
 const doors=Array.from({length:3},(_,i)=>({from:start+i*(width+gap),to:start+i*(width+gap)+width}));
 return {a,b,ux,uz,nx,nz,length,width,height,doors,edge:3,
  modelOnly:true,facadeOrientationVerified:false,doorCountVerified:false,newColliders:0};
}
export function renderHZSModelDoors5316(THREE,{plan,layer,baseHeight,modelHeight,enabled}={}){
 if(enabled!==true||!plan||!layer||!Number.isFinite(baseHeight)||!Number.isFinite(modelHeight)||modelHeight<plan.height+.5)return null;
 const tex=makeHZSGarageDoor5316(),map=new THREE.DataTexture(tex.data,tex.width,tex.height,THREE.RGBAFormat);
 map.colorSpace=THREE.SRGBColorSpace;map.magFilter=THREE.NearestFilter;map.minFilter=THREE.LinearFilter;map.generateMipmaps=false;map.needsUpdate=true;
 const pos=[],uv=[],idx=[];
 const point=(s,y)=>[plan.a.x+plan.ux*s+plan.nx*.025,baseHeight+y,plan.a.z+plan.uz*s+plan.nz*.025];
 for(const door of plan.doors){
  const n=pos.length/3;pos.push(...point(door.from,.03),...point(door.to,.03),...point(door.to,plan.height+.03),...point(door.from,plan.height+.03));
  uv.push(0,0,1,0,1,1,0,1);idx.push(n,n+1,n+2,n,n+2,n+3);
 }
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
 geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(idx);geometry.computeVertexNormals();
 const material=new THREE.MeshStandardMaterial({map,side:THREE.DoubleSide,roughness:.8});
 const mesh=new THREE.Mesh(geometry,material);mesh.name='HZS_model_door_preview_5316';layer.add(mesh);
 return {mesh,textureBytes:tex.data.byteLength,triangles:idx.length/3,doors:plan.doors.length,newColliders:0,
  target:{x:(plan.a.x+plan.b.x)/2,z:(plan.a.z+plan.b.z)/2,y:baseHeight+2},
  normal:{x:plan.nx,z:plan.nz}};
}
