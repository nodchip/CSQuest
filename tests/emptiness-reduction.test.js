import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reductionTrace,reductionRequired,createEmptinessReduction,emptinessReductionComplete,restoreEmptinessReduction} from '../src/emptiness-reduction.js';

test('門は入力を無視し、元の機械の停止に応じて受理する',()=>{
 for(const probe of ['0','1']){
  assert.equal(reductionTrace('full','early',probe,1).status,'running');assert.equal(reductionTrace('full','early',probe,2).status,'accept');
  assert.equal(reductionTrace('full','late',probe,2).status,'running');assert.equal(reductionTrace('full','late',probe,5).status,'accept');
  for(let step=0;step<=5;step++)assert.equal(reductionTrace('full','loop',probe,step).status,'running');
  assert.equal(reductionTrace('cutoff','late',probe,2).status,'reject');assert.equal(reductionTrace('cutoff','early',probe,2).status,'accept');
 }
 assert.throws(()=>reductionTrace('full','early','0',3),RangeError);assert.throws(()=>reductionTrace('cutoff','late','0',3),RangeError);
});
test('６観察と仮定の判定器の両結果と帰着の向きが必要',()=>{
 const s=createEmptinessReduction();s.observed=[...reductionRequired];s.empty='not-halt';s.nonempty='halt';s.direction='construct';assert.equal(emptinessReductionComplete(s),false);s.checked=true;assert.equal(emptinessReductionComplete(s),true);
 const r=restoreEmptinessReduction(s);r.observed.pop();assert.equal(s.observed.length,6);
 for(const p of [{steps:3},{mode:'bad'},{probe:'2'},{observed:['full,early,0,3']},{observed:['full,early,0,2','full,early,0,2']},{empty:'bad'},{checked:1}])assert.throws(()=>restoreEmptinessReduction({...s,...p}),RangeError);
});
