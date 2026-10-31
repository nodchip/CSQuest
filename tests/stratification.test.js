import test from 'node:test';
import assert from 'node:assert/strict';
import {strataData,strataSummary,createStrata,restoreStrata,strataComplete} from '../src/stratification.js';

test('aggregate ordering reverses both conditional orderings with exact counts',()=>{
 const all=strataSummary('all');assert.deepEqual(all.A,{success:29,total:110,rate:29/110});assert.deepEqual(all.B,{success:81,total:110,rate:81/110});assert.ok(all.B.success*all.A.total>all.A.success*all.B.total);
 for(const id of Object.keys(strataData)){const s=strataSummary(id);assert.ok(s.A.success*s.B.total>s.B.success*s.A.total);}assert.throws(()=>strataSummary('unknown'),RangeError);
});
test('all views and supported conclusions are required and saved state is validated',()=>{
 const state=createStrata();state.answers={overall:'B',groups:'A',interpretation:'mix'};state.checked=true;assert.equal(strataComplete(state),false);state.visited=['all','short','long'];assert.equal(strataComplete(state),true);const restored=restoreStrata(state);state.visited.pop();assert.equal(restored.visited.length,3);restored.answers.interpretation='certain';assert.equal(strataComplete(restored),false);assert.throws(()=>restoreStrata({...restored,visited:['all','all']}),RangeError);
});
