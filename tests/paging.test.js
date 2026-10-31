import test from 'node:test';
import assert from 'node:assert/strict';
import {createPaging,stepPaging,needsVictim,restorePaging} from '../src/paging.js';
function run(id,policy){let s=createPaging(id,policy);while(s.status==='playing')s=stepPaging(s,needsVictim(s)?`victim:${s.order[0]}`:'advance');return s;}
test('each policy can win depending on the reference string',()=>{
  assert.equal(run('returnA','fifo').faults,5);assert.equal(run('returnA','lru').faults,4);
  assert.equal(run('returnB','fifo').faults,4);assert.equal(run('returnB','lru').faults,5);
});
test('hits update recency for LRU but do not change FIFO arrival order',()=>{
  let f=createPaging('returnA','fifo'),l=createPaging('returnA','lru');for(let i=0;i<4;i++){f=stepPaging(f,'advance');l=stepPaging(l,'advance');}
  assert.deepEqual(f.order,['A','B','C']);assert.deepEqual(l.order,['B','C','A']);assert.equal(needsVictim(f),true);
  assert.equal(stepPaging(f,'victim:B').index,4);assert.equal(stepPaging(l,'victim:A').index,4);
});
test('independent runs resume from valid operations only',()=>{
  const actions={returnA:{fifo:['advance','advance'],lru:[]},returnB:{fifo:[],lru:['advance']}};
  const restored=restorePaging({example:'returnA',policy:'fifo',actions});assert.deepEqual(restored.states.returnA.fifo.order,['A','B']);
  assert.throws(()=>restorePaging({example:'returnA',policy:'fifo',actions:{...actions,returnA:{fifo:['victim:A'],lru:[]}}}),RangeError);
});
