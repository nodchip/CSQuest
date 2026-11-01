import test from 'node:test';
import assert from 'node:assert/strict';
import {minimaxCases,minimaxValue,checkMinimax,chanceCases,chanceValue,checkChance,createMinimax,restoreMinimax,minimaxComplete} from '../src/minimax.js';

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
  assert.equal(minimaxComplete(state),false);for(const id of Object.keys(chanceCases)){const v=chanceValue(id);state.chanceChoices[id]={east:v.east,best:v.best,tested:true};}assert.equal(minimaxComplete(state),true);const restored=restoreMinimax(state);state.choices.first.east=8;assert.equal(restored.choices.first.east,2);
  assert.throws(()=>restoreMinimax({...state,selected:'unknown'}),RangeError);restored.choices.second.west=7;assert.throws(()=>restoreMinimax(restored),RangeError);
});
test('chance nodes use the given probabilities, and earlier saves still restore',()=>{
 assert.deepEqual(chanceValue('half'),{east:5,west:4,best:'east'});assert.deepEqual(chanceValue('fifth'),{east:2,west:4,best:'west'});
 for(const id of Object.keys(chanceCases))for(const east of [2,4,5])for(const best of ['east','west']){const r=checkChance(id,{east,best}),v=chanceValue(id);assert.equal(r.east,east===v.east);assert.equal(r.best,best===v.best);}
 const s=createMinimax(),{chanceSelected,chanceChoices,...old}=s,restored=restoreMinimax(old);assert.deepEqual(restored,s);assert.throws(()=>restoreMinimax({...s,chanceSelected:'bad'}));
});
