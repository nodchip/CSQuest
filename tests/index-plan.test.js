import test from 'node:test';
import assert from 'node:assert/strict';
import {indexRows,indexCases,indexMethods,runIndex,indexOptimal,createIndexPlan,restoreIndexPlan,indexPlanComplete} from '../src/index-plan.js';

test('all modeled access paths return the independently filtered matching rows',()=>{
  for(const [id,q] of Object.entries(indexCases)){
    const expected=indexRows.filter(r=>(!q.kind||r.kind===q.kind)&&r.price>=q.minimum).map(r=>r.id).sort();
    for(const method of Object.keys(indexMethods)){const result=runIndex(id,method);assert.deepEqual(result.matches.slice().sort(),expected);assert.ok(result.matches.every(x=>result.candidates.includes(x)));}
  }
});
test('leading equality and first range affect candidate counts',()=>{
  assert.deepEqual(Object.keys(indexMethods).map(method=>runIndex('both',method).candidates.length),[8,4,3,6]);
  assert.deepEqual(Object.keys(indexMethods).map(method=>runIndex('price',method).candidates.length),[8,8,8,3]);
  assert.equal(indexOptimal('both','kindPrice'),true);assert.equal(indexOptimal('price','priceKind'),true);assert.equal(indexOptimal('both','priceKind'),false);
});
test('both cases need all methods tested and a checked minimum; saved trials are validated',()=>{
  const s=createIndexPlan(),methods=Object.keys(indexMethods);s.trials.both={method:'kindPrice',tested:methods.slice(),checked:true};s.trials.price={method:'priceKind',tested:methods.slice(),checked:true};assert.equal(indexPlanComplete(s),false);s.pipeline.histories={both:['validate','planKind','execute','send'],price:['validate','planPrice','execute','send']};assert.equal(indexPlanComplete(s),true);
  const copy=restoreIndexPlan(s);s.trials.both.tested.pop();assert.equal(indexPlanComplete(s),false);assert.equal(indexPlanComplete(copy),true);assert.throws(()=>restoreIndexPlan(s),RangeError);
  s.trials.both.checked=false;s.trials.both.tested=['scan','scan'];assert.throws(()=>restoreIndexPlan(s),RangeError);
});
