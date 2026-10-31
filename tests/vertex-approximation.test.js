import test from 'node:test';
import assert from 'node:assert/strict';
import {createApproximationTrial,approximationStep,approximationRemaining,approximationSelected,approximationTrialValid,createVertexApproximation,vertexApproximationComplete,restoreVertexApproximation,labEdges,labRemaining,labChoose,labSelected,labMinimum,labToggle,restoreApproximationLab} from '../src/vertex-approximation.js';
test('the two choices on a four-tower path yield optimal and twice-optimal covers',()=>{let middle=approximationStep(createApproximationTrial(),'BC');assert.deepEqual(approximationSelected(middle),['B','C']);assert.deepEqual(approximationRemaining(middle),[]);assert.ok(approximationTrialValid('middle',middle));let outer=approximationStep(createApproximationTrial(),'AB');assert.deepEqual(approximationRemaining(outer),['CD']);assert.throws(()=>approximationStep(outer,'BC'));outer=approximationStep(outer,'CD');assert.equal(approximationSelected(outer).length,4);assert.ok(approximationTrialValid('outer',outer));const s=createVertexApproximation();s.trials={middle:{...middle,done:true},outer:{...outer,done:true}};s.answer='matching';s.checked=true;assert.ok(vertexApproximationComplete(s));assert.deepEqual(restoreVertexApproximation(s),s);});
test('completed and saved trials must follow the algorithm and requested starting edge',()=>{const s=createVertexApproximation();s.trials.outer={edges:['BC'],done:true};assert.throws(()=>restoreVertexApproximation(s));s.trials.outer={edges:['AB','BC'],done:false};assert.throws(()=>restoreVertexApproximation(s));});
test('all four-vertex graphs and all valid edge choices produce covers within twice the true optimum',()=>{
 const edges=Object.keys(labEdges),vertices=['A','B','C','D'];
 for(let bits=0;bits<64;bits++){
  const graph=edges.filter((_,i)=>bits&(1<<i));
  const covers=Array.from({length:16},(_,mask)=>vertices.filter((_,i)=>mask&(1<<i))).filter(c=>graph.every(e=>c.includes(e[0])||c.includes(e[1])));
  const optimum=Math.min(...covers.map(c=>c.length));
  const visit=lab=>{assert.equal(labMinimum(lab),optimum);const remaining=labRemaining(lab);if(remaining.length){for(const e of remaining)visit(labChoose(lab,e));}else{const selected=labSelected(lab);assert.ok(graph.every(e=>selected.includes(e[0])||selected.includes(e[1])));assert.ok(selected.length<=2*optimum);assert.equal(selected.length,2*lab.chosen.length);}};
  visit({graph,chosen:[]});
 }
});
test('the graph editor resets chosen edges, validates restored history, and accepts old saves',()=>{let lab={graph:['AB','CD'],chosen:['AB']};assert.deepEqual(labToggle(lab,'BC'),{graph:['AB','CD','BC'],chosen:[]});assert.deepEqual(restoreApproximationLab(lab),lab);assert.throws(()=>restoreApproximationLab({graph:['AB','BC'],chosen:['AB','BC']}));const {lab:ignored,...old}=createVertexApproximation();assert.deepEqual(restoreVertexApproximation(old).lab,{graph:['AB','BC','CD'],chosen:[]});});
