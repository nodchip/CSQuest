import test from 'node:test';
import assert from 'node:assert/strict';
import {createInversionTrial,inversionPriorities,inversionNext,inversionStep,inversionDone,createInversion,inversionComplete,restoreInversion} from '../src/inversion.js';
test('priority inheritance raises the lock holder while high waits and shortens its completion',()=>{
 for(const [mode,order,highAt] of [['plain',['low','medium','medium','medium','low','high'],6],['inherit',['low','low','high','medium','medium','medium'],3]]){let s=createInversionTrial(mode);for(const [i,actor] of order.entries()){assert.equal(inversionNext(s),actor);if(i===1){const p=inversionPriorities(s);assert.equal(p.waiting,true);assert.equal(p.low,mode==='inherit'?3:1);}for(const wrong of ['low','medium','high'].filter(x=>x!==actor))assert.equal(inversionStep(s,wrong).history.length,s.history.length);s=inversionStep(s,actor);}assert.equal(s.highFinished,highAt);assert.equal(inversionDone(s),true);}
});
test('both traces replay and invalid scheduling is rejected',()=>{
 const s=createInversion();for(const a of ['low','medium','medium','medium','low','high'])s.trials.plain=inversionStep(s.trials.plain,a);for(const a of ['low','low','high','medium','medium','medium'])s.trials.inherit=inversionStep(s.trials.inherit,a);assert.equal(inversionComplete(s),true);const saved={selected:'inherit',histories:{plain:s.trials.plain.history,inherit:s.trials.inherit.history}};assert.equal(inversionComplete(restoreInversion(saved)),true);assert.throws(()=>restoreInversion({selected:'plain',histories:{plain:['high'],inherit:[]}}),RangeError);
});
