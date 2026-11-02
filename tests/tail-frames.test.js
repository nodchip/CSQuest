import {test} from 'node:test';
import assert from 'node:assert/strict';
import {tailModes,tailActions,tailInitial,tailExpected,tailExecute,tailReplay,tailCreate,tailStep,tailCheck,tailComplete,tailRestore} from '../src/tail-frames.js';

for(const mode of Object.keys(tailModes))test(`${mode}: all inputs produce triangular sum with expected peak frames`,()=>{
 for(let n=0;n<=8;n++){const s=tailInitial(mode,n);while(tailExpected(s)){const expected=tailExpected(s);for(const wrong of Object.keys(tailActions).filter(a=>a!==expected))assert.throws(()=>tailExecute(structuredClone(s),wrong));tailExecute(s,expected);}assert.equal(s.result,n*(n+1)/2);assert.equal(s.peak,mode==='tailReuse'?1:n+1);assert.equal(s.stack.length,0);assert.throws(()=>tailExecute(s,'base'));}
});
test('all scenarios, correct peak and explanation are required; restore validates histories',()=>{
 const q=tailCreate();for(const mode of Object.keys(tailModes)){q.selected=mode;while(true){const s=tailReplay(mode,q.trials[mode].history),next=tailExpected(s);if(!next)break;tailStep(q,next);assert.deepEqual(tailRestore(q),q);}const t=q.trials[mode];t.guess=3;assert.equal(tailCheck(q),false);t.guess=mode==='tailReuse'?1:4;assert.equal(tailCheck(q),true);}assert.equal(tailComplete(q),false);q.answer='pending';assert.equal(tailComplete(q),true);const bad=structuredClone(q);bad.trials.ordinary.history=['replace'];assert.throws(()=>tailRestore(bad));
});
