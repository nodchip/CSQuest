import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRefTrial,refCounts,refStep,createRefSet,restoreRefSet,refComplete} from '../src/reference-counting.js';

test('releasing the root cascades on a chain but not an unreachable cycle',()=>{
 let chain=createRefTrial('chain'),cycle=createRefTrial('cycle');
 assert.deepEqual(refCounts(chain),{A:1,B:1,C:1});assert.deepEqual(refCounts(cycle),{A:1,B:2,C:1});
 chain=refStep(chain,'release');cycle=refStep(cycle,'release');assert.deepEqual(refCounts(chain),{A:0,B:1,C:1});assert.deepEqual(refCounts(cycle),{A:0,B:2,C:1});
 assert.equal(refStep(chain,'finish').done,false);assert.deepEqual(refStep(cycle,'B').live,['A','B','C']);
 for(const n of ['A','B','C'])chain=refStep(chain,n);chain=refStep(chain,'finish');
 cycle=refStep(cycle,'A');assert.deepEqual(refCounts(cycle),{B:1,C:1});cycle=refStep(cycle,'finish');
 assert.deepEqual(chain.live,[]);assert.deepEqual(cycle.live,['B','C']);assert.ok(chain.done&&cycle.done);
});
test('drafts replay valid steps and reject illegal, repeated, and excessive histories',()=>{
 const s=createRefSet();s.trials.chain=refStep(s.trials.chain,'release');let restored=restoreRefSet({selected:'chain',histories:{chain:s.trials.chain.history,cycle:[]}});assert.equal(restored.trials.chain.root,false);
 assert.throws(()=>restoreRefSet({selected:'chain',histories:{chain:['B'],cycle:[]}}),RangeError);
 assert.throws(()=>restoreRefSet({selected:'chain',histories:{chain:['release','release'],cycle:[]}}),RangeError);
 assert.equal(refComplete(restored),false);
});
