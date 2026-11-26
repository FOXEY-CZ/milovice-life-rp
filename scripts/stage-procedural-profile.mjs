// Staging-only alternative; never rewrite the source checkout or claim release approval.
const cars=`export function makeVehicleAssetManager(THREE,{status=()=>{}}={}){
 const publish=()=>{if(typeof window!=='undefined')window.__miloviceGLBDebug={state:'disabled',mode:'off',ready:false,active:false,activeCount:0,maxActive:0,loaded:[],models:{},rejected:{},assignments:[],orientation:{}};};
 const configure=()=>{publish();status('🚘 Vlastní procedurální vozidla');};
 const noop=()=>{};
 configure();
 return {configure,update:publish,load:async()=>null,getState:()=>({mode:'off',enabled:false,states:{},activeCount:0}),spin:noop,reset:publish,retire:noop};
}
`;
const humans=`export function makeMiloviceHumanAssets(){
 const state=()=>{const s={mode:'off',loaded:[],status:{casualMan:'disabled'},playerReady:false,activeNpc:0,clips:[],bones:[],fallback:true};if(typeof window!=='undefined')window.__miloviceHumans=s;return s;};
 state();return {load:async()=>null,configure:state,update:state,state,resetPeople:state,playerFacingXZ:()=>null};
}
`;
function once(source,from,to){if(source.split(from).length!==2)throw Error('Procedural profile source marker changed: '+from.slice(0,100));return source.replace(from,to);}
function selectOnly(source,id,label){
 const re=new RegExp('<select id="'+id+'">[^]*?<\\/select>','g');
 const matches=[...source.matchAll(re)];if(matches.length!==1)throw Error('Missing unique select '+id);
 return source.replace(re,'<select id="'+id+'" disabled><option value="off" selected>'+label+'</option></select>');
}
export function proceduralProfile(path,source){
 if(path==='scripts/vehicle-assets.js')return cars;
 if(path==='scripts/human-assets.js')return humans;
 if(path==='index.html'){
  source=selectOnly(source,'rp-model-select','Vlastní procedurální vozidla');
  source=selectOnly(source,'rp-human-select','Vlastní procedurální postavy');
  source=once(source,"try{const saved=localStorage.getItem('milovice_glb_quality');if(['auto','on','coupe','off'].includes(saved))modelSelect.value=saved}catch(e){}","modelSelect.value='off';");
  source=once(source,"try{const pref=localStorage.getItem('milovice_glb_humans');if(['auto','on','off'].includes(pref))humanSelect.value=pref}catch(_){}","humanSelect.value='off';");
  source=once(source,"const msg=s.playerReady?'✅ GLB postava načtená; animace '+s.clips.length:s.status.casualMan==='fallback'?'⚠️ GLB se nenačetlo, záložní model funguje':'⏳ Stahuji skutečné 3D postavy…';","const msg='👤 Vlastní procedurální postavy';");
  source=once(source,"const proceduralBatch5350=new URLSearchParams(location.search).get('proceduralBatch')==='1';","const proceduralBatch5350=true;");
  source=once(source,'<title>CROSSVEX – 5.350</title>','<title>CROSSVEX – 5.350 (Procedural Preview)</title><meta name="crossvex-profile" content="procedural-preview">');
  return source;
 }
 if(path==='credits.html')return once(source,'Podle aktuální evidence zdrojového kódu jsou tyto externí modely používány pod','Tato procedurální preview varianta nepoužívá externí GLB vozidla ani postavy. Následující historická evidence vývojové varianty uvádí modely pod');
 return source;
}
