import {test} from 'node:test';
import assert from 'node:assert/strict';
import {abstractEvaluate,abstractCreate,abstractCheck,abstractComplete,abstractRestore} from '../src/abstract-mixin.js';

test('all four designs require the abstract delivery and mixin separately',()=>{
 assert.equal(abstractEvaluate('missing','without'),'abstract');assert.equal(abstractEvaluate('missing','with'),'abstract');assert.equal(abstractEvaluate('delivery','without'),'delivery');assert.equal(abstractEvaluate('delivery','with'),'bell');assert.throws(()=>abstractEvaluate('bad','with'));assert.throws(()=>abstractEvaluate('delivery','bad'));
});
test('completion and restoration require correct tests of all designs',()=>{
 const q=abstractCreate();for(const a of ['missing','delivery'])for(const b of ['without','with']){q.implementation=a;q.bell=b;const t=q.trials[`${a}:${b}`];t.guess='abstract';if(a==='delivery')assert.equal(abstractCheck(q),false);t.guess=abstractEvaluate(a,b);assert.equal(abstractCheck(q),true);assert.deepEqual(abstractRestore(q),q);}assert.equal(abstractComplete(q),false);q.answer='roles';assert.equal(abstractComplete(q),true);const bad=structuredClone(q);bad.trials['delivery:with'].guess='abstract';assert.throws(()=>abstractRestore(bad));const copy=abstractRestore(q);copy.trials['delivery:with'].checked=false;assert.equal(q.trials['delivery:with'].checked,true);
});
