import test from 'node:test';
import assert from 'node:assert/strict';
import {corpusPath,corpusReplay,corpusCreate,corpusRestore,corpusComplete} from '../src/fuzz-corpus.js';

test('only new non-crashing paths become seeds and failures are recorded separately',()=>{
 assert.deepEqual(Array.from({length:8},(_,i)=>corpusPath(i)),['low','low','low','low','middle','middle','deep','crash']);
 const history=[[0,1],[0,2],[4,0],[4,1],[6,0]],s=corpusReplay(history);
 assert.deepEqual(s.seeds,[0,4,6]);assert.deepEqual(s.events.map(e=>e.value),[2,4,5,6,7]);
 assert.deepEqual(s.events.map(e=>e.novel),[false,true,false,true,true]);assert.equal(s.repeated,true);assert.equal(s.crash,true);
 const q={...corpusCreate(),seed:6,history,reflection:'limits'};assert.equal(corpusComplete(q),true);
 const copy=corpusRestore(q);copy.history[0][0]=6;assert.equal(q.history[0][0],0);
});
test('replay rejects forged seeds and completion requires both repeated path and crash',()=>{
 assert.throws(()=>corpusReplay([[4,1]]));assert.throws(()=>corpusReplay([[0,3]]));assert.throws(()=>corpusReplay(Array(33).fill([0,0])));
 const q={...corpusCreate(),history:[[0,2],[4,1],[6,0]],reflection:'limits'};assert.equal(corpusComplete(q),false);
 q.history.unshift([0,0]);assert.equal(corpusComplete(q),true);assert.throws(()=>corpusRestore({...q,seed:7}));
});
