import test from 'node:test';
import assert from 'node:assert/strict';
import {createLinkedTrial,linkedReach,stepLinked,linkedCorrect,createLinkedSet,linkedComplete,restoreLinkedSet} from '../src/linked-list.js';

test('safe insertion and unlink preserve the remaining chain',()=>{
  const all=createLinkedSet();let insert=createLinkedTrial('insert');insert=stepLinked(insert,'X','B');insert=stepLinked(insert,'A','X');insert.checked=true;assert.deepEqual(linkedReach(insert),{order:['A','X','B','C'],cycle:false});assert.ok(linkedCorrect(insert));let remove=stepLinked(createLinkedTrial('remove'),'A','C');remove.checked=true;assert.ok(linkedCorrect(remove));all.trials={insert,remove};assert.ok(linkedComplete(all));
});
test('rewiring too early loses access under this model; cycles and drafts are handled',()=>{
  let s=stepLinked(createLinkedTrial('insert'),'A','X');assert.deepEqual(linkedReach(s).order,['A','X']);assert.equal(stepLinked(s,'X','B').history.length,s.history.length);s=stepLinked(s,'X','A');assert.equal(linkedReach(s).cycle,true);
  const trials={insert:{history:[['X','B']],selection:{from:'A',to:'X'},checked:false},remove:{history:[],selection:{from:'A',to:'B'},checked:false}};assert.equal(restoreLinkedSet({selected:'insert',trials}).trials.insert.links.X,'B');assert.throws(()=>restoreLinkedSet({selected:'insert',trials:{...trials,insert:{...trials.insert,history:[['A','X'],['X','B']]}}}));
});
