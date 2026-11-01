import {test} from 'node:test';
import assert from 'node:assert/strict';
import {landscapeScore,landscapeMoves,createLandscape,landscapeAct,landscapeComplete,restoreLandscape} from '../src/landscape-shapes.js';
test('the fixed grid ridge has lower cardinal steps and an improving diagonal; the saddle has both signs',()=>{
 const center=landscapeScore('ridge',0,0);assert.equal(center,8);for(const p of Object.values(landscapeMoves).slice(0,4))assert.ok(landscapeScore('ridge',p.x,p.y)<center);assert.ok(landscapeScore('ridge',1,1)>center);
 assert.equal(landscapeScore('saddle',0,0),8);assert.ok(landscapeScore('saddle',1,0)>8);assert.ok(landscapeScore('saddle',0,1)<8);assert.equal(landscapeScore('saddle',1,1),8);assert.throws(()=>landscapeScore('bad',0,0),RangeError);
});
test('observations and conclusions must be checked, and the history can be replayed',()=>{
 let s=createLandscape();for(const a of ['look:east','answer:ridge','check'])s=landscapeAct(s,a).state;assert.equal(landscapeComplete(s),false);assert.deepEqual(restoreLandscape(s),s);assert.throws(()=>restoreLandscape({history:['look:bad']}),RangeError);
});
