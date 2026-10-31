import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultTransitions,simulateMachine,checkMachine,restoreMachine} from '../src/automaton.js';
const solution={dark:{sun:'lit',moon:'dark'},lit:{sun:'dark',moon:'lit'}};
test('the two-state machine tracks odd and even counts regardless of moon symbols',()=>{
  assert.deepEqual(simulateMachine(solution,['sun','moon','sun']).trace,['dark','lit','lit','dark']);
  assert.equal(simulateMachine(solution,['moon','sun']).accept,true);assert.equal(simulateMachine(solution,[]).accept,false);
  const result=checkMachine(solution);assert.equal(result.tested,31);assert.equal(result.failed.length,0);
});
test('each transition matters and a mismatch includes a reproducible input sequence',()=>{
  for(const state of ['dark','lit'])for(const symbol of ['sun','moon']){
    const changed=structuredClone(solution);changed[state][symbol]=changed[state][symbol]==='lit'?'dark':'lit';const check=checkMachine(changed);
    assert.ok(check.failed.length>0);const failure=check.failed[0];assert.notEqual(simulateMachine(changed,failure.word).accept,failure.expected);
  }
});
test('restoration rejects invalid states and oversized words',()=>{
  assert.deepEqual(restoreMachine({table:solution,word:['sun'],checked:true}).word,['sun']);
  assert.throws(()=>restoreMachine({table:defaultTransitions(),word:Array(7).fill('sun'),checked:false}),RangeError);
  assert.throws(()=>restoreMachine({table:{dark:{sun:'unknown',moon:'dark'},lit:solution.lit},word:[],checked:false}),RangeError);
});
