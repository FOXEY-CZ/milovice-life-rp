// Milovice RP 5.3.2 — analog touchscreen pedestrian controls.
// Intensity is the stick distance (not touch pressure, which is unreliable).
export function pedestrianSpeed(magnitude, keyboardSprint=false) {
 const v=Math.max(0,Math.min(1,Number(magnitude)||0));
 if(v<=.12)return 0;
 const axis=(v-.12)/.88;
 // Smooth walking from a careful step to a brisk walk; outer ring = run.
 if(axis<=.62)return .82+(axis/.62)*2.17;
 return 2.99+((axis-.62)/.38)*2.51;
}
export function keyboardPedestrianSpeed(sprint=false){return sprint?5.5:2.99}
export function makeWalkJoystick(base,knob,enabled){
 let id=null,x=0,y=0,force=0;
 function refresh(){
  const size=base.getBoundingClientRect();
  const maxRadius=Math.max(18,Math.min(size.width,size.height)*.33);
  knob.style.transform='translate('+Math.round(x*maxRadius)+'px,'+Math.round(-y*maxRadius)+'px)';
  base.dataset.intensity=force>=.69?'běh':force>.12?'chůze':'stojí';
  base.setAttribute('aria-valuetext',force>=.69?'Běh':force>.12?'Chůze':'Stojí');
 }
 function move(e){
  if(id!==e.pointerId)return;
  if(!enabled()){clear();return}
  const rect=base.getBoundingClientRect(),centerX=rect.left+rect.width*.5,centerY=rect.top+rect.height*.5;
  const radius=Math.max(18,Math.min(rect.width,rect.height)*.33);
  const dx=(e.clientX-centerX)/radius,dy=(e.clientY-centerY)/radius;
  const length=Math.hypot(dx,dy),clamp=Math.max(1,length);
  x=dx/clamp;y=-dy/clamp;force=Math.min(1,length);
  // 12% dead zone to suppress drifting when a thumb is released near center.
  if(force<=.12){x=0;y=0;force=0}
  refresh();
 }
 function clear(){id=null;x=0;y=0;force=0;refresh()}
 const start=e=>{
  if(!enabled()||id!==null||e.button>0)return;
  e.preventDefault();id=e.pointerId;
  try{base.setPointerCapture(e.pointerId)}catch(_){}
  move(e);
 };
 const drag=e=>{if(e.pointerId===id){e.preventDefault();move(e)}};
 const end=e=>{if(e.pointerId===id){e.preventDefault();clear()}};
 base.addEventListener('pointerdown',start);
 base.addEventListener('pointermove',drag);
 for(const event of ['pointerup','pointercancel','lostpointercapture'])base.addEventListener(event,end);
 addEventListener('blur',clear);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()});
 refresh();
 return {get(){return {x,y,magnitude:force}},reset:clear};
}
