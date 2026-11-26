// Player-facing 3D sign text, independent of source geometry and identifiers.
// Prepared for integration after 5.336. Unknown businesses never expose source names.
import {landmarkDisplayName} from './fictional-identity.js';
const known=Object.freeze({
 'tesco':'🛒 Tesco','penny':'🛒 Penny','billa':'🛒 Billa',
 'modrá hvězda':'🏨 Modrá hvězda','potraviny d a š':'🛒 Potraviny D a Š',
 'zš t. g. masaryka':'🏫 ZŠ T. G. Masaryka','zš juventa':'🏫 ZŠ Juventa',
 'poliklinika milovice':'🏥 Poliklinika Milovice','mš sluníčko':'🏫 MŠ Sluníčko'
});
const shops=Object.freeze({supermarket:'Groceries',convenience:'Groceries',bakery:'Bakery',jewelry:'Jewelry',clothes:'Clothing',florist:'Florist',hairdresser:'Hair Salon'});
const amenities=Object.freeze({restaurant:'Restaurant',fast_food:'Bistro',clinic:'Health Center',school:'School',pharmacy:'Pharmacy',cafe:'Cafe'});
const keyOf=value=>typeof value==='string'?value.normalize('NFC').trim().toLocaleLowerCase('cs'):'';
export function businessSignText(tags={}){
 const key=keyOf(tags.name);
 if(Object.hasOwn(known,key))return landmarkDisplayName(known[key]).replace(/^\S+\s+/u,'');
 if(Object.hasOwn(amenities,tags.amenity))return amenities[tags.amenity];
 if(Object.hasOwn(shops,tags.shop))return shops[tags.shop];
 return tags.shop?'Shop':'Business';
}
export const STATIC_SIGN_TEXT=Object.freeze({
 station:'IRONFIELD',stationFallback:'IRONFIELD • STATION',
 busDestination:'432 • IRONFIELD',fallbackStreet:'SENTINEL ROAD',
 fallbackLeisure:'AMUSEMENT PARK',school:'LIBRARY HILL SCHOOL',
 hotel:'SILVERMOON INN',bikeHub:'CYCLEHUB'
});

// Display-only labels for the three source-observed direction boards.
export const DIRECTION_SIGN_LABELS=Object.freeze(['City Police','Recycling Center','Wonderwood Park']);
