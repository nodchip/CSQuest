import {test} from 'node:test';
import assert from 'node:assert/strict';
import {flockResult,flockCreate,flockCheck,flockComplete,flockRestore} from '../src/flock-rules.js';

test('all eight combinations agree with independently calculated velocity and position vectors',()=>{
 const expected=[[[0,1,1],[1,3,4]],[[1,0,0],[2,2,3]],[[1,1,0],[2,3,3]],[[2,0,-1],[3,2,2]],[[-1,1,2],[0,3,5]],[[0,0,1],[1,2,4]],[[0,1,1],[1,3,4]],[[1,0,0],[2,2,3]]];
 for(let mask=0;mask<8;mask++){const r=flockResult(mask);assert.deepEqual(r.map(b=>b.v),expected[mask][0]);assert.deepEqual(r.map(b=>b.x),expected[mask][1]);}
 assert.deepEqual(flockResult(7).map(({alignment,cohesion,separation})=>[alignment,cohesion,separation]),[[1,1,-1],[-1,0,0],[-1,-1,1]]);assert.throws(()=>flockResult(8));
});
test('every combination and the simultaneous-update reflection are required',()=>{
 let q=flockCreate();for(let mask=0;mask<8;mask++){q.mask=mask;const expected=flockResult(mask)[0].x;q.trials[mask].guess=[0,1,2,3].find(x=>x!==expected);assert.equal(flockCheck(q),false);q.trials[mask].guess=expected;assert.equal(flockCheck(q),true);q=flockRestore(q);}assert.equal(flockComplete(q),false);q.answer='snapshot';assert.equal(flockComplete(q),true);const copy=flockRestore(q);copy.trials[0].checked=false;assert.equal(flockComplete(q),true);const bad=structuredClone(q);bad.trials[1].guess=0;assert.throws(()=>flockRestore(bad));
});
