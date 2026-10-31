import test from 'node:test';
import assert from 'node:assert/strict';
import {processActions,createProcess,processStep,restoreProcess,processComplete} from '../src/process.js';
const play=actions=>actions.reduce(processStep,createProcess());
test('IO completion makes A ready, not running, while B keeps the processor',()=>{
  const state=play(['runA','request','runB','arrive']);assert.equal(state.A,'ready');assert.equal(state.B,'running');assert.equal(state.cpu,'B');assert.equal(state.overlap,true);
  assert.equal(processStep(state,'runA').history.length,state.history.length);
  const done=play(['runA','request','runB','arrive','finishB','runA','finishA']);assert.equal(processComplete(done),true);
});
test('finishing both without overlap does not satisfy the observation',()=>{
  const done=play(['runB','finishB','runA','request','arrive','runA','finishA']);assert.equal(done.A,'done');assert.equal(done.B,'done');assert.equal(processComplete(done),false);
  assert.throws(()=>restoreProcess(['runA','runB']),RangeError);
});
test('all reachable transitions preserve exclusive execution and bounded progress',()=>{
  const visit=state=>{
    const running=['A','B'].filter(id=>state[id]==='running');assert.ok(running.length<=1);assert.equal(state.cpu,running[0]||null);assert.ok(state.history.length<=7);
    if(state.A==='done'&&state.B==='done')return;
    for(const action of Object.keys(processActions)){const next=processStep(state,action);if(next.history.length>state.history.length)visit(next);}
  };visit(createProcess());
});
