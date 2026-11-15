// Milovice RP 5.81 — photo-observed upper blue parking-bicycle sign on
// EXISTING OSM 1011197691 Bike Tower. Not a new tower or street object.
// User-shared 2022 Mapy panorama (observation only) + ŠJů Commons 2024.
// Draw an original, generic symbol instead of copying protected source pixels.
export const UPPER_BIKETOWER_SIGN_SOURCE=Object.freeze({
 wayId:1011197691,photoYear:2022,
 source:'https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg',
 licensedPhotoDate:'2024-05-30',photographer:'ŠJů',license:'CC BY 4.0',
 observed:'blue square bicycle-parking pictogram high on existing tower',
 exactHeightSurveyed:false,exactFacingSurveyed:false,
 photosCopied:false
});
export function planUpperBiketowerSign({wayId=1011197691,radius,height=11.4,
 nx,nz}={}){
 if(wayId!==UPPER_BIKETOWER_SIGN_SOURCE.wayId||
  !Number.isFinite(radius)||radius<3.0||radius>4.3||
  !Number.isFinite(height)||height<10||height>15||
  !Number.isFinite(nx)||!Number.isFinite(nz))return null;
 const length=Math.hypot(nx,nz);
 if(length<.95||length>1.05)return null;
 const y=height-1.35,faceOffset=radius+.10,signHeight=1.15;
 // Keep sign below roof; it cannot protrude outside tower horizontally by
 // more than the .1m stand-off required to avoid z-fighting with glazing.
 return {
  x:nx*faceOffset,z:nz*faceOffset,y,
  yaw:Math.atan2(nx,nz),width:1.16,height:signHeight,
  wayId,source:UPPER_BIKETOWER_SIGN_SOURCE.source,
  estimatedPlacement:true,physicalRoadFurniture:0,drawCalls:1,
  photoPixelsUsed:false
 };
}
export function createUpperBiketowerSign(THREE,parent,plan){
 if(!THREE||!parent||!plan)return {active:false,drawCalls:0};
 const canvas=document.createElement('canvas');
 canvas.width=canvas.height=256;
 const g=canvas.getContext('2d');
 // Original generic blue P+bicycle sign, directly observed on tower facade.
 g.fillStyle='#135baf';g.fillRect(0,0,256,256);
 g.strokeStyle='#edf6fc';g.lineWidth=7;g.strokeRect(8,8,240,240);
 g.textAlign='center';g.textBaseline='middle';
 g.fillStyle='#fff';g.font='bold 116px Arial,sans-serif';
 g.fillText('P',128,99,190);
 // Simplified bicycle, no trademarks, no copied logo artwork.
 g.strokeStyle='#fff';g.lineWidth=9;g.lineCap='round';g.lineJoin='round';
 g.beginPath();g.arc(67,196,23,0,Math.PI*2);
 g.moveTo(189,196);g.arc(189,196,23,0,Math.PI*2);g.stroke();
 g.beginPath();g.moveTo(67,196);g.lineTo(112,150);g.lineTo(150,196);
 g.lineTo(67,196);g.moveTo(112,150);g.lineTo(189,196);
 g.moveTo(150,196);g.lineTo(164,152);g.lineTo(181,152);
 g.moveTo(105,147);g.lineTo(118,147);
 g.stroke();
 const texture=new THREE.CanvasTexture(canvas);
 texture.colorSpace=THREE.SRGBColorSpace;
 const geometry=new THREE.PlaneGeometry(plan.width,plan.height);
 const material=new THREE.MeshBasicMaterial({
  map:texture,side:THREE.FrontSide,transparent:false,depthWrite:true});
 const mesh=new THREE.Mesh(geometry,material);
 mesh.name='Milovice_2022_2024_Photo_BikeTower_Upper_Bike_P';
 mesh.position.set(plan.x,plan.y,plan.z);mesh.rotation.y=plan.yaw;
 mesh.userData.osmWayId=plan.wayId;
 mesh.userData.photoReference=plan.source;
 mesh.userData.positionEstimated=true;
 mesh.userData.notExtraStreetFurniture=true;
 parent.add(mesh);
 return {
  active:true,drawCalls:1,textureCount:1,wayId:plan.wayId,
  photoPixelsUsed:false,heightEstimated:true,
  dispose:()=>{parent.remove(mesh);geometry.dispose();material.dispose();texture.dispose()}
 };
}
