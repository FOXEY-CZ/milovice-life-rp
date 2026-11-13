// Every actual non-degenerate OSM polygon edge has a physical wall.
// Short returns/chamfers must be SEALED, but get no invented windows,
// door slots or decorative facade rows.
export function classifyFacadeEdgeLength(length,{
 minValid=.08,detailThreshold=3,maxLength=70
}={}){
 if(!Number.isFinite(length)||length<minValid||length>maxLength)return 'degenerate';
 return length<detailThreshold?'solid-return':'detailed';
}
