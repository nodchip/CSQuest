import test from 'node:test';
import assert from 'node:assert/strict';
import {createComposition,buildComposition,switchComposition,compositionComplete,restoreComposition} from '../src/composition-design.js';

test('all combinations can be built and the specified swap preserves the instance state',()=>{
 let s=createComposition();assert.throws(()=>switchComposition(s));
 for(const mode of ['inherit','compose']){s={...s,mode};for(const movement of ['walk','fly'])for(const signal of ['light','bell']){s={...s,movement,signal};s=buildComposition(s);assert.deepEqual(s.machines[mode],{movement,signal,energy:2});}assert.equal(s.tried[mode],15);const before=s.machines[mode];s=switchComposition(s);assert.equal(s.machines[mode].energy,2);assert.equal(s.machines[mode].movement,before.movement);assert.equal(s.machines[mode].signal,mode==='inherit'?before.signal:(before.signal==='bell'?'light':'bell'));}
 s={...s,countInherit:2,countCompose:1,answer:'tradeoff',checked:true};assert.equal(compositionComplete(s),true);assert.equal(compositionComplete({...s,countCompose:2}),false);
});
test('restoration validates and copies independent machine state',()=>{
 let s=buildComposition(createComposition());s=switchComposition(s);const r=restoreComposition(s);r.machines.inherit.energy=0;assert.equal(s.machines.inherit.energy,2);assert.throws(()=>restoreComposition({...s,tried:{...s.tried,inherit:16}}));assert.throws(()=>restoreComposition({...s,machines:{...s.machines,inherit:null}}));
});
