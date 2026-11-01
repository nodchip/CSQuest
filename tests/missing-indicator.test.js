import test from 'node:test';
import assert from 'node:assert/strict';
import {missingIndicatorEvaluation,createMissingIndicator,missingIndicatorComplete,restoreMissingIndicator} from '../src/missing-indicator.js';

test('imputation creates a collision; indicator rules differ when missingness changes',()=>{
 for(const [village,method,correct] of [['north','fill',3],['north','flag',4],['south','fill',4],['south','flag',3]]){
  const r=missingIndicatorEvaluation(village,method);assert.equal(r.mean,1);assert.equal(r.correct,correct);assert.equal(r.rows[1].filled,r.rows[3].filled);assert.equal(r.rows[1].missing,false);assert.equal(r.rows[3].missing,true);
  assert.equal(r.rows.filter(row=>row.prediction===row.truth).length,correct);
 }
 assert.throws(()=>missingIndicatorEvaluation('east','flag'));
});
test('all four observations and the conditional conclusion are required',()=>{
 const s=createMissingIndicator();s.observed=['north,fill','north,flag','south,fill','south,flag'];s.answer='depends';s.checked=true;assert.equal(missingIndicatorComplete(restoreMissingIndicator(s)),true);
 assert.equal(missingIndicatorComplete({...s,answer:'always'}),false);assert.equal(missingIndicatorComplete({...s,observed:s.observed.slice(1)}),false);assert.throws(()=>restoreMissingIndicator({...s,observed:['north,fill','north,fill']}));
});
