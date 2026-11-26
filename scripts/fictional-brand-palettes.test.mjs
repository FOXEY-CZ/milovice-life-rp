import assert from 'node:assert/strict';
import {BRAND_PALETTES,brandPalette} from './fictional-brand-palettes.js';
const luminance=hex=>{
 const c=hex.slice(1).match(/../g).map(s=>parseInt(s,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);
 return .2126*c[0]+.7152*c[1]+.0722*c[2];
};
for(const [source,p] of Object.entries(BRAND_PALETTES)){
 assert.equal(brandPalette(source.toUpperCase()),p);
 assert(Object.isFrozen(p));
 for(const key of ['background','foreground','accent','facadeTrim'])assert(/^#[0-9a-f]{6}$/.test(p[key]));
 const [lo,hi]=[luminance(p.background),luminance(p.foreground)].sort((a,b)=>a-b);
 assert((hi+.05)/(lo+.05)>=4.5,p.name+' sign contrast');
 assert.notEqual(p.name.toLowerCase(),source);
}
assert.equal(new Set(Object.values(BRAND_PALETTES).map(p=>p.background)).size,3);
for(const value of [null,undefined,'unknown','constructor','__proto__'])assert.equal(brandPalette(value),null);
console.log('PASS fictional retail palettes and text contrast');

import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of ['brandPalette(normalized)','pennyRed:BRAND_PALETTES.penny.facadeTrim','tescoWhite:BRAND_PALETTES.tesco.facadeTrim','billaBlack:BRAND_PALETTES.billa.background','g.fillStyle=BRAND_PALETTES.billa.foreground','billaCartHandle:BRAND_PALETTES.billa.facadeTrim'])assert(html.includes(token),token);
