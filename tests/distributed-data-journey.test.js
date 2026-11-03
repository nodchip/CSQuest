import test from 'node:test';import assert from 'node:assert/strict';
import {distributedJourneyCreate,distributedJourneyAct,distributedJourneyReplay,distributedJourneyRestore} from '../src/distributed-data-journey.js';
test('wrong connection and wrong cost choice can be corrected after both join plans',()=>{
 const q=distributedJourneyCreate(),act=a=>distributedJourneyAct(q,a);assert.throws(()=>act('next'),RangeError);act('connect');assert.equal(distributedJourneyReplay(q.history).connected,false);for(const a of ['route:gateway','connect','next','join:guess3','join:ship','join:join','method:semi','join:guess3','join:keys'])act(a);
 const copy=distributedJourneyRestore(q);assert.equal(distributedJourneyReplay(copy.history).trials.semi.phase,'filter');copy.history.pop();assert.notEqual(copy.history.length,q.history.length);
 for(const a of ['join:filter','join:ship','join:join','choice:all','confirm'])act(a);let s=distributedJourneyReplay(q.history);assert.equal(s.joined,false);assert.deepEqual([s.trials.all.sent,s.trials.semi.sent,s.trials.semi.result.length],[6,4,3]);for(const a of ['choice:semi','confirm','next','report'])act(a);assert.equal(distributedJourneyReplay(q.history).won,true);
});
test('invalid actions are rejected without changing a draft',()=>{const q=distributedJourneyCreate();assert.throws(()=>distributedJourneyAct(q,'join:ship'),RangeError);assert.deepEqual(q.history,[]);assert.throws(()=>distributedJourneyRestore({history:['route:unknown']}),RangeError);});
