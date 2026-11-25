// Player-facing 3D sign text, independent of source geometry and identifiers.
// Prepared for integration after 5.336. Unknown businesses never expose source names.
import {landmarkDisplayName} from './fictional-identity.js';
const known=Object.freeze({
 'tesco':'🛒 Tesco','penny':'🛒 Penny','billa':'🛒 Billa',
 'modrá hvězda':'🏨 Modrá hvězda','potraviny d a š':'🛒 Potraviny D a Š',
 'zš t. g. masaryka':'🏫 ZŠ T. G. Masaryka','zš juventa':'🏫 ZŠ Juventa',
 'poliklinika milovice':'🏥 Poliklinika Milovice','mš sluníčko':'🏫 MŠ Sluníčko'
});
const shops=Object.freeze({supermarket:'Potraviny',convenience:'Potraviny',bakery:'Pekárna',jewelry:'Šperky',clothes:'Oděvy',florist:'Květinářství',hairdresser:'Kadeřnictví'});
const amenities=Object.freeze({restaurant:'Restaurace',fast_food:'Bistro',clinic:'Zdravotní centrum',school:'Škola',pharmacy:'Lékárna',cafe:'Kavárna'});
const keyOf=value=>typeof value==='string'?value.normalize('NFC').trim().toLocaleLowerCase('cs'):'';
export function businessSignText(tags={}){
 const key=keyOf(tags.name);
 if(Object.hasOwn(known,key))return landmarkDisplayName(known[key]).replace(/^\S+\s+/u,'');
 if(Object.hasOwn(amenities,tags.amenity))return amenities[tags.amenity];
 if(Object.hasOwn(shops,tags.shop))return shops[tags.shop];
 return tags.shop?'Obchod':'Provozovna';
}
export const STATIC_SIGN_TEXT=Object.freeze({
 station:'IRONFIELD',stationFallback:'IRONFIELD • NÁDRAŽÍ',
 busDestination:'432 • IRONFIELD',fallbackStreet:'STRÁŽNÍKŮ',
 fallbackLeisure:'SMĚR ZÁBAVNÍ PARK',school:'ZŠ U KNIHOVNY',
 hotel:'STŘÍBRNÝ MĚSÍC',bikeHub:'CYKLOHUB'
});
