// HZS 5.317: original tiny bitmap lettering, not copied photograph pixels.
// DotaceEU exterior and HZS opening gallery show the station name and rotated 112.
// Font, color and stroke width are approximations; no surveyed placement.
const glyphs={
 ' ':['00000','00000','00000','00000','00000','00000','00000'],
 'S':['01111','10000','10000','01110','00001','00001','11110'],
 'T':['11111','00100','00100','00100','00100','00100','00100'],
 'A':['01110','10001','10001','11111','10001','10001','10001'],
 'N':['10001','11001','10101','10011','10001','10001','10001'],
 'I':['11111','00100','00100','00100','00100','00100','11111'],
 'C':['01111','10000','10000','10000','10000','10000','01111'],
 'E':['11111','10000','10000','11110','10000','10000','11111'],
 'H':['10001','10001','10001','11111','10001','10001','10001'],
 'Z':['11111','00001','00010','00100','01000','10000','11111'],
 'M':['10001','11011','10101','10101','10001','10001','10001'],
 'L':['10000','10000','10000','10000','10000','10000','11111'],
 'O':['01110','10001','10001','10001','10001','10001','01110'],
 'V':['10001','10001','10001','10001','10001','01010','00100'],
 'R':['11110','10001','10001','11110','10100','10010','10001'],
 'F':['11111','10000','10000','11110','10000','10000','10000'],
 'D':['11110','10001','10001','10001','10001','10001','11110'],
 '1':['00100','01100','00100','00100','00100','00100','01110'],
 '2':['01110','10001','00001','00010','00100','01000','11111']
};
export const HZS_SIGNAGE_5317=Object.freeze({
 sourceFacadeText:'STANICE HZS MILOVICE',facadeText:'IRONFIELD FIRE STATION',towerText:'112',
 towerRotationDegrees:90,towerPurpose:'hose-drying',
 sourceUrls:Object.freeze([
 'https://hzscr.gov.cz/hasicien/docDetail.aspx?docType=ART&docid=22205732',
 'https://www.dotaceeu.cz/cs/evropske-fondy-v-cr/novinky/pro-hasice-a-ostatni-slozky-izs-jsme-pripravili-vi',
 'https://www.hasici.cz/zhave-aktuality/Dulezite-informace/Slavnostni-otevreni-nove-stanice-Milovice'
 ]),
 exactFontVerified:false,placementVerified:false,towerDimensionsVerified:false,
 photoPixels:0,newGeometry:0,newColliders:0
});
export function makeHZSSign5317(kind,scale=2){
 if(!['facade','tower'].includes(kind)||!Number.isInteger(scale)||scale<1||scale>4)return null;
 const text=kind==='facade'?HZS_SIGNAGE_5317.facadeText:HZS_SIGNAGE_5317.towerText;
 const w=(text.length*6+1)*scale,h=9*scale;
 const rotated=kind==='tower',width=rotated?h:w,height=rotated?w:h;
 const data=new Uint8Array(width*height*4);
 for(let i=0;i<text.length;i++)for(let y=0;y<7;y++)for(let x=0;x<5;x++){
  if(glyphs[text[i]][y][x]!=='1')continue;
  for(let sy=0;sy<scale;sy++)for(let sx=0;sx<scale;sx++){
   const px=(1+i*6+x)*scale+sx,py=(1+y)*scale+sy;
   // Counterclockwise in image coordinates: horizontal label reads upward.
   const u=rotated?py:px,v=rotated?w-1-px:py;
   // Three.js DataTexture rows start at the bottom; store accordingly.
   data.set([181,43,45,255],((height-1-v)*width+u)*4);
  }
 }
 return {width,height,data,text,rotationDegrees:rotated?90:0,photoPixels:0,
  estimatedFont:true,placementVerified:false,newColliders:0};
}

