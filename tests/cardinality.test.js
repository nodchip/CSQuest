import test from 'node:test';
import assert from 'node:assert/strict';
import {cardinalityCases,cardinalityResults,createCardinality,restoreCardinality,cardinalityComplete} from '../src/cardinality.js';

test('all four uniqueness configurations are checked against each scenario',()=>{
  for(const id of Object.keys(cardinalityCases))for(const uniqueLeft of [false,true])for(const uniqueRight of [false,true]){
    const results=cardinalityResults(id,{uniqueLeft,uniqueRight});assert.deepEqual(results.map(r=>r.allowed),[true,!uniqueRight,!uniqueLeft]);assert.equal(results.every(r=>r.correct),uniqueLeft&&(id==='badge'?uniqueRight:!uniqueRight));
  }
});
test('both designs must be checked and saved choices are validated',()=>{
  const state=createCardinality();state.choices.village={uniqueLeft:true,uniqueRight:false,checked:true};assert.equal(cardinalityComplete(state),false);state.choices.badge={uniqueLeft:true,uniqueRight:true,checked:true};assert.equal(cardinalityComplete(state),true);
  const restored=restoreCardinality(state);state.choices.badge.checked=false;assert.equal(restored.choices.badge.checked,true);restored.choices.badge.uniqueLeft='true';assert.throws(()=>restoreCardinality(restored),RangeError);
});
