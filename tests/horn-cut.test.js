import test from 'node:test';
import assert from 'node:assert/strict';
import {cutCases,createCutTrial,stepCut,checkCut,cutTrialComplete,restoreHornCut,createHornCut,hornCutComplete} from '../src/horn-cut.js';

test('cut commits to the first candidate and can remove the only solution',()=>{
  const expected={starOpen:['d'],starCut:[],moonOpen:['b'],moonCut:['b']},all=createHornCut();
  for(const id of Object.keys(cutCases)){let s=createCutTrial(id);assert.equal(checkCut(s).checked,false);while(s.phase!=='done')s=stepCut(s);assert.deepEqual(s.answers,expected[id]);assert.equal(s.history.length,cutCases[id].cut?2:4);s.prediction=expected[id].length?'yes':'no';s=checkCut(s);assert.equal(cutTrialComplete(s),true);all.trials[id]=s;}
  assert.equal(hornCutComplete(all),true);
});
test('wrong predictions can be revised and saved actions are checked',()=>{
  let s=createCutTrial('starCut');s=stepCut(stepCut(s));s.prediction='yes';s=checkCut(s);assert.equal(cutTrialComplete(s),false);s.prediction='no';assert.equal(cutTrialComplete(checkCut(s)),true);
  const trials=Object.fromEntries(Object.keys(cutCases).map(id=>[id,{history:[],prediction:'',checked:false}]));trials.starCut={history:['next','next'],prediction:'no',checked:true};assert.equal(cutTrialComplete(restoreHornCut({selected:'starCut',trials}).trials.starCut),true);
  assert.throws(()=>restoreHornCut({selected:'starCut',trials:{...trials,starCut:{...trials.starCut,history:['next','next','next']}}}));
});
