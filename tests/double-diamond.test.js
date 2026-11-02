import {test} from 'node:test';
import assert from 'node:assert/strict';
import {diamondPeople,diamondOptions,diamondCreate,diamondStep,diamondComplete,diamondRestore} from '../src/double-diamond.js';

test('observations, framing, varied prototypes and reflection are all needed',()=>{
 const q=diamondCreate();assert.throws(()=>diamondStep(q,'frame:access'));for(const id of Object.keys(diamondPeople)){diamondStep(q,`hear:${id}`);assert.deepEqual(diamondRestore(q),q);}diamondStep(q,'frame:public');assert.throws(()=>diamondStep(q,'test:paper'));diamondStep(q,'frame:access');assert.throws(()=>diamondStep(q,'choose:combined'));for(const id of Object.keys(diamondOptions)){diamondStep(q,`test:${id}`);assert.deepEqual(diamondRestore(q),q);}diamondStep(q,'choose:paper');diamondStep(q,'reflect:iterate');assert(!diamondComplete(q));diamondStep(q,'choose:combined');assert(diamondComplete(q));diamondStep(q,'frame:access');assert.deepEqual(q.tested,[]);assert(!diamondComplete(q));
});
test('restore rejects duplicate, unknown and impossible progress',()=>{
 for(const bad of [{...diamondCreate(),heard:['ao','ao']},{...diamondCreate(),tested:['combined']},{...diamondCreate(),choice:'combined'},{...diamondCreate(),heard:['fake']}])assert.throws(()=>diamondRestore(bad));
});
