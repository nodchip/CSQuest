import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rippleNext,rippleReplay,rippleCreate,rippleStep,rippleComplete,rippleRestore} from '../src/water-ripple.js';

const traces={center:[[0,2,0,2,0],[0,2,-2,2,0],[0,-1,0,-1,0]],left:[[0,0,2,0,0],[0,-3,2,1,0],[0,-2,-1,2,0]]};
test('two starting surfaces follow independently calculated wave traces and fixed endpoints',()=>{
 for(const id of Object.keys(traces)){const state=rippleReplay(id,traces[id]);assert.deepEqual(state.rows.slice(1),traces[id]);assert.ok(state.rows.every(row=>row[0]===0&&row[4]===0));}
 assert.deepEqual(rippleNext([0,0,4,0,0],[0,0,4,0,0]),traces.center[0]);assert.throws(()=>rippleReplay('center',[[0,0,0,0,0]]));assert.throws(()=>rippleNext([1,0,0,0,0],[0,0,0,0,0]));
});
test('wrong guesses do not advance; all steps and the reflection are required and histories are replayed',()=>{
 let q=rippleCreate();q.trials.center.guess=[0,0,0];assert.equal(rippleStep(q),false);for(const id of Object.keys(traces)){q.selected=id;for(const row of traces[id]){q.trials[id].guess=row.slice(1,4);assert.equal(rippleStep(q),true);q=rippleRestore(q);}}
 assert.equal(rippleComplete(q),false);q.answer='both';assert.equal(rippleComplete(q),true);const copy=rippleRestore(q);copy.trials.center.history[0][1]=0;assert.equal(q.trials.center.history[0][1],2);assert.throws(()=>rippleRestore(copy));
});
