import test from 'node:test';
import assert from 'node:assert/strict';
import {replayVectors} from '../src/endgame-vectors.js';
test('head-to-tail addition is independent of vector order',()=>{
 const actions=['right','up','up','up','check','up','up','up','right','check','left','up','check'];
 assert.deepEqual(replayVectors('add',actions).results.map(r=>r.point),[[1,3],[1,3],[-1,1]]);
 assert.equal(replayVectors('add',['right','up','check']),null);
 assert.equal(replayVectors('add',Array(5).fill('right')),null);
});
test('scalar multiplication includes negative and zero',()=>{
 const actions=['right','right','up','up','up','up','check','left','down','down','check','check'];
 assert.deepEqual(replayVectors('scale',actions).results.map(r=>r.point),[[2,4],[-1,-2],[0,0]]);
 assert.equal(replayVectors('scale',['right','up','check']),null);
});
test('coefficients depend on basis while the resultant remains the same',()=>{
 const actions=['a:+','b:+','b:+','check','a:+','a:+','a:+','b:+','b:+','check'];
 assert.deepEqual(replayVectors('basis',actions).results,[{point:[3,2],a:1,b:2},{point:[3,2],a:3,b:2}]);
 assert.equal(replayVectors('basis',['a:+','b:+','check']),null);
 assert.equal(replayVectors('basis',Array(4).fill('a:+')),null);
});
