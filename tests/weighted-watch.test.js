import test from 'node:test';
import assert from 'node:assert/strict';
import {ensembleTruth,ensembleVotes} from '../src/watch-ensemble.js';
import {weightedWatchResult,createWeightedWatch,weightedWatchComplete,restoreWeightedWatch} from '../src/weighted-watch.js';

test('all 27 weight choices match independently summed votes and the stated tie rule',()=>{
 for(let a=1;a<=3;a++)for(let b=1;b<=3;b++)for(let c=1;c<=3;c++){
  const weights=[a,b,c],r=weightedWatchResult(weights);let correct=0,ties=0;
  for(let i=0;i<6;i++){let yes=0,no=0;for(let j=0;j<3;j++)if(ensembleVotes.different[j][i])yes+=weights[j];else no+=weights[j];const alert=yes>no;if(alert===ensembleTruth[i])correct++;if(yes===no)ties++;assert.deepEqual([r.rows[i].alarmWeight,r.rows[i].passWeight,r.rows[i].alert],[yes,no,alert]);}
  assert.deepEqual([r.correct,r.ties],[correct,ties]);
 }
 assert.deepEqual([[1,1,1],[2,1,1],[3,1,1]].map(w=>weightedWatchResult(w).correct),[6,5,4]);
});
test('completion requires each comparison and persists independent arrays',()=>{
 const s=createWeightedWatch();s.observed=['1,1,1','2,1,1','3,1,1'];s.answer='depends';s.checked=true;const restored=restoreWeightedWatch(s);assert.equal(weightedWatchComplete(restored),true);restored.weights[0]=3;assert.equal(s.weights[0],1);assert.equal(weightedWatchComplete({...s,answer:'always'}),false);assert.throws(()=>restoreWeightedWatch({...s,observed:['1,1,1','1,1,1']}));
});
