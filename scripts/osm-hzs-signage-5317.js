// HZS 5.317: original tiny bitmap lettering, not copied photograph pixels.
// DotaceEU exterior and HZS opening gallery show the station name and rotated 112.
// Font, color and stroke width are approximations; no surveyed placement.
const glyphs={
 ' ':['00000','00000','00000','00000','00000','00000','00000'],
 'S':['01111','10000','10000','01110','00001','00001','11110'],
 'T':['11111','00100','00100','00100','00100','00100','00100'],
 'A':['01110','10001','10001','11111','10001','10001','10001'],
 'N':['10001','11001','10101','10011','10001','10001','10001'],
 'I':['11111','00100','00100','00100','00100','00100','11111'],
 'C':['01111','10000','10000','10000','10000','10000','01111'],
 'E':['11111','10000','10000','11110','10000','10000','11111'],
 'H':['10001','10001','10001','11111','10001','10001','10001'],
 'Z':['11111','00001','00010','00100','01000','10000','11111'],
 'M':['10001','11011','10101','10101','10001','10001','10001'],
 'L':['10000','10000','10000','10000','10000','10000','11111'],
 'O':['01110','10001','10001','10001','10001','10001','01110'],
 'V':['10001','10001','10001','10001','10001','01010','00100'],
 '1':['00100','01100','00100','00100','00100','00100','01110'],
 '2':['01110','10001','00001','00010','00100','01000','11111']
};
export const HZS_SIGNAGE_5317=Object.freeze({
 facadeText:'STANICE HZS MILOVICE',towerText:'112',
 towerRotationDegrees:90,towerPurpose:'hose-drying',
 sourceUrls:Object.freeze([
 'https://hzscr.gov.cz/hasicien/docDetail.aspx?docType=ART&docid=22205732',
 'https://www.dotaceeu.cz/cs/evropske-fondy-v-cr/novinky/pro-hasice-a-ostatni-slozky-izs-jsme-pripravili-vi',
 'https://www.hasici.cz/zhave-aktuality/Dulezite-informace/Slavnostni-otevreni-nove-stanice-Milovice'
 ]),
 exactFontVerified:false,placementVerified:false,towerDimensionsVerified:false,
 photoPixels:0,newGeometry:0,newColliders:0
});
export function makeHZSSign5317(kind,scale=2){
 if(!['facade','tower'].includes(kind)||!Number.isInteger(scale)||scale<1||scale>4)return null;
 const text=kind==='facade'?HZS_SIGNAGE_5317.facadeText:HZS_SIGNAGE_5317.towerText;
 const w=(text.length*6+1)*scale,h=9*scale;
 const rotated=kind==='tower',width=rotated?h:w,height=rotated?w:h;
 const data=new Uint8Array(width*height*4);
 for(let i=0;i<text.length;i++)for(let y=0;y<7;y++)for(let x=0;x<5;x++){
  if(glyphs[text[i]][y][x]!=='1')continue;
  for(let sy=0;sy<scale;sy++)for(let sx=0;sx<scale;sx++){
   const px=(1+i*6+x)*scale+sx,py=(1+y)*scale+sy;
   // Counterclockwise in image coordinates: horizontal label reads upward.
   const u=rotated?py:px,v=rotated?w-1-px:py;
   // Three.js DataTexture rows start at the bottom; store accordingly.
   data.set([181,43,45,255],((height-1-v)*width+u)*4);
  }
 }
 return {width,height,data,text,rotationDegrees:rotated?90:0,photoPixels:0,
  estimatedFont:true,placementVerified:false,newColliders:0};
}
