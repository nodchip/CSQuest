import test from 'node:test';
import assert from 'node:assert/strict';
import {spiritMethod,createObjects,objectsStep,restoreObjects,objectsComplete} from '../src/objects.js';
test('the same shine call dispatches by the actual type and consumes only its own state',()=>{
  const initial={a:{type:'ember',charge:1},b:{type:'ember',charge:1},c:{type:'moon',charge:1}};const red=spiritMethod(initial,'a','shine'),blue=spiritMethod(initial,'c','shine');
  assert.equal(red.result,'red');assert.equal(blue.result,'blue');assert.equal(red.objects.a.charge,0);assert.equal(red.objects.b.charge,1);assert.equal(initial.a.charge,1);
});
test('recharging one instance leaves a second instance empty',()=>{
  let s=createObjects('state');s=objectsStep(s,'one');assert.equal(s.objects.a.charge,1);assert.equal(s.objects.b.charge,0);assert.equal(objectsStep(s,'red').index,1);s=objectsStep(s,'empty');s=objectsStep(s,'red');assert.equal(s.index,3);
});
test('histories replay only correct predictions and completion requires both trials',()=>{
  const saved={selected:'state',history:{dispatch:['red','blue'],state:['one','empty']}};const state=restoreObjects(saved);assert.equal(objectsComplete(state),false);state.states.state=objectsStep(state.states.state,'red');assert.equal(objectsComplete(state),true);
  assert.throws(()=>restoreObjects({...saved,history:{...saved.history,dispatch:['blue']}}),RangeError);
});
