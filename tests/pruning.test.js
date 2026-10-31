import test from 'node:test';
import assert from 'node:assert/strict';
import {pruningCases,createPruning,pruningStep,restorePruning,pruningComplete,canPrune} from '../src/pruning.js';

test('pruning after seeing 2 cannot change the preferred branch for any remaining score',()=>{
  const game=createPruning();let t=game.states.early;
  for(let i=0;i<3;i++)t=pruningStep(t,'reveal');
  assert.equal(canPrune(t),true);
  for(let hidden=-20;hidden<=20;hidden++)assert.ok(Math.min(pruningCases.early.right[0],hidden)<=Math.min(...pruningCases.early.left));
  t=pruningStep(t,'prune');assert.equal(t.done,true);assert.equal(t.revealed,3);
});
test('9 first cannot justify pruning and both orders yield the same minimax value',()=>{
  const game=createPruning();let t=game.states.late;
  for(let i=0;i<3;i++)t=pruningStep(t,'reveal');
  assert.equal(canPrune(t),false);assert.equal(pruningStep(t,'prune').history.length,3);
  assert.ok(Math.min(9,9)>Math.min(...pruningCases.late.left));
  t=pruningStep(t,'reveal');assert.equal(t.done,true);
  for(const c of Object.values(pruningCases))assert.equal(Math.max(Math.min(...c.left),Math.min(...c.right)),3);
});
test('completion requires both target trials and saved history is replayed safely',()=>{
  const game=createPruning();game.states.early=['reveal','reveal','reveal','prune'].reduce(pruningStep,game.states.early);assert.equal(pruningComplete(game),false);game.states.late=['reveal','reveal','reveal','reveal'].reduce(pruningStep,game.states.late);assert.equal(pruningComplete(game),true);
  const saved={selected:'late',history:{early:game.states.early.history,late:game.states.late.history}};assert.deepEqual(restorePruning(saved),game.selected==='late'?game:{...game,selected:'late'});assert.throws(()=>restorePruning({selected:'early',history:{early:['prune'],late:[]}}),RangeError);assert.throws(()=>restorePruning({selected:'early',history:{early:[...saved.history.early,'reveal'],late:[]}}),RangeError);
});
