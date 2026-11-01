import test from 'node:test';
import assert from 'node:assert/strict';
import {recursiveCases,createRecursiveCargo,prependRecursive,startRecursive,stepRecursive,recursiveCargoComplete,restoreRecursiveCargo} from '../src/recursive-cargo.js';
test('all sequences of up to three prepends build in reverse order and cap safely',()=>{
 function walk(t,sequence,n){assert.deepEqual(t.items,[...sequence].reverse());if(n)for(const x of ['moon','star'])walk(prependRecursive(t,x).trial,[...sequence,x],n-1);else assert.equal(prependRecursive(t,'moon').trial.items.length,3);}
 walk(createRecursiveCargo().trials.short,[],3);
});
test('both target lists require their own traversal including the empty case',()=>{
 let s=createRecursiveCargo();for(const [id,c] of Object.entries(recursiveCases)){
  let t=s.trials[id];assert.equal(startRecursive(id,t).trial.phase,'build');
  for(const stone of [...c.target].reverse())t=prependRecursive(t,stone).trial;
  t=startRecursive(id,t).trial;assert.equal(stepRecursive(t,'empty').trial.cursor,0);
  for(let i=0;i<c.target.length;i++)t=stepRecursive(t,'cons').trial;
  assert.equal(stepRecursive(t,'cons').trial.phase,'walk');t=stepRecursive(t,'empty').trial;s.trials[id]=t;
 }
 assert.equal(recursiveCargoComplete(s),false);s.answer='recursive';s.checked=true;assert.ok(recursiveCargoComplete(restoreRecursiveCargo(s)));
 assert.throws(()=>restoreRecursiveCargo({...s,trials:{...s.trials,short:{items:['star'],phase:'done',cursor:1}}}));
});
