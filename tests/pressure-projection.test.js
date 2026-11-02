import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pressureCases,pressureResult,pressureCreate,pressureCheck,pressureComplete,pressureRestore} from '../src/pressure-projection.js';

test('exact pressures remove divergence while preserving the circulating component',()=>{
 assert.deepEqual(pressureResult('push',{B:1,C:0,D:1}),{before:[1,0,0,1],beforeDivergence:[1,-1,1,-1],gradient:[1,0,0,1],after:[0,0,0,0],afterDivergence:[0,0,0,0]});
 assert.deepEqual(pressureResult('swirl',{B:2,C:0,D:2}),{before:[3,-1,1,1],beforeDivergence:[2,-2,2,-2],gradient:[2,0,0,2],after:[1,-1,1,-1],afterDivergence:[0,0,0,0]});
 for(const id of Object.keys(pressureCases)){const solutions=[];for(let B=0;B<=3;B++)for(let C=0;C<=3;C++)for(let D=0;D<=3;D++){const p={B,C,D},r=pressureResult(id,p);assert.equal(r.afterDivergence.reduce((a,b)=>a+b,0),0);if(r.afterDivergence.every(x=>x===0))solutions.push(p);}assert.deepEqual(solutions,id==='push'?[{B:1,C:0,D:1}]:[{B:2,C:0,D:2}]);}
});
test('both scenarios and the remaining circulation reflection are required; saved checks are verified',()=>{
 let q=pressureCreate();assert.equal(pressureCheck(q),false);q.trials.push.pressures={B:1,C:0,D:1};assert.equal(pressureCheck(q),true);q.selected='swirl';q.trials.swirl.pressures={B:2,C:0,D:2};assert.equal(pressureCheck(q),true);q=pressureRestore(q);assert.equal(pressureComplete(q),false);q.answer='circulate';assert.equal(pressureComplete(q),true);const copy=pressureRestore(q);copy.trials.push.pressures.B=0;assert.equal(pressureComplete(q),true);assert.equal(pressureComplete(copy),false);assert.throws(()=>pressureRestore(copy));
});
