import test from 'node:test';
import assert from 'node:assert/strict';
import {createFat,fatStep,fatComplete,restoreFat} from '../src/fat-table.js';

test('extending, deleting and reusing the chain works for both possible new file orders',()=>{
 for(const [first,second] of [[1,3],[3,1]]){
  let s=createFat();s=fatStep(s,5);assert.deepEqual(s.table,[2,3,4,-1,5,-1]);
  s=fatStep(s,1);assert.equal(s.heads.B,null);assert.equal(s.pending,3);assert.equal(s.table[1],null);
  s=fatStep(s,3);assert.equal(s.pending,null);assert.equal(s.table[3],null);
  s=fatStep(s,first);s=fatStep(s,second);assert.equal(s.heads.C,first);assert.equal(s.table[first],second);assert.equal(s.table[second],-1);
  for(const slot of [0,2,4,5])s=fatStep(s,slot);assert.equal(s.stage,9);assert.equal(s.table[0],2);assert.equal(s.table[2],4);assert.equal(s.table[4],5);assert.equal(s.table[5],-1);
  assert.ok(fatComplete({...s,answer:'table',checked:true}));assert.deepEqual(restoreFat({history:s.history,answer:'table',checked:true}).table,s.table);assert.throws(()=>fatStep(s,0));
 }
});
test('wrong choices cannot mutate the table or advance and invalid histories are rejected',()=>{
 let s=createFat();for(const correct of [5,1,3,1,3,0,2,4,5]){for(let slot=0;slot<6;slot++){const result=fatStep(s,slot);if(!result.history.includes(slot)||result.history.length===s.history.length){assert.equal(result.stage,s.stage);assert.deepEqual(result.table,s.table);}}s=fatStep(s,correct);}
 assert.throws(()=>restoreFat({history:[5,3],answer:null,checked:false}));assert.throws(()=>restoreFat({history:[6],answer:null,checked:false}));assert.equal(fatComplete({...s,answer:'adjacent',checked:true}),false);
});
