import test from 'node:test';
import assert from 'node:assert/strict';
import {minimaxCases,minimaxValue,checkMinimax,createMinimax,restoreMinimax,minimaxComplete} from '../src/minimax.js';

test('the player maximizes the minimum result chosen by the opponent',()=>{
  assert.deepEqual(minimaxValue('first'),{east:2,west:4,best:'west',guaranteed:4});
  assert.deepEqual(minimaxValue('second'),{east:3,west:1,best:'east',guaranteed:3});
  for(const [id,task] of Object.entries(minimaxCases))for(const east of task.east)for(const west of task.west)for(const best of ['east','west']){
    const actual=checkMinimax(id,{east,west,best});
    assert.equal(actual.east,east===Math.min(...task.east));assert.equal(actual.west,west===Math.min(...task.west));assert.equal(actual.best,best===minimaxValue(id).best);
  }
});
test('all trials require tested correct choices and saved choices are validated',()=>{
  const state=createMinimax();state.choices.first={east:2,west:4,best:'west',tested:true};state.choices.second={east:3,west:1,best:'east',tested:true};
  assert.equal(minimaxComplete(state),true);const restored=restoreMinimax(state);state.choices.first.east=8;assert.equal(restored.choices.first.east,2);
  assert.throws(()=>restoreMinimax({...state,selected:'unknown'}),RangeError);restored.choices.second.west=7;assert.throws(()=>restoreMinimax(restored),RangeError);
});
