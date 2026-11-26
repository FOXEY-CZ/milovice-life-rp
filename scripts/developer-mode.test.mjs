import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const match=html.match(/<script>\s*\(function\(\)\{\s*const q=new URLSearchParams\(location.search\);[\s\S]*?<\/script>/);
assert(match);
for(const [search,expected] of [['',false],['?v=534300',false],['?dev=0',false],['?dev=1',true],['?inspect=1',true],['?inspect=0',false],...['roofAudit','ticketPhotoAudit','forecourtAudit','streetAudit','npcAudit'].map(k=>['?'+k+'=test',true])]){
 let enabled;
 vm.runInNewContext(match[0].replace(/^<script>|<\/script>$/g,''),{URLSearchParams,location:{search},document:{documentElement:{classList:{toggle:(name,value)=>{assert.equal(name,'rp-developer-mode');enabled=value;}}}}});
 assert.equal(enabled,expected,search);
}
for(const id of ['rp-camera-gps-toggle','rp-camera-gps-panel','osm-inspect-toggle','osm-inspect-result','mapfollow-camera','terrain-status'])assert(html.includes('html:not(.rp-developer-mode) #'+id));
assert(html.includes('if(rpDeveloperMode){\n  if(!leafletCameraMarker)'));
assert(html.includes('if(!rpDeveloperMode)return;fullMapFollowCamera=true'));
console.log('PASS player-default UI and opt-in development modes');

// Source assertions for the ordinary startup and recovery text. Developer audits retain source names.
for(const text of ["Připravuji Ironfield…","Načítám Ironfield…","Vítej v Ironfieldu.","Ironfield 3D':'🔄 Načíst Ironfield","Mapa Ironfieldu je právě aktivní.","Prozkoumávej Ironfield.","Zkusit načíst Ironfield","Mapu Ironfieldu se nepodařilo načíst.","Mapa se nenačetla.","Načítám herní mapu…"])assert(html.includes(text),text);
for(const text of ["Připravuji skutečné Milovice…","Načítám Milovice…","Jsi v Milovicích.","Milovice 3D':'🔄 Načíst Milovice","Právě je aktivní skutečná mapa Milovic.","Prozkoumávej skutečné Milovice.","Zkusit načíst Milovice","Skutečnou mapu Milovic se nepodařilo načíst.","Skutečná mapa se nenačetla.","Načítám místní soubor mapy ze stejného GitHub Pages webu…"])assert(!html.includes(text),text);
console.log('PASS fictional startup and recovery copy');

// Raw errors may contain source URLs or names; expose them only in developer mode.
for(const expression of ["osmMessage('🏙️ Načítám '+regionDisplayName(area.id)+'…');","osmMessage('Oblast '+regionDisplayName(area.id)+': '+(rpDeveloperMode?e.message:'Načtení se nezdařilo.'));","osmNotice.textContent='3D mapa se nenačetla.'+(rpDeveloperMode?' '+e.message:'')+' Zkus znovu načíst mapu.';"])assert(html.includes(expression),expression);
for(const expression of ["osmMessage('🏙️ Načítám '+regionDisplayName(area.id)+' ze skutečné mapy…');","osmMessage('Oblast '+regionDisplayName(area.id)+': '+e.message);","osmNotice.textContent='3D mapa se nenačetla: '+e.message+'. Zkus znovu načíst mapu.';"])assert(!html.includes(expression),expression);

assert(html.includes("mapEl.textContent='Mapu se nepodařilo načíst. Zkontroluj internetové připojení.'+(rpDeveloperMode?' '+e.message:'')"));
assert(!html.includes("mapEl.textContent='Mapu se nepodařilo načíst. Zkontroluj internetové připojení. '+e.message"));
