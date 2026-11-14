/**
 * Milovice RP 5.64 — transparent BIKE TOWER steelwork, not an invented site.
 *
 * Location: EXISTING OSM way 1011197691 by Milovice station, same original
 * footprint and height. Evidence: May 30 2024 photo of Milovice bike tower
 * by ŠJů (CC BY 4.0) and official manufacturer listing "BIKETOWER BT 2.2,
 * Milovice 2021". Photos establish transparent shell and visible metallic
 * interior. Exact count/angles of struts are visual *approximations*.
 * No new tower, entrance, road, paving, bicycle or other unrelated item.
 *
 * https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg
 * https://www.biketower.cz/reference-a-mapa/
 */
export const MILOVICE_BIKE_TOWER_PHOTO={
 wayId:1011197691,photoDate:'2024-05-30',model:'BIKETOWER BT 2.2',
 photographicSiteVerified:true,steelRackArrangementEstimated:true,
 source:'https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg',
 manufacturer:'https://www.biketower.cz/reference-a-mapa/',
 renderBudget:1
};
export function planBikeTowerSteelwork({radius,height=11.4,wayId=1011197691}={}){
 if(wayId!==MILOVICE_BIKE_TOWER_PHOTO.wayId||
    !Number.isFinite(radius)||radius<3||radius>5||
    !Number.isFinite(height)||height<9||height>15)
  return {valid:false,reason:'wrong-site-or-dimensions',beams:[]};
 const beams=[],R=radius*.72;
 // Photographic cue: the glazed cylinder shows a *steel framework*, with
 // repeated pale-gray decks and vertical/radial bracing through the glass.
 // Geometry uses just SIX inner stations around the circular rack, with
 // no posts outside the exact mapped glass facade.
 const sectors=6,levels=4,yStart=.70,yEnd=height-1.0;
 for(let i=0;i<sectors;i++){
  const angle=i*Math.PI*2/sectors,following=(i+1)*Math.PI*2/sectors;
  const x=Math.cos(angle)*R,z=Math.sin(angle)*R;
  const nx=Math.cos(following)*R,nz=Math.sin(following)*R;
  const a={x,y:yStart,z},b={x,y:yEnd,z};
  beams.push({a,b,kind:'upright'});
  for(let level=1;level<=levels;level++){
   const y=yStart+(yEnd-yStart)*level/(levels+1);
   beams.push({a:{x,y,z},b:{x:nx,y,z:nz},kind:'horizontal'});
   // Braces are entirely INTERNAL, light visual indication of the real
   // machinery framework; not a new fence on the street.
   if(level<levels)beams.push({
    a:{x,y,z},b:{x:nx,y:y+(yEnd-yStart)/(levels+1),z:nz},
    kind:'diagonal'
   });
  }
 }
 // Keep a central core structure visible through the transparent skin.
 // No animated bicycles or simulated storage mechanics added.
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,y=yStart+1+i*1.9;
  beams.push({a:{x:0,y,z:0},b:{x:Math.cos(a)*R,y,z:Math.sin(a)*R},
   kind:'radial'});
 }
 return {valid:true,wayId,sectors,levels,beams,
  maxOuterRadius:R,renderBudget:1,
  source:MILOVICE_BIKE_TOWER_PHOTO,
  internalOnly:true,geometryEstimated:true};
}
export function createBikeTowerSteelwork(THREE,parent,plan){
 if(!THREE||!parent||!plan?.valid||!plan.beams.length)
  return {rendered:false,drawCalls:0,reason:'no-valid-photo-site-plan'};
 const geometry=new THREE.BoxGeometry(.055,1,.055);
 const mat=new THREE.MeshLambertMaterial({color:0x71858c});
 const batch=new THREE.InstancedMesh(geometry,mat,plan.beams.length);
 const helper=new THREE.Object3D();
 const up=new THREE.Vector3(0,1,0);
 const direction=new THREE.Vector3();
 const center=new THREE.Vector3();
 for(let i=0;i<plan.beams.length;i++){
  const {a,b}=plan.beams[i];
  direction.set(b.x-a.x,b.y-a.y,b.z-a.z);
  const length=direction.length();
  if(!Number.isFinite(length)||length<.01)throw Error('Invalid bike tower interior beam');
  direction.normalize();
  center.set((a.x+b.x)*.5,(a.y+b.y)*.5,(a.z+b.z)*.5);
  helper.position.copy(center);
  helper.quaternion.setFromUnitVectors(up,direction);
  helper.scale.set(1,length,1);
  helper.updateMatrix();
  batch.setMatrixAt(i,helper.matrix);
 }
 batch.instanceMatrix.needsUpdate=true;
 batch.computeBoundingSphere();
 batch.name='Milovice_Biketower_2024_photo_interior_steel';
 batch.userData.photoSiteId=MILOVICE_BIKE_TOWER_PHOTO.wayId;
 batch.userData.steelStructureApproximate=true;
 batch.userData.internalOnly=true;
 parent.add(batch);
 return {rendered:true,drawCalls:1,instances:plan.beams.length,
  mappedWayId:plan.wayId,sourceDate:'2024-05-30',
  geometryEstimated:true};
}
