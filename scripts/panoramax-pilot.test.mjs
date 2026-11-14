// Privacy, legal-scope and STAC parsing checks for the isolated 360 photo PILOT.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 PILOT_LOCATION,searchBox,buildPanoramaxSearchUrl,normalizedPanoramaxFeature,
 parsePanoramaxResponse,fetchPanoramaxPilot
} from './panoramax-pilot.js';
const UUID='890b6268-7716-4e34-ada9-69985e6c1657';
const bbox=searchBox();
assert.equal(PILOT_LOCATION.name,'Milovice — Nádražní a nádraží');
assert.equal(bbox.length,4);
assert(bbox[0]<14.88242&&bbox[2]>14.88242);
assert(bbox[1]<50.22949&&bbox[3]>50.22949);
assert.throws(()=>searchBox({lat:48.8,lon:13.2,radius:190}));
assert.throws(()=>searchBox({lat:50.22949,lon:14.88242,radius:5000}));
const url=new URL(buildPanoramaxSearchUrl());
assert.equal(url.origin,'https://api.panoramax.xyz');
assert.equal(url.pathname,'/api/search');
assert.equal(url.searchParams.get('limit'),'30');
const valid={
 type:'Feature',id:UUID,geometry:{type:'Point',coordinates:[14.8824,50.2295]},
 properties:{datetime:'2024-05-30T10:00:00Z','view:azimuth':200},
 collection:'example-sequence'
};
const norm=normalizedPanoramaxFeature(valid,bbox);
assert.equal(norm.id,UUID);
assert.equal(norm.reviewStatus,'candidate-unreviewed');
assert.equal(norm.heading,200);
assert(norm.viewerUrl.includes('pic='+UUID));
assert.equal(norm.lon,14.8824);
assert.equal(norm.lat,50.2295);
assert.equal(normalizedPanoramaxFeature({...valid,id:'../../admin'},bbox),null);
assert.equal(normalizedPanoramaxFeature({...valid,geometry:{type:'Point',coordinates:[17,47]}},bbox),null);
assert.equal(normalizedPanoramaxFeature({...valid,geometry:{type:'Polygon',coordinates:[]}},bbox),null);
const collection={type:'FeatureCollection',features:[valid,valid,{...valid,id:'unsafe'}],
 links:[{rel:'next',href:'https://api.panoramax.xyz/api/search?next=1'}]};
const parsed=parsePanoramaxResponse(collection);
assert.equal(parsed.photos.length,1);
assert.equal(parsed.morePages,true);
const federated=parsePanoramaxResponse({
 features:[valid],links:[] // api.panoramax.xyz actual 2026 metadata shape
});
assert.equal(federated.photos.length,1);
assert.equal(federated.catalogueFormat,'federated-feature-list');
assert.equal(parsePanoramaxResponse({features:[],links:[]}).photos.length,0,
 'Empty valid meta-catalogue must NOT be treated as an API error');
assert.equal(parsed.catalogueFormat,'stac-feature-collection');
assert.throws(()=>parsePanoramaxResponse({type:'Error',features:[]}),
 'Do not accept unknown feature containers');

assert.equal(parsed.photos[0].reviewStatus,'candidate-unreviewed');
assert.throws(()=>parsePanoramaxResponse({data:[]}));
let requests=0;
const res=await fetchPanoramaxPilot(PILOT_LOCATION,{fetcher:async(url,config)=>{
 requests++;
 assert.equal(new URL(url).origin,'https://api.panoramax.xyz');
 assert.equal(config.method,'GET');
 assert.equal(config.credentials,'omit');
 assert.equal(config.cache,'no-store');
 assert.equal(config.mode,'cors');
 assert(!('Authorization' in config.headers));
 return {ok:true,json:async()=>collection};
}});
assert.equal(requests,1,'Only one user-triggered lookup; no crawling');
assert.equal(res.photos.length,1);
const pilot=readFileSync(new URL('../photo-pilot.html',import.meta.url),'utf8');
assert(pilot.includes("import {PILOT_LOCATION,searchBox,fetchPanoramaxPilot}"));
assert(pilot.includes("id=\"find\""));
assert(pilot.includes("id=\"cancel\""));
assert(pilot.includes('readOnly:true'));
assert(pilot.includes('autoGameMutations:0'));
assert(pilot.includes('storedPictures:0'));
assert(!pilot.includes('localStorage'));
assert(!pilot.includes('<img'));
assert(!pilot.includes('api.mapy.cz'));
assert(!pilot.includes('thumbnail'));
assert(pilot.includes('backup/566-before-photo-pilot'));
// Check the entire inline module parses: importing has no side effect.
const moduleText=pilot.match(/<script type="module">([\s\S]*?)<\/script>/);
assert(moduleText,'Standalone pilot script missing');
const syntax=moduleText[1].replace(/^import \{PILOT_LOCATION,searchBox,fetchPanoramaxPilot\} from .*?;\s*$/m,'');
assert.doesNotThrow(()=>new Function(syntax),'PILOT inline script syntax must parse');
const main=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(/const BUILD_ID='[a-zA-Z0-9-]+';/.test(main),
 "Photo survey pilot must not remove the main game build identifier");
assert(main.includes('stationPhotoParking.create(elements,'),
 'The 3D game remains independently functional while photo pilot is read-only');
assert(!main.includes('panoramax-pilot.js'),'The pilot must never be imported into live game');
const editor=readFileSync(new URL('../editor.html',import.meta.url),'utf8');
assert(!editor.includes('panoramax-pilot.js'),'Existing editor must remain unaffected');
console.log('Panoramax isolated photo pilot PASS: 1 bounded metadata request, no image copies, no model writes, backup branch');
