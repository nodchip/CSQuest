import test from 'node:test';
import assert from 'node:assert/strict';
import {proofMethods,proofOutlineCases,proofOutlineReplay,proofOutlineStep,proofOutlinesCreate,proofOutlinesComplete,proofOutlinesRestore} from '../src/proof-outlines.js';

test('each outline requires its method and all four steps in order',()=>{
 const q=proofOutlinesCreate();
 for(const [id,c] of Object.entries(proofOutlineCases)){
  let history=[];for(const m of Object.keys(proofMethods).filter(m=>m!==c.method))assert.equal(proofOutlineStep(id,history,`method:${m}`).ok,false);
  history=proofOutlineStep(id,history,`method:${c.method}`).history;
  for(let i=0;i<c.order.length;i++){
   for(const card of Object.keys(c.cards).filter(card=>card!==c.order[i]))assert.equal(proofOutlineStep(id,history,`card:${card}`).ok,false);
   history=proofOutlineStep(id,history,`card:${c.order[i]}`).history;
  }
  assert.equal(proofOutlineReplay(id,history).done,true);q.trials[id]=history;
 }
 assert.equal(proofOutlinesComplete(q),false);q.reflection='multiple';assert.equal(proofOutlinesComplete(q),true);
 const copy=proofOutlinesRestore(q);copy.trials.even.pop();assert.equal(proofOutlinesComplete(copy),false);assert.equal(proofOutlinesComplete(q),true);
});
test('invalid or forged proof histories cannot be restored',()=>{
 assert.throws(()=>proofOutlineReplay('even',['method:direct','card:combine']));assert.throws(()=>proofOutlineReplay('nests',['method:induction']));
 const q=proofOutlinesCreate();q.trials.odd=['method:induction','card:bad'];assert.throws(()=>proofOutlinesRestore(q));
});
