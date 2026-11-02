import test from 'node:test';
import assert from 'node:assert/strict';
import {pathEnds,pathValue,pathSummary,pathTheory,pathCreate,pathChoose,pathRestore,pathComplete} from '../src/path-sampling.js';
test('four paths and all independent pairs yield the exact mean and variance',()=>{
 assert.deepEqual(Object.keys(pathEnds).map(pathValue),[2,0,1,0]);assert.deepEqual(pathSummary(['AA','AB','BA','BB']).mean,0.75);
 assert.equal(pathTheory(1).mean,0.75);assert.equal(pathTheory(1).variance,0.6875);assert.equal(pathTheory(2).mean,0.75);assert.equal(pathTheory(2).variance,0.34375);assert.equal(pathTheory(2).outcomes.length,16);
 assert.equal(pathSummary(['AA','AA']).mean,2);assert.throws(()=>pathValue('AC'));
});
test('partial path restores and completing all routes and reflections is required',()=>{
 const q=pathCreate();pathChoose(q,'A');q.depth=2;pathChoose(q,'B');assert.deepEqual(pathRestore(q),q);assert.throws(()=>pathRestore({...q,depth:1}));pathChoose(q,'A');for(const route of ['AA','AB','BB'])for(const d of route)pathChoose(q,d);q.indirect='bounce';assert.equal(pathComplete(q),false);q.sampling='random';assert.equal(pathComplete(q),true);
});
