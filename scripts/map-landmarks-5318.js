// 5.318: extra in-game map landmarks from the checked-in Mlada OSM snapshot.
// Coordinates lie inside original footprints, not surveyed entrances.
// These are map markers only, not live business data or routing waypoints.
const records=[
 {
  "sourceOSMId": "985224523",
  "name": "🚒 Hasičská stanice Milovice",
  "category": "public-service",
  "gps": [
   50.2301763,
   14.8547473
  ],
  "method": "polygon-centroid",
  "hash": "10a34d4b"
 },
 {
  "sourceOSMId": "53865836",
  "name": "🏫 ZŠ Juventa",
  "category": "education",
  "gps": [
   50.2267444,
   14.8667914
  ],
  "method": "polygon-centroid",
  "hash": "be655146"
 },
 {
  "sourceOSMId": "1057548624",
  "name": "🏥 Poliklinika Milovice",
  "category": "public-service",
  "gps": [
   50.2287279,
   14.8639743
  ],
  "method": "polygon-centroid",
  "hash": "d339e53e"
 },
 {
  "sourceOSMId": "53865699",
  "name": "🏫 MŠ Sluníčko",
  "category": "education",
  "gps": [
   50.2296523,
   14.8667266
  ],
  "method": "polygon-centroid",
  "hash": "912f8e04"
 },
 {
  "sourceOSMId": "38742870",
  "name": "🛒 Tesco",
  "category": "shop",
  "gps": [
   50.2271913,
   14.8794758
  ],
  "method": "polygon-centroid",
  "hash": "c2d37567"
 },
 {
  "sourceOSMId": "38742873",
  "name": "🛒 Penny",
  "category": "shop",
  "gps": [
   50.2281482,
   14.8795241
  ],
  "method": "polygon-centroid",
  "hash": "35b31e74"
 },
 {
  "sourceOSMId": "53865798",
  "name": "🛒 Billa",
  "category": "shop",
  "gps": [
   50.2290858,
   14.8620817
  ],
  "method": "polygon-centroid",
  "hash": "40a89543"
 }
];
export const EXTRA_MAP_LANDMARKS_5318=Object.freeze(records.map(p=>Object.freeze({...p,gps:Object.freeze(p.gps)})));
export function extraMapLandmarks5318(existing=[]){
 const names=new Set(existing.map(p=>p.name));
 const ids=new Set(existing.map(p=>String(p.sourceOSMId??'')));
 return EXTRA_MAP_LANDMARKS_5318.filter(p=>!names.has(p.name)&&!ids.has(p.sourceOSMId)).map(p=>({...p,gps:[...p.gps],entranceVerified:false}));
}
