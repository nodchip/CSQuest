import test from 'node:test';import assert from 'node:assert/strict';import {replayPrimRoads} from '../src/endgame-prim-roads.js';
const forest=['edge:AC','edge:BC','edge:BD','edge:DE','next'];
test('five places require four roads with independently expected total 10',()=>{
 const p=replayPrimRoads('forest',forest);assert.deepEqual(p.results,[{case:'forest',chosen:['AC','BC','BD','DE'],total:10}]);assert.equal(p.done,true);
});
test('equal cheapest roads and both final ties are accepted',()=>{
 for(const first of [['AB','AC'],['AC','AB']])for(const last of ['BD','CD']){
  const p=replayPrimRoads('ties',[...first,last].map(x=>`edge:${x}`).concat('next'));assert.equal(p.results[0].total,5);assert.equal(p.done,true);
 }
});
test('wrong noncrossing, more expensive, incomplete and post-completion histories rejected',()=>{
 for(const h of [['edge:BC'],['edge:AB'],['edge:AC','edge:AC'],['edge:AC','next'],[...forest,'reset'],['edge:XX']])assert.equal(replayPrimRoads('forest',h),null);
 assert.deepEqual(replayPrimRoads('forest',['edge:AC','reset']).state,replayPrimRoads('forest',[]).state);
 const h=[...forest,'edge:AB','edge:AC','edge:BD','next'];assert.equal(replayPrimRoads('compare',h).done,false);assert.equal(replayPrimRoads('compare',[...h,'answer:spanning']).done,true);assert.equal(replayPrimRoads('compare',[...h,'answer:shortest']),null);
});
