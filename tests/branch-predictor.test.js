import test from 'node:test';
import assert from 'node:assert/strict';
import {predictorCases,branchSeries,createPredictorTrial,predictorGuess,predictorTrialDone,createPredictors,predictorsComplete,restorePredictors} from '../src/branch-predictor.js';

test('fixed and two-bit predictions reflect the observed sequence and saturation',()=>{
  const expected={earlyFixed:2,earlyAdaptive:4,lateFixed:4,lateAdaptive:3},all=createPredictors();
  for(const id of Object.keys(predictorCases)){let s=createPredictorTrial(id);const states=[s.counter];while(!predictorTrialDone(s)){const guess=predictorCases[id].mode==='fixed'||s.counter>=2;assert.equal(predictorGuess(s,!guess).index,s.index);s=predictorGuess(s,guess);states.push(s.counter);}assert.equal(s.correct,expected[id]);assert.ok(states.every(x=>x>=0&&x<=3));assert.equal(s.index,branchSeries[predictorCases[id].series].length);all.trials[id]=s;}
  assert.ok(predictorsComplete(all));
});
test('saved predictions replay state and reject invalid or impossible guesses',()=>{
  const histories={earlyFixed:[],earlyAdaptive:[true,true,true],lateFixed:[],lateAdaptive:[]};const s=restorePredictors({selected:'earlyAdaptive',histories}).trials.earlyAdaptive;assert.equal(s.counter,2);assert.equal(s.correct,2);
  assert.throws(()=>restorePredictors({selected:'earlyAdaptive',histories:{...histories,earlyAdaptive:[false]}}));
  assert.throws(()=>restorePredictors({selected:'earlyAdaptive',histories:{...histories,earlyAdaptive:['true']}}));
});
