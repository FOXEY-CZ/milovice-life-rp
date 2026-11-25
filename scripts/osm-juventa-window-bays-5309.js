import {planJuventaPhotoAnchor5308} from './osm-juventa-photo-anchor-5308.js';
// Photo-inspired, explicitly provisional decoration on one candidate wall.
// No survey of exact window positions, facade edge attribution or dimensions.
export function planJuventaWindowBays5309(input){
 const anchor=planJuventaPhotoAnchor5308(input);
 if(!anchor||anchor.edge!==47||typeof input.toWorld!=='function')return null;
 const points=input.geometry.slice(0,-1).map(p=>{const q=input.toWorld(p);return {x:q.x,z:q.z??q.y}});
 if(points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 const a=points[anchor.edge],b=points[anchor.edge+1],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
 if(len<16||len>18)return null;
 const area=points.reduce((s,p,i)=>{const q=points[(i+1)%points.length];return s+p.x*q.z-q.x*p.z},0);
 if(!area)return null;
 const ux=dx/len,uz=dz/len,nx=Math.sign(area)*uz,nz=-Math.sign(area)*ux;
 const quads=[];
 function quad(left,right,bottom,top,offset,color){
  if(left<0||right>len||right<=left||top<=bottom)throw Error('Juventa bay outside source edge');
  const at=(u,y)=>[a.x+ux*u+nx*offset,y,a.z+uz*u+nz*offset];
  quads.push({vertices:[at(left,bottom),at(right,bottom),at(right,top),at(left,top)],color});
 }
 const accents=[0xb44736,0xd77b32,0xd8ac32];
 for(const bottom of [3.8,6.85,9.9])for(let j=0;j<3;j++){
  const left=1.15+j*3.3,right=left+2.65,top=bottom+1.65;
  quad(left,right,bottom,top,.022,0x999da0);
  for(let row=0;row<3;row++)for(let col=0;col<2;col++){
   const l=left+.07+col*1.29,lo=bottom+.07+row*.52;
   quad(l,l+1.21,lo,lo+.45,.035,[0x526b7d,0x8ca2ae,0x6b8798][row]);
  }
  quad(left-.28,left,bottom,top,.026,accents[j]);
 }
 return {sourceOSMId:anchor.sourceOSMId,edge:anchor.edge,quads,
  windowBays:9,glassPanes:54,accentStrips:9,sourceEdgeLength:len,
  modelOnly:true,exactPositionsSurveyed:false,entryCandidateKeptClear:true,
  source:'https://www.azklima.com/en/zakladni-skola-a-materska-skola-juventa-milovice/',
  additionalSource:'https://zakazky.mesto-milovice.cz/document_1250/65ebd096e4d0b8ab546f76ddfc2ea91a-priloha-c-7-pd_zs-juventa-oprava-sok-pdf'};
}
export function renderJuventaWindowBays5309(THREE,{plan,baseHeight,layer}){
 if(!plan||!Number.isFinite(baseHeight)||!layer)return null;
 const pos=[],colors=[];
 for(const q of plan.quads){
  const c=new THREE.Color(q.color);
  for(const i of [0,1,2,0,2,3]){
   const p=q.vertices[i];pos.push(p[0],p[1]+baseHeight,p[2]);colors.push(c.r,c.g,c.b);
  }
 }
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
 geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 geo.computeVertexNormals();
 const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:.8}));
 mesh.name='Juventa_provisional_window_bays_5309';mesh.userData.lodDetail=true;
 layer.add(mesh);
 return {mesh,triangles:pos.length/9};
}
