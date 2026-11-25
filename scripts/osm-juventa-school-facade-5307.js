// 5.307 — provisional school shell palette from municipal A/C photos.
// The whole perimeter and 0.95m band are model estimates, NOT a surveyed facade.
export const JUVENTA_FACADE_5307=Object.freeze({
 plaster:0xe4d9be,plinth:0x544c47,plinthModelHeight:0.95,
 source:'https://zakazky.mesto-milovice.cz/document_1250/65ebd096e4d0b8ab546f76ddfc2ea91a-priloha-c-7-pd_zs-juventa-oprava-sok-pdf',
 sourcePages:[14,15,17,19],exactWallColorsSurveyed:false,wholePerimeterEstimated:true
});
export function makeJuventaFacade5307(height){
 if(!Number.isFinite(height)||height<=JUVENTA_FACADE_5307.plinthModelHeight)return null;
 const rows=128,data=new Uint8Array(rows*4);
 const bandRows=Math.max(1,Math.round(rows*JUVENTA_FACADE_5307.plinthModelHeight/height));
 for(let y=0;y<rows;y++){
  const color=y<bandRows?JUVENTA_FACADE_5307.plinth:JUVENTA_FACADE_5307.plaster;
  data.set([(color>>16)&255,(color>>8)&255,color&255,255],y*4);
 }
 return {width:1,height:rows,data,bandRows,bytes:data.byteLength};
}
// ExtrudeGeometry uses a non-indexed side group. Normalize only its V
// from actual local Y, before world translation; leave cap UVs untouched.
export function mapJuventaWallUV5307(geometry,height){
 const p=geometry?.attributes?.position,uv=geometry?.attributes?.uv;
 const sides=geometry?.groups?.filter(g=>g.materialIndex===1);
 if(!Number.isFinite(height)||height<=0||geometry?.index||!p||!uv||p.count!==uv.count||!sides?.length||
  sides.some(g=>g.start<0||g.count<1||g.start+g.count>p.count))return false;
 for(const g of sides)for(let i=g.start;i<g.start+g.count;i++){
  const y=p.getY(i);
  if(!Number.isFinite(y)||y<-.001||y>height+.001)return false;
 }
 for(const g of sides)for(let i=g.start;i<g.start+g.count;i++)
  uv.setXY(i,.5,Math.max(0,Math.min(1,p.getY(i)/height)));
 uv.needsUpdate=true;return true;
}
