// Milovice RP 5.94: visual-only use of existing OSM surface=* tags.
// Surface is evidence of a general material, NOT a documented colour,
// pavement size, age or survey of individual stones.
const WALK=new Set(['footway','path','pedestrian','cycleway','steps']);
const ROADS=new Set(['primary','secondary','tertiary','residential',
 'unclassified','living_street','service','trunk','trunk_link',
 'primary_link','secondary_link','road','track']);
const PAVING=new Set(['paving_stones','sett','cobblestone','concrete',
 'concrete:plates','concrete:lanes','bricks','paved_stones']);
const AGGREGATE=new Set(['gravel','fine_gravel','compacted','pebblestone',
 'crushed_stone','rock']);
const EARTH=new Set(['dirt','earth','ground','sand','mud','unpaved']);
const GREEN=new Set(['grass','grass_paver']);
const normalize=s=>typeof s==='string'?s.trim().toLowerCase():'';
export function classifyMappedRoadSurface(tags={}){
 const kind=normalize(tags.highway);
 if(!WALK.has(kind)&&!ROADS.has(kind))return null;
 const source=normalize(tags.surface);
 let material=null;
 if(source==='asphalt')material='asphalt';
 else if(PAVING.has(source))material='paving';
 else if(AGGREGATE.has(source))material='aggregate';
 else if(EARTH.has(source))material='earth';
 else if(GREEN.has(source))material='grass';
 // A mapped forestry/agricultural track is an ACTUAL OSM line, but its
 // untagged soil/stone composition is unknown: show an unobtrusive neutral
 // aggregate, never falsely call it surveyed gravel.
 else if(kind==='track'&&(!source||source==='unpaved'))material='aggregate';
 else material=WALK.has(kind)?'legacy-footway':'legacy-asphalt';
 return {
  kind,material,tagged:Boolean(source),surfaceTag:source||null,
  pathFromOSM:true,materialSource:source?'OSM surface tag':'game fallback',
  exactAppearanceVerified:false,roadGeometryChanged:false,
  widthChanged:false,heightChanged:false
 };
}
export function mappedRoadWidth(kind){
 return kind==='track'?3.2:null;
}
