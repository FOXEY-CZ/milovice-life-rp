// 5.330: opt-in, rate-limited game cues. No speech or radio control.
export function createGpsCue5330(){
 let goal=null,direction=null,maneuver=null,stage=0,last=-Infinity;
 function reset(){goal=null;direction=null;maneuver=null;stage=0;}
 function update({enabled,mapOpen,walking,target,instruction,now}={}){
  if(!enabled||!target){reset();return null;}
  if(mapOpen||walking||!Number.isFinite(now))return null;
  if(goal!==target){reset();goal=target;}
  const dir=instruction?.direction,d=instruction?.distanceMetres;
  if(!['left','right','reverse','road-end'].includes(dir)||!Number.isFinite(d)||d<0)return null;
  const key=typeof instruction.maneuverKey==='string'?instruction.maneuverKey:null;
  if(direction!==dir||maneuver!==key||d>140){direction=dir;maneuver=key;stage=0;}
  const next=d<=20?2:d<=80?1:0;
  if(next<=stage||now-last<8000)return null;
  last=now;stage=next;return dir;
 }
 return {update,reset};
}
export const gpsTonePatterns5330=Object.freeze({
 left:Object.freeze([600,440]),right:Object.freeze([440,600]),
 reverse:Object.freeze([440,660,440]),'road-end':Object.freeze([520,520]),
 arrival:Object.freeze([440,550,660])
});
