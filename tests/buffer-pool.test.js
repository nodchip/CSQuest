import test from 'node:test';
import assert from 'node:assert/strict';
import {createBufferPool,bufferPoolStep,bufferPoolComplete,restoreBufferPool} from '../src/buffer-pool.js';
test('pinned and dirty pages cannot be removed before the dirty page is written',()=>{
 let s=createBufferPool();s=bufferPoolStep(s,'evict1');assert.equal(s.pinBlocked,true);assert.equal(s.page2,true);
 s=bufferPoolStep(s,'evict2');assert.equal(s.dirtyBlocked,true);assert.equal(s.page2,true);assert.equal(bufferPoolComplete(s),false);
 for(const action of ['write2','evict2','load3'])s=bufferPoolStep(s,action);
 assert.equal(bufferPoolComplete(s),true);assert.deepEqual(restoreBufferPool(s),s);
 assert.throws(()=>restoreBufferPool({history:['load3']}));assert.throws(()=>bufferPoolStep(s,'invalid'));
});
