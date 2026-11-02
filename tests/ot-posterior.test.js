import test from 'node:test';
import assert from 'node:assert/strict';
import {posteriorCases,posteriorData,posteriorCreate,posteriorDone,posteriorComplete,posteriorRestore} from '../src/ot-posterior.js';

test('enumerated requests and prior weights give the expected posterior or an impossible observation',()=>{
 const expected={full:[[1,1],[1,1],'half'],overlap:[[1,1],[1,1],'half'],zero:[[1,0],[1,0],'one'],one:[[0,1],[0,1],'zero'],prior:[[1,1],[3,1],'threequarters'],impossible:[[0,0],[0,0],'impossible']};
 for(const [id,[counts,weighted,answer]] of Object.entries(expected)){const data=posteriorData(id);assert.deepEqual(data.matches.map(x=>x.length),counts);assert.deepEqual(data.weighted,weighted);assert.equal(data.answer,answer);}
});
test('all six checked comparisons and the reflection are needed, and draft data is validated',()=>{
 const state=posteriorCreate();for(const id of Object.keys(posteriorCases)){const answer=posteriorData(id).answer;assert.equal(posteriorDone(id,{answer,checked:false}),false);state.trials[id]={answer,checked:true};}assert.equal(posteriorComplete(state),false);state.reflection='prior';assert.equal(posteriorComplete(state),true);
 const copy=posteriorRestore(state);copy.trials.full.checked=false;assert.equal(posteriorComplete(copy),false);assert.equal(posteriorComplete(state),true);copy.trials.full.answer='missing';assert.throws(()=>posteriorRestore(copy));
});
