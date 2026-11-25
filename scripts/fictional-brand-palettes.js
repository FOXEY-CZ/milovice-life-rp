// Fictional retail brand palettes. Source names are internal lookup keys only.
// Independent of mesh placement, collision, LOD and source building geometry.
export const BRAND_PALETTES=Object.freeze({
 tesco:Object.freeze({name:'BrayMart',background:'#173d42',foreground:'#ffffff',accent:'#54c6b5',facadeTrim:'#287b78'}),
 penny:Object.freeze({name:'ValueNest',background:'#553477',foreground:'#ffffff',accent:'#d0b9ef',facadeTrim:'#72529a'}),
 billa:Object.freeze({name:'Vendoa',background:'#263d2c',foreground:'#e4c797',accent:'#92b58a',facadeTrim:'#426b4c'})
});
export function brandPalette(sourceName){
 const key=typeof sourceName==='string'?sourceName.trim().toLowerCase():'';
 return Object.hasOwn(BRAND_PALETTES,key)?BRAND_PALETTES[key]:null;
}
