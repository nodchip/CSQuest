import test from 'node:test';
import assert from 'node:assert/strict';
import {replayMatrix} from '../src/endgame-matrix.js';

test('matrix rows produce separate coordinates for two input vectors',()=>{
 const p=replayMatrix('shear',['answer:4','answer:1','next','answer:3','answer:2','next']);assert.equal(p.done,true);assert.deepEqual(p.results.map(x=>x.output),[[4,1],[3,2]]);
 assert.equal(replayMatrix('shear',['answer:3']),null);
});
test('the rotation maps x right and y up counterclockwise',()=>{
 const p=replayMatrix('rotate',['answer:-1','answer:2','next','answer:-1','answer:-2','next']);assert.equal(p.done,true);assert.deepEqual(p.results.map(x=>x.output),[[-1,2],[-1,-2]]);
});
test('composing the two maps in opposite orders gives different results',()=>{
 const p=replayMatrix('compare',['answer:4','answer:1','next','answer:-1','answer:4','next','answer:-1','answer:2','next','answer:3','answer:2','next']);assert.equal(p.done,true);assert.deepEqual(p.results.map(x=>x.output),[[4,1],[-1,4],[-1,2],[3,2]]);
 assert.equal(replayMatrix('compare',['answer:4','next']),null);
});
