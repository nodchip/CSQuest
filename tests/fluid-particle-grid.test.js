import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fluidGridCases,fluidGridModes,fluidGridResult,fluidGridCreate,fluidGridCheck,fluidGridComplete,fluidGridRestore} from '../src/fluid-particle-grid.js';

test('two cases and three methods give independently calculated velocities and positions',()=>{
 const expected={push:{ballistic:[[2,4],[2,5]],pic:[[3,3],[3,4]],flip:[[2,4],[2,5]]},pull:{ballistic:[[-1,3],[-1,4]],pic:[[1,1],[1,2]],flip:[[-1,3],[-1,4]]}};
 for(const id of Object.keys(fluidGridCases))for(const mode of Object.keys(fluidGridModes)){const r=fluidGridResult(id,mode);assert.equal(r.gridBefore,2);assert.equal(r.gridAfter,id==='push'?3:1);assert.deepEqual([r.velocities,r.positions],expected[id][mode]);assert.equal(r.velocities[0]+r.velocities[1],2*r.gridAfter);}
 assert.throws(()=>fluidGridResult('push','other'));
});
test('six comparisons and both reflections are required, and restored guesses are validated',()=>{
 let q=fluidGridCreate();for(const id of Object.keys(fluidGridCases))for(const mode of Object.keys(fluidGridModes)){q.selected=id;q.mode=mode;const t=q.trials[`${id}:${mode}`],v=fluidGridResult(id,mode).velocities;t.guess=[0,0];assert.equal(fluidGridCheck(q),false);t.guess=[...v];assert.equal(fluidGridCheck(q),true);q=fluidGridRestore(q);}assert.equal(fluidGridComplete(q),false);q.representation='particle';q.transfer='difference';assert.equal(fluidGridComplete(q),true);const copy=fluidGridRestore(q);copy.trials['push:pic'].guess[0]=1;assert.equal(fluidGridComplete(q),true);assert.equal(fluidGridComplete(copy),false);assert.throws(()=>fluidGridRestore(copy));
});
