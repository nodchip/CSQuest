import test from 'node:test';
import assert from 'node:assert/strict';
import {contentionCases,contentionState,createContention,contentionComplete,restoreContention} from '../src/contention-trials.js';
import {createSharedStock,restoreSharedStock} from '../src/shared-stock.js';

test('fixed schedules distinguish conflicts, waiting, and repeated rejection',()=>{
 const expected={quietOptimistic:[2,0,0],busyOptimistic:[2,1,0],quietLock:[2,0,0],busyLock:[2,0,1],starvation:[2,2,0]};
 for(const [id,c] of Object.entries(contentionCases)){
  const result=contentionState(id,c.steps);
  assert.deepEqual([result.value,result.failures,result.waits],expected[id]);
 }
 assert.throws(()=>contentionState('busyOptimistic',['aw']));
 const s=createContention();
 for(const [id,c] of Object.entries(contentionCases))s.histories[id]=[...c.steps];
 assert.equal(contentionComplete(s),true);
 const copy=restoreContention(s);copy.histories.starvation.pop();assert.equal(s.histories.starvation.length,8);
 assert.throws(()=>restoreContention({...s,histories:{...s.histories,starvation:['aw']}}));
});
test('earlier saved stock drafts acquire empty comparison histories',()=>{
 const {contention,...old}=createSharedStock();
 assert.deepEqual(restoreSharedStock(old).contention,createContention());
});
