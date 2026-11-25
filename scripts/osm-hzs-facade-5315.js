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