// Explicitly hypothetical model on the same candidate facade as the 5.316 doors.
// No new collider, interior or verified site dimensions; ordinary gameplay unchanged.
export function planHZSSignPreview5317(doorPlan,modelHeight){
 if(doorPlan?.edge!==3||doorPlan.modelOnly!==true||!Number.isFinite(modelHeight)||modelHeight<4.6||
 ![doorPlan.length,doorPlan.ux,doorPlan.uz,doorPlan.nx,doorPlan.nz].every(Number.isFinite)||
 !Number.isFinite(doorPlan.a?.x)||!Number.isFinite(doorPlan.a?.z)||doorPlan.length<13||doorPlan.length>15)return null;
 const sign=makeHZSSign5317('facade'),signWidth=8.4,signHeight=signWidth*sign.height/sign.width;
 const signBottom=Math.max(doorPlan.height+.30,modelHeight*.72);
 if(signBottom+signHeight>modelHeight-.1)return null;
 const towerWidth=2.4,towerDepth=2.4,towerExtraHeight=5.5;
 return {doorPlan,modelHeight,signWidth,signHeight,signBottom,
  towerWidth,towerDepth,towerExtraHeight,towerAlong:1.7,modelOnly:true,
  towerDimensionsVerified:false,placementVerified:false,newColliders:0};
}
export function renderHZSSignPreview5317(THREE,{plan,layer,baseHeight,enabled}={}){
 if(enabled!==true||!plan||!layer||!Number.isFinite(baseHeight))return null;
 const d=plan.doorPlan,group=new THREE.Group();
 group.name='HZS_hypothetical_sign_and_tower_5317';
 const coord=(s,y,inset=0)=>new THREE.Vector3(d.a.x+d.ux*s-d.nx*inset,baseHeight+y,d.a.z+d.uz*s-d.nz*inset);
 // A camera outside the wall must read the text left-to-right, not mirrored.
 const reverse=d.ux*d.nz-d.uz*d.nx<0;
 const sign=(kind,center,bottom,width,height,inset)=>{
  const tex=makeHZSSign5317(kind),map=new THREE.DataTexture(tex.data,tex.width,tex.height,THREE.RGBAFormat);
  map.colorSpace=THREE.SRGBColorSpace;map.magFilter=THREE.NearestFilter;map.minFilter=THREE.NearestFilter;
  map.generateMipmaps=false;map.needsUpdate=true;
  const l=center+(reverse?1:-1)*width/2,r=center-(reverse?1:-1)*width/2;
  const pos=[coord(l,bottom,inset),coord(r,bottom,inset),coord(r,bottom+height,inset),coord(l,bottom+height,inset)];
  const g=new THREE.BufferGeometry().setFromPoints(pos);g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,1],2));g.setIndex([0,1,2,0,2,3]);
  const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map,alphaTest:.5,side:THREE.DoubleSide}));
  m.name='HZS_model_sign_'+kind;group.add(m);return tex.data.byteLength;
 };
 const tower=new THREE.Mesh(new THREE.BoxGeometry(plan.towerWidth,plan.towerExtraHeight,plan.towerDepth),new THREE.MeshStandardMaterial({color:0xd5d6d3,roughness:.9}));
 tower.position.copy(coord(plan.towerAlong,plan.modelHeight+plan.towerExtraHeight/2,plan.towerDepth/2));
 tower.rotation.y=Math.atan2(-d.uz,d.ux);tower.name='HZS_model_tower_above_roof';group.add(tower);
 const strip=new THREE.Mesh(new THREE.BoxGeometry(.66,plan.towerExtraHeight-.5,.04),new THREE.MeshStandardMaterial({color:0xb52b2d,roughness:.85}));
 strip.position.copy(coord(plan.towerAlong-.65,plan.modelHeight+plan.towerExtraHeight/2,-.035));
 strip.rotation.y=tower.rotation.y;group.add(strip);
 const glass=new THREE.Mesh(new THREE.BoxGeometry(.36,plan.towerExtraHeight-1.1,.025),new THREE.MeshStandardMaterial({color:0x43565d,roughness:.32}));
 glass.position.copy(coord(plan.towerAlong-.65,plan.modelHeight+plan.towerExtraHeight/2,-.07));
 glass.rotation.y=tower.rotation.y;group.add(glass);
 const textureBytes=sign('facade',d.length/2,plan.signBottom,plan.signWidth,plan.signHeight,-.04)+
  sign('tower',plan.towerAlong+.52,plan.modelHeight+.9,.95,2.01,-.045);
 layer.add(group);
 return {group,meshes:5,triangles:40,textureBytes,newColliders:0,modelOnly:true,towerDimensionsVerified:false,placementVerified:false};
}
