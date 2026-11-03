import test from 'node:test';
import assert from 'node:assert/strict';
import {methodHashCreate,methodHashState,methodHashStep,methodHashDone,methodHashRestore} from '../src/method-hash-lookup.js';

test('collisions require comparing names and an empty slot proves absence in this table',()=>{
 assert.deepEqual(methodHashState('light',[1]),{next:null,result:'found',value:'火を灯す'});
 assert.deepEqual(methodHashState('heal',[1]),{next:2,result:null,value:null});
 assert.deepEqual(methodHashState('heal',[1,2]),{next:null,result:'found',value:'傷を癒やす'});
 assert.deepEqual(methodHashState('wave',[1,2,3]),{next:null,result:'absent',value:null});
 assert.throws(()=>methodHashState('wave',[1,3]));assert.throws(()=>methodHashState('light',[1,2]));
});
test('wrong steps do not change history and restore validates every path',()=>{
 const q=methodHashCreate();assert.equal(methodHashStep(q,2),false);assert.deepEqual(q.trials.light,[]);assert.equal(methodHashStep(q,1),true);
 q.selected='heal';assert.equal(methodHashStep(q,1),true);assert.equal(methodHashStep(q,2),true);
 q.selected='wave';for(const n of [1,2,3])assert.equal(methodHashStep(q,n),true);
 q.answer='compare';assert.equal(methodHashDone(q),false);q.checked=true;assert.equal(methodHashDone(q),true);
 const r=methodHashRestore(q);r.trials.wave.pop();assert.equal(q.trials.wave.length,3);
 q.trials.wave=[1,3];assert.throws(()=>methodHashRestore(q));
});
