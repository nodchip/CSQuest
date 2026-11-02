import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fragmentCases,fragmentResult,fragmentCreate,fragmentRun,fragmentComplete,fragmentRestore} from '../src/fragment-graph.js';

test('all settings compute the fixed light samples and display channels independently',()=>{
 for(const a of [0,20])for(const g of [4,8,10])for(const clamp of [false,true]){const r=fragmentResult(a,g,clamp);for(let i=0;i<3;i++){const raw=a+g*[0,5,10][i],expected=clamp?Math.min(raw,100):raw;assert.equal(r.raw[i],raw);assert.equal(r.values[i],expected);assert.deepEqual(r.rgb[i],[240,120,60].map(c=>Math.min(255,Math.round(c*expected/100))));}}
 assert.deepEqual(fragmentResult(20,10,false).values,[20,70,120]);assert.deepEqual(fragmentResult(20,10,true).values,[20,70,100]);assert.throws(()=>fragmentResult(10,4,true));
});
test('each requirement accepts any equivalent matching settings, with valid saved trials and reflections',()=>{
 let q=fragmentCreate();q.ambient=20;for(const [id,gain,clamp] of [['shadow',8,false],['bright',10,true],['night',4,true]]){q.selected=id;q.gain=gain;q.clamp=clamp;fragmentRun(q);q=fragmentRestore(q);assert.deepEqual(fragmentResult(q.ambient,q.gain,q.clamp).values,fragmentCases[id].target);}q.stageAnswer='vertex';q.rangeAnswer='limit';assert.equal(fragmentComplete(q),false);q.stageAnswer='fragment';assert.equal(fragmentComplete(q),true);const copy=fragmentRestore(q);copy.runs.bright.length=0;assert.equal(fragmentComplete(copy),false);assert.equal(fragmentComplete(q),true);assert.throws(()=>fragmentRestore({...q,runs:{...q.runs,night:['20:04:1']}}));
});
