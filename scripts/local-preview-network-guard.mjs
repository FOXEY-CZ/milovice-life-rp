// Shared browser guard for the local-library test mode only.
export async function blockRemotePreviewRequests(page,base){
 const attempts=[],origin=new URL(base).origin;
 await page.route('**/*',route=>{
  const u=new URL(route.request().url());
  if((u.protocol==='http:'||u.protocol==='https:')&&u.origin!==origin){attempts.push(u.href);return route.abort();}
  return route.continue();
 });
 return attempts;
}
