import test from 'node:test';
import assert from 'node:assert/strict';
import {pipelineTools,runPipeline,checkPipeline,restorePipeline} from '../src/pipeline.js';

test('the intended pipeline transforms, selects and sums without changing input',()=>{
  const input=[1,2,3,4],result=runPipeline(['double','filter','sum'],input);
  assert.deepEqual(result.trace,[[1,2,3,4],[2,4,6,8],[6,8],14]);assert.deepEqual(input,[1,2,3,4]);
  assert.ok(checkPipeline(['double','filter','sum']).every(row=>row.correct));
});
test('every three-tool combination is checked on both independent inputs',()=>{
  const solutions=[];
  for(const a of Object.keys(pipelineTools))for(const b of Object.keys(pipelineTools))for(const c of Object.keys(pipelineTools))if(checkPipeline([a,b,c]).every(row=>row.correct))solutions.push([a,b,c]);
  assert.deepEqual(solutions,[['double','filter','sum']]);
  const wrong=runPipeline(['sum','double','filter'],[1,2]);assert.equal(wrong.ok,false);assert.equal(wrong.index,1);
});
test('restoration recomputes results and rejects invalid tools',()=>{
  const saved={sequence:['double','filter','sum'],tested:true},state=restorePipeline(saved);saved.sequence[0]='sum';assert.equal(state.sequence[0],'double');assert.ok(state.results.every(row=>row.correct));
  assert.throws(()=>restorePipeline({sequence:['double','unknown','sum'],tested:true}),RangeError);
});
