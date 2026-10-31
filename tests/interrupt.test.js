import test from 'node:test';
import assert from 'node:assert/strict';
import {interruptModes,createInterrupt,interruptStep,restoreInterrupt,interruptComplete} from '../src/interrupt.js';

test('both waiting strategies finish at tick four with different useful work',()=>{
  for(const id of Object.keys(interruptModes)){let state=createInterrupt().states[id];const expected=id==='poll'?['poll','poll','poll','service']:['work','work','work','service'];
    for(const action of expected){for(const wrong of ['poll','work','service'].filter(a=>a!==action)){const unchanged=interruptStep(state,wrong);assert.equal(unchanged.time,state.time);assert.equal(unchanged.work,state.work);}state=interruptStep(state,action);}
    assert.equal(state.done,true);assert.equal(state.time,4);assert.equal(state.work,id==='poll'?0:3);assert.throws(()=>interruptStep(state,'service'),RangeError);
  }
});
test('completion requires both runs and restored steps are bounded',()=>{
  const set=createInterrupt();for(const id of Object.keys(interruptModes)){const actions=id==='poll'?['poll','poll','poll','service']:['work','work','work','service'];set.states[id]=actions.reduce(interruptStep,set.states[id]);}assert.equal(interruptComplete(set),true);
  assert.deepEqual(restoreInterrupt({selected:'poll',steps:{poll:4,interrupt:4}}),set);assert.throws(()=>restoreInterrupt({selected:'poll',steps:{poll:5,interrupt:0}}),RangeError);
});
