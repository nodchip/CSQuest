import test from 'node:test';
import assert from 'node:assert/strict';
import {reduceImage,expandImage,imageExamples,replayResample} from '../src/endgame-resample.js';

test('two different pictures become identical while a uniform picture survives',()=>{
 const [a,b,c]=imageExamples.map(reduceImage);
 assert.deepEqual(a,[false,false,false,false]);assert.deepEqual(b,a);assert.deepEqual(c,[true,true,true,true]);
 assert.deepEqual(expandImage(a),Array(16).fill(false));assert.deepEqual(expandImage(c),imageExamples[2]);
 assert.equal(reduceImage([false]),null);assert.equal(expandImage([true]),null);
});
test('sampling requires the four specified pixels and can be corrected before reducing',()=>{
 const one=['cell:1','cell:1','cell:0','cell:2','cell:8','cell:10','reduce','expand','next'];
 const result=replayResample([...one,...one,...one,'ambiguous']);
 assert.equal(result.done,true);assert.equal(result.results.length,3);
 assert.deepEqual(result.results[0].small,result.results[1].small);
 assert.equal(replayResample(['cell:0','reduce']),null);
 assert.equal(replayResample(['cell:16']),null);
 assert.equal(replayResample([...one,...one,...one,'certain']),null);
});
