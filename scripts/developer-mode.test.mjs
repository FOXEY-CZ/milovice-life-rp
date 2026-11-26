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
