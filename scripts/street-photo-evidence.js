// Milovice RP · Stage 1 reality-source catalog.
// Source metadata comes from attributed, dated public Wikimedia Commons
// descriptions, NOT from guessed image content. The geometry pipeline must
// never treat proximity as proof that a particular facade is photographed.
export const STREET_PHOTO_EVIDENCE=Object.freeze([
 {id:'skolska-1-2024',title:'Školská 220/1 · dokumentovaný dům',
  url:'https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg',
  author:'ŠJů',license:'CC BY 4.0',taken:'2024-05-30',
  buildingIds:['118487980'],camera:[50.2290672,14.8822619],
  street:'Školská',scope:'building'},
 {id:'mirova-36-2024',title:'Mírová 243/36 · dokumentovaný dům',
  url:'https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_36.jpg',
  author:'ŠJů',license:'CC BY 4.0',taken:'2024-05-30',
  buildingIds:['202367254'],camera:[50.2280572,14.8840981],
  street:'Mírová',scope:'building'},
 {id:'modra-hvezda-2024',title:'Mírová 134/11 · Modrá hvězda',
  url:'https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_11,_hotel_Modr%C3%A1_hv%C4%9Bzda.jpg',
  author:'ŠJů',license:'CC BY 4.0',taken:'2024-05-30',
  buildingIds:['202367194'],camera:null,
  street:'Mírová',scope:'building'},
 {id:'nadrazi-bus-2024',title:'Nádraží · autobusová zastávka a cyklověž',
  url:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_autobusov%C3%A1_zast%C3%A1vka_a_cyklov%C4%9B%C5%BE.jpg',
  author:'ŠJů',license:'CC BY 4.0',taken:'2024-05-30',
  buildingIds:[],camera:[50.2289419,14.8823244],heading:335,
  street:'Nádražní',scope:'streetscape'},
 {id:'mir-street-2024',title:'Mírová · záběr ulice',
  url:'https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_(01).jpg',
  author:'ŠJů',license:'CC BY 4.0',taken:'2024-05-30',
  buildingIds:[],camera:[50.2286667,14.8847222],heading:30,
  street:'Mírová',scope:'streetscape'},
 {id:'5kv-2014',title:'5. května · historický uliční pohled',
  url:'https://commons.wikimedia.org/wiki/File:Milovice_-_5._kv%C4%9Btna.jpg',
  author:'Tiia Monto',license:'CC BY-SA 4.0',taken:'2014-07-26',
  buildingIds:[],camera:[50.227797,14.884813],
  street:'5. května',scope:'historical-streetscape'},
 {id:'church-2024',title:'Kostel sv. Kateřiny · okolí 5. května',
  url:'https://commons.wikimedia.org/wiki/File:Milovice,_kostel_sv._Kate%C5%99iny_(05).jpg',
  author:'ŠJů',license:'CC BY 4.0',taken:'2024-05-30',
  buildingIds:[],camera:[50.2278239,14.8837536],heading:320,
  street:'5. května',scope:'landmark-context'},
 {id:'school-2024',title:'Školská 112/15 · ZŠ T. G. Masaryka',
  url:'https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg',
  author:'ŠJů',license:'CC BY 4.0',taken:'2024-05-30',
  buildingIds:[],camera:[50.228698,14.885952],heading:85,
  street:'Školská',scope:'landmark-context'}
]);
const R=Math.PI/180;
export function distanceBetweenPhotosAndBuilding(a,b){
 if(!Array.isArray(a)||!Array.isArray(b)||a.length!==2||b.length!==2||
  ![...a,...b].every(Number.isFinite))return Infinity;
 const latitude=(a[0]+b[0])*.5*R;
 return Math.hypot((a[0]-b[0])*111320,
  (a[1]-b[1])*111320*Math.cos(latitude));
}
// A close camera may face away, be occluded, or depict a DIFFERENT house.
// The displayed relationship is solely 'photo in nearby streetscape'.
export function streetEvidenceForBuilding(building,{
 radiusM=135,max=9,photos=STREET_PHOTO_EVIDENCE
}={}){
 if(!building||!Number.isFinite(radiusM)||radiusM<10||radiusM>500||
  !Number.isInteger(max)||max<1||max>30)return [];
 const buildingId=String(building.id??building.osmId??'');
 const center=building.center??(Number.isFinite(building.lat)&&Number.isFinite(building.lon)?
  [building.lat,building.lon]:null);
 const matches=[];
 for(const source of photos){
  const direct=(source.buildingIds||[]).includes(buildingId)&&buildingId!=='';
  const distance=source.camera&&center?
   distanceBetweenPhotosAndBuilding(center,source.camera):Infinity;
  if(!direct&&distance>radiusM)continue;
  // Same building takes priority; proximity never becomes proof.
  matches.push({...source,directEvidence:direct,
   nearbyOnly:!direct,distanceM:Number.isFinite(distance)?
    Math.round(distance):null});
 }
 matches.sort((a,b)=>Number(b.directEvidence)-Number(a.directEvidence)||
  (a.distanceM??Infinity)-(b.distanceM??Infinity)||
  b.taken.localeCompare(a.taken)||a.id.localeCompare(b.id));
 return matches.slice(0,max);
}
export function streetPhotoCoverage(buildings,{
 radiusM=135,photos=STREET_PHOTO_EVIDENCE
}={}){
 const rows=(Array.isArray(buildings)?buildings:[]).map(b=>{
  const candidates=streetEvidenceForBuilding(b,{radiusM,photos,max:30});
  return {id:String(b.id??b.osmId),candidateCount:candidates.length,
   directlyIdentified:candidates.some(p=>p.directEvidence)};
 });
 return {buildings:rows.length,withNearbyPhotos:rows.filter(x=>x.candidateCount>0).length,
  withIdentifiedBuildingPhotos:rows.filter(x=>x.directlyIdentified).length,
  evidenceRecords:photos.length,
  allFacadesVerified:false,rows};
}

// Wikimedia's public low-resolution redirect is a preview only.
// Never bundle, persist, annotate or reuse the bitmap without confirming
// its per-file license; the clickable canonical File page remains primary.
export function previewForCommonsPhoto(source){
 try{
  const url=new URL(source?.url||'');
  if(url.hostname!=='commons.wikimedia.org'||
   !url.pathname.startsWith('/wiki/File:'))return null;
  const pathname=url.pathname.replace('/wiki/File:','/wiki/Special:FilePath/');
  return url.origin+pathname+'?width=320';
 }catch{return null}
}
