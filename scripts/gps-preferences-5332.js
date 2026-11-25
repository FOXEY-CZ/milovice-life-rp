// 5.332: local, versioned GPS preferences; never unlock audio automatically.
export const GPS_PREF_KEY5332='milovice.gps.preferences.v1';
export function normalizeGpsPreferences5332(value){
 const v=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 return {sound:v.sound===true,voice:v.voice===true,
  volume:typeof v.volume==='number'&&Number.isFinite(v.volume)?Math.max(0,Math.min(100,Math.round(v.volume))):100};
}
export function createGpsPreferences5332(getStorage=()=>globalThis.localStorage){
 let current=normalizeGpsPreferences5332(null),persisted=false;
 try{
  const raw=getStorage()?.getItem(GPS_PREF_KEY5332);
  if(raw!=null){
   const parsed=JSON.parse(raw);
   if(parsed?.version===1){current=normalizeGpsPreferences5332(parsed);persisted=true;}
  }
 }catch{}
 function read(){return {...current};}
 function update(patch){
  const p=patch&&typeof patch==='object'&&!Array.isArray(patch)?patch:{};
  current=normalizeGpsPreferences5332({...current,...p});
  persisted=false;
  try{
   const storage=getStorage();
   if(storage){storage.setItem(GPS_PREF_KEY5332,JSON.stringify({version:1,...current}));persisted=true;}
  }catch{}
  return read();
 }
 return {read,update,stats:()=>({persisted,version:1})};
}
export function gpsOutputLevels5332(volume){
 const fraction=normalizeGpsPreferences5332({volume}).volume/100;
 return {tonePeak:.045*fraction,voiceVolume:.65*fraction};
}
