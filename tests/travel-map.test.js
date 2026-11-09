import test from 'node:test';
import assert from 'node:assert/strict';
import {travelPlaces,laterTravelIds,laterStoryRegions,legacyTravelIds,availableTravelPlaces,travelNotice,validTravelVisits} from '../src/travel-map.js';
import {towerGateIds} from '../src/tower-gate.js';
import {forgeStationIds} from '../src/forge-station.js';
const ids=s=>availableTravelPlaces(s).map(p=>p.id);
test('first destinations open together and one new place follows each additional region helped',()=>{
 const s={completed:[]};assert.deepEqual(ids(s),['workshop']);
 s.completed=['forest','branch'];assert.deepEqual(new Set(ids(s)),new Set(['workshop','river','city','harbor']));
 s.completed.push('city-sort');assert.equal(ids(s).length,4);
 s.completed.push('city-queue');assert.ok(ids(s).includes('archive'));assert.ok(!ids(s).includes('windmill'));
 s.completed.push('river','river-signals');assert.ok(ids(s).includes('windmill'));assert.ok(!ids(s).includes('mountain'));
 s.completed.push('harbor-message','harbor-parallel');assert.ok(ids(s).includes('mountain'));
 assert.equal(new Set(travelPlaces.map(p=>p.id)).size,16);
 assert.equal(new Set(laterTravelIds).size,8);
});
test('previously visited upper destinations remain available in old saves',()=>{
 const s={completed:['forest','branch'],mapVisited:['workshop','sky','garden']};
 assert.ok(ids(s).includes('sky'));assert.ok(!ids(s).includes('garden'));
});
test('all four lower destinations open together only after the new climax',()=>{
 const old={completed:['forest','branch'],forgeStationSeen:true,mapVisited:['workshop','garden']};
 const legacyUnlocked=legacyTravelIds(old);
 assert.ok(legacyUnlocked.includes('guide'));
 for(const id of laterStoryRegions){
  assert.ok(!ids({...old,legacyUnlocked}).includes(id));
  assert.ok(ids({...old,legacyUnlocked,storyClimaxComplete:true}).includes(id));
 }
 assert.equal(old.mapVisited.includes('guide'),false);
});
test('which early place is helped does not change the next destination',()=>{
 const base=['forest','branch'];
 const a=ids({completed:[...base,'river','river-signals']});
 const b=ids({completed:[...base,'city-sort','city-queue']});
 assert.deepEqual(a,b);
});
test('story notices remain until the corresponding event is seen',()=>{
 const s={completed:['archive-search','windmill-lamp'],bridgeOpen:false,towerGateSeen:false,forgeStationSeen:false};assert.match(travelNotice('archive',s),/橋/);s.bridgeOpen=true;assert.equal(travelNotice('archive',s),'');
 s.completed.push(...towerGateIds);assert.match(travelNotice('sky',s),/谷/);s.towerGateSeen=true;assert.equal(travelNotice('sky',s),'');
 s.completed.push(...forgeStationIds);assert.match(travelNotice('station',s),/道具/);s.forgeStationSeen=true;assert.equal(travelNotice('station',s),'');
});
test('visit history accepts only distinct known places',()=>{assert.equal(validTravelVisits(['workshop','river']),true);assert.equal(validTravelVisits(['river','river']),false);assert.equal(validTravelVisits(['unknown']),false);assert.equal(validTravelVisits(null),false)});
