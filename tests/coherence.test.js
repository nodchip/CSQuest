import test from 'node:test';
import assert from 'node:assert/strict';
import {coherenceModes,coherenceActions,createCoherence,coherenceStep,restoreCoherence,coherenceComplete} from '../src/coherence.js';

test('a stale copy persists without invalidation but the invalidated copy reloads memory',()=>{
  for(const mode of Object.keys(coherenceModes)){let s=createCoherence().states[mode];for(const action of ['read0','read0','write'])s=coherenceStep(s,action);
    assert.equal(s.memory,1);assert.equal(s.caches.A,1);assert.equal(s.caches.B,mode==='silent'?0:null);
    const expected=mode==='silent'?0:1;assert.equal(coherenceStep(s,expected?'read0':'read1').index,s.index);s=coherenceStep(s,`read${expected}`);
    assert.equal(s.history.at(-1).value,expected);assert.equal(s.history.at(-1).source,mode==='silent'?'cache':'memory');assert.throws(()=>coherenceStep(s,'read0'),RangeError);
  }
});
test('both trials are required and saved steps reproduce the cache state',()=>{
  const set=createCoherence();for(const mode of Object.keys(coherenceModes)){let s=set.states[mode];for(const action of ['read0','read0','write',mode==='silent'?'read0':'read1'])s=coherenceStep(s,action);set.states[mode]=s;}assert.equal(coherenceComplete(set),true);
  const saved={selected:'silent',steps:{silent:coherenceActions.length,invalidate:coherenceActions.length}};assert.deepEqual(restoreCoherence(saved),set);assert.throws(()=>restoreCoherence({...saved,steps:{silent:5,invalidate:0}}),RangeError);
});
