import test from 'node:test';
import assert from 'node:assert/strict';
import {updateTravelUnlocks} from '../src/travel-map.js';

test('old saves establish a baseline without reporting previously available places',()=>{
 const s={completed:['forest','branch'],mapVisited:['workshop']};updateTravelUnlocks(s);
 assert.deepEqual(s.travelPending,[]);assert.deepEqual(s.travelNew,[]);
 assert.deepEqual(new Set(s.travelKnown),new Set(['workshop','river','city','harbor']));
});
test('new destinations are queued together, survive updates, and are not repeated after acknowledgement',()=>{
 const s={completed:[],mapVisited:['workshop']};updateTravelUnlocks(s);
 s.completed=['forest','branch'];updateTravelUnlocks(s);
 assert.deepEqual(new Set(s.travelPending),new Set(['river','city','harbor']));
 assert.deepEqual(new Set(s.travelNew),new Set(['river','city','harbor']));
 const resumed=JSON.parse(JSON.stringify(s));updateTravelUnlocks(resumed);assert.equal(resumed.travelPending.length,3);
 resumed.travelPending=[];resumed.mapVisited.push('river');resumed.travelNew=resumed.travelNew.filter(id=>id!=='river');updateTravelUnlocks(resumed);
 assert.deepEqual(resumed.travelPending,[]);assert.deepEqual(new Set(resumed.travelNew),new Set(['city','harbor']));
 resumed.completed.push('city-sort','city-queue');updateTravelUnlocks(resumed);assert.deepEqual(resumed.travelPending,['archive']);
});
test('story ending queues its four destinations without re-announcing earlier unlocks',()=>{
 const s={completed:['forest','branch'],mapVisited:['workshop']};updateTravelUnlocks(s);s.storyClimaxComplete=true;updateTravelUnlocks(s);
 assert.deepEqual(new Set(s.travelPending),new Set(['garden','observatory','tailor','guide']));
});
