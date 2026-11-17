// Milovice RP 5.108: prefer measured/map-tagged OSM roadway width only
// where the area is being rebuilt. Unmapped widths remain model estimates.
// This is NOT a survey of kerbs or a reason to invent parallel sidewalks.
const ROADS=new Set(['primary','secondary','tertiary','residential',
 'unclassified','living_street','service','track']);
const TARGET=new Set(['mlada','vrutice','westlink']);
const MIN_WIDTH={
 primary:5,secondary:4.5,tertiary:3.5,residential:3,
 unclassified:3,living_street:2.5,service:2.2,track:1.8
};
const MAX_WIDTH={
 primary:20,secondary:17,tertiary:16,residential:13,
 unclassified:13,living_street:11,service:10,track:8
};
export function planMappedRoadWidth(tags={},defaultWidth,regionId='old'){
 const fallback=Number(defaultWidth);
 if(!Number.isFinite(fallback)||fallback<=0||fallback>25)
  return {width:null,applied:false,reason:'invalid-fallback',
   source:'model-default',originalWidth:defaultWidth};
 const kind=String(tags?.highway||'');
 const raw=tags?.width;
 const base={width:fallback,applied:false,reason:'',
  source:'model-default',originalWidth:fallback};
 if(!TARGET.has(regionId))
  return {...base,reason:'protected-region'};
 if(!ROADS.has(kind))
  return {...base,reason:'not-carriageway'};
 if(raw===undefined||raw===null||String(raw).trim()==='')
  return {...base,reason:'no-mapped-width'};
 const str=String(raw).trim();
 // OSM width is documented in metres by default. Refuse lists,
 // ranges, complex units and decimal commas rather than guessing.
 if(!/^(?:[1-9]\d?)(?:\.\d{1,2})?$/.test(str))
  return {...base,reason:'unsupported-width-format',rawWidth:str};
 const metres=Number(str);
 if(metres<MIN_WIDTH[kind]||metres>MAX_WIDTH[kind])
  return {...base,reason:'outside-validated-road-range',rawWidth:str};
 return {width:metres,applied:true,reason:'explicit-osm-width-metres',
  source:'OSM width=*',rawWidth:str,originalWidth:fallback};
}
