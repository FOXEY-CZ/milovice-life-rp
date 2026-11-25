// 5.315 preparation: exact checked-in OSM source identities for HZS Milovice.
// Site polygon is amenity, not a building. Existing access filtering is reused.
// No survey of facade, garage gates, surface or actual on-site permissions.
import {classifyPublicNpcRoad5240} from './osm-traffic-access-5240.js';
const ids=Object.freeze([1468803952,985224523,1249890275,1249890276,517526939]);
const facts=Object.freeze({"517526939":{"nodes":14,"hash":"170aa991"},"985224523":{"nodes":9,"hash":"10a34d4b"},"1249890275":{"nodes":5,"hash":"7f97354d"},"1249890276":{"nodes":3,"hash":"3675bd29"},"1468803952":{"nodes":16,"hash":"1d727cf9"}});
function fingerprint(g){
 let h=2166136261;
 for(const ch of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}
 return(h>>>0).toString(16).padStart(8,'0');
}
export function auditHZS5315(elements){
 if(!Array.isArray(elements))return null;
 const ways=ids.map(id=>elements.filter(e=>e?.type==='way'&&String(e.id)===String(id)));
 if(ways.some(w=>w.length!==1))return null;
 const [site,building,...roads]=ways.map(w=>w[0]);
 for(const e of [site,building,...roads]){
  const g=e.geometry,f=facts[e.id];
  if(!Array.isArray(g)||g.length!==f.nodes||g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||fingerprint(g)!==f.hash)return null;
 }
 if(site.tags?.amenity!=='fire_station'||site.tags.building||building.tags?.['ref:ruian:building']!=='103284605'||building.tags?.['building:levels']!=='2'||building.tags.building!=='yes')return null;
 if(roads.slice(0,2).some(r=>r.tags?.highway!=='service'||r.tags.access!=='permit')||roads[2].tags?.name!=='Armádní'||roads[2].tags.highway!=='residential')return null;
 const access=roads.map(r=>({id:String(r.id),...classifyPublicNpcRoad5240(r)}));
 if(access[0].allowed||access[1].allowed||!access[2].allowed)return null;
 return {siteId:String(site.id),buildingId:String(building.id),buildingLevels:2,siteIsBuilding:false,
  access,sourceHashes:{...facts},sourceGeometryPreserved:true,facadeSurveyed:false,
  physicalAccessVerified:false,newRoads:0,newGeometry:0,newColliders:0};
}
