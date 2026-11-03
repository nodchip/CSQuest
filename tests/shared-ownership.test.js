import test from 'node:test';
import assert from 'node:assert/strict';
import {ownershipActions,ownershipReplay,ownershipStep,ownershipDone,ownershipCreate,ownershipComplete,ownershipRestore} from '../src/shared-ownership.js';

const plans={raw:['read','remove','retain'],locked:['lock','read','retain','unlock','remove','touch','release'],before:['acquire','remove','touch','release'],after:['remove','acquire']};
test('the fixed histories distinguish stale raw pointers, protected ownership and an empty acquisition',()=>{
 for(const [id,actions] of Object.entries(plans)){let history=[];for(const action of actions){for(const wrong of Object.keys(ownershipActions).filter(x=>x!==action))assert.equal(ownershipStep(id,history,wrong).ok,false);const next=ownershipStep(id,history,action);assert.equal(next.ok,true);history=next.history;}assert.equal(ownershipDone(id,history),true);const state=ownershipReplay(id,history);assert.equal(state.count,0);assert.equal(state.freed,true);if(id==='raw')assert.equal(state.unsafe,true);if(id==='locked'||id==='before')assert.equal(state.touched,true);if(id==='after')assert.equal(state.empty,true);}
 const retained=ownershipReplay('locked',['lock','read','retain','unlock','remove']);assert.equal(retained.count,1);assert.equal(retained.freed,false);assert.equal(retained.owned,true);
});
test('all four histories and reflection are required and saved history is validated',()=>{
 const s=ownershipCreate();for(const [id,actions] of Object.entries(plans))s.trials[id]=[...actions];assert.equal(ownershipComplete(s),false);s.reflection='acquire';assert.equal(ownershipComplete(s),true);const copy=ownershipRestore(s);copy.trials.before.pop();assert.equal(ownershipComplete(copy),false);assert.equal(ownershipComplete(s),true);copy.trials.raw=['retain'];assert.throws(()=>ownershipRestore(copy));
});
