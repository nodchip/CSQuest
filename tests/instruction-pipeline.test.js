import test from 'node:test';
import assert from 'node:assert/strict';
import {createInstructionTrial,tickInstruction,createInstructionPipeline,instructionPipelineComplete,restoreInstructionPipeline} from '../src/instruction-pipeline.js';

test('dependency without protection reads old value, while stall and forwarding use the new value',()=>{
  const all=createInstructionPipeline();for(const [mode,blue,cycles,stalls,forwarded] of [['unsafe',1,4,0,false],['stall',3,5,1,false],['forward',3,4,0,true]]){let s=createInstructionTrial(mode);while(!s.done)s=tickInstruction(s);assert.equal(s.red,2);assert.equal(s.blue,blue);assert.equal(s.cycle,cycles);assert.equal(s.stalls,stalls);assert.equal(s.forwarded,forwarded);all.trials[mode]=s;}assert.ok(instructionPipelineComplete(all));
});
test('pending hazards resume correctly and impossible saved cycle counts are rejected',()=>{
  const saved={selected:'stall',cycles:{unsafe:0,stall:3,forward:0}},s=restoreInstructionPipeline(saved).trials.stall;assert.equal(s.stalls,1);assert.equal(s.red,2);assert.equal(s.decode,1);assert.equal(tickInstruction(tickInstruction(s)).blue,3);
  assert.throws(()=>restoreInstructionPipeline({...saved,cycles:{...saved.cycles,unsafe:5}}));
});
