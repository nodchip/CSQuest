import test from 'node:test';
import assert from 'node:assert/strict';
import {createQueryPipeline,queryPipelineState,queryPipelineComplete,restoreQueryPipeline} from '../src/query-pipeline.js';
import {createIndexPlan,restoreIndexPlan,runIndex,indexOptimal} from '../src/index-plan.js';

test('both requests require validation, the modeled minimum-candidate plan, execution and return',()=>{
 assert.throws(()=>queryPipelineState('both',['execute']));
 assert.throws(()=>queryPipelineState('both',['validate','planPrice']));
 assert.equal(indexOptimal('both','kindPrice'),true);
 assert.equal(indexOptimal('price','priceKind'),true);
 assert.deepEqual(runIndex('both','kindPrice').matches,['B','C','D']);
 assert.deepEqual(runIndex('price','priceKind').matches,['G','D','H']);
 const s=createQueryPipeline();s.histories={both:['validate','planKind','execute','send'],price:['validate','planPrice','execute','send']};assert.equal(queryPipelineComplete(s),true);
 const copy=restoreQueryPipeline(s);copy.histories.both.pop();assert.equal(s.histories.both.length,4);
 assert.throws(()=>restoreQueryPipeline({...s,histories:{...s.histories,price:['send']}}));
});
test('earlier index drafts keep their trial and gain a fresh processing exercise',()=>{
 const {pipeline,...old}=createIndexPlan();old.trials.both.tested=['scan'];
 const r=restoreIndexPlan(old);assert.deepEqual(r.trials.both.tested,['scan']);assert.deepEqual(r.pipeline,createQueryPipeline());
});
