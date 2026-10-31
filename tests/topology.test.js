import test from 'node:test';
import assert from 'node:assert/strict';
import {topologyCases,createTopology,availableTopology,topologyStep,restoreTopology,topologyComplete} from '../src/topology.js';
function permutations(xs){return xs.length?xs.flatMap(x=>permutations(xs.filter(y=>y!==x)).map(rest=>[x,...rest])):[[]];}
test('all 120 festival permutations match the independently checked edge constraints',()=>{
  let valid=0;const task=topologyCases.festival;
  for(const order of permutations(task.nodes)){let s=createTopology('festival');for(const id of order){const next=topologyStep(s,id);if(next.order.length===s.order.length)break;s=next;}
    const correct=task.edges.every(([a,b])=>order.indexOf(a)<order.indexOf(b));assert.equal(s.order.length===order.length,correct);if(correct)valid++;}
  assert.equal(valid,7);
});
test('cycle detection waits until all available nodes are removed and distinguishes downstream nodes',()=>{
  let s=createTopology('loop');assert.deepEqual(availableTopology(s),['A']);assert.equal(topologyStep(s,'stuck').cycle,false);s=topologyStep(s,'A');assert.deepEqual(availableTopology(s),[]);
  for(const node of ['B','C','D'])assert.equal(topologyStep(s,node).order.length,1);
  s=topologyStep(s,'stuck');assert.equal(s.cycle,true);assert.deepEqual(s.order,['A']);
});
test('restoration validates each history and both scenarios are needed',()=>{
  const saved={selected:'loop',history:{festival:['B','A','E','C','D'],loop:['A']}};const state=restoreTopology(saved);assert.equal(topologyComplete(state),false);
  state.states.loop=topologyStep(state.states.loop,'stuck');assert.equal(topologyComplete(state),true);
  assert.throws(()=>restoreTopology({...saved,history:{...saved.history,loop:['stuck']}}),RangeError);
  assert.throws(()=>restoreTopology({...saved,history:{...saved.history,festival:['C']}}),RangeError);
});
