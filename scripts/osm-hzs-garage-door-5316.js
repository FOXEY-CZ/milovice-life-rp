// 5.316 independent preparation: original opaque visual garage door swatch.
// Reference: official HZS opening gallery photo 037 (11 February 2020),
// https://hzscr.gov.cz/hasicien/SCRIPT/ViewImage.aspx?docname=037.jpg&physid=1090352
// and public DotaceEU exterior photo. Red framing and glazed rows visible.
// 2 x 4 model panes, colors, dimensions and placement are estimates.
// No actual photo pixels, transparency, garage access or physics implied.
export function makeHZSGarageDoor5316(width=32,height=64){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<16||width>128||height<32||height>256)return null;
 const data=new Uint8Array(width*height*4);
 const colors={red:0xb52b2d,edge:0x8b2426,glass:0x43565d,reflection:0x62767c};
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const u=(x+.5)/width,v=(y+.5)/height;
  const frame=u<.075||u>.925||v<.20||v>.96||Math.abs(u-.5)<.028;
  const horizontal=[.39,.58,.77].some(t=>Math.abs(v-t)<.018);
  const color=frame||horizontal?(u<.035||u>.965?colors.edge:colors.red):u<.16?colors.reflection:colors.glass;
  data.set([(color>>16)&255,(color>>8)&255,color&255,255],(y*width+x)*4);
 }
 return {width,height,data,modelGlassRows:4,modelGlassColumns:2,photoPixels:0,exactPanelCountVerified:false,placementVerified:false,newColliders:0};
}
