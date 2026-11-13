import assert from 'node:assert/strict';
import {distanceMeters,bearingDegrees,normalizeMapillaryImage,rankImagesForFacade,planStreetQueryBoxes,buildMapillaryQuery,fetchMapillaryImages,summarizeStreetCoverage} from './mapillary-discovery.js';
const face={id:'S',cardinal:180,middle:[50.23,14.89],buildingCenter:[50.23004,14.89]};
const good={id:'999111',computed_geometry:{coordinates:[14.89,50.22987]},computed_compass_angle:0,
 camera_type:'perspective',captured_at:1710000000000,creator:{username:'photographer'},
 thumb_256_url:'https://images.mapillary.com/pic.png'};
const img=normalizeMapillaryImage(good);
assert.equal(img.id,'999111');assert.equal(img.creator,'photographer');
assert.equal(img.pano,false);assert(img.heading===0);
assert(img.thumbnail.startsWith('https:'));
assert(distanceMeters([50.23,14.89],[50.23,14.89])===0);
assert(Math.abs(bearingDegrees([50.2299,14.89],[50.23,14.89]))<1);
assert.equal(rankImagesForFacade(face,[img]).length,1);
assert.equal(rankImagesForFacade(face,[{...img,heading:180}]).length,0,'camera facing away');
assert.equal(rankImagesForFacade(face,[{...img,point:[50.2302,14.89]}]).length,0,'other side of building');
assert.equal(rankImagesForFacade(face,[{...img,pano:true,heading:180}]).length,1,'360-degree image may be rotated');
assert.equal(normalizeMapillaryImage({...good,id:'wrong'}),null);
assert.equal(normalizeMapillaryImage({...good,thumb_256_url:'javascript:evil()'}).thumbnail,null);
const buildings=[{id:1,center:[50.23,14.89],coords:[[50.22995,14.88995],[50.22995,14.89005],[50.23005,14.89005],[50.23005,14.88995]],street:'Mírová'}];
const tiles=planStreetQueryBoxes(buildings);
assert.equal(tiles.length,1);const url=new URL(buildMapillaryQuery(tiles[0]));
assert.equal(url.host,'graph.mapillary.com');assert.equal(url.searchParams.get('limit'),'200');
const responses=[];
const token='TEST_PUBLIC_CLIENT_TOKEN';
const fetcher=async(u,opts)=>{
 assert(!u.includes(token),'token must NEVER appear in the URL');
 assert.equal(opts.headers.Authorization,'OAuth '+token);
 assert.equal(opts.referrerPolicy,'no-referrer');
 responses.push(u);
 return {ok:true,json:async()=>({data:[good,good],paging:{next:'more'}})};
};
const request=await fetchMapillaryImages(tiles[0],token,{fetcher});
assert.equal(request.images.length,1);
assert.equal(request.morePages,true);
const faces=[{id:'S',...face}];
const summary=summarizeStreetCoverage(buildings,[],request.images,()=>faces);
assert.equal(summary.withCandidates,1);
assert.equal(summary.candidateFacades,1);
assert.equal(planStreetQueryBoxes([...Array(110)].map((_,i)=>({
 id:i,center:[50.18+i*.0007,14.85]})),{maxTiles:15}),null,'do not silently partially scan an oversized street');
console.log('Mapillary metadata discovery OK: geospatial filters, camera direction, small API bboxes, auth header and coverage summaries');
