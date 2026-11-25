// 5.315 preparation: original procedural facade material swatches.
// Visual references: HZS opening gallery (2020-02-11), DotaceEU (2023-05-04).
// Color, texture period and shading are model estimates; no copied photo pixels.
// These swatches are not placed on the real footprint until facade registration.
export const HZS_FACADE_5315=Object.freeze({
 sourceBuildingId:'985224523',sourceLevelCount:2,
 sources:Object.freeze([
 'https://hzscr.gov.cz/hasicien/docDetail.aspx?docType=ART&docid=22205732',
 'https://www.dotaceeu.cz/cs/evropske-fondy-v-cr/novinky/pro-hasice-a-ostatni-slozky-izs-jsme-pripravili-vi'
 ]),
 colors:Object.freeze({metal:0x84969d,metalShadow:0x63737a,metalHighlight:0xa9b7bc,
 plaster:0xe4e2dd,red:0xb52b2d,glass:0x43565d}),
 visibleFeatures:Object.freeze(['horizontal-metal-cladding','light-ground-floor','red-glazed-garage-doors','hose-drying-tower','red-112-sign']),
 facadeOrientationVerified:false,doorCountVerified:false,towerDimensionsVerified:false,
 colorsSurveyed:false,readyForGeometry:false
});
export function makeHZSCladding5315(height=64){
 if(!Number.isInteger(height)||height<16||height>256||height%8!==0)return null;
 const c=HZS_FACADE_5315.colors, data=new Uint8Array(height*4);
 for(let y=0;y<height;y++){
  const p=y%8, color=p===0?c.metalShadow:p===1?c.metalHighlight:c.metal;
  data.set([(color>>16)&255,(color>>8)&255,color&255,255],y*4);
 }
 return {width:1,height,data,repeatPeriodRows:8,estimated:true,photoPixels:0,newMeshes:0};
}

// Apply to the exact original RUIAN polygon only; defer to any approved card.
// The lower/upper material split is a model estimate, not a facade survey.
export function planHZSShell5315({id,regionId,tags,geometry,approvedArchitecture=false,photoReviewed=false}={}){
 if(String(id)!=='985224523'||!['mlada','westlink'].includes(regionId)||approvedArchitecture||photoReviewed||
 tags?.['ref:ruian:building']!=='103284605'||tags?.['building:levels']!=='2'||tags?.building!=='yes'||
 !Array.isArray(geometry)||geometry.length!==9||geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon)))return null;
 let h=2166136261;
 for(const ch of geometry.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}
 if((h>>>0).toString(16).padStart(8,'0')!=='10a34d4b')return null;
 return {sourceOSMId:'985224523',sourceHash:'10a34d4b',sourceOutlineVertices:8,sourceLevels:2,
  wholePerimeterEstimated:true,splitEstimated:true,doorCountVerified:false,towerDimensionsVerified:false,
  newColliders:0,newFootprints:0};
}
export function makeHZSShellPalette5315(){
 const upper=makeHZSCladding5315(64),data=new Uint8Array(128*4),c=HZS_FACADE_5315.colors.plaster;
 for(let y=0;y<64;y++)data.set([(c>>16)&255,(c>>8)&255,c&255,255],y*4);
 data.set(upper.data,256);
 return {width:1,height:128,data,plasterRows:64,estimated:true,photoPixels:0};
}
