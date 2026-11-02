import {test} from 'node:test';
import assert from 'node:assert/strict';
import {groverTargets,groverSteps,groverReplay,groverCreate,groverStep,groverComplete,groverRestore} from '../src/grover-search.js';

for(const target of groverTargets)test(`Grover ${target}: phase flip and reflection preserve norm and amplify then overshoot`,()=>{
 const h=[];for(const action of groverSteps){const before=groverReplay(target,h);assert.throws(()=>groverReplay(target,[...h,'wrong']));h.push(action);const s=groverReplay(target,h);assert.equal(s.probabilities.reduce((a,b)=>a+b,0),1);if(action==='oracle')assert.deepEqual(s.probabilities,before.probabilities);if(h.length===2)assert.equal(s.probabilities[groverTargets.indexOf(target)],1);if(h.length===5)assert.deepEqual(s.probabilities,[.25,.25,.25,.25]);}
 assert.equal(groverReplay(target,h).next,null);assert.throws(()=>groverReplay(target,[...h,'oracle']));
});
test('all marked doors and reflection are required; invalid histories cannot restore',()=>{
 const q=groverCreate();for(const t of groverTargets){q.target=t;for(const a of groverSteps){groverStep(q,a);assert.deepEqual(groverRestore(q),q);}}assert(!groverComplete(q));q.answer='rotate';assert(groverComplete(q));const invalid=structuredClone(q);invalid.histories['00'][2]='predict:25';assert.throws(()=>groverRestore(invalid));
});
