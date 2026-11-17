// Ignore obsolete release pins: a historic visual regression must verify
// the current build identity without pretending it is still a 5.91 release.
export function hasConsistentGameBuild(html){
 if(typeof html!=='string')return false;
 const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
 const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
 const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
 return Boolean(runtime&&runtime===meta&&meta===hud);
}
