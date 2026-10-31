import test from 'node:test';
import assert from 'node:assert/strict';
import {decisionCases,decisionGroups,decisionCosts,decisionCorrect,createDecision,restoreDecision,decisionComplete} from '../src/decision.js';

test('expected costs match independent enumeration of all 100 observations',()=>{
  for(const [id,scenario] of Object.entries(decisionCases))for(const [group,data] of Object.entries(decisionGroups)){
    const observations=[...Array(data.broken).fill(true),...Array(data.working).fill(false)];
    const inspect=observations.reduce(sum=>sum+2,0),leave=observations.reduce((sum,broken)=>sum+(broken?scenario.loss:0),0);
    assert.deepEqual(decisionCosts(id,group),{inspect,leave});
    assert.equal(decisionCorrect(id,group,{broken:data.broken,policy:inspect<leave?'inspect':'leave'}),true);
    assert.equal(decisionCorrect(id,group,{broken:data.broken,policy:inspect<leave?'leave':'inspect'}),false);
  }
});
test('all four checked correct decisions are required and saved choices are validated',()=>{
  const state=createDecision();for(const id of Object.keys(decisionCases))for(const g of Object.keys(decisionGroups)){const cost=decisionCosts(id,g);state.choices[id][g]={broken:decisionGroups[g].broken,policy:cost.inspect<cost.leave?'inspect':'leave',checked:true};}assert.equal(decisionComplete(state),true);
  const restored=restoreDecision(state);state.choices.costly.alarm.broken=2;assert.equal(restored.choices.costly.alarm.broken,8);restored.choices.mild.silent.checked=false;assert.equal(decisionComplete(restored),false);
  restored.choices.mild.silent.broken=999;assert.throws(()=>restoreDecision(restored),RangeError);
});
