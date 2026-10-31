import test from 'node:test';
import assert from 'node:assert/strict';
import {histogramCases,histogramBins,histogramBin,createHistogram,histogramStep,restoreHistogram,histogramComplete} from '../src/histogram.js';

test('half-open bin boundaries assign each possible integer once',()=>{
 assert.deepEqual(Array.from({length:9},(_,n)=>histogramBin(n)),['low','low','low','middle','middle','middle','high','high','high']);assert.throws(()=>histogramBin(9),RangeError);assert.throws(()=>histogramBin(-1),RangeError);
});
test('two equal means yield independently counted different distributions',()=>{
 const expected={wide:[4,2,4],narrow:[0,10,0]};for(const [id,task] of Object.entries(histogramCases)){const mean=task.values.reduce((a,b)=>a+b,0)/task.values.length;assert.equal(mean,4);let state=createHistogram().states[id];for(const n of task.values){const bin=histogramBin(n),wrong=Object.keys(histogramBins).find(key=>key!==bin);assert.equal(histogramStep(state,wrong).index,state.index);state=histogramStep(state,bin);}assert.deepEqual(Object.values(state.counts),expected[id]);assert.deepEqual(expected[id],[[0,3],[3,6],[6,9]].map(([a,b])=>task.values.filter(x=>x>=a&&x<b).length));}
});
test('both trials are required and saved indices restore safely',()=>{
 const set=createHistogram();for(const id of Object.keys(histogramCases))for(const n of histogramCases[id].values)set.states[id]=histogramStep(set.states[id],histogramBin(n));assert.equal(histogramComplete(set),true);assert.deepEqual(restoreHistogram({selected:'wide',indices:{wide:10,narrow:10}}),set);assert.throws(()=>restoreHistogram({selected:'wide',indices:{wide:11,narrow:0}}),RangeError);
});
