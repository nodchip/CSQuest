import test from 'node:test';
import assert from 'node:assert/strict';
import {createIsolation,isolationAction,restoreIsolation,isolationComplete} from '../src/isolation.js';

test('a dirty read observes an update that is later rolled back',()=>{
  let state=createIsolation('dirty');state=isolationAction(state,'update');
  const wrong=isolationAction(state,'read10');assert.equal(wrong.index,1);assert.equal(wrong.observed,null);
  state=isolationAction(state,'read7');state=isolationAction(state,'rollback');
  assert.deepEqual({committed:state.committed,pending:state.pending,observed:state.observed},{committed:10,pending:null,observed:7});
});
test('the committed-version reader sees the previously committed value',()=>{
  let state=createIsolation('committed');state=isolationAction(state,'update');
  assert.equal(isolationAction(state,'read7').index,1);
  state=isolationAction(state,'read10');state=isolationAction(state,'rollback');
  assert.deepEqual({committed:state.committed,observed:state.observed},{committed:10,observed:10});
});
test('draft restoration replays only legal progress in each mode',()=>{
  const saved={selected:'committed',actions:{dirty:['update','read7','rollback'],committed:['update','read10']}};
  const restored=restoreIsolation(saved);assert.equal(restored.states.committed.observed,10);assert.equal(isolationComplete(restored),false);
  restored.states.committed=isolationAction(restored.states.committed,'rollback');assert.equal(isolationComplete(restored),true);
  assert.throws(()=>restoreIsolation({...saved,actions:{dirty:['update','read10'],committed:[]}}),RangeError);
  assert.throws(()=>restoreIsolation({...saved,actions:{dirty:['rollback'],committed:[]}}),RangeError);
});
