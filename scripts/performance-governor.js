// Milovice RP 5.17: crisp pixels are a player-quality constraint.
// Adaptive mode may cull distant decoration, NEVER lower canvas resolution.
export const GRAPHICS_TIER=[
 {view:440,detail:165},
 {view:415,detail:150},
 {view:390,detail:135},
 {view:365,detail:120}
];
export function createPerformanceGovernor({mobile=false,baselineDpr=1.6}={}){
 let tier=0,low=0,high=0,mode='balanced',samples=0;
 const crispDpr=Math.max(1,Number.isFinite(baselineDpr)?baselineDpr:1.6);
 const profile=()=>({
  tier,mobile,mode,
  dpr:mode==='realistic'?Math.min(2,crispDpr*1.25):crispDpr,
  view:mobile?GRAPHICS_TIER[tier].view:Infinity,
  detail:mobile?GRAPHICS_TIER[tier].detail:335
 });
 function observe(fps){
  if(!mobile||mode==='realistic'||!Number.isFinite(fps)||fps<2)return {changed:false,...profile()};
  samples++;
  // Lower only distant decorative LOD; keep player-visible pixels crisp.
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
  low=high=0;
  return {changed:true,...profile()};
 }
 return {observe,setMode,profile,get samples(){return samples}};
}
