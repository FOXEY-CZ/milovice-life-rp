// Milovice RP 5.15: light, hysteresis-controlled GPU budget governor.
// It does NOT change gameplay speed, collision, camera control or assets.
export const GRAPHICS_TIER=[{dpr:1.25,view:440,detail:165},
 {dpr:1.0,view:385,detail:130},
 {dpr:.85,view:345,detail:110},
 {dpr:.72,view:300,detail:88}];
export function createPerformanceGovernor({mobile=false,baselineDpr=1.25}={}){
 let tier=0,low=0,high=0,mode='balanced',samples=0;
 const profile=()=>({
  tier,mobile,mode,
  dpr:mode==='realistic'?Math.min(1.65,baselineDpr*1.32):
   mobile?Math.min(baselineDpr,GRAPHICS_TIER[tier].dpr):baselineDpr,
  view:mobile?GRAPHICS_TIER[tier].view:Infinity,
  detail:mobile?GRAPHICS_TIER[tier].detail:335
 });
 function observe(fps){
  if(!mobile||mode==='realistic'||!Number.isFinite(fps)||fps<2)return {changed:false,...profile()};
  samples++;
  // ~1.2 seconds per sample. Respond after sustained low FPS, not a one-off
  // shader compilation or streaming stall.
  if(fps<36){
   low++;high=0;
   if(low>=2&&tier<GRAPHICS_TIER.length-1){tier++;low=0;return {changed:true,...profile()}}
  }else if(fps>=52){
   high++;low=0;
   if(high>=6&&tier>0){tier--;high=0;return {changed:true,...profile()}}
  }else{low=0;high=0}
  return {changed:false,...profile()};
 }
 function setMode(next){
  mode=next==='realistic'?'realistic':'balanced';
  // restore normal adaptive profile when returning from realistic settings
  low=high=0;
  return {changed:true,...profile()};
 }
 return {observe,setMode,profile,get samples(){return samples}};
}
