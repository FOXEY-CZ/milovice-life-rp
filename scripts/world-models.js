// Original, procedural meshes for Milovice RP. No third-party geometry or photographed textures.
// The style is medium-detail mobile-friendly; these are not manufacturer-certified models.
const mats=new WeakMap();
function material(THREE,hex,metalness=.05,roughness=.76){
 let cache=mats.get(THREE);if(!cache){cache=new Map();mats.set(THREE,cache)}
 const key=[hex,metalness,roughness].join('/');
 if(!cache.has(key))cache.set(key,new THREE.MeshStandardMaterial({color:hex,metalness,roughness}));
 return cache.get(key);
}
function part(THREE,parent,geo,mat,x,y,z,sx=1,sy=1,sz=1){
 const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;
}
export function makeHumanRig(THREE,variant=0,clothing=0x355f78,player=false){
 // 5.1.4: more human body proportions and clothing silhouettes, still lightweight,
 // stylized procedural original meshes (not a scanned or photorealistic person).
 const root=new THREE.Group(),high=new THREE.Group(),low=new THREE.Group();
 root.add(high,low);low.visible=false;
 const skin=material(THREE,player?0xd2a184:[0xe1b092,0xc59070,0xb47f60,0x986747,0xefbda0][variant%5]);
 const hair=material(THREE,player?0x2e292a:[0x302b29,0x735036,0x4b352b,0xab835b,0x222324][variant%5]);
 const coat=material(THREE,clothing),trousers=material(THREE,[0x303842,0x3d4548,0x514944][variant%3]);
 const shoes=material(THREE,0x22262b),eye=material(THREE,0xeceae2),pupil=material(THREE,0x263944);
 const oval=new THREE.SphereGeometry(1,14,12);
 const limb=new THREE.CapsuleGeometry(.5,1,6,8);
 const armSleeve=material(THREE,player?0x204b66:clothing);
 const coatShadow=material(THREE,player?0x183c53:0x414b53);
 const coatHighlight=material(THREE,player?0x2e7091:clothing);
 // Narrow waist, shaped shoulders and defined neck replace the old stacked round blocks.
 part(THREE,high,oval,coat,0,1.25,0,.32,.37,.205);
 part(THREE,high,oval,coat,0,1.49,0,.36,.19,.214);
 part(THREE,high,oval,trousers,0,.91,0,.272,.17,.178);
 part(THREE,high,oval,coatShadow,0,1.05,0,.29,.048,.18);
 part(THREE,high,oval,skin,0,1.666,0,.080,.11,.078);
 part(THREE,high,oval,skin,0,1.84,-.018,.187,.226,.174);
 // More natural short hair: top, crown and a small front fringe, not a helmet-shaped cap.
 part(THREE,high,oval,hair,0,2.004,.025,.189,.075,.175);
 part(THREE,high,oval,hair,0,1.973,.119,.175,.103,.085);
 if(variant%3===0)part(THREE,high,oval,hair,-.06,2.04,-.042,.135,.053,.130);
 if(variant%3===1)part(THREE,high,oval,hair,.072,2.041,-.035,.121,.058,.129);
 for(const side of [-1,1]){
  part(THREE,high,oval,skin,side*.188,1.841,-.012,.039,.068,.037);
  part(THREE,high,oval,eye,side*.073,1.871,-.187,.033,.021,.009);
  part(THREE,high,oval,pupil,side*.073,1.87,-.194,.015,.016,.010);
 }
 part(THREE,high,oval,skin,0,1.809,-.187,.039,.057,.038);
 part(THREE,high,oval,material(THREE,0x995f59),0,1.764,-.180,.047,.008,.010);
 const arms=[],legs=[];
 for(const side of [-1,1]){
  const arm=new THREE.Group();arm.position.set(side*.359,1.491,.006);high.add(arm);
  part(THREE,arm,oval,coat,0,-.074,0,.125,.164,.141);
  part(THREE,arm,limb,armSleeve,0,-.277,0,.212,.275,.212);
  part(THREE,arm,oval,coatShadow,0,-.520,0,.100,.052,.098);
  part(THREE,arm,oval,skin,0,-.606,-.014,.082,.111,.072);
  arms.push(arm);
  const leg=new THREE.Group();leg.position.set(side*.151,.87,0);high.add(leg);
  part(THREE,leg,limb,trousers,0,-.325,0,.224,.298,.211);
  part(THREE,leg,oval,trousers,0,-.570,-.005,.114,.12,.113);
  part(THREE,leg,oval,shoes,0,-.763,-.060,.130,.085,.201);
  if(player)part(THREE,leg,oval,coatShadow,0,-.831,-.060,.134,.026,.209);
  legs.push(leg);
 }
 if(player){
  // Cloth details are only added to the player to avoid dozens of extra NPC draw calls.
  const block=new THREE.BoxGeometry(1,1,1);
  // Padded jacket yoke, back panel and waist seam (most visible in third-person).
  part(THREE,high,block,coatHighlight,0,1.466,.211,.415,.115,.018);
  part(THREE,high,block,coat,0,1.283,.209,.470,.252,.018);
  part(THREE,high,block,coatShadow,0,1.132,.204,.395,.020,.020);
  for(const side of [-1,1]){
   part(THREE,high,block,coatHighlight,side*.282,1.339,.155,.023,.355,.024);
   part(THREE,high,oval,coatShadow,side*.126,1.569,-.155,.103,.09,.075);
  }
  part(THREE,high,block,coatShadow,0,1.345,-.208,.025,.43,.015);
  part(THREE,high,block,coatHighlight,0,1.569,-.20,.138,.049,.026);
 }
 // Low-cost alternative for distant NPCs.
 part(THREE,low,oval,coat,0,1.25,0,.315,.405,.198);
 part(THREE,low,oval,skin,0,1.84,-.02,.186,.225,.175);
 return {group:root,high,low,arms,legs};
}
function sideExtrusion(THREE,points,width,bevel=.045){
 const shape=new THREE.Shape();shape.moveTo(points[0][0],points[0][1]);
 for(let i=1;i<points.length;i++)shape.lineTo(points[i][0],points[i][1]);shape.closePath();
 const geom=new THREE.ExtrudeGeometry(shape,{depth:width-.08,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:2,steps:1,curveSegments:2});
 geom.rotateY(-Math.PI/2);geom.translate(width*.5-.02,0,0);
 return geom;
}
// Baked procedural metallic surface: tiny clearcoat grain, no borrowed image textures.
function automotivePaint(THREE,color){
 const coat=material(THREE,color,.33,.42);
 if(coat.map)return coat;
 const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d'),im=g.createImageData(128,128);
 let seed=79231;for(let i=0;i<im.data.length;i+=4){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const n=218+(seed%33),sparkle=(seed%59===0)?22:0;
  im.data[i]=Math.min(255,n+sparkle);im.data[i+1]=Math.min(255,n+sparkle);
  im.data[i+2]=Math.min(255,n+sparkle);im.data[i+3]=255;
 }
 g.putImageData(im,0,0);
 const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;
 tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(5,9);
 coat.map=tex;coat.needsUpdate=true;return coat;
}
function carWheel(THREE,parent,side,z,radius=.38,xOffset=.87){
 const tyre=material(THREE,0x171a1d),rim=material(THREE,0xabb4b8,.74,.35),spoke=material(THREE,0x505b65,.6,.42);
 const pivot=new THREE.Group();pivot.position.set(side*xOffset,radius+.045,z);pivot.userData.wheelRadius=radius;pivot.userData.wheelSide=side;parent.add(pivot);
 const rubber=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,.19,18),tyre);rubber.rotation.z=Math.PI/2;pivot.add(rubber);
 const face=new THREE.Mesh(new THREE.CylinderGeometry(radius*.57,radius*.57,.20,12),rim);face.rotation.z=Math.PI/2;pivot.add(face);
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5;part(THREE,pivot,new THREE.BoxGeometry(.025,.28,.07),spoke,side*.114,Math.cos(a)*radius*.33,Math.sin(a)*radius*.33).rotation.x=a}
 return pivot;
}
export function makeRoadCar(THREE,index=0){
 // Skoda-like hatch/estate, BMW-like sedan and Toyota-like crossover are generic
 // shape categories: no unsupported branded facsimile, logos or third-party meshes.
 const variant=index%8,group=new THREE.Group(),isVan=variant===6;
 const length=[4.45,4.15,4.75,4.28,4.62,4.86,5.08,4.34][variant];
 const height=[1.60,1.58,1.57,1.75,1.60,1.72,2.16,1.60][variant];
 const width=isVan?2.04:1.81;
 const colors=[0x164a71,0xa0afb8,0x393d43,0x8f3937,0x4c7566,0xc7c5bd,0xf0ece1,0x8f8d80];
 // Body palette is keyed by vehicle instance, not only its silhouette.
 const paintIndex=(variant*3+Math.floor(index/8)*5)%colors.length;
 const paint=automotivePaint(THREE,colors[paintIndex]),chrome=material(THREE,0xb6bec4,.72,.35);
 const glass=material(THREE,0x223e50,.22,.19),black=material(THREE,0x20272e),light=material(THREE,0xf8e5b5);
 const back=material(THREE,0xb82e29),headStart=isVan?1.13:height*.68;
 const profile=[[-length*.50,.46],[-length*.49,.87],[-length*.39,1.03],[length*.36,1.03],[length*.49,.83],[length*.50,.50]];
 const body=part(THREE,group,sideExtrusion(THREE,profile,width),paint,0,0,0);
 body.castShadow=true;
 const top=isVan
  ?[[-length*.45,1.03],[-length*.40,height-.10],[-length*.29,height],[length*.34,height],[length*.44,1.03]]
  :[[-length*.32,1.03],[-length*.17,height-.11],[-length*.07,height],[length*.14,height],[length*.32,1.03]];
 part(THREE,group,sideExtrusion(THREE,top,width*.90,.035),paint,0,0,0);
 const wheels=[];
 for(const side of [-1,1]){
  for(const z of [-length*.32,length*.32])wheels.push(carWheel(THREE,group,side,z,isVan?.43:.385));
  const lx=side*width*.47;
  // Windows are separate polygon panes, correctly matching sloping A/C pillars.
  const panes=isVan?[
   [[-length*.37,1.22],[-length*.34,height-.21],[-length*.06,height-.21],[-length*.06,1.20]],
   [[-length*.015,1.20],[-length*.015,height-.21],[length*.31,height-.21],[length*.34,1.20]]
  ]:[
   [[-length*.275,1.12],[-length*.145,height-.19],[-length*.016,height-.19],[-length*.016,1.12]],
   [[length*.015,1.12],[length*.015,height-.19],[length*.115,height-.19],[length*.275,1.12]]
  ];
  for(const poly of panes){
   const shape=new THREE.Shape();shape.moveTo(poly[0][0],poly[0][1]);
   for(let j=1;j<poly.length;j++)shape.lineTo(poly[j][0],poly[j][1]);shape.closePath();
   const geo=new THREE.ShapeGeometry(shape);geo.rotateY(-Math.PI/2);geo.translate(lx,0,0);
   const window=new THREE.Mesh(geo,glass);window.material.side=THREE.DoubleSide;group.add(window);
  }
  part(THREE,group,new THREE.BoxGeometry(.06,.12,.19),black,side*width*.56,1.22,-length*.22);
  part(THREE,group,new THREE.BoxGeometry(.05,.08,.08),chrome,side*(width*.51),1.0,-length*.15);
  part(THREE,group,new THREE.BoxGeometry(.055,.05,.15),chrome,side*width*.51,.96,length*.08);
  part(THREE,group,new THREE.BoxGeometry(.12,.14,.34),light,side*.62,.88,-length*.48);
  part(THREE,group,new THREE.BoxGeometry(.10,.20,.26),back,side*.66,.83,length*.48);
 }
 part(THREE,group,new THREE.BoxGeometry(1.26,.14,.06),black,0,.70,-length*.499);
 part(THREE,group,new THREE.BoxGeometry(.45,.12,.065),chrome,0,.71,-length*.52);
 part(THREE,group,new THREE.BoxGeometry(1.15,.10,.08),chrome,0,.69,length*.49);
 // Tinted windscreen angled to match sloping hood; softened low-triangle bonnet lines.
 const windshield=part(THREE,group,new THREE.BoxGeometry(width*.83,.43,.035),glass,0,height*.84,-length*.19);
 windshield.rotation.x=-.45;
 // Detailed but GPU-conservative: curved arch trim is a single instanced draw,
 // and extra glazing/plate/bumper significantly improve the road silhouettes.
 const rear=part(THREE,group,new THREE.BoxGeometry(width*.79,.35,.035),glass,0,height*.81,length*.215);
 rear.rotation.x=.48;
 part(THREE,group,new THREE.BoxGeometry(width*.60,.19,.07),black,0,.70,-length*.505);
 const plate=material(THREE,0xdde0da,.10,.65);
 part(THREE,group,new THREE.BoxGeometry(.45,.12,.065),plate,0,.55,-length*.515);
 part(THREE,group,new THREE.BoxGeometry(.45,.12,.065),plate,0,.56,length*.505);
 const arch=new THREE.InstancedMesh(new THREE.TorusGeometry(.42,.042,5,14,Math.PI),
  material(THREE,0x22282c),4);
 const tmp=new THREE.Object3D();let ai=0;
 for(const side of [-1,1])for(const axle of [-length*.32,length*.32]){
  tmp.position.set(side*(width*.5+.025),.44,axle);
  tmp.rotation.set(0,side*Math.PI/2,0);tmp.updateMatrix();arch.setMatrixAt(ai++,tmp.matrix);
 }
 arch.instanceMatrix.needsUpdate=true;arch.computeBoundingSphere();group.add(arch);
 if(variant===4||variant===5||variant===6){
  for(const side of [-1,1])
   part(THREE,group,new THREE.BoxGeometry(.052,.055,length*.45),chrome,
    side*width*.37,height+.035,length*.015);
 }
 if(variant===3||variant===5){
  for(const side of [-1,1])
   part(THREE,group,new THREE.BoxGeometry(.046,.12,length*.72),black,
    side*width*.51,.52,0);
 }
 group.userData.vehiclePaint=colors[paintIndex];
 group.userData.vehicleKind=['hatchback','compact','sedan','crossover','estate','SUV','van','sedan'][variant];
 return {group,wheels,kind:group.userData.vehicleKind};
}
function textPanel(THREE,text,w,h,background='#12191e',foreground='#ffd75a'){
 const cv=document.createElement('canvas');cv.width=512;cv.height=128;const g=cv.getContext('2d');
 g.fillStyle=background;g.fillRect(0,0,512,128);
 g.fillStyle=foreground;g.font='bold 65px system-ui';g.textAlign='center';g.textBaseline='middle';
 g.fillText(text,256,65,490);
 const texture=new THREE.CanvasTexture(cv);texture.colorSpace=THREE.SRGBColorSpace;
 return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
}
export function makePidBus(THREE,route='432',articulated=false){
 const group=new THREE.Group(),w=2.55,length=11.0,wheels=[];
 const white=automotivePaint(THREE,0xeaeae5),red=automotivePaint(THREE,0xc72931),dark=material(THREE,0x20292f);
 const tinted=material(THREE,0x305b70,.25,.25),silver=material(THREE,0xa9b7bc,.65,.4);
 const profile=[[-5.5,.47],[-5.49,2.69],[-5.25,3.04],[5.23,3.04],[5.48,2.70],[5.50,.47]];
 const shell=part(THREE,group,sideExtrusion(THREE,profile,w,.095),white,0,0,0);
 shell.castShadow=true;
 // White/red PID-inspired regional colorblocking. Not an exact licensed operator model.
 for(const side of [-1,1]){
  part(THREE,group,new THREE.BoxGeometry(.085,.82,10.8),red,side*1.29,1.02,0);
  part(THREE,group,new THREE.BoxGeometry(.09,.22,10.8),dark,side*1.32,1.49,0);
  for(let i=0;i<7;i++){
   const z=-4.65+i*1.48;
   part(THREE,group,new THREE.BoxGeometry(.075,1.02,1.34),tinted,side*1.335,2.19,z);
   part(THREE,group,new THREE.BoxGeometry(.095,1.06,.06),dark,side*1.38,2.18,z+.69);
  }
  for(const z of [-3.35,3.50])wheels.push(carWheel(THREE,group,side,z,.57,1.32));
  part(THREE,group,new THREE.BoxGeometry(.13,.35,.31),dark,side*1.48,2.49,-5.16);
  part(THREE,group,new THREE.BoxGeometry(.10,.22,.50),material(THREE,0xfff0cc),side*.88,1.13,-5.53);
  part(THREE,group,new THREE.BoxGeometry(.08,.20,.41),material(THREE,0xcd2626),side*.95,1.13,5.53);
 }
 part(THREE,group,new THREE.BoxGeometry(2.36,1.36,.08),tinted,0,2.15,-5.53);
 part(THREE,group,new THREE.BoxGeometry(2.36,.15,.12),dark,0,2.85,-5.57);
 part(THREE,group,new THREE.BoxGeometry(2.30,.29,.10),red,0,1.10,-5.54);
 part(THREE,group,new THREE.BoxGeometry(1.48,.12,2.55),white,0,3.15,.34);
 // Articulated regional vehicle option: approx. 18m SOR NS18 proportions.
 // The visual joint flex is stylized; axle steering is not separately simulated.
 if(articulated){
  const trailer=[ [4.45,.49],[4.45,2.78],[4.66,3.02],[11.94,3.02],[12.15,2.73],[12.17,.49] ];
  part(THREE,group,sideExtrusion(THREE,trailer,w,.085),white,0,0,0);
  const rubber=material(THREE,0x24292d),redTrim=red;
  // Bellows at the articulation, separated from the main passenger cabin.
  part(THREE,group,new THREE.BoxGeometry(2.60,2.47,.86),rubber,0,1.69,5.49);
  for(let fold=0;fold<6;fold++){
   const z=5.06+fold*.18;
   part(THREE,group,new THREE.BoxGeometry(2.65,2.43,.055),material(THREE,0x4e5355),0,1.69,z);
  }
  for(const side of [-1,1]){
   part(THREE,group,new THREE.BoxGeometry(.084,.82,7.50),redTrim,side*1.29,1.02,8.39);
   for(let k=0;k<5;k++){
    const z=6.15+k*1.28;
    part(THREE,group,new THREE.BoxGeometry(.075,1.02,1.12),tinted,side*1.335,2.19,z);
    part(THREE,group,new THREE.BoxGeometry(.088,1.07,.06),dark,side*1.38,2.19,z+.58);
   }
   wheels.push(carWheel(THREE,group,side,10.35,.57,1.32));
   part(THREE,group,new THREE.BoxGeometry(.08,.24,.36),material(THREE,0xd03035),side*.95,1.12,12.21);
  }
  part(THREE,group,new THREE.BoxGeometry(2.24,.85,.12),tinted,0,2.15,12.21);
  group.userData.articulated=true;
 }
 const destination=textPanel(THREE,route+' MILOVICE',2.0,.46);
 destination.position.set(0,2.76,-5.65);group.add(destination);
 const sidePanel=textPanel(THREE,'PID '+route,2.2,.43,'#e6e8e5','#be2030');
 sidePanel.rotation.y=Math.PI/2;sidePanel.position.set(1.38,1.2,2.20);group.add(sidePanel);
 return {group,route,wheels};
}
export function makeCityElefantStyleTrain(THREE){
 const group=new THREE.Group(),cars=[];
 const steel=material(THREE,0xa6afb4,.39,.48),blue=material(THREE,0x2876a4),red=material(THREE,0xc44145);
 const glass=material(THREE,0x284d61,.26,.25),black=material(THREE,0x252b30),wheel=material(THREE,0x33383d,.2,.76);
 for(let i=0;i<3;i++){
  const coach=new THREE.Group();group.add(coach);cars.push(coach);
  const poly=i===0||i===2
   ?[[-12,.55],[-12,3.40],[-11.30,3.92],[11.75,3.92],[12,3.47],[12,.55]]
   :[[-12,.56],[-12,3.82],[-11.8,3.95],[11.8,3.95],[12,3.82],[12,.56]];
  part(THREE,coach,sideExtrusion(THREE,poly,2.77,.12),steel,0,0,0);
  for(const side of [-1,1]){
   part(THREE,coach,new THREE.BoxGeometry(.06,1.11,23.2),blue,side*1.43,2.66,0);
   part(THREE,coach,new THREE.BoxGeometry(.07,.50,23.2),red,side*1.44,1.25,0);
   // GPU-instanced panes: 22 windows per side without 44 separate draw calls.
   const paneGeo=new THREE.BoxGeometry(.08,.48,1.43);
   const seamGeo=new THREE.BoxGeometry(.10,.51,.06);
   const panes=new THREE.InstancedMesh(paneGeo,glass,22);
   const seams=new THREE.InstancedMesh(seamGeo,black,22),tmp=new THREE.Object3D();
   let p=0;
   for(let k=0;k<11;k++){
    const z=-10.9+k*2.07;
    for(const y of [1.86,3.12]){
     tmp.position.set(side*1.45,y,z);tmp.rotation.set(0,0,0);tmp.scale.set(1,1,1);
     tmp.updateMatrix();panes.setMatrixAt(p,tmp.matrix);
     tmp.position.set(side*1.50,y,z+.75);tmp.updateMatrix();seams.setMatrixAt(p,tmp.matrix);
     p++;
    }
   }
   panes.instanceMatrix.needsUpdate=true;seams.instanceMatrix.needsUpdate=true;
   panes.computeBoundingSphere();seams.computeBoundingSphere();coach.add(panes,seams);
   for(const z of [-8.8,8.5]){
    const tyre=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.18,14),wheel);
    tyre.rotation.z=Math.PI/2;tyre.position.set(side*1.12,.48,z);coach.add(tyre);
   }
  }
  if(i!==1){
   const cabZ=i===0?-12.13:12.13;
   part(THREE,coach,new THREE.BoxGeometry(2.40,1.02,.10),glass,0,2.55,cabZ);
   const routeSign=textPanel(THREE,'S22 MILOVICE',1.65,.32);
   routeSign.position.set(0,2.87,cabZ+(i===0?-.10:.10));
   routeSign.rotation.y=i===0?0:Math.PI;
   coach.add(routeSign);
   part(THREE,coach,new THREE.BoxGeometry(2.50,.24,.12),black,0,1.45,cabZ+.04);
   for(const s of [-1,1]){
    part(THREE,coach,new THREE.BoxGeometry(.19,.17,.13),material(THREE,0xffedcb),s*.97,1.55,cabZ+.08);
    part(THREE,coach,new THREE.BoxGeometry(.15,.15,.13),red,s*.88,.93,cabZ+.08);
   }
  }
 }
 return {group,cars};
}
