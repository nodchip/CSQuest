import test from 'node:test';
import assert from 'node:assert/strict';
import {rendezvousModes,createRendezvousTrial,rendezvousStep,createRendezvous,rendezvousComplete,restoreRendezvous} from '../src/rendezvous.js';
test('all valid interleavings deadlock with two sends first and finish with complementary first operations',()=>{
 for(const id of Object.keys(rendezvousModes)){const stack=[createRendezvousTrial(id)];let terminal=0;while(stack.length){const s=stack.pop();if(s.status!=='playing'){terminal++;assert.equal(s.status,id==='blocked'?'deadlock':'done');if(s.status==='done')assert.deepEqual(s.received,{a:true,b:true});continue;}for(const actor of ['a','b']){const n=rendezvousStep(s,actor);if(n.history.length>s.history.length)stack.push(n);}}assert.ok(terminal>0);}
});
test('trials restore by replay; waiting actors and invalid histories cannot advance',()=>{
 const s=createRendezvous();s.trials.blocked=rendezvousStep(rendezvousStep(s.trials.blocked,'a'),'b');for(const actor of ['a','b','a','b'])s.trials.ordered=rendezvousStep(s.trials.ordered,actor);assert.equal(rendezvousComplete(s),true);const r=restoreRendezvous({selected:'ordered',histories:{blocked:s.trials.blocked.history,ordered:s.trials.ordered.history}});assert.equal(rendezvousComplete(r),true);assert.throws(()=>restoreRendezvous({selected:'ordered',histories:{blocked:['a','a'],ordered:[]}}),RangeError);
});
