import test from 'node:test';
import assert from 'node:assert/strict';
import {lifecycleCases,lifecycleSequence,lifecycleReplay,createThreadLifecycle,threadLifecycleComplete,restoreThreadLifecycle} from '../src/thread-lifecycle.js';
test('early join blocks, late join retains result, and detached completion releases its record',()=>{
 const early=lifecycleSequence('early');assert.equal(lifecycleReplay('early',early.slice(0,2)).parent,'終了待ち');assert.deepEqual(lifecycleReplay('early',early),{parent:'実行可能',child:'終了',joinable:false,record:'解放済み',result:7,inspection:null});
 const late=lifecycleSequence('late');const waiting=lifecycleReplay('late',late.slice(0,2));assert.equal(waiting.child,'終了');assert.equal(waiting.record,'保持中');assert.equal(waiting.result,null);assert.equal(lifecycleReplay('late',late).result,7);
 const detached=lifecycleReplay('detached',lifecycleSequence('detached'));assert.equal(detached.record,'解放済み');assert.equal(detached.result,null);assert.equal(detached.inspection,'合流できない');assert.throws(()=>lifecycleReplay('detached',['create','join']));
});
test('replay validates all journeys and reflection',()=>{
 const s=createThreadLifecycle();for(const id of Object.keys(lifecycleCases))s.histories[id]=lifecycleSequence(id);s.answer='limits';s.checked=true;assert.ok(threadLifecycleComplete(s));assert.deepEqual(restoreThreadLifecycle(s),s);s.histories.early.pop();assert.equal(threadLifecycleComplete(s),false);assert.throws(()=>restoreThreadLifecycle({...s,histories:{...s.histories,late:['finish']}}));
});
