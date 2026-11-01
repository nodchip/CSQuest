import test from 'node:test';
import assert from 'node:assert/strict';
import {lifeSteps,createLife,chooseLife,restoreLife,lifeSnapshot,lifeComplete,lifeStagesComplete} from '../src/data-life.js';
test('the lifecycle records, aggregates, retains, retrieves and deletes exactly as described',()=>{
 let s=createLife();assert.deepEqual(lifeSnapshot(s).records,[]);for(const [i,step] of lifeSteps.entries()){
  const wrong=Object.keys(step.choices).find(k=>k!==step.correct),failed=chooseLife(s,wrong);assert.equal(failed.actions.length,i);assert.ok(failed.feedback);s=chooseLife(failed,step.correct);assert.equal(s.actions.length,i+1);
  if(i===0)assert.equal(lifeSnapshot(s).records.reduce((sum,r)=>sum+r.count,0),5);if(i===1)assert.equal(lifeSnapshot(s).total,5);if(i===3)assert.equal(lifeSnapshot(s).stored,true);if(i===4)assert.equal(lifeSnapshot(s).retrieved,true);
 }assert.equal(lifeStagesComplete(s),true);assert.equal(lifeComplete(s),false);assert.deepEqual(lifeSnapshot(s),{records:[],total:null,report:null,stored:false,retrieved:true,deleted:true});assert.throws(()=>chooseLife(s,'destroy'),RangeError);
});
test('draft restores only valid prefixes and cannot alter the saved list',()=>{
 let s=createLife();s=chooseLife(s,'counts');s=chooseLife(s,'five');const restored=restoreLife(s.actions);s.actions.pop();assert.equal(restored.actions.length,2);assert.throws(()=>restoreLife(['counts','six']),RangeError);assert.throws(()=>restoreLife(['unknown']),RangeError);
});
