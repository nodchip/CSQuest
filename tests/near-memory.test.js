import test from 'node:test';
import assert from 'node:assert/strict';
import {nearValues,nearCases,nearModes,nearReplay,nearCreate,nearRestore,nearComplete} from '../src/near-memory.js';
test('every request and placement yields the same sum with the expected external transfer',()=>{
 const expected={sum:{cpu:8,near:1},all:{cpu:8,near:8}};
 for(const scenario of Object.keys(nearCases))for(const mode of Object.keys(nearModes)){
  const actions=mode==='cpu'?['send',...nearValues.map(()=> 'scan')]:[...nearValues.map(()=> 'scan'),'send'];
  const r=nearReplay(scenario,mode,actions);assert.equal(r.total,24);assert.equal(r.words,expected[scenario][mode]);assert.equal(r.done,true);
  assert.throws(()=>nearReplay(scenario,mode,[...actions,'scan']));assert.throws(()=>nearReplay(scenario,mode,[...actions,'send']));
 }
 assert.throws(()=>nearReplay('sum','cpu',['scan']));assert.throws(()=>nearReplay('sum','near',['send']));
});
test('valid history survives restore and all four completed trials and reflection are needed',()=>{
 const q=nearCreate();q.trials.sum.near=['scan','scan'];assert.deepEqual(nearRestore(q),q);assert.throws(()=>nearRestore({...q,trials:{...q.trials,sum:{...q.trials.sum,near:['send']}}}));
 for(const s of Object.keys(nearCases))for(const m of Object.keys(nearModes))q.trials[s][m]=m==='cpu'?['send',...nearValues.map(()=>'scan')]:[...nearValues.map(()=>'scan'),'send'];
 assert.equal(nearComplete(q),false);q.answer='tradeoff';assert.equal(nearComplete(q),true);
});
