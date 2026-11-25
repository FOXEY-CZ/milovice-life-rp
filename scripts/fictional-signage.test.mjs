import assert from 'node:assert/strict';
import {businessSignText,STATIC_SIGN_TEXT} from './fictional-signage.js';
import {CITY_NAME} from './fictional-identity.js';
for(const [name,expected] of [
 ['Tesco','BrayMart'],['PENNY','ValueNest'],[' Billa ','Vendoa'],
 ['Modrá hvězda','Penzion Stříbrný měsíc'],['Potraviny D a Š','Potraviny Zrnova'],
 ['ZŠ T. G. Masaryka','ZŠ U Knihovny'],['ZŠ Juventa','ZŠ Rozbřesk'],
 ['Poliklinika Milovice','Zdravotní centrum Ironfield'],['MŠ Sluníčko','MŠ Mechulky']
]){
 assert.equal(businessSignText({name}),expected);
 assert.equal(businessSignText({name:name.normalize('NFD')}),expected);
}
for(const [tags,expected] of [
 [{name:'Unknown real company',shop:'bakery'},'Pekárna'],
 [{name:'Unknown real company',amenity:'restaurant'},'Restaurace'],
 [{name:'Unknown real company',shop:'supermarket'},'Potraviny'],
 [{name:'Unknown real company',shop:'other'},'Obchod'],
 [{name:'Unknown real company'},'Provozovna'],
 [{name:'constructor',shop:'toString'},'Obchod'],[{},'Provozovna']
]){
 const original=JSON.stringify(tags);
 assert.equal(businessSignText(tags),expected);
 assert.equal(JSON.stringify(tags),original,'Source tags must not be altered');
}
assert.equal(STATIC_SIGN_TEXT.station,CITY_NAME.toUpperCase());
assert(STATIC_SIGN_TEXT.busDestination.includes(CITY_NAME.toUpperCase()));
assert(Object.isFrozen(STATIC_SIGN_TEXT));
console.log('PASS fictional storefront names, neutral fallbacks and source preservation');

import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of ['businessSignText(tags).toLocaleUpperCase','label(STATIC_SIGN_TEXT.stationFallback','led(STATIC_SIGN_TEXT.busDestination','stationBoard(STATIC_SIGN_TEXT.station','stationFacadeSign(STATIC_SIGN_TEXT.station','schoolFacadeSign(STATIC_SIGN_TEXT.school','c.fillText(STATIC_SIGN_TEXT.hotel','stationBoard(STATIC_SIGN_TEXT.bikeHub']) assert(html.includes(marker),marker);
