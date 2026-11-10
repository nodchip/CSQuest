import test from 'node:test';import assert from 'node:assert/strict';import {replayRendezvous} from '../src/endgame-rendezvous.js';
const free=['step:A','step:A','step:B','step:B','next'];
const barrier=['step:A','step:A','step:B','step:B','step:A','step:B','next'];
test('early reading and rendezvous have independently expected totals',()=>{
 assert.deepEqual(replayRendezvous('free',free).results,[{mode:'free',A:2,B:5,waited:false}]);
 assert.deepEqual(replayRendezvous('barrier',barrier).results,[{mode:'barrier',A:5,B:5,waited:true}]);
});
test('wait, early completion, wrong results, and post-completion are rejected',()=>{
 for(const h of [['next'],['step:A','step:A','step:A'],['step:A','step:B','step:A','step:B','next'],[...barrier,'step:A']])assert.equal(replayRendezvous('barrier',h),null);
 assert.deepEqual(replayRendezvous('free',['step:A','reset']).state,replayRendezvous('free',[]).state);
 const h=[...free,...barrier];assert.equal(replayRendezvous('compare',h).done,false);assert.equal(replayRendezvous('compare',[...h,'answer:wait']).done,true);assert.equal(replayRendezvous('compare',[...h,'answer:fast']),null);
});
test('opposite worker arrival order also works',()=>{
 const p=replayRendezvous('barrier',['step:B','step:B','step:A','step:A','step:B','step:A','next']);assert.deepEqual([p.results[0].A,p.results[0].B],[5,5]);
});
