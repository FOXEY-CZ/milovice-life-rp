// Regional identity, independent of any city and reusable for future destinations.
export const TRANSIT_NAME='CrossTransit';
export const TRANSIT_CODE='CT';
export const TRANSIT_PALETTE=Object.freeze({body:0xeaeae5,primary:0x18334b,accent:0x54c6b5,signBackground:'#18334b',signForeground:'#ffffff'});
export const destinationLabel=(route,city='Ironfield')=>String(route)+' '+String(city).toUpperCase();
export const transitRouteLabel=route=>TRANSIT_CODE+' '+String(route);
export const FALLBACK_STOPS=Object.freeze([
 Object.freeze({name:'Central Station',z:0}),
 Object.freeze({name:'City Hall',z:-105}),
 Object.freeze({name:'Sentinel Road',z:-210}),
 Object.freeze({name:'Wonderwood Park',z:-320})
]);

// Only the display layer changes; route-source data remains historical evidence.
const REGIONAL_DESTINATIONS=Object.freeze({'Park Mirakulum':'Wonderwood Park','Lysá nad Labem':'Riverside','Benátky nad Jizerou':'Brookhaven','Balonka':'Hillcrest','Lipník':'Willowfield','Mladá Boleslav':'Eastborough','Straky':'Oakford','Nymburk':'Stonebridge','Kostomlaty nad Labem':'Westhaven'});
export function regionalDestinationLabel(name){return typeof name==='string'&&Object.hasOwn(REGIONAL_DESTINATIONS,name.normalize('NFC'))?REGIONAL_DESTINATIONS[name.normalize('NFC')]:'Regional Stop';}
