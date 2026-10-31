import test from 'node:test';
import assert from 'node:assert/strict';
import {machineProgram,createMachine,machineStep,restoreMachineCycle,machineComplete} from '../src/machine.js';
const run=(id,values)=>values.reduce(machineStep,createMachine(id));
const zero=['fetch:0','decode:LOAD','exec:0','fetch:1','decode:JZ','exec:4','fetch:4','decode:HALT','exec:stop'];
const three=['fetch:0','decode:LOAD','exec:3','fetch:1','decode:JZ','exec:2','fetch:2','decode:ADD','exec:5','fetch:3','decode:STORE','exec:5','fetch:4','decode:HALT','exec:stop'];
test('zero takes the branch and three loads, adds, stores and stops',()=>{
  const a=run('zero',zero),b=run('three',three);assert.equal(a.phase,'done');assert.equal(a.cells[6],0);assert.equal(b.phase,'done');assert.equal(b.cells[6],5);assert.equal(b.reg,5);assert.equal(b.cells[7],2);assert.deepEqual(b.cells.slice(0,5),machineProgram);
});
test('fetch changes the next PC, decode has no data effect, and wrong predictions do not advance',()=>{
  let s=createMachine('three');assert.equal(machineStep(s,'fetch:1').history.length,0);s=machineStep(s,'fetch:0');assert.equal(s.pc,1);assert.equal(s.reg,0);assert.equal(s.phase,'decode');assert.equal(machineStep(s,'decode:ADD').phase,'decode');s=machineStep(s,'decode:LOAD');assert.equal(s.reg,0);assert.equal(machineStep(s,'exec:5').phase,'execute');s=machineStep(s,'exec:3');assert.equal(s.reg,3);
});
test('validated histories restore the real state and reject impossible actions',()=>{
  const saved={selected:'three',history:{zero,three:three.slice(0,7)}};const s=restoreMachineCycle(saved);assert.equal(s.states.zero.phase,'done');assert.equal(s.states.three.phase,'decode');assert.equal(machineComplete(s),false);s.states.three=run('three',three);assert.equal(machineComplete(s),true);assert.throws(()=>restoreMachineCycle({...saved,history:{...saved.history,three:['fetch:1']}}),RangeError);
});
