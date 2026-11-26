// Independent, staging-only fallback candidate for one unresolved Panorama card.
// No changes to the development demo or OSM source data.
const id='202385910';
function once(source,from,to){
 if(source.split(from).length!==2)throw Error('Panorama fallback marker changed: '+from);
 return source.replace(from,to);
}
export function panoramaHouseFallback(path,source){
 if(path==='index.html'){
  source=once(source,'const isPionyru2022PhotoGable=osmId===202385910; // front gable from user panorama','const isPionyru2022PhotoGable=false; // staged candidate: use ordinary OSM-based rendering');
  source=once(source,'const localArchitecture=loadLocalArchitectureCards();',"const localArchitecture=loadLocalArchitectureCards();\nlocalArchitecture.delete('202385910'); // do not restore excluded photo card from a previous browser preview");
  return source;
 }
 if(path==='data/architecture/verified-buildings.json'){
  const data=JSON.parse(source);
  const card=data.buildings?.[id];
  if(data.schema!=='milovice-rp-approved-buildings-v1'||!card||card.provenance?.panoramaId!=='81190391'||card.provenance?.photoSource!=='Mapy.com Panorama')throw Error('Unexpected Panorama card identity');
  delete data.buildings[id];
  data.description='Staged candidate: remaining published reviewed cards; one unresolved Panorama card omitted. All measurements remain approximate.';
  return JSON.stringify(data,null,2)+'\n';
 }
 return source;
}
