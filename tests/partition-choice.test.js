import test from 'node:test';
import assert from 'node:assert/strict';
import {createPartitionChoice,partitionChoiceState,partitionChoiceComplete,restorePartitionChoice} from '../src/partition-choice.js';
import {createReplica,restoreReplica} from '../src/replica-lag.js';
const steps=['write','read','heal','deliver','read'];
test('a completed write followed by the isolated read either returns stale or waits',()=>{
 assert.deepEqual(partitionChoiceState('reply',steps).reads,[4,3]);
 assert.deepEqual(partitionChoiceState('wait',steps).reads,['wait',3]);
 assert.throws(()=>partitionChoiceState('reply',['read']));
 const s=createPartitionChoice();s.histories={reply:[...steps],wait:[...steps]};s.answers={reply:'stale',wait:'fresh'};s.checked={reply:true,wait:true};
 assert.equal(partitionChoiceComplete(s),false);
 s.answers.wait='wait';assert.equal(partitionChoiceComplete(s),true);
 const copy=restorePartitionChoice(s);copy.histories.wait.pop();assert.equal(s.histories.wait.length,5);
 assert.throws(()=>restorePartitionChoice({...s,histories:{...s.histories,wait:['read']}}));
});
test('previous draft restores its original history with empty comparison',()=>{
 const old={history:['write','readReplica']};
 assert.deepEqual(restoreReplica(old).choice,createReplica().choice);
 assert.equal(restoreReplica(old).flags.stale,true);
});
