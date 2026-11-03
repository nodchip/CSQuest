import test from 'node:test';
import assert from 'node:assert/strict';
import {arrayRecordData,arrayRecordCases,arrayRecordSlice,arrayRecordExpected,arrayRecordCreate,arrayRecordTrialDone,arrayRecordDone,arrayRecordRestore} from '../src/array-record-slice.js';

test('all in-bounds rectangles retain their shape and exact cell order',()=>{
 for(const grid of Object.values(arrayRecordData))for(let r1=1;r1<=3;r1++)for(let r2=r1;r2<=3;r2++)for(let c1=1;c1<=3;c1++)for(let c2=c1;c2<=3;c2++){
  const expected=[];for(let r=r1;r<=r2;r++){const row=[];for(let c=c1;c<=c2;c++)row.push(grid[r-1][c-1]);expected.push(row);}
  assert.deepEqual(arrayRecordSlice(grid,[r1,r2,c1,c2]),expected);
 }
 assert.throws(()=>arrayRecordSlice(arrayRecordData.first,[0,1,1,1]));
});
test('missing and zero are retained separately and masks select exact positions',()=>{
 assert.deepEqual(arrayRecordExpected('missing'),{values:[[4,6],[null,5]],mask:54,count:4,known:3,sum:15});
 assert.deepEqual(arrayRecordExpected('zero'),{values:[[4,1],[0,6]],mask:216,count:4,known:4,sum:11});
 const q=arrayRecordCreate();for(const id of Object.keys(arrayRecordCases)){const mask=arrayRecordExpected(id).mask;assert.equal(arrayRecordTrialDone(id,{mask:mask^1,checked:true}),false);q.trials[id]={mask,checked:true};}
 q.answer='unknown';assert.equal(arrayRecordDone(q),false);q.answerChecked=true;assert.equal(arrayRecordDone(q),true);
 const copy=arrayRecordRestore(q);copy.trials.point.mask=0;assert.notEqual(q.trials.point.mask,0);q.trials.point.mask=512;assert.throws(()=>arrayRecordRestore(q));
});
