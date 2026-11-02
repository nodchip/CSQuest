import {test} from 'node:test';
import assert from 'node:assert/strict';
import {addressingCases,addressingAddresses,addressingValues,addressingCreate,addressingMemory,addressingWrite,addressingRead,addressingComplete,addressingRestore} from '../src/memory-addressing.js';

test('all direct, indirect and indexed guesses are checked against the selected location',()=>{
 const memory={10:100,11:100,100:7,101:12,102:5},expected={direct:10,indirect:memory[10],indexed:memory[10]+1};
 for(const [id,address] of Object.entries(expected))for(const a of addressingAddresses)for(const value of addressingValues){const q=addressingCreate();q.selected=id;const t=q.trials[id];t.address=a;t.guess=value;assert.equal(addressingRead(q),a===address&&value===memory[address]);}
});
test('alias writes through Q and P sees the same location; invalid write cannot change memory',()=>{
 const q=addressingCreate();q.selected='alias';const t=q.trials.alias;assert.equal(addressingRead(q),false);for(const a of addressingAddresses.filter(x=>x!==100)){t.address=a;assert.equal(addressingWrite(q),false);assert.equal(addressingMemory(t)[100],7);}t.address=100;assert.equal(addressingWrite(q),true);assert.equal(addressingMemory(t)[100],9);t.address=100;t.guess=7;assert.equal(addressingRead(q),false);t.guess=9;assert.equal(addressingRead(q),true);assert.equal(addressingWrite(q),false);
});
test('restoration checks trial evidence and completion requires all cases and reflection',()=>{
 const q=addressingCreate();for(const [id,c] of Object.entries(addressingCases)){q.selected=id;const t=q.trials[id];if(id==='alias'){t.address=100;assert.ok(addressingWrite(q));}t.address=c.address;t.guess=c.value;assert.ok(addressingRead(q));assert.deepEqual(addressingRestore(q),q);}assert.equal(addressingComplete(q),false);q.answer='alias';assert.equal(addressingComplete(q),true);const bad=structuredClone(q);bad.trials.alias.wrote=false;assert.throws(()=>addressingRestore(bad));bad.trials.alias.wrote=true;bad.trials.alias.guess=7;assert.throws(()=>addressingRestore(bad));
});
