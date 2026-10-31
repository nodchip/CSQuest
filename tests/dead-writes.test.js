import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runWrites,writesCorrect,createDeadWrites,deadWritesComplete,restoreDeadWrites} from '../src/dead-writes.js';

test('exhaustive removal sets preserve the correct output and only optimal sets pass',()=>{
 const keys=['a','b','c'];for(let mask=0;mask<8;mask++){const removed=keys.filter((_,i)=>mask&(1<<i));
  assert.equal(runWrites('x',removed),removed.includes('c')?(removed.includes('a')?0:1):3);
  assert.equal(runWrites('y',removed),removed.includes('b')?0:2);
  assert.equal(writesCorrect('x',removed),mask===3);assert.equal(writesCorrect('y',removed),mask===5);
 }
});
test('completion and restored records require both checked optimal sets',()=>{
 const s=createDeadWrites();s.trials.x={removed:['a','b'],checked:true};s.trials.y={removed:['a','c'],checked:true};const copy=restoreDeadWrites(s);assert.equal(deadWritesComplete(copy),true);
 s.trials.x.removed.push('c');assert.equal(deadWritesComplete(copy),true);assert.throws(()=>restoreDeadWrites(s),RangeError);
});
