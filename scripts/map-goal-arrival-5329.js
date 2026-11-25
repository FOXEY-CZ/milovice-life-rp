// 5.329: proximity completion of a game waypoint, not arrival at a verified entrance.
export function createGoalArrival5329(){
 let state=null;
 const clear=()=>{state=null;};
 function update({goal,now,distance,walking,speed,mapOpen}={}){
  if(!goal||!Number.isFinite(now)||!Number.isFinite(distance)||distance<0||
     typeof walking!=='boolean'||mapOpen!==false||
     distance>(walking?12:10)||(!walking&&(!Number.isFinite(speed)||Math.abs(speed)>.45))){
   clear();return false;
  }
  if(!state||state.goal!==goal||state.walking!==walking||now<state.last||now-state.last>1800){
   state={goal,walking,start:now,last:now,samples:1};return false;
  }
  if(now>state.last){state.samples++;state.last=now;}
  if(state.samples>=3&&now-state.start>=1400){clear();return true;}
  return false;
 }
 return {update,clear};
}
