import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createModelCheck,expandModel,boundedModelWitness,modelCheckComplete,restoreModelCheck} from '../src/model-checking.js';
test('finite breadth-first exploration finds a simultaneous entry only when check and entry are separate',()=>{
 const s=createModelCheck();for(const mode of ['split','atomic'])while(s.trials[mode].status==='searching')s.trials[mode]=expandModel(s.trials[mode]);assert.equal(s.trials.split.status,'violation');assert.deepEqual(s.trials.split.counterexample.path,['A：外 → 確認後','B：外 → 確認後','A：確認後 → 部屋の中','B：確認後 → 部屋の中']);assert.equal(s.trials.atomic.status,'safe');assert.equal(s.trials.atomic.seen.includes('2,2'),false);assert.equal(modelCheckComplete(s),true);
});
test('bounded witness search misses the four-step counterexample at smaller bounds',()=>{
 for(let bound=0;bound<=3;bound++)assert.equal(boundedModelWitness('split',bound),null);
 const witness=boundedModelWitness('split',4);
 assert.deepEqual(witness.path,['A：外 → 確認後','B：外 → 確認後','A：確認後 → 部屋の中','B：確認後 → 部屋の中']);
 assert.deepEqual([witness.a,witness.b],[2,2]);
 for(let bound=0;bound<=4;bound++)assert.equal(boundedModelWitness('atomic',bound),null);
 assert.throws(()=>boundedModelWitness('split',5));assert.throws(()=>boundedModelWitness('bad',3));
 const old=createModelCheck();delete old.bound;delete old.boundedChecked;
 const restored=restoreModelCheck(old);assert.equal(restored.bound,3);assert.equal(restored.boundedChecked,false);
 assert.equal(restoreModelCheck({...old,bound:4,boundedChecked:true}).boundedChecked,true);
 assert.throws(()=>restoreModelCheck({...old,bound:5}));
});
test('blocking all entry preserves exclusion but prevents even one entry',()=>{
 for(let bound=0;bound<=4;bound++){
  assert.equal(boundedModelWitness('sealed',bound,'both'),null);
  assert.equal(boundedModelWitness('sealed',bound,'either'),null);
 }
 assert.equal(boundedModelWitness('atomic',1,'either'),null);
 const entering=boundedModelWitness('atomic',2,'either');
 assert.deepEqual(entering.path,['A：外 → 確認後','A：確認後 → 部屋の中']);
 assert.equal(boundedModelWitness('atomic',4,'both'),null);
 assert.throws(()=>boundedModelWitness('atomic',2,'bad'));
 const old=createModelCheck();delete old.boundedGoal;delete old.boundedVariant;
 const restored=restoreModelCheck(old);assert.equal(restored.boundedGoal,'both');assert.equal(restored.boundedVariant,'selected');
 assert.throws(()=>restoreModelCheck({...old,boundedVariant:'bad'}));assert.throws(()=>restoreModelCheck({...old,boundedGoal:'bad'}));
});
test('saved exploration is reconstructed, cannot run beyond exhaustion, and ignores forged states',()=>{
 const s=createModelCheck();s.trials.split=expandModel(s.trials.split);const copy=restoreModelCheck({...s,trials:{...s.trials,split:{steps:1,status:'violation'}}});assert.equal(copy.trials.split.status,'searching');assert.deepEqual(copy.trials.split.seen,['0,0','1,0','0,1']);assert.throws(()=>restoreModelCheck({...s,trials:{...s.trials,split:{steps:31}}}),RangeError);
});
