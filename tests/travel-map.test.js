import test from 'node:test';
import assert from 'node:assert/strict';
import {travelPlaces,availableTravelPlaces,travelNotice,validTravelVisits} from '../src/travel-map.js';
import {towerGateIds} from '../src/tower-gate.js';
import {forgeStationIds} from '../src/forge-station.js';
const ids=s=>availableTravelPlaces(s).map(p=>p.id);
test('existing travel prerequisites independently control destinations',()=>{
 const s={completed:[],bridgeOpen:false,towerGateSeen:false};assert.deepEqual(ids(s),['workshop']);
 s.completed=['forest','branch'];assert.ok(ids(s).includes('river'));assert.ok(ids(s).includes('city'));assert.ok(!ids(s).includes('harbor'));
 s.completed.push('river');assert.ok(ids(s).includes('harbor'));assert.ok(!ids(s).includes('archive'));
 s.completed.push('harbor-message');assert.ok(ids(s).includes('archive'));assert.ok(ids(s).includes('windmill'));assert.ok(!ids(s).includes('mountain'));
 s.bridgeOpen=true;assert.ok(ids(s).includes('mountain'));assert.ok(!ids(s).includes('valley'));
 s.completed.push('search-bfs','search-weighted','search-compare');assert.ok(ids(s).includes('valley'));assert.ok(!ids(s).includes('sky'));
 s.completed.push('data-record','data-filter','data-join');assert.ok(ids(s).includes('sky'));assert.ok(ids(s).includes('mist'));assert.ok(!ids(s).includes('forge'));
 s.completed.push(...towerGateIds);s.towerGateSeen=true;assert.equal(ids(s).length,12);assert.equal(new Set(travelPlaces.map(p=>p.id)).size,12);
});
test('story notices remain until the corresponding event is seen',()=>{
 const s={completed:['archive-search','windmill-lamp'],bridgeOpen:false,towerGateSeen:false,forgeStationSeen:false};assert.match(travelNotice('archive',s),/橋/);s.bridgeOpen=true;assert.equal(travelNotice('archive',s),'');
 s.completed.push(...towerGateIds);assert.match(travelNotice('sky',s),/谷/);s.towerGateSeen=true;assert.equal(travelNotice('sky',s),'');
 s.completed.push(...forgeStationIds);assert.match(travelNotice('station',s),/道具/);s.forgeStationSeen=true;assert.equal(travelNotice('station',s),'');
});
test('visit history accepts only distinct known places',()=>{assert.equal(validTravelVisits(['workshop','river']),true);assert.equal(validTravelVisits(['river','river']),false);assert.equal(validTravelVisits(['unknown']),false);assert.equal(validTravelVisits(null),false)});
