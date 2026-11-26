// Only for freshly constructed procedural cars with exclusively owned geometries.
// Materials and textures are shared by world-models and must never be disposed here.
export function createProceduralCarOwnership(){
 const owners=new WeakMap(),registered=new WeakSet();
 function register(original,selected=original){
  const root=selected?.group,source=original?.group;
  if(!root?.isGroup||!source?.isGroup||root.parent||source.parent||registered.has(root)||registered.has(source))
   throw Error('Register a fresh detached procedural car once');
  const owned=new Set(),instances=new Set();
  for(const g of new Set([source,root]))g.traverse(n=>{
   if(!n.isMesh)return;
   if(!n.geometry||typeof n.geometry.dispose!=='function')throw Error('Missing owned geometry');
   owned.add(n.geometry);
   if(n.isInstancedMesh){if(typeof n.dispose!=='function')throw Error('Missing instance disposal');instances.add(n);}
  });
  const resources=[...owned,...instances];
  if(resources.some(r=>owners.has(r)))throw Error('Geometry or instance already owned by another car');
  for(const r of resources)owners.set(r,root);
  let released=false;
  const lease={
   release(){
    if(released)return false;
    if(root.parent||source.parent)throw Error('Detach procedural car before disposal');
    // These are the objects registered at construction, never the GLB meshes attached later.
    for(const n of instances)n.dispose();
    for(const g of owned)g.dispose();
    for(const r of resources)owners.delete(r);
    released=true;return true;
   },
   get released(){return released;},
   geometryCount:owned.size,instanceCount:instances.size
  };
  registered.add(root);registered.add(source);return lease;
 }
 return {register};
}
